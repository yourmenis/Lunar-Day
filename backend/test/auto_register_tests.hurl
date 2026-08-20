# ------------------------------------------
# TC1.1 Registration Success
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user01",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "testlunarday@gmail.com",
  "isConsent": true
}
HTTP 201
[Asserts]
jsonpath "$.msg" == "สมัครสมาชิกสำเร็จ"

# ------------------------------------------
# TC1.2 Duplicate Username
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user01",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "new_email@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"

# ------------------------------------------
# TC1.3.1 Incomplete Data (Missing username)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user03@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกข้อมูลให้ครบถ้วน"

# ------------------------------------------
# TC1.3.2 Incomplete Data (Missing password)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "nana",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user03@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกข้อมูลให้ครบถ้วน"

# ------------------------------------------
# TC1.3.3 Incomplete Data (Missing confirmPassword)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "x",
  "password": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user03@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกข้อมูลให้ครบถ้วน"

# ------------------------------------------
# TC1.3.4 Incomplete Data (Missing firstName)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "x",
  "password": "password123",
  "confirmPassword": "password123",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user03@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกข้อมูลให้ครบถ้วน"

# ------------------------------------------
# TC1.3.5 Incomplete Data (Missing lastName)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "x",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "birthDate": "2000-07-03",
  "email": "lunar_user03@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกข้อมูลให้ครบถ้วน"

# ------------------------------------------
# TC1.3.6 Incomplete Data (Missing email)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "x",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากรอกข้อมูลให้ครบถ้วน"

# ------------------------------------------
# TC1.4 Password Too Short
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user05",
  "password": "1234",
  "confirmPassword": "1234",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user05@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"

# ------------------------------------------
# TC1.5 Password Mismatch
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user06",
  "password": "password123",
  "confirmPassword": "password999",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user06@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "โปรดระบุรหัสผ่านทั้งสองช่องให้ตรงกัน"

# ------------------------------------------
# TC1.6 Underage (Below 13)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user07",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2020-07-03",
  "email": "lunar_user07@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "ผู้สมัครต้องมีอายุตั้งแต่ 13 ปีขึ้นไปจึงจะใช้งานได้"

# ------------------------------------------
# TC1.7 Consent Not Given (Missing Key)
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user09",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "lunar_user09@gmail.com"
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "กรุณากดยอมรับเงื่อนไขและนโยบายความเป็นส่วนตัวก่อนดำเนินการต่อ"

# ------------------------------------------
# TC1.8 Duplicate Email
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{
  "username": "lunar_user10",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "lunar",
  "lastName": "test",
  "birthDate": "2000-07-03",
  "email": "testlunarday@gmail.com",
  "isConsent": true
}
HTTP 400
[Asserts]
jsonpath "$.msg" == "อีเมลนี้ถูกใช้แล้ว กรุณาระบุอีเมลใหม่"

