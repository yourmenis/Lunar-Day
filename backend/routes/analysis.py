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

# INPUT VALIDATION
VALID_PAIN = ["ปกติ/ปวดเล็กน้อย", "ปวดปานกลาง", "ปวดรุนแรง"]
VALID_DURATION = ["1-7 วัน", "มากกว่า 7 วัน"]
VALID_PREG = ["true", "false"]
VALID_SIZE = ["เล็กกว่าเหรียญสิบ", "ใหญ่กว่าเหรียญสิบ"]

# AREA CONFIG
MIN_AREA = 20
SMALL_OBJECT = 100
LARGE_OBJECT = 1000
LARGE_TISSUE = 5000

# FIX 1: แปลง ai_res (EN) → ภาษาไทย สำหรับใช้เป็น key ใน RISK_TABLE และแสดงผล
AI_RESULT_TH = {
    "clot": "ลิ่มเลือด",
    "tissue": "เนื้อเยื่อ",
    "mixed": "พบลิ่มเลือดและเนื้อเยื่อ",
    "none": "ไม่พบลิ่มเลือดและเนื้อเยื่อ",
}

model = None
model_lock = Lock()


# ==============================
# MEDICAL LOOKUP TABLE
# ==============================
RISK_TABLE = {
    # ── ลิ่มเลือด + ปกติ/ปวดเล็กน้อย ────────────────────────────────────
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", False, "เล็กกว่าเหรียญสิบ"): (
        "เสี่ยงปานกลาง",
        "ประจำเดือนปกติที่มีลิ่มเลือดปน",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", False, "ใหญ่กว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "ติ่งเนื้อ/เลือดออกมาก",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", True, "เล็กกว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "เลือดล้างหน้าเด็ก/แท้งคุกคาม",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", True, "ใหญ่กว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ภาวะแท้งบุตร",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", False, "เล็กกว่าเหรียญสิบ"): (
        "เสี่ยงปานกลาง",
        "ฮอร์โมนไม่ปกติ/ภาวะไข่ไม่ตก",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", False, "ใหญ่กว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "เยื่อบุโพรงมดลูกหนาตัว",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", True, "เล็กกว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก",
    ),
    ("ลิ่มเลือด", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", True, "ใหญ่กว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ภาวะแท้งไม่ครบ",
    ),
    # ── ลิ่มเลือด + ปวดปานกลาง ───────────────────────────────────────────
    ("ลิ่มเลือด", "ปวดปานกลาง", "1-7 วัน", False, "เล็กกว่าเหรียญสิบ"): (
        "เสี่ยงปานกลาง",
        "ปวดประจำเดือนทั่วไป",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "1-7 วัน", False, "ใหญ่กว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "มดลูกอักเสบเรื้อรัง",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "1-7 วัน", True, "เล็กกว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ภาวะแท้ง / ท้องนอกมดลูก",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "1-7 วัน", True, "ใหญ่กว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "แท้งรุนแรง / ภาวะแทรกซ้อน",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "มากกว่า 7 วัน", False, "เล็กกว่าเหรียญสิบ"): (
        "เสี่ยงปานกลาง",
        "ปากมดลูกอักเสบ / ฮอร์โมนผิดปกติ",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "มากกว่า 7 วัน", False, "ใหญ่กว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "เนื้องอกมดลูก",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "มากกว่า 7 วัน", True, "เล็กกว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก",
    ),
    ("ลิ่มเลือด", "ปวดปานกลาง", "มากกว่า 7 วัน", True, "ใหญ่กว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "แท้งไม่ครบ / ภาวะวิกฤต",
    ),
    # ── ลิ่มเลือด + ปวดรุนแรง ────────────────────────────────────────────
    ("ลิ่มเลือด", "ปวดรุนแรง", "1-7 วัน", False, "เล็กกว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "เยื่อบุโพรงมดลูกเจริญผิดที่",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "1-7 วัน", False, "ใหญ่กว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "เนื้องอกมดลูก / เยื่อบุเจริญผิดที่รุนแรง",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "1-7 วัน", True, "เล็กกว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก / แท้ง",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "1-7 วัน", True, "ใหญ่กว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูกแตก",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "มากกว่า 7 วัน", False, "เล็กกว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "อุ้งเชิงกรานอักเสบ",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "มากกว่า 7 วัน", False, "ใหญ่กว่าเหรียญสิบ"): (
        "เสี่ยงสูง",
        "เนื้องงอกมดลูกขนาดใหญ่ / พังผืด",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "มากกว่า 7 วัน", True, "เล็กกว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก / แท้งไม่ครบ",
    ),
    ("ลิ่มเลือด", "ปวดรุนแรง", "มากกว่า 7 วัน", True, "ใหญ่กว่าเหรียญสิบ"): (
        "ฉุกเฉิน",
        "ภาวะแทรกซ้อนรุนแรงจากการตั้งครรภ์",
    ),
    # ── เนื้อเยื่อ + ปกติ/ปวดเล็กน้อย ───────────────────────────────────
    ("เนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", False, None): (
        "เสี่ยงสูง",
        "เยื่อบุโพรงมดลูกหลุดลอก",
    ),
    ("เนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", True, None): (
        "ฉุกเฉิน",
        "ภาวะแท้งคุกคาม",
    ),
    ("เนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", False, None): (
        "เสี่ยงสูง",
        "ฮอร์โมนผิดปกติ / ผนังมดลูกหนาตัว",
    ),
    ("เนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", True, None): (
        "ฉุกเฉิน",
        "ภาวะแท้งไม่ครบ",
    ),
    # ── เนื้อเยื่อ + ปวดปานกลาง ──────────────────────────────────────────
    ("เนื้อเยื่อ", "ปวดปานกลาง", "1-7 วัน", False, None): (
        "เสี่ยงสูง",
        "มดลูกอักเสบเรื้อรัง",
    ),
    ("เนื้อเยื่อ", "ปวดปานกลาง", "1-7 วัน", True, None): (
        "ฉุกเฉิน",
        "ภาวะแท้งบุตร / ท้องนอกมดลูก",
    ),
    ("เนื้อเยื่อ", "ปวดปานกลาง", "มากกว่า 7 วัน", False, None): (
        "เสี่ยงสูง",
        "ติ่งเนื้อ / เนื้องอกมดลูก",
    ),
    ("เนื้อเยื่อ", "ปวดปานกลาง", "มากกว่า 7 วัน", True, None): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก /แท้งติดเชื้อ",
    ),
    # ── เนื้อเยื่อ + ปวดรุนแรง ───────────────────────────────────────────
    ("เนื้อเยื่อ", "ปวดรุนแรง", "1-7 วัน", False, None): (
        "เสี่ยงสูง",
        "เนื้อเยื่อหลุดทั้งแผ่น",
    ),
    ("เนื้อเยื่อ", "ปวดรุนแรง", "1-7 วัน", True, None): ("ฉุกเฉิน", "ท้องนอกมดลูกแตก"),
    ("เนื้อเยื่อ", "ปวดรุนแรง", "มากกว่า 7 วัน", False, None): (
        "เสี่ยงสูง",
        "เยื่อบุโพรงมดลูกเจริญผิดที่ / อุ้งเชิงกรานอักเสบ",
    ),
    ("เนื้อเยื่อ", "ปวดรุนแรง", "มากกว่า 7 วัน", True, None): (
        "ฉุกเฉิน",
        "ภาวะช็อกจากการเสียเลือด / แท้งรุนแรง",
    ),
    # ── ไม่พบลิ่มเลือดและเนื้อเยื่อ + ปกติ/ปวดเล็กน้อย ─────────────────
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", False, None): (
        "ปกติ",
        "ประจำเดือนมาตามปกติ",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "1-7 วัน", True, None): (
        "เสี่ยงปานกลาง",
        "เลือดล้างหน้าเด็ก / แท้งคุกคามระยะแรก",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", False, None): (
        "เสี่ยงปานกลาง",
        "ภาวะไข่ไม่ตก",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปกติ/ปวดเล็กน้อย", "มากกว่า 7 วัน", True, None): (
        "เสี่ยงปานกลาง",
        "ภาวะแทรกซ้อนจากการตั้งครรภ์",
    ),
    # ── ไม่พบลิ่มเลือดและเนื้อเยื่อ + ปวดปานกลาง ────────────────────────
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดปานกลาง", "1-7 วัน", False, None): (
        "ปกติ",
        "ปวดประจำเดือนทั่วไป",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดปานกลาง", "1-7 วัน", True, None): (
        "เสี่ยงสูง",
        "ภาวะแท้งบุตร / ท้องนอกมดลูก",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดปานกลาง", "มากกว่า 7 วัน", False, None): (
        "เสี่ยงปานกลาง",
        "ฮอร์โมนผิดปกติ / ปากมดลูกอักเสบ",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดปานกลาง", "มากกว่า 7 วัน", True, None): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก",
    ),
    # ── ไม่พบลิ่มเลือดและเนื้อเยื่อ + ปวดรุนแรง ─────────────────────────
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดรุนแรง", "1-7 วัน", False, None): (
        "เสี่ยงปานกลาง",
        "ปวดประจำเดือนรุนแรง",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดรุนแรง", "1-7 วัน", True, None): (
        "เสี่ยงสูง",
        "ภาวะแท้งบุตร / ท้องนอกมดลูก",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดรุนแรง", "มากกว่า 7 วัน", False, None): (
        "เสี่ยงสูง",
        "อุ้งเชิงกรานอักเสบ",
    ),
    ("ไม่พบลิ่มเลือดและเนื้อเยื่อ", "ปวดรุนแรง", "มากกว่า 7 วัน", True, None): (
        "ฉุกเฉิน",
        "ท้องนอกมดลูก / ภาวะวิกฤต",
    ),
}

# FIX 2: copy เนื้อเยื่อ → พบลิ่มเลือดและเนื้อเยื่อ (mixed)
# แก้จาก if _r == "tissue" เป็น if _r == "เนื้อเยื่อ" ให้ตรงกับ key จริงใน table
for (_r, _p, _d, _preg, _s), _v in list(RISK_TABLE.items()):
    if _r == "เนื้อเยื่อ":
        RISK_TABLE[("พบลิ่มเลือดและเนื้อเยื่อ", _p, _d, _preg, _s)] = _v

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

            # คำนวณค่า STD จริงของก้อนนั้น
            std_val = np.std(img[m_temp > 0])

            # --- แก้จุดนี้: ใช้ std_limit เพียวๆ ไม่ต้องสนขนาดก้อนเพื่อดันค่า 55 ---
            if cls_id == 1 and std_val <= std_limit:
                scores[1] += 2  # ให้คะแนนพื้นฐานถ้าผ่านเกณฑ์ STD
            elif cls_id == 2 and std_val > std_limit:
                scores[2] += 2

            # ให้โบนัสตามขนาดเพื่อให้คะแนนถึงเกณฑ์สรุปผลง่ายขึ้น
            if area > SMALL_OBJECT:
                scores[cls_id] += 1
            if area > LARGE_OBJECT:
                scores[cls_id] += 1

    return scores


# ==============================
# MEDICAL LOGIC
# ==============================
def evaluate_medical_risk(ai_result, user_input):
    pain = user_input.get("pain_level")
    duration = user_input.get("duration")
    is_preg = user_input.get("is_pregnant")
    user_size = user_input.get("size")

    # FIX 3: แปลง ai_result → ภาษาไทย ก่อนใช้เป็น key lookup
    detect_th = AI_RESULT_TH.get(ai_result, ai_result)

    if ai_result == "clot":
        detect2 = f"ลิ่มเลือด{user_size}" if user_size else "ลิ่มเลือด"
    elif ai_result == "tissue":
        detect2 = "เนื้อเยื่อ"
    elif ai_result == "mixed":
        detect2 = "พบลิ่มเลือดและเนื้อเยื่อ"
    else:
        detect2 = "ไม่พบลิ่มเลือดและเนื้อเยื่อ"

    size_key = user_size if ai_result == "clot" else None
    key = (detect_th, pain, duration, is_preg, size_key)
    risk, disease = RISK_TABLE.get(key, ("ปกติ", "ประจำเดือนมาตามปกติ"))
    adv = DB_ADVICE.get(risk, DB_ADVICE["ปกติ"])

    return risk, disease, detect2, adv


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
        std_limit = calculate_dynamic_std(img_resized)
        mask, conf, avg_conf = run_inference(img_resized)
        scores = calculate_scores(mask, conf, img_resized, std_limit)
        THRESHOLD_SCORE = 2
        if scores[1] >= THRESHOLD_SCORE and scores[2] >= THRESHOLD_SCORE:
            ai_res = "mixed"
        elif scores[1] >= THRESHOLD_SCORE:
            ai_res = "clot"
        elif scores[2] >= THRESHOLD_SCORE:
            ai_res = "tissue"
        else:
            ai_res = "none"
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
    print(f"DEBUG: Current User ID is {current_user_id}")
    start_time = time.time()
    data = request.form
    ai_res = data.get("ai_result")
    pain_level = data.get("pain_level")
    duration = data.get("duration")
    is_pregnant = (data.get("is_pregnant") or "").lower()
    size_val = data.get("size")
    confidence = data.get("confidence")
    image_path = data.get("image_path")

    # ===== A3: required fields =====
    if not ai_res or not pain_level or not duration or not is_pregnant:
        return (
            jsonify(
                {
                    "status": "error",
                    "error_code": "A3",
                    "msg": "กรุณากรอกข้อมูลอาการให้ครบถ้วน",
                }
            ),
            400,
        )

    # ===== validate values =====
    if (
        pain_level not in VALID_PAIN
        or duration not in VALID_DURATION
        or is_pregnant not in VALID_PREG
    ):
        return (
            jsonify({"status": "error", "error_code": "A3", "msg": "ข้อมูลไม่ถูกต้อง"}),
            400,
        )

    # ===== case-specific validation =====
    if ai_res == "clot" and not size_val:
        return (
            jsonify(
                {
                    "status": "error",
                    "error_code": "A3",
                    "msg": "กรุณาระบุขนาดของลิ่มเลือด",
                }
            ),
            400,
        )

    is_preg_bool = is_pregnant == "true"

    user_input = {
        "pain_level": pain_level,
        "duration": duration,
        "is_pregnant": is_preg_bool,
        "size": size_val if ai_res == "clot" else None,
    }

    # ===== medical evaluation =====
    risk, disease, det2, adv = evaluate_medical_risk(ai_res, user_input)

    # ===== SAVE DB =====
    db_saved = False
    db = get_db_connection()
    if db:
        try:
            cursor = db.cursor()
            cursor.execute(
                """
                INSERT INTO Risk_Assessment
                (UserID, Detect1, Detect2, Confidence, Pain_Level,
                 Duration, Is_Pregnant, Size, Risk_Level,
                 Potential_Disease, Recommendation,Image_Path)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    current_user_id,
                    AI_RESULT_TH.get(ai_res, ai_res),
                    det2,
                    confidence,
                    pain_level,
                    duration,
                    1 if is_preg_bool else 0,
                    size_val,
                    risk,
                    disease,
                    adv,
                    image_path,
                ),
            )
            db.commit()
            db_saved = True
        except Exception as e:
            db.rollback()
            logger.error(e)
        finally:
            db.close()

    return jsonify(
        {
            "status": "success",
            "Detect1": AI_RESULT_TH.get(ai_res, ai_res),
            "Detect2": det2,
            "Risk_Level": risk,
            "Potential_Disease": disease,
            "Confidence": confidence,
            "Recommendation": adv,
            "processing_time": round(time.time() - start_time, 2),
            "saved": db_saved,
        }
    )
