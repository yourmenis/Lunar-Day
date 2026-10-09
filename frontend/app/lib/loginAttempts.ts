// นับจำนวนครั้งที่เข้าสู่ระบบไม่สำเร็จ (แสดง "กรอกผิดได้อีก x/3 ครั้ง" ในหน้าเข้าสู่ระบบ)
// - กรอกชื่อผู้ใช้ผิด / รหัสผ่านผิด / ผิดทั้งคู่ → นับเป็น 1 ครั้งเท่ากัน (ไม่แยกตามชื่อผู้ใช้)
// - ผิดครบ 3 ครั้ง → ระงับการเข้าสู่ระบบ 30 นาที (ตรงกับ backend ที่ระงับบัญชี 30 นาที / error_code A11)
// - พ้นเวลาระงับ หรือเข้าสู่ระบบสำเร็จ → เริ่มนับใหม่
// backend ไม่ได้ส่งจำนวนครั้งกลับมา จึงนับฝั่งหน้าเว็บ และเก็บใน localStorage ของเบราว์เซอร์นี้

export const MAX_LOGIN_ATTEMPTS = 3
export const LOGIN_LOCK_MS = 30 * 60 * 1000
const STORAGE_KEY = 'lunar_login_attempts'

export type AttemptRecord = { count: number; lockedUntil: number | null }
export const NO_ATTEMPTS: AttemptRecord = { count: 0, lockedUntil: null }

export function loadAttempts(): AttemptRecord {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (data && typeof data.count === 'number') {
      return { count: data.count, lockedUntil: typeof data.lockedUntil === 'number' ? data.lockedUntil : null }
    }
  } catch {}
  return NO_ATTEMPTS
}

function save(rec: AttemptRecord): AttemptRecord {
  try {
    if (rec.count === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(rec))
  } catch {}
  return rec
}

/** สถานะ ณ เวลา now (พ้นเวลาระงับแล้ว = เริ่มนับใหม่) */
export function currentAttempts(rec: AttemptRecord, now: number): AttemptRecord {
  if (rec.lockedUntil && now >= rec.lockedUntil) return NO_ATTEMPTS
  return rec
}

/** เข้าสู่ระบบไม่สำเร็จ (ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง) */
export function recordFailure(rec: AttemptRecord, now: number): AttemptRecord {
  const count = Math.min(MAX_LOGIN_ATTEMPTS, currentAttempts(rec, now).count + 1)
  return save({ count, lockedUntil: count >= MAX_LOGIN_ATTEMPTS ? now + LOGIN_LOCK_MS : null })
}

/** backend แจ้งว่าบัญชีถูกระงับ (403 / A11) */
export function recordLocked(rec: AttemptRecord, now: number): AttemptRecord {
  const cur = currentAttempts(rec, now)
  return save({ count: MAX_LOGIN_ATTEMPTS, lockedUntil: cur.lockedUntil ?? now + LOGIN_LOCK_MS })
}

/** เข้าสู่ระบบสำเร็จ */
export function clearAttempts(): AttemptRecord {
  return save(NO_ATTEMPTS)
}
