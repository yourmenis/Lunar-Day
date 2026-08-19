# ==========================================
# Test cases: POST /auth/login
# Reference: backend/routes/auth.py (login)
# ==========================================

# 1. Login สำเร็จ (username + password ถูกต้อง) -> 200
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest1",
  "password": "test12345"
}
HTTP 200
[Asserts]
jsonpath "$.msg" == "เข้าสู่ระบบสำเร็จ"
jsonpath "$.access_token" exists
jsonpath "$.user.id" exists
jsonpath "$.user.name" exists
jsonpath "$.user.lastname" exists
jsonpath "$.access_token" matches ".*\\..*\\..*"

# 2. ขาด username -> 400
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "password": "test12345"
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

# 3. ขาด password -> 400
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest1"
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

# 4. username และ password ว่าง -> 400
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "",
  "password": ""
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"

# 5. รหัสผ่านไม่ถูกต้อง -> 401
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest1",
  "password": "wrongpassword123"
}
HTTP 401
[Asserts]
jsonpath "$.msg" == "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"

# 6. ไม่มี user ในระบบ -> 401
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "userdoesnotexist",
  "password": "test12345"
}
HTTP 401
[Asserts]
jsonpath "$.msg" == "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
