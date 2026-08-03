import email
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import datetime, date
from extensions import bcrypt
from numpy import rint
from config.database import get_db_connection
import mysql.connector
import random
import smtplib
import os
from email.mime.text import MIMEText
import re
from datetime import datetime, timedelta

auth_bp = Blueprint("auth_bp", __name__)


# ==========================================
# 🆕 ส่วนที่ 1: ระบบสมาชิก (Register )
# ==========================================
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    confirm_pw = data.get("confirmPassword", "").strip()
    name = data.get("firstName", "").strip()
    lastname = data.get("lastName", "").strip()
    birthday = data.get("birthDate", "").strip()
    email = data.get("email", "").strip()

    # --- ด่านที่ 1: เช็คข้อมูลว่าง (A2) ---
    if not all([username, password, confirm_pw, name, lastname, birthday, email]):
        return jsonify({"msg": "กรุณากรอกข้อมูลให้ครบถ้วน"}), 400

    # --- ด่านที่ 2: เช็ครหัสผ่านสั้นไป (A5) ---
    if len(password) < 8:
        return jsonify({"msg": "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"}), 400

    # --- ด่านที่ 3: เช็ครหัสผ่านไม่ตรงกัน (A3) ---
    if password != confirm_pw:
        return jsonify({"msg": "รหัสผ่านไม่ตรงกัน"}), 400

    # --- ด่านที่ 4: format email ---
    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_pattern, email):

        return jsonify({"msg": "รูปแบบอีเมลไม่ถูกต้อง"}), 400
    # --- ด่านที่ 4: เช็คอายุต้อง >= 13 ปี (A4) ---
    try:

        birthday = datetime.strptime(birthday, "%Y-%m-%d").date()
        if birthday.year > 2400:
            birthday = birthday.replace(year=birthday.year - 543)

        today = date.today()

        age = (
            today.year
            - birthday.year
            - ((today.month, today.day) < (birthday.month, birthday.day))
        )

        if age < 13:
            return jsonify({"msg": "ขออภัย คุณต้องมีอายุตั้งแต่ 13 ปีขึ้นไป"}), 400

    except ValueError:
        return jsonify({"msg": "รูปแบบวันที่ไม่ถูกต้อง"}), 400

    # --- ด่านที่ 5: ทำงานกับ Database (A1 & บันทึก) ---
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        # เช็ค Username ซ้ำ
        check_sql = "SELECT Username FROM User WHERE Username = %s"
        cursor.execute(check_sql, (username,))
        if cursor.fetchone():
            return jsonify({"msg": "ชื่อผู้ใช้ซ้ำ: Username นี้ถูกใช้งานแล้ว"}), 400

        # check email ซ้ำ
        check_sql = "SELECT Email FROM User WHERE Email = %s"
        cursor.execute(check_sql, (email,))
        if cursor.fetchone():
            return jsonify({"msg": "อีเมลนี้ถูกใช้งานแล้ว"}), 400

        # ถ้าผ่านทุกด่านแล้ว ค่อยแฮชรหัสผ่าน
        hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

        # บันทึกข้อมูล
        sql = "INSERT INTO User (Username, Password, Name, LastName, Birthday,Email) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (username, hashed_pw, name, lastname, birthday, email)

        cursor.execute(sql, values)
        db.commit()  # ยืนยันการบันทึกลง Hard Drive
        return jsonify({"msg": "สมัครสมาชิกสำเร็จ!"}), 201

    except mysql.connector.Error as err:
        return jsonify({"msg": f"เกิดข้อผิดพลาดทางเทคนิค: {err}"}), 500
    finally:
        cursor.close()
        db.close()


# ==========================================
# ✅ ส่วนที่ 2: login
# ==========================================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"msg": "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        # 1. ค้นหา User จากฐานข้อมูล
        sql = "SELECT * FROM User WHERE Username = %s"
        cursor.execute(sql, (username,))
        user = cursor.fetchone()

        # 2. ตรวจสอบว่ามี User นี้ไหม และรหัสผ่านถูกต้องหรือไม่
        # [A1] กรณีรหัสผ่านหรือชื่อผู้ใช้ผิด
        if user and bcrypt.check_password_hash(user["Password"], password):
            # 3. ถ้าถูกต้อง สร้าง Access Token (JWT)
            access_token = create_access_token(identity=str(user["UserID"]))

            return (
                jsonify(
                    {
                        "msg": "เข้าสู่ระบบสำเร็จ",
                        "access_token": access_token,
                        "user": {
                            "id": user["UserID"],
                            "name": user["Name"],
                            "lastname": user["LastName"],
                        },
                    }
                ),
                200,
            )
        else:
            return jsonify({"msg": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}), 401

    except mysql.connector.Error as err:
        return jsonify({"msg": f"เกิดข้อผิดพลาดทางเทคนิค: {err}"}), 500
    finally:
        cursor.close()
        db.close()


# --- Configuration (ระบบส่งเมล) ---

GMAIL_USER = os.environ.get("GMAIL_USER")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD")


# ==========================================
# 🔑 1. ส่ง OTP ไปที่อีเมล (Forgot Password)
# ==========================================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"msg": "กรุณากรอกอีเมล"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True, buffered=True)

    try:
        # ตรวจสอบอีเมลในระบบ
        cursor.execute("SELECT UserID FROM User WHERE Email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"msg": "ไม่พบอีเมลนี้ในระบบ"}), 404

        # สุ่ม OTP 6 หลัก
        otp = str(random.randint(100000, 999999))

        # กำหนดเวลาหมดอายุ 5 นาที
        expire_time = datetime.now() + timedelta(minutes=5)

        # บันทึก OTP + เวลาหมดอายุ
        cursor.execute(
            """
            UPDATE User 
            SET ResetOTP = %s, OTPExpireTime = %s 
            WHERE Email = %s
            """,
            (otp, expire_time, email),
        )
        db.commit()

        # ---------------- ส่งอีเมล ----------------
        subject = "Luna Day - Password Reset Verification Code"
        body = f"""
เรียน ผู้ใช้งาน Luna Day
มีการร้องขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ

รหัส OTP สำหรับยืนยันตัวตนคือ
รหัส OTP ของคุณคือ: 
{otp}

    • รหัสนี้มีอายุการใช้งาน 5 นาที
    • โปรดใช้รหัสนี้เพื่อดำเนินการเปลี่ยนรหัสผ่าน
    • ห้ามเปิดเผยรหัส OTP แก่บุคคลอื่น

หากคุณไม่ได้เป็นผู้ร้องขอ โปรดละเว้นอีเมลฉบับนี้ บัญชีของคุณจะไม่ได้รับผลกระทบหากไม่มีการยืนยันรหัส OTP

ขอแสดงความนับถือ
Luna Day Team
"""

        msg = MIMEText(body, _charset="utf-8")
        msg["Subject"] = subject
        msg["From"] = f"Luna Day Team <{GMAIL_USER}>"
        msg["To"] = email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, email, msg.as_string())

        return jsonify({"msg": "ส่งรหัส OTP ไปยังอีเมลของคุณเรียบร้อยแล้ว"}), 200

    except Exception as e:
        return jsonify({"msg": f"เกิดข้อผิดพลาดในการส่งอีเมล: {str(e)}"}), 500

    finally:
        cursor.close()
        db.close()


# ==========================================
# 🛡️ ส่วนที่ 4: verify otp
# ==========================================
@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    otp = (data.get("otp") or "").strip()

    if not email or not otp:
        return jsonify({"msg": "กรุณากรอกข้อมูลให้ครบถ้วน"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True, buffered=True)

    try:
        # เช็คว่า OTP ตรงไหม
        cursor.execute(
            """
            SELECT UserID, OTPExpireTime 
            FROM User 
            WHERE Email = %s AND ResetOTP = %s
            """,
            (email, otp),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"msg": "รหัส OTP ไม่ถูกต้อง"}), 400

        # เช็ควันหมดอายุ
        if user["OTPExpireTime"] is None or datetime.now() > user["OTPExpireTime"]:
            return jsonify({"msg": "รหัส OTP หมดอายุแล้ว โปรดขอรหัสใหม่"}), 400

        return jsonify({"msg": "รหัส OTP ถูกต้อง"}), 200

    except Exception as e:
        return jsonify({"msg": f"เกิดข้อผิดพลาดทางเทคนิค: {str(e)}"}), 500

    finally:
        cursor.close()
        db.close()


# ==========================================
# 🛡️ ส่วนที่ 5: ตั้งรหัสผ่านใหม่ (Reset Password + Confirm)
# ==========================================
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("Email") or "").strip()
    otp = (data.get("OTP") or "").strip()
    new_password = data.get("NewPassword") or ""
    confirm_password = data.get("ConfirmPassword") or ""

    # 1️⃣ เช็คค่าว่าง
    if not all([email, otp, new_password, confirm_password]):
        return jsonify({"msg": "กรุณากรอกข้อมูลให้ครบถ้วน"}), 400

    # 2️⃣ เช็ครหัสผ่านตรงกัน
    if new_password != confirm_password:
        return jsonify({"msg": "รหัสผ่านใหม่ไม่ตรงกัน"}), 400

    # 3️⃣ เช็คความยาว
    if len(new_password) < 8:
        return jsonify({"msg": "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True, buffered=True)

    try:
        # 4️⃣ ดึง OTP + เวลา expire มาตรวจสอบเพื่อความชัวร์อีกรอบ
        cursor.execute(
            """
            SELECT UserID, OTPExpireTime 
            FROM User 
            WHERE Email = %s AND ResetOTP = %s
            """,
            (email, otp),
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"msg": "รหัส OTP ไม่ถูกต้อง"}), 400

        # 5️⃣ เช็ควันหมดอายุซ้ำ
        if user["OTPExpireTime"] is None or datetime.now() > user["OTPExpireTime"]:
            return jsonify({"msg": "รหัส OTP หมดอายุแล้ว โปรดขอรหัสใหม่"}), 400

        # 6️⃣ แฮชรหัสผ่านใหม่
        hashed_pw = bcrypt.generate_password_hash(new_password).decode("utf-8")

        # 7️⃣ อัปเดตรหัสผ่าน และเคลียร์ค่า OTP ทิ้งเพื่อไม่ให้เอามาใช้ซ้ำได้อีก
        cursor.execute(
            """
            UPDATE User 
            SET Password = %s, ResetOTP = NULL, OTPExpireTime = NULL
            WHERE Email = %s
            """,
            (hashed_pw, email),
        )
        db.commit()

        return jsonify({"msg": "เปลี่ยนรหัสผ่านสำเร็จ สามารถเข้าสู่ระบบได้ทันที"}), 200

    except Exception as e:
        return jsonify({"msg": f"เกิดข้อผิดพลาดทางเทคนิค: {str(e)}"}), 500

    finally:
        cursor.close()
        db.close()
