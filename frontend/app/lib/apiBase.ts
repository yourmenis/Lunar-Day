// ที่อยู่ของ backend API
// ค่าตั้งต้นมาจาก NEXT_PUBLIC_API_URL (เช่น http://localhost:5000)
// ถ้าตั้งเป็น localhost แต่เปิดเว็บจากเครื่องอื่น (เช่น http://192.168.1.10:3000 ในวง LAN)
// จะเปลี่ยนเป็น host เดียวกับที่เปิดเว็บอยู่ (http://192.168.1.10:5000) ให้อัตโนมัติ
const CONFIGURED = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
const LOCAL_HOSTS = ['localhost', '127.0.0.1']

export function apiBase(): string {
  if (typeof window === 'undefined') return CONFIGURED
  try {
    const u = new URL(CONFIGURED)
    if (LOCAL_HOSTS.includes(u.hostname) && !LOCAL_HOSTS.includes(window.location.hostname)) {
      u.hostname = window.location.hostname
      return u.origin
    }
  } catch {}
  return CONFIGURED
}

// URL เต็มที่ backend ส่งมา (เช่น ImageURL = http://localhost:5000/static/...) → ชี้ไปที่ apiBase() ปัจจุบัน
export function fixBackendUrl(url: string): string {
  try {
    const u = new URL(url)
    const c = new URL(CONFIGURED)
    if (LOCAL_HOSTS.includes(u.hostname) && u.port === c.port) return apiBase() + u.pathname + u.search
  } catch {}
  return url
}
