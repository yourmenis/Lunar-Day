// แปลงวันเวลาที่ backend ส่งมาเป็น Date
// Flask ส่ง datetime เป็นรูปแบบ 'Fri, 03 Oct 2026 06:17:46 GMT' และ MySQL เก็บ CURRENT_TIMESTAMP เป็นเวลา UTC
// (ตรวจแล้ว: NOW() = UTC_TIMESTAMP()) ป้าย GMT จึงถูกต้อง → new Date() แปลงเป็นเวลาท้องถิ่นของเครื่องให้เอง
export function parseServerDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}
