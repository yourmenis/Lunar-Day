import numpy as np
import torch
import cv2
import os
import time
import logging
from threading import Lock
from flask import Blueprint, app, request, jsonify, send_from_directory
import segmentation_models_pytorch as smp
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from config.database import get_db_connection

# ==============================
# INIT
# ==============================
analysis_bp = Blueprint("analysis", __name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join(os.getcwd(), "incepv2.pth")

IMG_SIZE = 512
STD_BASE_THRESHOLD = 33.20
CONF_THRESHOLD = 0.3
RED_RATIO_LIMIT = 0.02

# brightness thresholds for dynamic std
BRIGHTNESS_HIGH = 150
BRIGHTNESS_LOW = 130

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# FILE VALIDATION
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024

# AREA CONFIG
MIN_AREA = 20
SMALL_OBJECT = 100
LARGE_OBJECT = 1000
LARGE_TISSUE = 5000

# แปลงผล AI (EN) → ภาษาไทย สำหรับแสดงผล
AI_RESULT_TH = {
    "clot": "ลิ่มเลือด",
    "tissue": "เนื้อเยื่อ",
    "mixed": "พบลิ่มเลือดและเนื้อเยื่อ",
    "none": "ไม่พบลิ่มเลือดและเนื้อเยื่อ",
}

model = None
model_lock = Lock()


DB_ADVICE = {
    "ฉุกเฉิน": "แนะนำให้เข้ารับการตรวจประเมินจากแพทย์โดยเร็วที่สุดเนื่องจากอาการเลือดออกหรือปวดท้องร่วมกับความเสี่ยงตั้งครรภ์อาจสัมพันธ์กับภาวะแทรกซ้อนที่จำเป็นต้องได้รับการดูแลทางการแพทย์อย่างใกล้ชิด",
    "เสี่ยงสูง": "ควรปรึกษาสูตินรีแพทย์เพื่อการวินิจฉัยเพิ่มเติมเนื่องจากลักษณะเลือดออกหรืออาการปวดที่พบ อาจสัมพันธ์กับความผิดปกติของมดลูกหรือภาวะเลือดออกมากที่ควรได้รับการตรวจหาสาเหตุ",
    "เสี่ยงปานกลาง": "แนะนำให้ติดตามอาการและจดบันทึกรอบเดือนต่อเนื่องควรสังเกตความเปลี่ยนแปลงใน 1-2 รอบเดือนถัดไป หากอาการยังคงอยู่ ไม่สม่ำเสมอ หรือรบกวนการใช้ชีวิตประจำวัน แนะนำให้ปรึกษาแพทย์เมื่อสะดวก",
    "ปกติ": "ผลการวิเคราะห์เบื้องต้นอยู่ในเกณฑ์ทั่วไปยังไม่พบข้อบ่งชี้ความเสี่ยงที่น่ากังวลในขณะนี้แนะนำให้ดูแลสุขภาพ จดบันทึกประจำเดือนสม่ำเสมอ และเข้ารับการตรวจคัดกรองสุขภาพประจำปีตามปกติ",
}


# ==============================
# HELPERS
# ==============================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_model():
    global model
    with model_lock:
        if model is None:
            try:
                m = smp.Unet(
                    encoder_name="inceptionresnetv2", classes=3, activation=None
                )
                m.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
                m.to(DEVICE).eval()
                model = m
            except Exception:
                logger.exception("โหลดโมเดลล้มเหลว")
                raise
    return model


def calculate_dynamic_std(img_rgb):
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    brightness = np.mean(img_gray)
    tolerance = (
        2.0
        if brightness > BRIGHTNESS_HIGH
        else (1.20 if brightness < BRIGHTNESS_LOW else 1.50)
    )
    return STD_BASE_THRESHOLD * tolerance


def run_inference(img):
    model_inst = get_model()
    input_tensor = (
        torch.from_numpy(img).permute(2, 0, 1).float().unsqueeze(0).to(DEVICE) / 255
    )

    with torch.no_grad():
        output = model_inst(input_tensor)
        prob = torch.softmax(output, dim=1)
        conf, mask = torch.max(prob, dim=1)

    mask_np = mask[0].cpu().numpy()
    conf_np = conf[0].cpu().numpy()
    # คำนวณค่าเฉลี่ย confidence ของพื้นที่ที่ตรวจพบ (mask > 0) และมี confidence > threshold
    detected = (mask_np > 0) & (conf_np > CONF_THRESHOLD)
    if np.any(detected):
        # ถ้าเจอลิ่มเลือด/เนื้อเยื่อ ให้เฉลี่ยความมั่นใจของก้อนนั้น
        avg_conf = np.mean(conf_np[detected])
    else:
        # ถ้าไม่เจออะไรเลย ให้เฉลี่ยความมั่นใจของ "พื้นหลัง" แทน
        background_pixels = mask_np == 0
        avg_conf = (
            np.mean(conf_np[background_pixels]) if np.any(background_pixels) else 0.99
        )

    return mask_np, conf_np, float(avg_conf)


def validate_ai_findings(mask, conf, img, std_limit):
    found_clot = False
    found_tissue = False

    for cls_id in [1, 2]:
        binary = ((mask == cls_id) & (conf > CONF_THRESHOLD)).astype(np.uint8)
        contours, _ = cv2.findContours(
            binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < MIN_AREA:
                continue

            m_temp = np.zeros(img.shape[:2], np.uint8)
            cv2.drawContours(m_temp, [cnt], -1, 255, -1)
            std_val = np.std(img[m_temp > 0])

            if cls_id == 1 and std_val <= std_limit:
                found_clot = True
            elif cls_id == 2:
                # ให้ผ่านถ้า STD ใกล้เคียงเกณฑ์ (80%) หรือก้อนใหญ่มากจนเชื่อถือ AI ได้เลย
                if std_val > (std_limit * 0.8) or area > LARGE_TISSUE:
                    found_tissue = True
            # ==============================

    if found_clot and found_tissue:
        return "mixed"
    elif found_clot:
        return "clot"
    elif found_tissue:
        return "tissue"
    else:
        return "none"


# ==============================
# MEDICAL LOGIC
# ==============================
# ข้อมูลโรค + เกณฑ์อาการ (ระบบคัดกรองแบบให้คะแนน %)
# กลุ่มโรค: 1 = สรีระปกติ, 2 = นรีเวช, 3 = ตั้งครรภ์
# criteria = {qX: เซตคำตอบที่ยอมรับ} ใส่เฉพาะข้อที่เป็นเกณฑ์จริง
# (ข้อที่เป็น N/A ไม่ต้องใส่ → จะไม่ถูกนับในตัวหาร)
DISEASES = [
    {
        "name": "ประจำเดือนปกติ",
        "risk": "ปกติ",
        "group": 1,
        "criteria": {
            "q1": {"normal"},
            "q2": {"mid"},
            "q3": {"mid"},
            "q4": {"none"},
            "q5": {"none", "mild"},
            "q6": {"none", "mild"},
            "q10": {"small"},
        },
    },
    {
        "name": "ติ่งเนื้อเยื่อบุโพรงมดลูก",
        "risk": "เสี่ยงปานกลาง",
        "group": 2,
        "criteria": {
            "q1": {"high"},
            "q2": {"long"},
            "q3": {"short", "long"},
            "q4": {"spotting", "postcoital"},
            "q5": {"severe"},
            "q6": {"none", "mild", "severe"},
            "q7": {"discharge"},
            "q10": {"large"},
        },
    },
    {
        "name": "เยื่อบุโพรงมดลูกหนาตัว",
        "risk": "เสี่ยงปานกลาง",
        "group": 2,
        "criteria": {
            "q1": {"high"},
            "q2": {"long"},
            "q3": {"short", "long"},
            "q4": {"spotting"},
            "q5": {"severe"},
            "q6": {"severe"},
            "q10": {"large"},
        },
    },
    {
        "name": "เนื้องอกมดลูก",
        "risk": "เสี่ยงปานกลาง",
        "group": 2,
        "criteria": {
            "q1": {"high"},
            "q2": {"long"},
            "q3": {"short", "long"},
            "q4": {"spotting"},
            "q5": {"severe"},
            "q6": {"mild", "severe"},
            "q7": {"urine", "bowel"},
            "q10": {"large"},
        },
    },
    {
        "name": "ฮอร์โมนไม่สมดุล",
        "risk": "เสี่ยงปานกลาง",
        "group": 2,
        "criteria": {
            "q1": {"high"},
            "q2": {"long"},
            "q3": {"long"},
            "q4": {"spotting"},
            "q5": {"severe"},
            "q6": {"mild", "severe"},
            "q10": {"large"},
        },
    },
    {
        "name": "เยื่อบุโพรงมดลูกเจริญผิดที่",
        "risk": "เสี่ยงปานกลาง",
        "group": 2,
        "criteria": {
            "q1": {"high"},
            "q2": {"long"},
            "q3": {"long"},
            "q4": {"spotting"},
            "q5": {"severe"},
            "q6": {"severe"},
            "q7": {"bowel", "nausea"},
            "q10": {"large"},
        },
    },
    {
        "name": "อุ้งเชิงกรานอักเสบ",
        "risk": "เสี่ยงสูง",
        "group": 2,
        "criteria": {
            "q1": {"high"},
            "q2": {"long"},
            "q3": {"long"},
            "q4": {"spotting"},
            "q5": {"severe"},
            "q6": {"mild", "severe"},
            "q7": {"urine", "fever", "discharge", "nausea"},
        },
    },
    {
        "name": "แท้งคุกคาม",
        "risk": "ฉุกเฉิน",
        "group": 3,
        "criteria": {
            "q4": {"spotting"},
            "q6": {"severe"},
            "q10": {"small"},
        },
    },
    {
        "name": "ท้องนอกมดลูก",
        "risk": "ฉุกเฉิน",
        "group": 3,
        "criteria": {
            "q4": {"spotting"},
            "q6": {"mild", "severe"},
            "q7": {"palpitation", "breast", "nausea"},
            "q10": {"small", "large"},
        },
    },
    {
        "name": "ภาวะแท้งไม่สมบูรณ์",
        "risk": "ฉุกเฉิน",
        "group": 3,
        "criteria": {
            "q4": {"spotting"},
            "q6": {"severe"},
            "q7": {"fever", "discharge", "nausea"},
            "q10": {"large"},
        },
    },
]

# ลำดับความรุนแรง (ใช้หา "ระดับเสี่ยงสูงสุด" ตอนเจอหลายโรค)
RISK_ORDER = {"ปกติ": 0, "เสี่ยงปานกลาง": 1, "เสี่ยงสูง": 2, "ฉุกเฉิน": 3}


def _eligible_groups(q8, q9):
    """ด่านกรองกลุ่มโรคจากคำถามเรื่องเพศสัมพันธ์ (Q8) / การตั้งครรภ์ (Q9)"""
    if q8 == "no_sex":
        return {1, 2}
    if q9 == "pregnant":
        return {3}
    if q9 == "unsure":
        return {1, 2, 3}
    # มีเพศสัมพันธ์ + ไม่ตั้งครรภ์ (หรือไม่ระบุ)
    return {1, 2}


def screen_symptoms(ai_result, answers):
    """
    คัดกรองโรคจากคำตอบ Q1-Q10 แบบให้คะแนน %
    answers: dict เช่น {"q1":"normal","q4":"spotting","q7":["nausea"],"q8":"no_sex",...}
             q7 = list (เลือกได้หลายข้อ) · ข้ออื่น = string
    คืน (results, risk_level, recommendation)
      results = [{"disease","risk_level","match_percent"}, ...] เรียง % มาก→น้อย
    """
    q8 = answers.get("q8")
    q9 = answers.get("q9")
    q7_ans = set(answers.get("q7") or [])

    # ข้อที่ถูกถามจริง (Q7 นับเมื่อผู้ใช้เลือกอาการ ≥1 · Q9 เมื่อมีเพศสัมพันธ์ · Q10 เฉพาะเคส clot)
    asked = {"q1", "q2", "q3", "q4", "q5", "q6"}
    if q7_ans:  # Q7 ไม่บังคับ → เข้าตัวหารเฉพาะเมื่อเลือกอาการอย่างน้อย 1
        asked.add("q7")
    if q8 != "no_sex":
        asked.add("q9")
    if ai_result == "clot":
        asked.add("q10")

    eligible = _eligible_groups(q8, q9)

    results = []
    for d in DISEASES:
        if d["group"] not in eligible:
            continue
        total = 0
        matched = 0
        for q, allowed in d["criteria"].items():
            if q not in asked:
                continue  # ข้อที่ไม่ได้ถาม / N/A → ตัดออกจากตัวหาร
            total += 1
            if q == "q7":
                if q7_ans & allowed:  # ตรงอย่างน้อย 1 อย่าง = ผ่าน
                    matched += 1
            elif answers.get(q) in allowed:
                matched += 1
        # เข้าข่ายเมื่อ >= 2/3 (67% ตามที่ตกลง เช่น 2 จาก 3)
        if total and matched * 3 >= total * 2:
            results.append(
                {
                    "disease": d["name"],
                    "risk_level": d["risk"],
                    "match_percent": round(matched / total * 100, 1),
                }
            )

    results.sort(key=lambda r: r["match_percent"], reverse=True)
    if not results:
        return [], None, None

    top_risk = max(
        (r["risk_level"] for r in results), key=lambda lv: RISK_ORDER.get(lv, 0)
    )
    recommendation = DB_ADVICE.get(top_risk, DB_ADVICE["ปกติ"])
    return results, top_risk, recommendation


def build_detect2(ai_res, q10):
    """
    Detect2 = ผล AI + ขนาดลิ่มเลือด (คงความหมายเดิม)
    เคสลิ่มเลือด → ต่อขนาดจาก Q10 เช่น "ลิ่มเลือดขนาดใหญ่" / "ลิ่มเลือดขนาดเล็ก"
    เคสอื่น (เนื้อเยื่อ/ทั้งคู่/ไม่พบ) → เท่ากับ Detect1
    """
    if ai_res == "clot":
        size = {"small": "ขนาดเล็ก", "large": "ขนาดใหญ่"}.get(q10, "")
        return f"ลิ่มเลือด{size}"
    return AI_RESULT_TH.get(ai_res, ai_res)


def _clean(v):
    """ตัดช่องว่างหน้า-หลังของค่าที่รับมา (กันค่าเพี้ยนจากการ copy/พิมพ์ เช่น 'high ')
    ถ้าไม่ใช่ string (None) ก็คืนค่าเดิม"""
    return v.strip() if isinstance(v, str) else v


@analysis_bp.route("/image", methods=["POST"])
@jwt_required()
def analyze_image():
    current_user_id = get_jwt_identity()
    start_time = time.time()
    file = request.files.get("image")

    # ===== A1: file type =====
    if not file or file.filename == "":
        return (
            jsonify(
                {
                    "status": "error",
                    "error_code": "A1",
                    "msg": "ไม่พบไฟล์ภาพ กรุณาอัปโหลดรูปภาพของคุณในรูปแบบ JPG, JPEG หรือ PNG",
                }
            ),
            400,
        )

    if not allowed_file(file.filename):
        return (
            jsonify(
                {
                    "status": "error",
                    "error_code": "A1",
                    "msg": "รูปแบบไฟล์ไม่ถูกต้อง กรุณาอัปโหลดรูปภาพของคุณในรูปแบบ JPG, JPEG หรือ PNG",
                }
            ),
            400,
        )
    file_content = file.read()

    # ===== A2: file size =====
    if len(file_content) > MAX_FILE_SIZE:
        return (
            jsonify(
                {
                    "status": "error",
                    "error_code": "A2",
                    "msg": "ขนาดไฟล์เกินกำหนด กรุณาอัปโหลดรูปภาพของคุณที่มีขนาดไม่เกิน 10MB",
                }
            ),
            400,
        )
    # ===== SAVE IMAGE =====
    timestamp = int(time.time())
    filename = f"user_{current_user_id}_{timestamp}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    with open(filepath, "wb") as f:
        f.write(file_content)

    try:
        img_bgr = cv2.imdecode(np.frombuffer(file_content, np.uint8), cv2.IMREAD_COLOR)
        if img_bgr is None:
            return jsonify({"status": "error", "msg": "ไม่สามารถอ่านภาพได้"}), 400

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (IMG_SIZE, IMG_SIZE))

        # ===== A4: not menstrual image =====
        hsv = cv2.cvtColor(img_resized, cv2.COLOR_RGB2HSV)

        mask_red = cv2.inRange(
            hsv, np.array([0, 58, 16]), np.array([14, 255, 214])
        ) | cv2.inRange(hsv, np.array([161, 58, 16]), np.array([179, 255, 214]))

        if (np.sum(mask_red > 0) / mask_red.size) < RED_RATIO_LIMIT:
            if os.path.exists(filepath):
                os.remove(filepath)
            return (
                jsonify(
                    {
                        "status": "error",
                        "error_code": "A4",
                        "msg": "ไม่พบลักษณะเลือดประจำเดือนในภาพ",
                    }
                ),
                400,
            )

        # ===== AI =====
        # ===== AI =====
        std_limit = calculate_dynamic_std(img_resized)
        mask, conf, avg_conf = run_inference(img_resized)

        # เรียกใช้ฟังก์ชันใหม่ที่คืนค่าสถานะเป็นชื่อคลาสเลย
        ai_res = validate_ai_findings(mask, conf, img_resized, std_limit)

        img_visual = img_resized.copy()

        # กำหนดสี (OpenCV ใช้ BGR): ลิ่มเลือด(ม่วง), เนื้อเยื่อ(แดง)
        class_info = {
            1: {"name": "Blood Clot", "color": (128, 0, 128)},  # ม่วง
            2: {"name": "Tissue", "color": (255, 0, 0)},
        }

        for cls_id, info in class_info.items():
            # สร้าง Binary Mask จากผลลัพธ์ AI และ Confidence
            m = ((mask == cls_id) & (conf > CONF_THRESHOLD)).astype(np.uint8)
            cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            for c in cnts:
                if cv2.contourArea(c) > MIN_AREA:
                    # วาดเส้นขอบลงบนภาพ
                    cv2.drawContours(img_visual, [c], -1, info["color"], 3)

                    # ใส่ชื่อคลาสกำกับ
                    x, y, w, h = cv2.boundingRect(c)
                    label_y = (y - 10) if cls_id == 2 else (y + h + 20)
                    label_y = max(label_y, 15)
                    cv2.putText(
                        img_visual,
                        info["name"],
                        (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,  # ขนาดตัวอักษร
                        info["color"],
                        2,  # ความหนาของตัวอักษร
                    )

        # ตั้งชื่อไฟล์ใหม่สำหรับภาพที่วาดผลแล้ว
        res_filename = f"res_{filename}"
        res_filepath = os.path.join(UPLOAD_FOLDER, res_filename)

        # เซฟภาพที่วาดเส้นแล้วลงในโฟลเดอร์ uploads
        cv2.imwrite(res_filepath, cv2.cvtColor(img_visual, cv2.COLOR_RGB2BGR))

        return jsonify(
            {
                "status": "success",
                "ai_result": ai_res,
                "image_path": f"uploads/{filename}",
                "visual_path": f"uploads/{res_filename}",
                "detect_label": AI_RESULT_TH.get(ai_res, ai_res),
                "confidence": round(avg_conf * 100, 2),
                "processing_time": round(time.time() - start_time, 2),
            }
        )

    except Exception as e:
        logger.exception(e)
        return jsonify({"status": "error", "msg": str(e)}), 500


@analysis_bp.route("/risk", methods=["POST"])
@jwt_required()
def analyze_risk():
    current_user_id = get_jwt_identity()
    start_time = time.time()
    data = request.form

    ai_res = _clean(data.get("ai_result"))
    if not ai_res:
        return (
            jsonify(
                {
                    "status": "error",
                    "error_code": "A3",
                    "msg": "กรุณาระบุผลการวิเคราะห์ภาพ (ai_result)",
                }
            ),
            400,
        )

    # ข้อมูลจาก step 1 (/analysis/image) ที่หน้าบ้านส่งต่อมา (ใช้บันทึกลง DB)
    image_path = data.get("image_path")
    confidence_raw = data.get("confidence")
    try:
        confidence = float(confidence_raw) if confidence_raw not in (None, "") else None
    except (TypeError, ValueError):
        confidence = None

    # รวบรวมคำตอบ Q1-Q10 (q7 เลือกได้หลายข้อ → getlist)
    # _clean = ตัดช่องว่างหน้า-หลัง กันค่าเพี้ยนจากการพิมพ์/copy
    answers = {
        "q1": _clean(data.get("q1")),
        "q2": _clean(data.get("q2")),
        "q3": _clean(data.get("q3")),
        "q4": _clean(data.get("q4")),
        "q5": _clean(data.get("q5")),
        "q6": _clean(data.get("q6")),
        "q7": [_clean(x) for x in data.getlist("q7")],
        "q8": _clean(data.get("q8")),
        "q9": _clean(data.get("q9")),
        "q10": _clean(data.get("q10")),
    }

    # ผลตรวจภาพ (แสดง/บันทึกทั้งกรณีเจอและไม่เจอโรค)
    detect1 = AI_RESULT_TH.get(ai_res, ai_res)
    detect2 = build_detect2(ai_res, answers["q10"])

    # คัดกรองด้วยระบบให้คะแนนอาการ
    results, risk_level, recommendation = screen_symptoms(ai_res, answers)

    # ไม่มีโรคใดถึงเกณฑ์ → ไม่บันทึก DB ตอบเฉพาะข้อความ
    if not results:
        return (
            jsonify(
                {
                    "status": "success",
                    "results": [],
                    "Detect1": detect1,
                    "Detect2": detect2,
                    "Confidence": confidence,
                    "Risk_Level": None,
                    "Potential_Disease": "ไม่มีโรคที่เกี่ยวข้องในระบบ",
                    "Recommendation": None,
                    "msg": "ไม่มีโรคที่เกี่ยวข้องในระบบ",
                    "processing_time": round(time.time() - start_time, 2),
                }
            ),
            200,
        )

    # รวมชื่อโรคที่พบเป็น string เดียว (จำกัดความยาวตามคอลัมน์ varchar 255)
    potential_disease = ", ".join(r["disease"] for r in results)[:255]
    q7_joined = ",".join(answers["q7"])

    # บันทึกผลลง Risk_Assessment (เฉพาะเคสที่เจอโรค)
    db = None
    cursor = None
    assessment_id = None
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO Risk_Assessment
                (UserID, Detect1, Detect2, Confidence,
                 Q1_Flow_Volume, Q2_Duration, Q3_Cycle_Frequency,
                 Q4_Bleeding_Characteristics, Q5_Menstrual_Pain, Q6_Pelvic_Pain,
                 Q7_Associated_Symptoms, Q8_Sexual_History, Q9_Pregnancy_Test,
                 Q10_Clot_Size, Potential_Disease, Risk_Level, Recommendation, Image_Path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                current_user_id,
                detect1,
                detect2,
                confidence,
                answers["q1"],
                answers["q2"],
                answers["q3"],
                answers["q4"],
                answers["q5"],
                answers["q6"],
                q7_joined,
                answers["q8"],
                answers["q9"],
                answers["q10"],
                potential_disease,
                risk_level,
                recommendation,
                image_path,
            ),
        )
        db.commit()
        assessment_id = cursor.lastrowid
    except mysql.connector.Error as err:
        if db is not None:
            db.rollback()
        logger.error(f"บันทึกผลวิเคราะห์ล้มเหลว: {err}")
        return jsonify({"status": "error", "msg": "บันทึกผลวิเคราะห์ไม่สำเร็จ"}), 500
    finally:
        if cursor is not None:
            cursor.close()
        if db is not None:
            db.close()

    return (
        jsonify(
            {
                "status": "success",
                "assessment_id": assessment_id,
                "Detect1": detect1,
                "Detect2": detect2,
                "Confidence": confidence,
                "Risk_Level": risk_level,
                "Potential_Disease": potential_disease,
                "Recommendation": recommendation,
                "results": results,
                "processing_time": round(time.time() - start_time, 2),
            }
        ),
        200,
    )
