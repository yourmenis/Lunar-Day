from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import get_db_connection
import mysql.connector

profile_bp = Blueprint("profile_bp", __name__)


@profile_bp.route("/api/profile", methods=["GET"])
@jwt_required()
def get_profile():
    db = None
    try:
        # ดึง userID ที่เราเซตเป็น identity ใน auth.py (str(user["userID"]))
        user_id = get_jwt_identity()

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # ค้นหาข้อมูลจากตาราง User (ใช้ชื่อ Column ตามที่อยู่ใน auth.py ของคุณ)
        sql = "SELECT Username, Name, LastName, Email, Birthday, profile_img FROM User WHERE userID = %s"
        cursor.execute(sql, (user_id,))
        user_data = cursor.fetchone()

        if user_data:
            # แปลงวันที่เป็น String เพื่อส่งให้ React
            if user_data["Birthday"]:
                user_data["Birthday"] = user_data["Birthday"].strftime("%Y-%m-%d")

            return jsonify({"status": "success", "data": user_data}), 200
        else:
            return jsonify({"msg": "ไม่พบข้อมูลผู้ใช้"}), 404

    except Exception as e:
        return jsonify({"msg": f"เกิดข้อผิดพลาด: {str(e)}"}), 500
    finally:
        if db:
            cursor.close()
            db.close()
