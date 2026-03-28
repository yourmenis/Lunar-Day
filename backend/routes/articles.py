from flask import Blueprint, jsonify, request
from config.database import get_db_connection
import mysql.connector
import os

articles_bp = Blueprint("articles_bp", __name__)

# ใช้ ENV ถ้ามี ไม่งั้น fallback localhost
SERVER_URL = os.getenv("SERVER_URL", "http://localhost:5000")


# ----------------------------------------------
# Helper: จัดการ URL รูปภาพ
# ----------------------------------------------
def format_image_url(article):
    if (
        article
        and article.get("ImageURL")
        and not article["ImageURL"].startswith("http")
    ):
        article["ImageURL"] = f"{SERVER_URL}{article['ImageURL']}"
    return article


# ----------------------------------------------
# Helper: ปิด DB
# ----------------------------------------------
def close_db(cursor, db):
    if cursor is not None:
        cursor.close()
    if db is not None and db.is_connected():
        db.close()


# ----------------------------------------------
# 1. ดึงรายการบทความทั้งหมด
# ----------------------------------------------
@articles_bp.route("/articles", methods=["GET"])
def get_articles():
    db = None
    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        sql = "SELECT ArticleID, Title, ImageURL FROM Article"
        cursor.execute(sql)
        articles = cursor.fetchall()

        # format image URL
        articles = [format_image_url(a) for a in articles]

        return jsonify(articles), 200

    except mysql.connector.Error as err:
        return jsonify({"msg": f"Database Error: {err}"}), 500
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        close_db(cursor, db)


# ----------------------------------------------
# 2. ดึงรายละเอียดบทความ
# ----------------------------------------------
@articles_bp.route("/articles/<int:article_id>", methods=["GET"])
def get_article_detail(article_id):
    db = None
    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        sql = "SELECT * FROM Article WHERE ArticleID = %s"
        cursor.execute(sql, (article_id,))
        article = cursor.fetchone()

        if not article:
            return jsonify({"msg": "ไม่พบบทความที่ต้องการ"}), 404

        article = format_image_url(article)

        return jsonify(article), 200

    except mysql.connector.Error as err:
        return jsonify({"msg": f"Database Error: {err}"}), 500
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        close_db(cursor, db)


# ----------------------------------------------
# 3. ค้นหาบทความ
# ----------------------------------------------
@articles_bp.route("/articles/search", methods=["GET"])
def search_articles():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify({"msg": "กรุณาใส่คำค้นหา"}), 400

    db = None
    cursor = None

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        sql = """
            SELECT ArticleID, Title, ImageURL 
            FROM Article 
            WHERE Title LIKE %s OR Content LIKE %s
        """
        cursor.execute(sql, (f"%{query}%", f"%{query}%"))
        results = cursor.fetchall()

        # ไม่เจอ → ส่ง empty list (frontend ใช้ง่ายกว่า)
        if not results:
            return jsonify({"msg": "ไม่พบข้อมูลที่ท่านค้นหา"}), 404

        results = [format_image_url(a) for a in results]

        return jsonify(results), 200

    except mysql.connector.Error as err:
        return jsonify({"msg": f"Database Error: {err}"}), 500
    except Exception as e:
        return jsonify({"msg": str(e)}), 500
    finally:
        close_db(cursor, db)
