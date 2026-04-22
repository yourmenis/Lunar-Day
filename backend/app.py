from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import os
from dotenv import load_dotenv

# --- นำเข้า Blueprint จากโฟลเดอร์ routes ---
from routes.auth import auth_bp
from routes.articles import articles_bp
from routes.analysis import analysis_bp
from routes.profile import profile_bp
from routes.history import history_bp

# โหลดค่าจากไฟล์ .env (พวก DB_PASSWORD, JWT_SECRET_KEY)
load_dotenv()

app = Flask(__name__)

# --- 1. ตั้งค่า CORS (สำคัญมาก!) ---
# อนุญาตให้ Frontend (พอร์ต 3000) คุยกับ Backend (พอร์ต 5000) ได้
CORS(app, resources={r"/*": {"origins": "*"}})

# --- 2. ตั้งค่าระบบความปลอดภัย (JWT) ---
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "luna-day-default-secret-key-2026-secure"
)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24) 
jwt = JWTManager(app)

# --- 3. ตั้งค่า Bcrypt ---
# ใช้สำหรับแฮชรหัสผ่านในระบบ
bcrypt = Bcrypt(app)

# --- 4. ลงทะเบียน Blueprint (Route ทั้งหมด) ---
# กำหนด Prefix ให้ชัดเจน เพื่อให้เรียกใช้ผ่าน Postman/Frontend ได้ง่าย
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(articles_bp, url_prefix="/")
app.register_blueprint(analysis_bp, url_prefix="/analysis")
app.register_blueprint(profile_bp, url_prefix="/profile")
app.register_blueprint(history_bp, url_prefix="/history")


# หน้าแรกสำหรับเช็คว่า Server รันติดไหม
@app.route("/")
def index():
    return {
        "message": "Luna Day API is running!",
        "version": "1.0.0",
        "status": "success",
    }, 200


if __name__ == "__main__":
    # รันบนพอร์ต 5000 และเปิด host เป็น 0.0.0.0 เพื่อให้เพื่อนในวง LAN เดียวกันเข้าได้
    app.run(debug=True, host="0.0.0.0", port=5000)
