# ==========================================
# TC1.1 ลงทะเบียนสำเร็จ
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user01",
  "password": "password1234",
  "confirmPassword": "password1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "testlunarday@gmail.com",
  "isConsent": true
}
HTTP 201
[Asserts]
jsonpath "$.msg" contains "สมัครสมาชิกสำเร็จ"

# ==========================================
# TC1.2 ตรวจสอบชื่อผู้ใช้ซ้ำ
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user01", 
  "password": "password1234",
  "confirmPassword": "password1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "new_email_02@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"

# ==========================================
# TC1.3 ตรวจสอบการกรอกข้อมูลไม่ครบ
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user03",
  "password": "password1234",
  "confirmPassword": "password1234",
  "firstName": "lunar",
  "birthDate": "2000-07-03",
  "email": "lunarday_user03@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "กรุณากรอกข้อมูลให้ครบถ้วน"

# ==========================================
# TC1.4 ตรวจสอบความยาวรหัสผ่าน
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user04",
  "password": "1234",
  "confirmPassword": "1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunarday_user04@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"

# ==========================================
# TC1.5 ตรวจสอบรหัสผ่านไม่ตรงกัน
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user05",
  "password": "password1234",
  "confirmPassword": "password9999",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunarday_user05@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "โปรดระบุรหัสผ่านทั้งสองช่องให้ตรงกัน"

# ==========================================
# TC1.6 ตรวจสอบเงื่อนไขอายุ (ไม่ผ่านเกณฑ์)
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user06",
  "password": "password1234",
  "confirmPassword": "password1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2020-07-03",
  "email": "lunarday_user06@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "ผู้สมัครต้องมีอายุตั้งแต่ 13 ปีขึ้นไปจึงจะใช้งานได้"

# ==========================================
# TC1.7 ตรวจสอบการกดข้อความยินยอมและยอมรับเงื่อนไข
# ==========================================
# จงใจส่งค่า isConsent เป็น false
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user07",
  "password": "password1234",
  "confirmPassword": "password1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunarday_user07@gmail.com",
  "isConsent": false
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "กรุณากดยอมรับเงื่อนไขและนโยบายความเป็นส่วนตัวก่อนดำเนินการต่อ"

# ==========================================
# TC1.8 ตรวจสอบอีเมลซ้ำ
# ==========================================
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunarday_user08",
  "password": "password1234",
  "confirmPassword": "password1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "testlunarday@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" contains "อีเมลนี้ถูกใช้แล้ว กรุณาระบุอีเมลใหม่"