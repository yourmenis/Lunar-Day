import os
import time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config.database import get_db_connection
from extensions import bcrypt
import mysql.connector

profile_bp = Blueprint("profile", __name__)

# กำหนดโฟลเดอร์สำหรับเก็บไฟล์รูปโปรไฟล์
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILE_UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads", "profiles")
os.makedirs(PROFILE_UPLOAD_FOLDER, exist_ok=True)


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# 2. กำหนดขนาดไฟล์สูงสุด 10MB ตามสเปค UC-06
MAX_FILE_SIZE = 10 * 1024 * 1024


def allowed_file(filename):
    # ตรวจสอบว่าไฟล์มีนามสกุลที่อนุญาตหรือไม่
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


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
                    {
                        "status": "error",
                        "error_code": "A1",
                        "msg": "ชื่อผู้ใช้งานนี้มีผู้ใช้แล้ว",
                    }
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
            original_filename = secure_filename(file.filename)
            file_ext = (
                original_filename.rsplit(".", 1)[1].lower()
                if "." in original_filename
                else "png"
            )
            profile_img_name = f"profile_{user_id}_{int(time.time())}.{file_ext}"

            # บันทึกไฟล์ลงโฟลเดอร์
            save_path = os.path.join(PROFILE_UPLOAD_FOLDER, profile_img_name)
            file.save(save_path)

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


# ---------------------------------------------------------
# 3. DELETE: ลบบัญชีผู้ใช้ (ต้องยืนยันด้วยรหัสผ่าน)
# ---------------------------------------------------------
@profile_bp.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()

    # รับรหัสผ่านยืนยันจาก body
    data = request.get_json(silent=True) or {}
    password = (data.get("password") or "").strip()

    if not password:
        return (
            jsonify({"status": "error", "msg": "กรุณากรอกรหัสผ่านเพื่อยืนยัน"}),
            400,
        )

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        # ดึงรหัสผ่าน (hash) + ชื่อไฟล์รูปโปรไฟล์ของผู้ใช้
        cursor.execute(
            "SELECT Password, Profile_Image FROM User WHERE UserID = %s",
            (user_id,),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"status": "error", "msg": "ไม่พบข้อมูลผู้ใช้"}), 404

        # ยืนยันรหัสผ่าน (เหมือนตอน login)
        if not bcrypt.check_password_hash(user["Password"], password):
            return jsonify({"status": "error", "msg": "รหัสผ่านไม่ถูกต้อง"}), 401

        # ลบข้อมูล: ลบผลวิเคราะห์ของผู้ใช้ก่อน (กัน FK ของ Risk_Assessment.UserID) แล้วค่อยลบ User
        cursor.execute("DELETE FROM Risk_Assessment WHERE UserID = %s", (user_id,))
        cursor.execute("DELETE FROM User WHERE UserID = %s", (user_id,))
        db.commit()

        # ลบไฟล์รูปโปรไฟล์ทิ้ง (ถ้ามี) — ครอบ try/except กันลบไม่ได้แล้วล้มทั้ง request
        if user["Profile_Image"]:
            try:
                img_path = os.path.join(PROFILE_UPLOAD_FOLDER, user["Profile_Image"])
                if os.path.exists(img_path):
                    os.remove(img_path)
            except OSError:
                pass

        return jsonify({"status": "success", "msg": "ลบบัญชีเรียบร้อยแล้ว"}), 200

    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({"status": "error", "msg": f"ลบบัญชีไม่สำเร็จ: {err}"}), 500
    finally:
        cursor.close()
        db.close()


# ---------------------------------------------------------
# 4. logout: ออกจากระบบ
# ---------------------------------------------------------
@profile_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    claims = get_jwt()
    jti = claims["jti"]
    exp_timestamp = claims["exp"]  # เวลาหมดอายุของ token
    user_id = get_jwt_identity()

    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO TokenBlacklist (JTI, UserID, ExpiresAt_TK) VALUES (%s, %s, FROM_UNIXTIME(%s))",
            (jti, user_id, exp_timestamp),
        )
        db.commit()
        return jsonify({"status": "success", "msg": "ออกจากระบบเรียบร้อยแล้ว"}), 200
    except mysql.connector.Error as err:
        db.rollback()
        return (
            jsonify({"status": "error", "msg": f"ไม่สามารถออกจากระบบได้: {err}"}),
            500,
        )
    finally:
        cursor.close()
        db.close()
