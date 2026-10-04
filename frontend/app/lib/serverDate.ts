const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

// Flask ส่ง datetime เป็นรูปแบบ 'Fri, 03 Oct 2026 21:15:00 GMT' แต่ค่าใน DB เป็นเวลาท้องถิ่น
// (ไม่ใช่ GMT จริง) ถ้าใช้ new Date() ตรง ๆ เวลาจะถูกบวก offset ซ้ำ (+7 ชม. ในไทย)
// จึงอ่านวัน-เวลาตามที่บันทึกไว้ แล้วสร้างเป็นเวลาท้องถิ่นของเครื่อง
export function parseServerDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const m = /(\d{1,2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2})/.exec(value)
  if (m && m[2] in MONTHS) {
    return new Date(Number(m[3]), MONTHS[m[2]], Number(m[1]), Number(m[4]), Number(m[5]), Number(m[6]))
  }
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}
