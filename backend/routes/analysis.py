import numpy as np
import torch
import cv2
import os
import time
import logging
from threading import Lock
from flask import Blueprint, request, jsonify
import segmentation_models_pytorch as smp
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity

from config.database import get_db_connection

# ==============================
# INIT
# ==============================
analysis_bp = Blueprint("analysis", __name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join(os.getcwd(), "effv2.pth")

IMG_SIZE = 512
STD_BASE_THRESHOLD = 33.20
CONF_THRESHOLD = 0.3
RED_RATIO_LIMIT = 0.02

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# FILE VALIDATION
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024

# INPUT VALIDATION
VALID_PAIN = ["ปวดปกติเล็กน้อย", "ปวดปานกลาง", "ปวดรุนแรง"]
VALID_DURATION = ["1-7 วัน", "มากกว่า 7 วัน"]
VALID_PREG = ["true", "false"]

# AREA CONFIG
MIN_AREA = 20
SMALL_OBJECT = 100
LARGE_OBJECT = 1000
LARGE_TISSUE = 5000

model = None
model_lock = Lock()


# ==============================
# HELPERS
# ==============================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_model():
    global model
    with model_lock:
        if model is None:
            model = smp.Unet(encoder_name="efficientnet-b0", classes=3, activation=None)
            model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
            model.to(DEVICE).eval()
    return model


def calculate_dynamic_std(img_rgb):
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    brightness = np.mean(img_gray)
    tolerance = 1.30 if brightness > 180 else (1.20 if brightness < 60 else 1.10)
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

    detected = mask_np > 0
    avg_conf = np.mean(conf_np[detected]) if np.any(detected) else 0.0

    return mask_np, conf_np, float(avg_conf)


def calculate_scores(mask, conf, img, std_limit):
    scores = {1: 0, 2: 0}

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
            current_limit = max(std_limit, 55.0) if area > LARGE_OBJECT else std_limit

            if (cls_id == 1 and std_val <= current_limit) or (
                cls_id == 2 and (std_val > current_limit or area > LARGE_TISSUE)
            ):

                scores[cls_id] += 2
                if area > SMALL_OBJECT:
                    scores[cls_id] += 1

    return scores


# ==============================
# ✅ MEDICAL LOGIC (ORIGINAL YOU)
# ==============================
def evaluate_medical_risk(ai_result, user_input):
    pain = user_input.get("pain_level")
    duration = user_input.get("duration")
    is_preg = user_input.get("is_pregnant")
    user_size = user_input.get("size")

    detect2_map = {
        "clot": f"ลิ่มเลือด{user_size}" if user_size else "ลิ่มเลือด",
        "tissue": "เนื้อเยื่อ",
        "mixed": "พบลิ่มเลือดและเนื้อเยื่อ",
        "none": "ไม่พบลิ่มเลือดและเนื้อเยื่อ",
    }
    detect2 = detect2_map.get(ai_result, "ไม่ทราบลักษณะ")

    db_adv = {
        "ฉุกเฉิน": "แนะนำให้เข้ารับการตรวจประเมินจากแพทย์โดยเร็วที่สุดเนื่องจากอาการเลือดออกหรือปวดท้องร่วมกับความเสี่ยงตั้งครรภ์อาจสัมพันธ์กับภาวะแทรกซ้อนที่จำเป็นต้องได้รับการดูแลทางการแพทย์อย่างใกล้ชิด",
        "เสี่ยงสูง": "ควรปรึกษาสูตินรีแพทย์เพื่อการวินิจฉัยเพิ่มเติมเนื่องจากลักษณะเลือดออกหรืออาการปวดที่พบ อาจสัมพันธ์กับความผิดปกติของมดลูกหรือภาวะเลือดออกมากที่ควรได้รับการตรวจหาสาเหตุ",
        "เสี่ยงปานกลาง": "แนะนำให้ติดตามอาการและจดบันทึกรอบเดือนต่อเนื่องควรสังเกตความเปลี่ยนแปลงใน 1-2 รอบเดือนถัดไป หากอาการยังคงอยู่ ไม่สม่ำเสมอ หรือรบกวนการใช้ชีวิตประจำวัน แนะนำให้ปรึกษาแพทย์เมื่อสะดวก",
        "ปกติ": "ผลการวิเคราะห์เบื้องต้นอยู่ในเกณฑ์ทั่วไปยังไม่พบข้อบ่งชี้ความเสี่ยงที่น่ากังวลในขณะนี้แนะนำให้ดูแลสุขภาพ จดบันทึกประจำเดือนสม่ำเสมอ และเข้ารับการตรวจคัดกรองสุขภาพประจำปีตามปกติ",
    }

    risk = "ปกติ"
    disease = "ประจำเดือนมาตามปกติ"

    if ai_result != "none":
        if is_preg:
            risk = "ฉุกเฉิน"
            disease = "ภาวะแทรกซ้อนจากการตั้งครรภ์/เสี่ยงแท้ง"

        else:
            if pain == "ปวดรุนแรง":
                risk = "เสี่ยงสูง"
                disease = "เยื่อบุโพรงมดลูกเจริญผิดที่/เนื้องอกมดลูก"

            elif ai_result == "tissue":
                risk = "เสี่ยงสูง"
                disease = "เยื่อบุโพรงมดลูกหลุดลอกผิดปกติ"

            elif ai_result == "mixed":
                risk = "เสี่ยงสูง"
                disease = "พบลักษณะลิ่มเลือดและเนื้อเยื่อร่วมกัน"

            elif ai_result == "clot" and user_size == "ใหญ่กว่าเหรียญสิบ":
                risk = "เสี่ยงสูง"
                disease = "ภาวะเลือดออกมากผิดปกติ (HMB)"

            else:
                risk = "เสี่ยงปานกลาง"
                disease = "พบความผิดปกติเบื้องต้นเล็กน้อย"

    return risk, disease, detect2, db_adv.get(risk, db_adv["ปกติ"])


# ==============================
# ROUTE
# ==============================
@analysis_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze():
    current_user_id = get_jwt_identity()
    start_time = time.time()

    file = request.files.get("image")

    # ===== A1 =====
    if not file or file.filename == "":
        return (
            jsonify({"status": "error", "error_code": "A1", "msg": "ไม่พบไฟล์ภาพ"}),
            400,
        )

    if not allowed_file(file.filename):
        return (
            jsonify(
                {"status": "error", "error_code": "A1", "msg": "รองรับเฉพาะ JPG/PNG"}
            ),
            400,
        )

    file.seek(0)
    file_content = file.read()

    if len(file_content) > MAX_FILE_SIZE:
        return (
            jsonify({"status": "error", "error_code": "A1", "msg": "ไฟล์ต้องไม่เกิน 10MB"}),
            400,
        )

    try:
        img_bgr = cv2.imdecode(np.frombuffer(file_content, np.uint8), cv2.IMREAD_COLOR)

        if img_bgr is None:
            return jsonify({"status": "error", "msg": "อ่านภาพไม่ได้"}), 400

        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (IMG_SIZE, IMG_SIZE))

        # ===== A3 =====
        hsv = cv2.cvtColor(img_resized, cv2.COLOR_RGB2HSV)
        mask_red = cv2.inRange(
            hsv, np.array([0, 75, 30]), np.array([10, 255, 255])
        ) | cv2.inRange(hsv, np.array([170, 75, 30]), np.array([180, 255, 255]))

        if (np.sum(mask_red > 0) / mask_red.size) < RED_RATIO_LIMIT:
            return (
                jsonify(
                    {
                        "status": "error",
                        "error_code": "A3",
                        "msg": "ไม่พบลักษณะเลือดประจำเดือนในภาพ กรุณาถ่ายภาพใหม่โดยให้เห็นลักษณะเลือดชัดเจน",
                    }
                ),
                400,
            )

        # ===== AI =====
        std_limit = calculate_dynamic_std(img_resized)
        mask, conf, avg_conf = run_inference(img_resized)
        scores = calculate_scores(mask, conf, img_resized, std_limit)

        if scores[1] >= 2 and scores[2] >= 2:
            ai_res = "mixed"
        elif scores[1] >= 2:
            ai_res = "clot"
        elif scores[2] >= 2:
            ai_res = "tissue"
        else:
            ai_res = "none"

        pain_level = request.form.get("pain_level")

        # ===== STEP 1 =====
        if not pain_level:
            return jsonify(
                {
                    "status": "success",
                    "step": 1,
                    "detect1": ai_res,
                    "confidence": round(avg_conf * 100, 2),
                }
            )

        # ===== A2 =====
        duration = request.form.get("duration")
        is_pregnant = request.form.get("is_pregnant", "").lower()

        if (
            pain_level not in VALID_PAIN
            or duration not in VALID_DURATION
            or is_pregnant not in VALID_PREG
        ):
            return (
                jsonify(
                    {"status": "error", "error_code": "A2", "msg": "กรุณากรอกข้อมูลให้ครบ"}
                ),
                400,
            )

        is_preg_bool = is_pregnant == "true"
        size_val = request.form.get("size") if ai_res == "clot" else None

        user_input = {
            "pain_level": pain_level,
            "duration": duration,
            "is_pregnant": is_preg_bool,
            "size": size_val,
        }

        risk, disease, det2, adv = evaluate_medical_risk(ai_res, user_input)

        # ===== SAVE IMAGE =====
        filename = secure_filename(file.filename)
        unique_name = f"{int(time.time())}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_name)

        file.seek(0)
        file.save(filepath)

        # ===== SAVE DB =====
        db = get_db_connection()
        if db:
            try:
                cursor = db.cursor()
                cursor.execute(
                    """
                    INSERT INTO Risk_Assessment
                    (UserID, Detect1, Detect2, Confidence, Pain_Level,
                     Duration, Is_Pregnant, Size, Risk_Level,
                     Potential_Disease, Recommendation, Image_Path)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                    (
                        current_user_id,
                        ai_res,
                        det2,
                        round(avg_conf * 100, 2),
                        pain_level,
                        duration,
                        1 if is_preg_bool else 0,
                        size_val,
                        risk,
                        disease,
                        adv,
                        f"uploads/{unique_name}",
                    ),
                )
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error(e)

        return jsonify(
            {
                "status": "success",
                "step": 2,
                "Detect1": ai_res,
                "Detect2": det2,
                "Confidence": round(avg_conf * 100, 2),
                "Risk_Level": risk,
                "Potential_Disease": disease,
                "Recommendation": adv,
                "processing_time": round(time.time() - start_time, 2),
            }
        )

    except Exception as e:
        logger.exception(e)
        return jsonify({"status": "error", "msg": str(e)}), 500
