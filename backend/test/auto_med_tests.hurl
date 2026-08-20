# ==========================================
# 0. LOGIN เพื่อดึง Token มาใช้กับทุก Test Cases ด้านล่าง
# ==========================================
POST http://localhost:5000/auth/login
Content-Type: application/json
{
  "username": "lunardaytest1",
  "password": "test12345"
}
HTTP 200
[Captures]
my_token: jsonpath "$.access_token"

# ------------------------------------------
# TC-M01-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M01-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

# ------------------------------------------
# TC-M01-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M01-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

# ------------------------------------------
# TC-M01-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M01-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

# ------------------------------------------
# TC-M01-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

# ------------------------------------------
# TC-M01-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M01-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

# ------------------------------------------
# TC-M01-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

# ------------------------------------------
# TC-M01-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M01-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M01-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

# ------------------------------------------
# TC-M01-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M01-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M02-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M02-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M02-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M02-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M02-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M03-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M03-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M03-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M03-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M03-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: protected
q9: unsure
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M04-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M04-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M01-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"

# ------------------------------------------
# TC-M04-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M04-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M04-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M05-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M05-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"

# ------------------------------------------
# TC-M05-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M05-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M05-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M06-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M06-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"

# ------------------------------------------
# TC-M06-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M06-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M06-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: protected
q9: unsure
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M07-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M07-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

# ------------------------------------------
# TC-M07-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M07-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

# ------------------------------------------
# TC-M07-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M07-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

# ------------------------------------------
# TC-M07-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

# ------------------------------------------
# TC-M07-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M07-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

# ------------------------------------------
# TC-M07-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

# ------------------------------------------
# TC-M07-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M07-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M07-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

# ------------------------------------------
# TC-M07-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

# ------------------------------------------
# TC-M07-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: small
q8: no_sex
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M08-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M08-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M08-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M08-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "เนื้องอกมดลูก"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M08-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: clot
q10: large
q8: no_sex
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M09-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M09-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"

# ------------------------------------------
# TC-M09-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M09-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M10-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M10-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"

# ------------------------------------------
# TC-M10-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M10-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M10-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M11-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M11-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"

# ------------------------------------------
# TC-M11-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M11-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M11-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: protected
q9: unsure
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M12-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M12-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex-unsure
q9: high
q1: long
q2: long
q3: spotting
q4: severe
q5: severe
q7: 201

# ------------------------------------------
# TC-M12-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M12-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M12-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M12-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: tissue
q8: no_sex
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M13-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M13-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

# ------------------------------------------
# TC-M13-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M13-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M13-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M14-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M14-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

# ------------------------------------------
# TC-M14-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M14-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M14-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M14-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M15-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M15-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

# ------------------------------------------
# TC-M15-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M15-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M15-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"

# ------------------------------------------
# TC-M15-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: protected
q9: unsure
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M16-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M16-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"

# ------------------------------------------
# TC-M16-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"
jsonpath "$.data.potential_disease" contains ""

# ------------------------------------------
# TC-M16-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

# ------------------------------------------
# TC-M16-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M16-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ปกติ"
jsonpath "$.data.potential_disease" contains "ภาวะประจำเดือนปกติ"

# ------------------------------------------
# TC-M16-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงสูง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "ฮอร์โมนไม่สมดุล"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกเจริญผิดที่"
jsonpath "$.data.potential_disease" contains "อุ้งเชิงกรานอักเสบ"

# ------------------------------------------
# TC-M16-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q9: -high
q1: long
q2: short
q3: spotting
q4: severe
q5: severe
q7: 201

# ------------------------------------------
# TC-M16-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: negative space
q8: no_sex
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M17-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M17-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M09-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"

# ------------------------------------------
# TC-M17-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M17-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M17-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: not_pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M18-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M18-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"

# ------------------------------------------
# TC-M18-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M18-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M18-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: pregnant
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M19-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M19-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"

# ------------------------------------------
# TC-M19-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild
q7: bowel

# ------------------------------------------
# TC-M19-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "ฉุกเฉิน"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"
jsonpath "$.data.potential_disease" contains "แท้งคุกคาม"
jsonpath "$.data.potential_disease" contains "ท้องนอกมดลูก"
jsonpath "$.data.potential_disease" contains "ภาวะแท้งไม่สมบูรณ์"

# ------------------------------------------
# TC-M19-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: protected
q9: unsure
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

# ------------------------------------------
# TC-M020-1
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: normal
q2: normal
q3: normal
q4: none
q5: mild
q6: mild

# ------------------------------------------
# TC-M20-2
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: discharge

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-3
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex-unsure
q9: high
q1: long
q2: long
q3: spotting
q4: severe
q5: severe
q7: 201

# ------------------------------------------
# TC-M20-4
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-5
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-6
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: bowel

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-7
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: urine

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-8
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-9
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: palpitation

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-10
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: long
q4: spotting
q5: severe
q6: severe
q7: fever

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-11
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: short
q4: postcoital
q5: mild
q6: mild
q7: urine

# ------------------------------------------
# TC-M20-12
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed-
q10: no_sex
q9: normal
q1: normal
q2: normal
q3: none
q4: mild
q5: mild
q6: bowel
q7: 400

# ------------------------------------------
# TC-M20-13
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: low
q2: short
q3: long
q4: spotting
q5: none
q6: severe
q7: nausea

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-14
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: high
q2: long
q3: short
q4: spotting
q5: severe
q6: severe

HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "เสี่ยงปานกลาง"
jsonpath "$.data.potential_disease" contains "ติ่งเนื้อเยื่อบุโพรงมดลูก"
jsonpath "$.data.potential_disease" contains "เยื่อบุโพรงมดลูกหนาตัว"

# ------------------------------------------
# TC-M20-15
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{my_token}}
[FormParams]
ai_result: mixed
q8: no_sex
q1: low
q2: short
q3: normal
q4: none
q5: mild
q6: severe

