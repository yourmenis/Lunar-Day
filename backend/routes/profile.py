import os
import time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config.database import get_db_connection

profile_bp = Blueprint("profile", __name__)

# ตั้งค่าโฟลเดอร์เก็บรูปโปรไฟล์แยกจากรูปวิเคราะห์เลือด
PROFILE_UPLOAD_FOLDER = os.path.join(os.getcwd(), "static/uploads/profiles")
os.makedirs(PROFILE_UPLOAD_FOLDER, exist_ok=True)


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# 2. กำหนดขนาดไฟล์สูงสุด 10MB ตามสเปค UC-06
MAX_FILE_SIZE = 10 * 1024 * 1024 

def allowed_file(filename):
    # .lower() จะเปลี่ยน "MyPic.JPEG" -> "jpeg" แล้วมาเช็คในเซตข้างบน
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------
# 1. GET: ดูข้อมูลโปรไฟล์ (Main Flow ข้อ 2)
# ---------------------------------------------------------
@profile_bp.route("/", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    db = get_db_connection()
    try:
        cursor = db.cursor(dictionary=True)

        sql = """
            SELECT Username, Name, LastName,Birthday, Email, Profile_Image
            FROM user 
            WHERE UserID = %s
        """
        cursor.execute(sql, (user_id,))
        user = cursor.fetchone()

        if user:
            if user["Birthday"]:
                user["Birthday"] = user["Birthday"].strftime("%Y-%m-%d")

            return jsonify({"status": "success", "data": user}), 200

        return jsonify({"status": "error", "msg": "ไม่พบข้อมูลผู้ใช้"}), 404

    except Exception as e:
        return jsonify({"status": "error", "msg": str(e)}), 500

    finally:
        db.close()


# ---------------------------------------------------------
# 2. POST/PUT: แก้ไขข้อมูลและรูปภาพ (Main Flow ข้อ 5-8)
# ---------------------------------------------------------
@profile_bp.route("/update", methods=["POST"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # รับข้อมูลจาก Form-data
    username = request.form.get("username")
    name = request.form.get("name")
    lastname = request.form.get("lastname")
    birthday = request.form.get("birthday")
    file = request.files.get("profile_img")

    try:
        # [A1] เช็ค Username ซ้ำ (ถ้ามีการเปลี่ยน Username)
        cursor.execute(
            "SELECT UserID FROM User WHERE Username = %s AND UserID != %s",
            (username, user_id),
        )
        if cursor.fetchone():
            return (
                jsonify(
                    {"status": "error", "error_code": "A1", "msg": "ชื่อผู้ใช้งานนี้มีผู้ใช้แล้ว"}
                ),
                400,
            )

        # [A3] เช็คไฟล์รูปภาพ
        profile_img_name = None
        if file and file.filename != "":
            if not allowed_file(file.filename):
                return (
                    jsonify(
                        {
                            "status": "error",
                            "error_code": "A3",
                            "msg": "รูปแบบไฟล์ไม่ถูกต้อง",
                        }
                    ),
                    400,
                )

            # เช็คขนาดไฟล์ (A3)
            file.seek(0, os.SEEK_END)
            file_length = file.tell()
            if file_length > MAX_FILE_SIZE:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "error_code": "A3",
                            "msg": "ขนาดไฟล์ใหญ่เกิน 10MB",
                        }
                    ),
                    400,
                )

            # บันทึกไฟล์รูป
            file.seek(0)
            filename = secure_filename(file.filename)
            profile_img_name = f"profile_{user_id}_{int(time.time())}_{filename}"
            file.save(os.path.join(PROFILE_UPLOAD_FOLDER, profile_img_name))

        # อัปเดตข้อมูลใน DB
        if profile_img_name:
            sql = "UPDATE User SET Username=%s, Name=%s, LastName=%s, Birthday=%s, Profile_Image=%s WHERE UserID=%s"
            params = (username, name, lastname, birthday, profile_img_name, user_id)
        else:
            sql = "UPDATE User SET Username=%s, Name=%s, LastName=%s, Birthday=%s WHERE UserID=%s"
            params = (username, name, lastname, birthday, user_id)

        cursor.execute(sql, params)
        db.commit()

        return jsonify({"status": "success", "msg": "บันทึกข้อมูลสำเร็จ"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"msg": str(e)}), 500
    finally:
        db.close()
