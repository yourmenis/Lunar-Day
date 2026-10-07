from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import get_db_connection
import mysql.connector
import logging
import os 

history_bp = Blueprint("history", __name__)
logger = logging.getLogger(__name__)

# กำหนด Path ของโฟลเดอร์รูปภาพ
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# ---------------------------------------------------------
# 1. GET: ดึงรายการประวัติทั้งหมด 
# ---------------------------------------------------------
@history_bp.route("/", methods=["GET"])
@jwt_required()
def get_history_list():
    current_user_id = get_jwt_identity()
    db = get_db_connection()
    cursor = None

    if not db:
        return jsonify({"status": "error", "msg": "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"}), 500

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
            return jsonify({"status": "empty","error_code":"A1", "msg": "ไม่พบประวัติการใช้งาน"}), 200

        return jsonify({"status": "success", "data": history}), 200

    except mysql.connector.Error as err:
        logger.error(f"Database Error : {err}")
        return jsonify({"status": "error", "msg": "เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล"}), 500
    except Exception as e:
        logger.error(f"System Error: {e}")
        return jsonify({"status": "error", "msg": "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
# ---------------------------------------------------------
# 2. GET: ดูรายละเอียดฉบับเต็ม 
# ---------------------------------------------------------
@history_bp.route("/<int:assessment_id>", methods=["GET"])
@jwt_required()
def get_history_detail(assessment_id):
    current_user_id = get_jwt_identity()
    db = get_db_connection()
    cursor = None

    if not db:
        return jsonify({"status": "error", "msg": "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"}), 500

    try:
        cursor = db.cursor(dictionary=True)
        query = "SELECT * FROM Risk_Assessment WHERE AssessmentID = %s AND UserID = %s"
        cursor.execute(query, (assessment_id, current_user_id))
        detail = cursor.fetchone()

        if not detail:
            return jsonify({"status": "error", "error_code": "A1", "msg": "ไม่พบข้อมูลประวัติการใช้งาน"}), 404

        return jsonify({"status": "success", "data": detail}), 200
        
    except mysql.connector.Error as err:
        logger.error(f"Database Error: {err}")
        return jsonify({"status": "error", "msg": "เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล"}), 500
    except Exception as e:
        logger.error(f"Error System: {e}")
        return jsonify({"status": "error", "msg": "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
# ---------------------------------------------------------
# 3. DELETE: ลบประวัติ 
# ---------------------------------------------------------
@history_bp.route("/<int:assessment_id>", methods=["DELETE"])
@jwt_required()
def delete_history(assessment_id):
    current_user_id = get_jwt_identity()
    db = get_db_connection()
    cursor = None

    if not db:
        return jsonify({"status": "error","msg": "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"}), 500

    try:
        cursor = db.cursor(dictionary=True) 
        
        find_query = "SELECT Image_Path FROM Risk_Assessment WHERE AssessmentID = %s AND UserID = %s"
        cursor.execute(find_query, (assessment_id, current_user_id))
        record = cursor.fetchone()

        if not record:
            return jsonify({"status": "error", "error_code": "A1", "msg": "ไม่พบข้อมูลประวัติการใช้งาน"}), 404

        # 2. ลบข้อมูลจากฐานข้อมูล
        delete_query = "DELETE FROM Risk_Assessment WHERE AssessmentID = %s AND UserID = %s"
        cursor.execute(delete_query, (assessment_id, current_user_id))
        db.commit()

        image_url = record.get("Image_Path")
        if image_url:
            
            filename = image_url.split("/")[-1]
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except Exception as e:
                    logger.warning(f"ลบไฟล์รูปภาพต้นฉบับไม่สำเร็จ: {e}")

            
            res_filepath = os.path.join(UPLOAD_FOLDER, f"res_{filename}")
            if os.path.exists(res_filepath):
                try:
                    os.remove(res_filepath)
                except Exception as e:
                    logger.warning(f"ลบไฟล์รูปภาพประมวลผลไม่สำเร็จ: {e}")

        return jsonify({"status": "success", "msg": "ลบรายการประวัติเรียบร้อยแล้ว"}), 200

    except mysql.connector.Error as err:
        db.rollback() 
        logger.error(f"Database Error : {err}")
        return jsonify({"status": "error", "msg": "เกิดข้อผิดพลาดในการลบข้อมูล"}), 500
    except Exception as e:
        db.rollback()
        logger.error(f"Error System: {e}")
        return jsonify({"status": "error", "msg": "เกิดข้อผิดพลาดของระบบ"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()