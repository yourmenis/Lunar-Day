// กฎ username / password ที่ใช้ร่วมกันทุกหน้า (login, signup, แก้ไขโปรไฟล์)
// ต้องตรงกันทุกหน้า ไม่งั้นผู้ใช้จะตั้งค่าได้แต่ล็อกอินไม่ได้
export const USERNAME_MAX = 32
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 128

// คืนข้อความ error หรือ null ถ้าผ่าน (ตรวจหลังตัดช่องว่างหัว-ท้าย เหมือน backend)
export function usernameError(raw: string): string | null {
  const name = raw.trim()
  if (!name) return 'กรุณากรอกชื่อผู้ใช้'
  if (/\s/.test(name)) return 'ชื่อผู้ใช้ห้ามมีช่องว่าง'
  if (name.length > USERNAME_MAX) return `ชื่อผู้ใช้ต้องมีความยาวไม่เกิน ${USERNAME_MAX} ตัวอักษร`
  return null
}

export function passwordLengthError(raw: string): string | null {
  const pw = raw.trim()
  if (pw.length < PASSWORD_MIN) return `รหัสผ่านต้องมีความยาวอย่างน้อย ${PASSWORD_MIN} ตัวอักษร`
  if (raw.length > PASSWORD_MAX) return `รหัสผ่านต้องมีความยาวไม่เกิน ${PASSWORD_MAX} ตัวอักษร`
  return null
}
