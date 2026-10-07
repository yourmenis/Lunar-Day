// จำข้อมูลโปรไฟล์ + ประวัติล่าสุดไว้ในหน่วยความจำ เพื่อให้กลับมาหน้าโปรไฟล์แล้วแสดงได้ทันที
// (ไม่ต้องเห็นค่าว่างก่อนรอ API) แล้วค่อยอัปเดตเมื่อ API ตอบ
// - เก็บในหน่วยความจำเท่านั้น ไม่เขียนลง storage เพราะประวัติเป็นข้อมูลสุขภาพ
// - ผูกกับ token: ถ้า token เปลี่ยน (ล็อกอินบัญชีอื่น) จะไม่ใช้ข้อมูลเดิม

/* eslint-disable @typescript-eslint/no-explicit-any */
type ProfileCache = { token: string; profile: any | null; history: any[] | null }
let cache: ProfileCache | null = null

function currentToken(): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem('access_token') } catch { return null }
}

function valid(): ProfileCache | null {
  const token = currentToken()
  return cache && token && cache.token === token ? cache : null
}

export function getCachedProfile(): any | null {
  return valid()?.profile ?? null
}

export function getCachedHistory(): any[] {
  return valid()?.history ?? []
}

function update(patch: Partial<Omit<ProfileCache, 'token'>>) {
  const token = currentToken()
  if (!token) { cache = null; return }
  const base = cache && cache.token === token ? cache : { token, profile: null, history: null }
  cache = { ...base, ...patch }
}

export function setCachedProfile(profile: any) { update({ profile }) }
export function setCachedHistory(history: any[]) { update({ history }) }

export function clearProfileCache() { cache = null }
