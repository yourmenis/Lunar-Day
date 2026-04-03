from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import get_db_connection
import logging

history_bp = Blueprint("history", __name__)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------
# 1. GET: ดึงรายการประวัติทั้งหมด (เรียงตามล่าสุด)
# ---------------------------------------------------------
@history_bp.route("/", methods=["GET"])
@jwt_required()
def get_history_list():
    current_user_id = get_jwt_identity()
    db = get_db_connection()

    if not db:
        return jsonify({"msg": "Database connection failed"}), 500

    try:
        cursor = db.cursor(dictionary=True)
        query = """
            SELECT AssessmentID, Detect2, Risk_Level, Potential_Disease, 
                   Image_Path, Create_At 
            FROM Risk_Assessment 
            WHERE UserID = %s 
            ORDER BY Create_At DESC
        """
        cursor.execute(query, (current_user_id,))
        history = cursor.fetchall()

        if not history:
            return jsonify({"status": "empty", "msg": "ไม่พบประวัติการใช้งาน"}), 200

        return jsonify({"status": "success", "data": history}), 200

    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        return jsonify({"msg": "Internal Server Error"}), 500
    finally:
        cursor.close()
        db.close()


# ---------------------------------------------------------
# 2. GET: ดูรายละเอียดฉบับเต็ม (By ID)
# ---------------------------------------------------------
@history_bp.route("/<int:assessment_id>", methods=["GET"])
@jwt_required()
def get_history_detail(assessment_id):
    current_user_id = get_jwt_identity()
    db = get_db_connection()

    try:
        cursor = db.cursor(dictionary=True)
        query = "SELECT * FROM Risk_Assessment WHERE AssessmentID = %s AND UserID = %s"
        cursor.execute(query, (assessment_id, current_user_id))
        detail = cursor.fetchone()

        if not detail:
            return jsonify({"msg": "ไม่พบข้อมูลที่ต้องการ"}), 404

        return jsonify({"status": "success", "data": detail}), 200
    finally:
        cursor.close()
        db.close()


# ---------------------------------------------------------
# 3. DELETE: ลบประวัติ
# ---------------------------------------------------------
@history_bp.route("/<int:assessment_id>", methods=["DELETE"])
@jwt_required()
def delete_history(assessment_id):
    current_user_id = get_jwt_identity()
    db = get_db_connection()

    try:
        cursor = db.cursor()
        # เช็คก่อนว่าข้อมูลนี้เป็นของ User คนนี้จริงไหมเพื่อความปลอดภัย
        query = "DELETE FROM Risk_Assessment WHERE AssessmentID = %s AND UserID = %s"
        cursor.execute(query, (assessment_id, current_user_id))
        db.commit()

        if cursor.rowcount == 0:
            return jsonify({"msg": "ไม่พบข้อมูล"}), 404

        return jsonify({"status": "success", "msg": "ลบรายการประวัติเรียบร้อยแล้ว"}), 200
    finally:
        cursor.close()
        db.close()
