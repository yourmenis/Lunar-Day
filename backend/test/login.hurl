# ==========================================
# TC2.1 Login Success
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunar_user01",
  "password": "password123"
}
HTTP 200
[Asserts]
jsonpath "$.msg" == "เข้าสู่ระบบสำเร็จ"
[Captures]
my_token: jsonpath "$.access_token"

# ==========================================
# TC2.2 Invalid Password 
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest1",
  "password": "123456789"
}
HTTP 401
[Asserts]
jsonpath "$.msg" == "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

# ==========================================
# TC2.3 Invalid Username (ไม่มี User นี้ในระบบ)
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest122",
  "password": "test12345"
}

HTTP 401
[Asserts]
jsonpath "$.msg" == "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

# ==========================================
# TC2.4-1 Anonymous user (ไม่กรอก Username)
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "",
  "password": "test12345"
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

# ==========================================
# TC2.4-2 Anonymous password (ไม่กรอก Password)
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest122",
  "password": ""
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

# ==========================================
# TC2.4-3 Anonymous both (ไม่กรอกทั้งคู่)
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "",
  "password": ""
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

# =====================================================================
# TC2.5: ตรวจสอบการเข้าถึงหน้าภายในโดยไม่เข้าสู่ระบบ (Unauthorized Access)
# =====================================================================

# ---------------------------------------------------------------------
# กรณีที่ 1: หน้าประวัติการวิเคราะห์ 
# ---------------------------------------------------------------------
GET http://localhost:5000/analysis/result/50

HTTP 401
[Asserts]
jsonpath "$.msg" exists

# ---------------------------------------------------------------------
# กรณีที่ 2: หน้าบันทึกผลความเสี่ยง
# ---------------------------------------------------------------------
POST http://localhost:5000/analysis/risk

HTTP 401
[Asserts]
jsonpath "$.msg" exists

# ---------------------------------------------------------------------
# กรณีที่ 3: หน้าอัปโหลด
# ---------------------------------------------------------------------
POST http://localhost:5000/analysis/image

HTTP 401
[Asserts]
jsonpath "$.msg" exists