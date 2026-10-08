# 🌙 Lunar Day

เว็บแอปพลิเคชันวิเคราะห์ลิ่มเลือดประจำเดือนด้วย AI ผู้ใช้อัปโหลดรูปภาพลิ่มเลือด แล้วตอบแบบสอบถามอาการ
จากนั้นระบบจะประเมินระดับความเสี่ยงเป็น 4 ระดับ (ปกติ / เสี่ยงปานกลาง / เสี่ยงสูง / ฉุกเฉิน) และให้คำแนะนำเบื้องต้น
นอกจากนี้ยังมีบทความสุขภาพสตรี ประวัติการวิเคราะห์ และระบบจัดการบัญชีผู้ใช้

> ⚠️ ผลการวิเคราะห์เป็นข้อมูลเบื้องต้นเท่านั้น ไม่สามารถใช้แทนการวินิจฉัยของแพทย์ได้

---

## สารบัญ

1. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
2. [โครงสร้างโฟลเดอร์](#โครงสร้างโฟลเดอร์)
3. [โปรแกรมที่ต้องติดตั้ง](#โปรแกรมที่ต้องติดตั้ง)
4. [การติดตั้งและตั้งค่า](#การติดตั้งและตั้งค่า)
5. [การรันโปรแกรม](#การรันโปรแกรม)
6. [วิธีการใช้งาน](#วิธีการใช้งาน)
7. [API ของ Backend](#api-ของ-backend)
8. [ปัญหาที่พบบ่อย](#ปัญหาที่พบบ่อย)

---

## เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, axios, lucide-react |
| Backend | Python, Flask, Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS |
| AI | PyTorch, segmentation-models-pytorch, OpenCV (โมเดลแยกส่วนภาพลิ่มเลือด) |
| ฐานข้อมูล | MySQL |

---

## โครงสร้างโฟลเดอร์

```text
Lunar-Day/
├── README.md                    # ไฟล์นี้
├── .gitignore
├── docs/                        # เอกสารประกอบ (รายการปัญหาและแนวทางแก้ไขฝั่ง backend)
│
├── backend/                     # Flask API (พอร์ต 5000)
│   ├── app.py                   # จุดเริ่มโปรแกรม: ตั้งค่า CORS, JWT, ลงทะเบียน routes
│   ├── extensions.py
│   ├── requirements.txt         # รายชื่อแพ็กเกจ Python
│   ├── .env                     # ค่าตั้งค่าลับ (ต้องสร้างเอง ไม่อยู่ใน git)
│   ├── incep_exp12.pth          # ไฟล์โมเดล AI (ดาวน์โหลดจาก Google Drive ดูขั้นตอนที่ 3)
│   ├── config/
│   │   └── database.py          # การเชื่อมต่อ MySQL
│   ├── routes/
│   │   ├── auth.py              # สมัครสมาชิก / เข้าสู่ระบบ / ลืมรหัสผ่าน (OTP ทางอีเมล)
│   │   ├── analysis.py          # วิเคราะห์รูปภาพด้วย AI + ประเมินความเสี่ยง
│   │   ├── articles.py          # บทความ + ค้นหาบทความ
│   │   ├── history.py           # ประวัติการวิเคราะห์
│   │   └── profile.py           # โปรไฟล์ / แก้ไขข้อมูล / ลบบัญชี / ออกจากระบบ
│   ├── static/uploads/          # รูปปกบทความ และรูปโปรไฟล์ (profiles/)
│   └── uploads/                 # รูปที่ผู้ใช้อัปโหลดเพื่อวิเคราะห์ (สร้างอัตโนมัติ)
│
└── frontend/                    # Next.js (พอร์ต 3000)
    ├── package.json
    ├── next.config.ts
    ├── public/                  # โลโก้และรูปพื้นหลัง
    └── app/
        ├── layout.tsx           # layout หลัก + ระบบแจ้งเตือน (toast)
        ├── page.tsx             # เปิดเว็บแล้วพาไปหน้า /home
        ├── login/               # หน้าเข้าสู่ระบบ
        ├── signup/              # หน้าสมัครสมาชิก
        ├── forgot-password/     # หน้าลืมรหัสผ่าน (ขอ OTP → ตั้งรหัสใหม่)
        ├── components/          # คอมโพเนนต์ที่ใช้ร่วมกัน (Toast, RiskLegend, PolicyBody)
        ├── lib/                 # ฟังก์ชันช่วย (เรียก API, กฎรหัสผ่าน, ระดับความเสี่ยง ฯลฯ)
        └── home/
            ├── page.tsx         # หน้าแรก
            ├── components/      # Navbar, ภาพตัวละครเคลื่อนไหวในหน้าแรก
            ├── analyze/         # หน้าแนะนำการวิเคราะห์
            │   └── start/       # ขั้นตอนวิเคราะห์: อัปโหลดรูป → ระบุอาการ → ผลลัพธ์
            ├── articles/        # รายการบทความ + ค้นหา, [id]/ = หน้าอ่านบทความ
            ├── profile/         # โปรไฟล์ + ประวัติการวิเคราะห์
            └── contact/         # หน้าติดต่อเรา
```

---

## โปรแกรมที่ต้องติดตั้ง

| โปรแกรม | เวอร์ชันที่แนะนำ | ใช้ทำอะไร | ดาวน์โหลด |
|---|---|---|---|
| Git | ล่าสุด | ดาวน์โหลดโค้ดจาก GitHub | https://git-scm.com |
| Node.js | 20 ขึ้นไป (ทดสอบกับ 24) | รัน Frontend | https://nodejs.org |
| Python | 3.10 ขึ้นไป (ทดสอบกับ 3.13) | รัน Backend และโมเดล AI | https://www.python.org |
| MySQL Server | 8.0 ขึ้นไป | ฐานข้อมูล | https://dev.mysql.com/downloads/ |
| MySQL Workbench หรือ phpMyAdmin | (ไม่บังคับ) | จัดการฐานข้อมูลผ่านหน้าจอ | – |

ตรวจสอบว่าติดตั้งสำเร็จ:

```bash
git --version
node --version
npm --version
python --version
mysql --version
```

---

## การติดตั้งและตั้งค่า

### 1. ดาวน์โหลดโค้ด

```bash
git clone https://github.com/yourmenis/Lunar-Day.git
cd Lunar-Day
```

### 2. ตั้งค่าฐานข้อมูล MySQL

1. เปิด MySQL Server แล้วสร้างฐานข้อมูล เช่น

   ```sql
   CREATE DATABASE lunar_day CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. นำเข้าไฟล์โครงสร้างตาราง (`.sql`) ของโปรเจกต์ ไฟล์นี้ไม่ได้อยู่ใน git (ถูกยกเว้นไว้ใน `.gitignore`) ขอได้จากทีมผู้พัฒนา

   ```bash
   mysql -u root -p lunar_day < lunar_day.sql
   ```

   ตารางที่ระบบใช้มีดังนี้

   | ตาราง | เก็บข้อมูล |
   |---|---|
   | `User` | บัญชีผู้ใช้ ข้อมูลส่วนตัว รูปโปรไฟล์ และ OTP สำหรับรีเซ็ตรหัสผ่าน |
   | `Risk_Assessment` | ผลการวิเคราะห์แต่ละครั้ง (รูปภาพ คำตอบแบบสอบถาม ระดับความเสี่ยง) |
   | `Article` | บทความสุขภาพ |
   | `TokenBlacklist` | token ที่ออกจากระบบแล้ว |

> ฐานข้อมูลเก็บเวลาเป็น UTC ส่วน frontend จะแปลงเป็นเวลาไทยเองตอนแสดงผล

### 3. ติดตั้ง Backend

```bash
cd backend

# (แนะนำ) สร้าง virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# ติดตั้งแพ็กเกจ
pip install -r requirements.txt
```

> แพ็กเกจ `torch` มีขนาดใหญ่ อาจใช้เวลาดาวน์โหลดนาน ถ้าต้องการเวอร์ชันที่ใช้ GPU ดูคำสั่งติดตั้งได้ที่ https://pytorch.org/get-started/locally/

**วางไฟล์โมเดล AI:** ดาวน์โหลดไฟล์ `incep_exp12.pth` จาก [Google Drive](https://drive.google.com/file/d/1aZNYYyzp_yvnleVKbwixL3YVA3ZXlUKB/view?usp=sharing) (ไม่ได้อยู่ใน git เพราะไฟล์ใหญ่) แล้ววางไว้ในโฟลเดอร์ `backend/` โดยตรง ชื่อไฟล์ต้องเป็น `incep_exp12.pth`

**สร้างไฟล์ `backend/.env`:**

```env
# --- ความปลอดภัย (JWT) ---
JWT_SECRET_KEY=ใส่ข้อความลับยาว ๆ ที่เดายาก

# --- ฐานข้อมูล ---
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=รหัสผ่าน MySQL
DB_NAME=lunar_day

# --- ระบบส่งอีเมล OTP (ลืมรหัสผ่าน) ---
GMAIL_USER1=อีเมล Gmail ที่ใช้ส่ง OTP
GMAIL_APP_PASSWORD=App Password ของ Gmail (16 ตัวอักษร)

# --- (ไม่บังคับ) URL ของ backend สำหรับลิงก์รูปภาพบทความ ---
SERVER_URL=http://localhost:5000
```

> `GMAIL_APP_PASSWORD` ไม่ใช่รหัสผ่าน Gmail ปกติ ต้องเปิด 2-Step Verification ของบัญชี Google ก่อน แล้วสร้าง App Password ที่ https://myaccount.google.com/apppasswords

### 4. ติดตั้ง Frontend

```bash
cd frontend
npm install
```

frontend เรียก backend ที่ `http://<ชื่อเครื่องที่เปิดเว็บ>:5000` อัตโนมัติ จึงไม่ต้องตั้งค่าเพิ่ม

---

## การรันโปรแกรม

เปิด terminal 2 หน้าต่าง (และต้องเปิด MySQL Server ไว้ก่อน)

**Terminal 1: Backend**

```bash
cd backend
venv\Scripts\activate        # Windows (macOS/Linux: source venv/bin/activate)
python app.py
```

รันสำเร็จเมื่อเปิด http://localhost:5000 แล้วเห็นข้อความ `"Luna Day API is running!"`

**Terminal 2: Frontend**

```bash
cd frontend
npm run dev
```

แล้วเปิดเว็บที่ **http://localhost:3000**

### รันแบบ production / ให้เครื่องอื่นในวง LAN เข้าใช้งาน

โหมด `npm run dev` จะบล็อกการเข้าจากเครื่องอื่น ถ้าต้องการให้เครื่องอื่นในเครือข่ายเดียวกันเข้าใช้งาน ให้ build ก่อน:

```bash
cd frontend
npm run build
npx next start -H 0.0.0.0
```

จากนั้นเครื่องอื่นเข้าได้ที่ `http://<IP ของเครื่องที่รัน>:3000` (backend เปิดรับจาก LAN อยู่แล้วที่พอร์ต 5000 อาจต้องอนุญาตพอร์ต 3000 และ 5000 ใน Firewall)

### คำสั่งอื่นของ Frontend

| คำสั่ง | ความหมาย |
|---|---|
| `npm run dev` | รันโหมดพัฒนา (แก้โค้ดแล้วหน้าเว็บอัปเดตทันที) |
| `npm run build` | build สำหรับใช้งานจริง |
| `npm run start` | รันเวอร์ชันที่ build แล้ว |
| `npm run lint` | ตรวจคุณภาพโค้ดด้วย ESLint |

---

## วิธีการใช้งาน

### 1. สมัครสมาชิก
1. กด **เข้าสู่ระบบ** แล้วไปที่ **สมัครสมาชิก**
2. กรอกข้อมูล ผู้ใช้ต้องอายุ 13 ปีขึ้นไป
   - ชื่อผู้ใช้: ไม่เกิน 32 ตัวอักษร และห้ามมีช่องว่าง
   - รหัสผ่าน: 8–128 ตัวอักษร และต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และอักขระพิเศษ
3. ยอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งาน แล้วกดสมัคร

### 2. เข้าสู่ระบบ / ลืมรหัสผ่าน
- เข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน
- ถ้าลืมรหัสผ่าน กด **ลืมรหัสผ่าน** แล้วกรอกอีเมล ระบบจะส่ง OTP 6 หลักไปทางอีเมล (หมดอายุใน 5 นาที) จากนั้นยืนยัน OTP และตั้งรหัสผ่านใหม่

### 3. วิเคราะห์ลิ่มเลือด
1. ไปที่เมนู **วิเคราะห์ลิ่มเลือด** แล้วกด **เริ่มวิเคราะห์**
2. **อัปโหลดรูป:** ลากไฟล์มาวาง หรือกด **เลือกภาพ** ระบบจะตรวจรูปด้วย AI ทันที
   - ถ้ารูปไม่ใช่ลิ่มเลือด ระบบจะแจ้งเตือนและให้เลือกรูปใหม่
3. **ระบุอาการ:** ตอบแบบสอบถาม เช่น
   - ปริมาณเลือด ระยะเวลา ระดับความปวด และอาการร่วม
   - ประวัติการมีเพศสัมพันธ์ (คำถามเรื่องการตั้งครรภ์จะแสดงเฉพาะเมื่อเกี่ยวข้อง)
4. **ผลลัพธ์:**
   - ระดับความเสี่ยง พร้อมคำอธิบายแต่ละระดับ
   - ภาพที่ AI ทำเครื่องหมายไว้ และความมั่นใจของ AI
   - คำแนะนำเบื้องต้น

### 4. ประวัติการวิเคราะห์และโปรไฟล์
- กดรูปโปรไฟล์มุมขวาบนเพื่อเข้าหน้า **โปรไฟล์**
- ดูประวัติการวิเคราะห์ทั้งหมด (หน้าละ 15 รายการ) กดดูรายละเอียด หรือลบรายการได้
- แก้ไขข้อมูลส่วนตัวและเปลี่ยนรูปโปรไฟล์
- ออกจากระบบ หรือลบบัญชีได้

### 5. บทความ
- เมนู **บทความ** แสดงบทความสุขภาพสตรี ค้นหาได้ด้วยการพิมพ์คำค้นหา แล้วกดเพื่ออ่านบทความเต็ม

---

## API ของ Backend

Base URL: `http://localhost:5000` (เส้นทางที่มี 🔒 ต้องส่ง header `Authorization: Bearer <token>`)

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| POST | `/auth/register` | สมัครสมาชิก |
| POST | `/auth/login` | เข้าสู่ระบบ (ได้ access token) |
| POST | `/auth/forgot-password` | ขอ OTP ทางอีเมล |
| POST | `/auth/verify-otp` | ยืนยัน OTP |
| POST | `/auth/reset-password` | ตั้งรหัสผ่านใหม่ |
| POST | `/analysis/image` 🔒 | อัปโหลดรูปให้ AI วิเคราะห์ |
| POST | `/analysis/risk` 🔒 | ส่งคำตอบแบบสอบถามเพื่อประเมินความเสี่ยง |
| GET | `/analysis/result/<id>` 🔒 | ดูผลการวิเคราะห์ |
| GET | `/history/` 🔒 | รายการประวัติการวิเคราะห์ |
| GET / DELETE | `/history/<id>` 🔒 | ดู / ลบประวัติ |
| GET | `/profile/` 🔒 | ข้อมูลโปรไฟล์ |
| POST | `/profile/update` 🔒 | แก้ไขโปรไฟล์และรูปโปรไฟล์ |
| DELETE | `/profile/delete` 🔒 | ลบบัญชี |
| POST | `/profile/logout` 🔒 | ออกจากระบบ |
| GET | `/articles` | รายการบทความ |
| GET | `/articles/<id>` | รายละเอียดบทความ |
| GET | `/articles/search?q=<คำค้น>` | ค้นหาบทความ |
| GET | `/uploads/<filename>` | ไฟล์รูปที่อัปโหลด |

---

## ปัญหาที่พบบ่อย

| อาการ | วิธีแก้ |
|---|---|
| ขึ้นแจ้งเตือนว่าเชื่อมต่อเซิร์ฟเวอร์ไม่ได้ | ตรวจว่า backend รันอยู่ที่พอร์ต 5000 และ MySQL เปิดอยู่ |
| backend error `Can't connect to MySQL` / `Access denied` | ตรวจค่า `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` ใน `backend/.env` |
| backend error หาไฟล์ `incep_exp12.pth` ไม่เจอ | ดาวน์โหลดไฟล์โมเดลจาก [Google Drive](https://drive.google.com/file/d/1aZNYYyzp_yvnleVKbwixL3YVA3ZXlUKB/view?usp=sharing) มาวางไว้ใน `backend/` และรัน `python app.py` จากในโฟลเดอร์ `backend/` |
| ไม่ได้รับอีเมล OTP | ตรวจ `GMAIL_USER1` / `GMAIL_APP_PASSWORD` และดูในโฟลเดอร์ Spam |
| `pip install` ติดตั้ง `torch` ไม่สำเร็จ | อัปเดต pip (`python -m pip install --upgrade pip`) แล้วติดตั้งตามคำสั่งจาก pytorch.org |
| พอร์ต 3000 ถูกใช้อยู่ | รัน `npm run dev -- -p 3001` แล้วเปิด http://localhost:3001 |
| เครื่องอื่นในวง LAN เปิดเว็บไม่ได้ | ใช้ `npm run build` + `npx next start -H 0.0.0.0` และอนุญาตพอร์ต 3000, 5000 ใน Firewall |
