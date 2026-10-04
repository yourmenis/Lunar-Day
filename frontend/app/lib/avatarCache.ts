// จำ URL รูปโปรไฟล์ไว้ เพื่อให้ Navbar / หน้าโปรไฟล์แสดงรูปได้ทันที ไม่ต้องรอ API (กันรูปกะพริบ)
// - ตัวแปรในหน่วยความจำ: อยู่รอดตอนเปลี่ยนหน้าแบบ client-side และอ่านได้ตั้งแต่ render แรก
//   (ตอนโหลดหน้าครั้งแรกค่าเป็น null เหมือนฝั่ง server จึงไม่เกิด hydration mismatch)
// - sessionStorage: อยู่รอดตอนกดรีเฟรชหน้า (อ่านหลัง mount)

const KEY = 'profile_avatar_url'
let memory: string | null = null

export function avatarUrlFromFile(fileName: string | null | undefined): string | null {
  if (!fileName) return null
  return fileName.startsWith('http')
    ? fileName
    : `${process.env.NEXT_PUBLIC_API_URL}/static/uploads/profiles/${fileName}`
}

// ค่าที่ใช้เป็น state เริ่มต้นได้อย่างปลอดภัย (ไม่แตะ sessionStorage)
export function getMemoryAvatar(): string | null {
  return memory
}

// อ่านค่าที่จำไว้ รวม sessionStorage (เรียกใน useEffect เท่านั้น)
export function getCachedAvatar(): string | null {
  if (memory) return memory
  try {
    memory = sessionStorage.getItem(KEY)
  } catch {}
  return memory
}

export function setCachedAvatar(url: string | null) {
  memory = url
  try {
    if (url) sessionStorage.setItem(KEY, url)
    else sessionStorage.removeItem(KEY)
  } catch {}
}
