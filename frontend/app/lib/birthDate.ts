// อายุขั้นต่ำของผู้ใช้ (ตรงกับที่ backend ตรวจตอนสมัครสมาชิก)
export const MIN_AGE = 13

// แปลง 'YYYY-MM-DD' เป็นวันที่ตามเวลาท้องถิ่น (new Date('YYYY-MM-DD') จะตีความเป็น UTC)
export function parseYmd(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null
}

export function ageFrom(birth: Date): number {
  const t = new Date()
  const beforeBirthday =
    t.getMonth() < birth.getMonth() ||
    (t.getMonth() === birth.getMonth() && t.getDate() < birth.getDate())
  return t.getFullYear() - birth.getFullYear() - (beforeBirthday ? 1 : 0)
}

// วันเกิดล่าสุดที่ยังมีอายุครบ MIN_AGE ปี ณ วันนี้
export function latestAllowedBirthDate(): Date {
  const t = new Date()
  return new Date(t.getFullYear() - MIN_AGE, t.getMonth(), t.getDate())
}
