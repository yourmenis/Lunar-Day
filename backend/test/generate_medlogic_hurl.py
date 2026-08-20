import csv

csv_file = "test_cases_med.csv"
hurl_file = "auto_med_tests.hurl"

disease_map = {
    "D01": "ภาวะประจำเดือนปกติ",
    "D02": "ติ่งเนื้อเยื่อบุโพรงมดลูก",
    "D03": "เยื่อบุโพรงมดลูกหนาตัว",
    "D04": "เนื้องอกมดลูก",
    "D05": "ฮอร์โมนไม่สมดุล",
    "D06": "เยื่อบุโพรงมดลูกเจริญผิดที่",
    "D07": "อุ้งเชิงกรานอักเสบ",
    "D08": "แท้งคุกคาม",
    "D09": "ท้องนอกมดลูก",
    "D10": "ภาวะแท้งไม่สมบูรณ์",
}

with open(csv_file, mode="r", encoding="utf-8") as f_in, open(
    hurl_file, mode="w", encoding="utf-8"
) as f_out:
    reader = csv.DictReader(f_in)

    # 1. เพิ่มบล็อก Login ไว้บนสุดของไฟล์ Hurl
    login_block = """# ==========================================
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

"""
    f_out.write(login_block)

    # 2. วนลูปสร้าง Test Case ทั้ง 300 เคส
    for row in reader:
        if not row.get('test_id') or row['test_id'].strip() == "":
            continue

        hurl_content = f"""# ------------------------------------------
# {row['test_id']}
# ------------------------------------------
POST http://localhost:5000/analysis/risk
Authorization: Bearer {{{{my_token}}}}
[FormParams]
ai_result: {row['ai_result']}
"""
        params = ["q10", "q8", "q9", "q1", "q2", "q3", "q4", "q5", "q6", "q7"]
        for p in params:
            val = row[p].strip()
            if val != "" and val != "-":
                hurl_content += f"{p}: {val}\n"

        hurl_content += "\n"

        if row["expected_http"] == "201":
            hurl_content += f"""HTTP 201
[Asserts]
jsonpath "$.status" == "success"
jsonpath "$.data.risk_level" == "{row['expected_risk_level']}"
"""
            diseases = row["expected_disease"].split("|")
            for d in diseases:
                code = d.strip()
                thai_name = disease_map.get(code, code)
                hurl_content += (
                    f'jsonpath "$.data.potential_disease" contains "{thai_name}"\n'
                )

            hurl_content += "\n"

        elif row["expected_http"] == "400":
            err_code = row["expected_disease"].strip()
            if err_code == "A5":
                hurl_content += """HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error_code" == "A5"
jsonpath "$.msg" contains "ไม่พบโรคที่สอดคล้องกับอาการที่ระบุ กรุณาตรวจสอบข้อมูลอาการอีกครั้ง"
"""
            elif err_code == "A6":
                hurl_content += """HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error_code" == "A6"
jsonpath "$.msg" contains "ความสัมพันธ์อาการไม่สอดคล้องกันของลักษณะเลือดออกและประวัติทางเพศ"
"""
        f_out.write(hurl_content)

print(f"🎉 สร้างไฟล์ {hurl_file} สำเร็จเรียบร้อยแล้ว!")