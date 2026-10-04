export const MSG_NETWORK_ERROR = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
export const MSG_SERVER_ERROR = 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง'

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
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
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
