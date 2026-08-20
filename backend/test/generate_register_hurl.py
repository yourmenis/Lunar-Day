import csv
import json

csv_file = "test_cases_register.csv"
hurl_file = "auto_register_tests.hurl"

with open(csv_file, mode="r", encoding="utf-8-sig") as f_in, open(
    hurl_file, mode="w", encoding="utf-8"
) as f_out:
    reader = csv.DictReader(f_in)
    
    # วนลูปสร้าง Test Case แต่ละข้อจาก CSV
    for row in reader:
        # ข้ามบรรทัดที่ไม่มี test_id
        if not row.get('test_id') or row['test_id'].strip() == "":
            continue

        # 1. เตรียมข้อมูล Payload (ดึงเฉพาะคีย์ที่ไม่ได้ใส่เครื่องหมาย - ออกมา)
        payload = {}
        text_fields = ["username", "password", "confirmPassword", "firstName", "lastName", "birthDate", "email"]
        
        for field in text_fields:
            val = row.get(field, "").strip()
            if val != "-":  # ถ้าเป็นเครื่องหมาย - คือจงใจไม่ส่งคีย์นี้ไปเลย (ทดสอบกรอกไม่ครบ)
                payload[field] = val

        # จัดการค่า isConsent (แปลง Text จาก CSV ให้เป็น Boolean ของ JSON)
        consent_val = row.get("isConsent", "").strip().lower()
        if consent_val == "true":
            payload["isConsent"] = True
        elif consent_val == "false":
            payload["isConsent"] = False

        # แปลง Dictionary เป็น JSON String จัดหน้าสวยงาม
        json_payload = json.dumps(payload, indent=2, ensure_ascii=False)

        # 2. สร้างก้อนข้อความ Hurl สำหรับเคสนี้
        hurl_content = f"""# ------------------------------------------
# {row['test_id']}
# ------------------------------------------
POST http://localhost:5000/auth/register
Content-Type: application/json
{json_payload}
HTTP {row['expected_http']}
[Asserts]
jsonpath "$.msg" == "{row['expected_msg']}"

"""
        # เขียนลงไฟล์
        f_out.write(hurl_content)

print(f"🎉 สร้างไฟล์ {hurl_file} สำหรับระบบลงทะเบียนสำเร็จเรียบร้อยแล้ว!")