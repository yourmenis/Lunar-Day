import { apiBase } from './apiBase'

export const MSG_NETWORK_ERROR = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
export const MSG_SERVER_ERROR = 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง'

// token หมดอายุ/ถูกยกเลิก (401) หรือ token ผิดรูปแบบ (422 จาก flask-jwt-extended)
export const isAuthError = (status: number) => status === 401 || status === 422

// อ่าน JSON แบบไม่พัง: ถ้า backend ตอบเป็นหน้า HTML (เช่น error 500) จะได้ {} แทน
export async function readJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

// อ่านข้อความ msg ที่ backend ส่งมากับ response (ถ้าไม่ใช่ JSON หรือไม่มี msg → ใช้ fallback)
export async function responseMessage(res: Response, fallback = MSG_SERVER_ERROR): Promise<string> {
  try {
    const data = await res.json()
    return typeof data?.msg === 'string' && data.msg ? data.msg : fallback
  } catch {
    return fallback
  }
}

// ดึงข้อความจาก error ของ axios (lib/api): ใช้ msg ของ backend ถ้ามี
export function axiosErrorMessage(err: unknown, fallback = MSG_SERVER_ERROR): string {
  const e = err as { response?: { data?: { msg?: unknown } } }
  if (!e?.response) return MSG_NETWORK_ERROR
  const msg = e.response.data?.msg
  return typeof msg === 'string' && msg ? msg : fallback
}

export type PostJsonResult<T> =
  | { ok: boolean; status: number; data: T & { msg?: string } }
  | { ok: false; status: number; data: null; error: string }

// POST JSON ไปที่ backend แล้วแยกกรณี "ต่อเซิร์ฟเวอร์ไม่ได้" ออกจาก "เซิร์ฟเวอร์ตอบกลับไม่ใช่ JSON"
// (เช่น backend error 500 เป็นหน้า HTML) เพื่อแสดงข้อความที่ตรงกับสาเหตุจริง
export async function postJson<T = Record<string, unknown>>(
  path: string,
  body: unknown,
): Promise<PostJsonResult<T>> {
  let res: Response
  try {
    res = await fetch(`${apiBase()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return { ok: false, status: 0, data: null, error: MSG_NETWORK_ERROR }
  }
  try {
    const data = await res.json()
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: res.status, data: null, error: MSG_SERVER_ERROR }
  }
}
