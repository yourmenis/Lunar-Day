import os
import time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config.database import get_db_connection
from extensions import bcrypt
import mysql.connector
from werkzeug.security import check_password_hash
from extensions import bcrypt
profile_bp = Blueprint("profile", __name__)

# กำหนดโฟลเดอร์สำหรับเก็บไฟล์รูปโปรไฟล์
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILE_UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads", "profiles")
os.makedirs(PROFILE_UPLOAD_FOLDER, exist_ok=True)


ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# 2. กำหนดขนาดไฟล์สูงสุด 10MB ตามสเปค UC-06
MAX_FILE_SIZE = 10 * 1024 * 1024


def allowed_file(filename):
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
# 2. POST/PUT: แก้ไขข้อมูลและรูปภาพ 
# ---------------------------------------------------------
@profile_bp.route("/update", methods=["POST"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    def clean_input(val):
        return val.strip('"').strip("'") if val is not None else None

    username = clean_input(request.form.get("username"))
    firstname = clean_input(request.form.get("firstName"))
    lastname = clean_input(request.form.get("lastName"))
    birthdate = clean_input(request.form.get("birthDate"))
    file = request.files.get("profileImg")
    if username == "" or firstname == "" or lastname == "" or birthdate == "":
        return jsonify({
            "status": "error", 
            "msg": "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนทำการบันทึก"
        }), 400
    try:
        # [A1] เช็ค Username ซ้ำ (เฉพาะเมื่อมีการส่ง username มาแก้)
        if username is not None:
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
                            "msg": "รูปแบบไฟล์ไม่รองรับ กรุณาอัปโหลดไฟล์นามสกุล .jpg, .jpeg หรือ .png",
                        }
                    ),
                    400,
                )

            # เช็คขนาดไฟล์ (A4)
            file.seek(0, os.SEEK_END)
            file_length = file.tell()
            if file_length > MAX_FILE_SIZE:
                return (
                    jsonify(
                        {
                            "status": "error",
                            "error_code": "A4",
                            "msg": "ขนาดไฟล์เกินขีดจำกัด กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 10 MB",
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

    
        updates = []
        params = []
        if username is not None:
            updates.append("Username=%s")
            params.append(username)
        if firstname is not None:
            updates.append("Name=%s")
            params.append(firstname)
        if lastname is not None:
            updates.append("LastName=%s")
            params.append(lastname)
        if birthdate is not None:
            updates.append("Birthday=%s")
            params.append(birthdate)
        if profile_img_name:
            updates.append("Profile_Image=%s")
            params.append(profile_img_name)

        # ไม่มี field ไหนส่งมาเลย → ไม่มีอะไรให้อัปเดต
        if not updates:
            return jsonify({"status": "error", "msg": "ไม่มีข้อมูลที่จะอัปเดต"}), 400


        params.append(user_id)
        sql = f"UPDATE User SET {', '.join(updates)} WHERE UserID=%s"
        cursor.execute(sql, params)
        db.commit()

        return jsonify({"status": "success", "msg": "บันทึกข้อมูลสำเร็จ"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"msg": str(e)}), 500
    finally:
        db.close()
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

# กำหนดขนาดไฟล์สูงสุด 10MB
MAX_FILE_SIZE = 10 * 1024 * 1024

def allowed_file(filename):
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
            SELECT Username, Name, LastName, Birthday, Email, Profile_Image
            FROM User 
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
# 2. POST/PUT: แก้ไขข้อมูลและรูปภาพ 
# ---------------------------------------------------------
@profile_bp.route("/update", methods=["POST"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    def clean_input(val):
        return val.strip('"').strip("'") if val is not None else None

    # รับค่าจากหน้าบ้าน (Camel Case)
    username = clean_input(request.form.get("username"))
    firstName = clean_input(request.form.get("firstName"))
    lastName = clean_input(request.form.get("lastName"))
    birthDate = clean_input(request.form.get("birthDate"))
    file = request.files.get("profileImg")
    
    # เช็คค่าว่าง
    if username == "" or firstName == "" or lastName == "" or birthDate == "":
        return jsonify({
            "status": "error", 
            "msg": "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนทำการบันทึก"
        }), 400
        
    try:
        # [A1] เช็ค Username ซ้ำ
        if username is not None:
            cursor.execute(
                "SELECT UserID FROM User WHERE Username = %s AND UserID != %s",
                (username, user_id),
            )
            if cursor.fetchone():
                return jsonify({
                    "status": "error",
                    "error_code": "A1",
                    "msg": "ชื่อผู้ใช้งานนี้มีผู้ใช้แล้ว"
                }), 400

        # [A3, A4] เช็คไฟล์รูปภาพและขนาดไฟล์
        profile_img_name = None
        if file and file.filename != "":
            if not allowed_file(file.filename):
                return jsonify({
                    "status": "error",
                    "error_code": "A3",
                    "msg": "รูปแบบไฟล์ไม่รองรับ กรุณาอัปโหลดไฟล์นามสกุล .jpg, .jpeg หรือ .png"
                }), 400

            file.seek(0, os.SEEK_END)
            file_length = file.tell()
            if file_length > MAX_FILE_SIZE:
                return jsonify({
                    "status": "error",
                    "error_code": "A4",
                    "msg": "ขนาดไฟล์เกินขีดจำกัด กรุณาอัปโหลดไฟล์ขนาดไม่เกิน 10 MB"
                }), 400

            # บันทึกไฟล์รูปลงระบบ
            file.seek(0)
            original_filename = secure_filename(file.filename)
            file_ext = original_filename.rsplit(".", 1)[1].lower() if "." in original_filename else "png"
            profile_img_name = f"profile_{user_id}_{int(time.time())}.{file_ext}"
            save_path = os.path.join(PROFILE_UPLOAD_FOLDER, profile_img_name)
            file.save(save_path)

        # Map ข้อมูลเพื่อเตรียม Update ลงฐานข้อมูล
        updates = []
        params = []
        if username is not None:
            updates.append("Username=%s")
            params.append(username)
        if firstName is not None:
            updates.append("Name=%s")  # จับคู่กับคอลัมน์ Name
            params.append(firstName)
        if lastName is not None:
            updates.append("LastName=%s") # จับคู่กับคอลัมน์ LastName
            params.append(lastName)
        if birthDate is not None:
            updates.append("Birthday=%s") # จับคู่กับคอลัมน์ Birthday
            params.append(birthDate)
        if profile_img_name:
            updates.append("Profile_Image=%s")
            params.append(profile_img_name)

        if not updates:
            return jsonify({"status": "error", "msg": "ไม่มีข้อมูลที่จะอัปเดต"}), 400

        params.append(user_id)
        sql = f"UPDATE User SET {', '.join(updates)} WHERE UserID=%s"
        cursor.execute(sql, params)
        db.commit()

        return jsonify({"status": "success", "msg": "บันทึกข้อมูลสำเร็จ"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500
    finally:
        db.close()


# ---------------------------------------------------------
# 3. DELETE: ลบบัญชีผู้ใช้งาน
# ---------------------------------------------------------
@profile_bp.route("/delete", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    claims = get_jwt()
    jti = claims["jti"]
    exp_timestamp = claims["exp"]
    
    # ดึงรหัสผ่านจาก Payload
    data = request.get_json()
    password = data.get("password")
    
    if not password:
        return jsonify({"status": "error", "msg": "กรุณากรอกรหัสผ่าน"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        # 1. เช็ครหัสผ่านก่อนว่าตรงกับในฐานข้อมูลไหม
        cursor.execute("SELECT Password FROM User WHERE UserID = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user or not bcrypt.check_password_hash(user["Password"], password):
            return jsonify({"status": "error", "msg": "รหัสผ่านไม่ถูกต้อง"}), 401

        # 2. ถ้ารหัสถูก ค่อยทำการลบข้อมูล
        cursor.execute(
            "INSERT INTO TokenBlacklist (JTI, UserID, ExpiresAt_TK) VALUES (%s, %s, FROM_UNIXTIME(%s))",
            (jti, user_id, exp_timestamp),
        )

        cursor.execute("DELETE FROM Risk_Assessment WHERE UserID = %s", (user_id,))
        cursor.execute("DELETE FROM User WHERE UserID = %s", (user_id,))
        cursor.execute("DELETE FROM TokenBlacklist WHERE ExpiresAt_TK < NOW()")
        
        db.commit()
        return jsonify({"status": "success", "msg": "ลบบัญชีผู้ใช้งานเรียบร้อยแล้ว"}), 200

    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({"status": "error", "msg": f"ไม่สามารถลบบัญชีได้: {err}"}), 500
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "msg": str(e)}), 500
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
    
        cursor.execute("DELETE FROM TokenBlacklist WHERE ExpiresAt_TK < NOW()")
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


