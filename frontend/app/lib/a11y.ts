import type { KeyboardEvent } from 'react'

// ทำให้ element ที่ไม่ใช่ <button> (เช่น <div>) กดได้ทั้งเมาส์และคีย์บอร์ด (Tab → Enter / Space)
export function clickable(fn: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: fn,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.target !== e.currentTarget) return   // ปุ่มที่ซ้อนอยู่ข้างใน (เช่น ถังขยะ) จัดการเอง
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        fn()
      }
    },
  }
}

// ซ่อน input ด้วยสายตา แต่ยังโฟกัสด้วยคีย์บอร์ดและอ่านด้วยโปรแกรมอ่านหน้าจอได้ (แทน display: none)
export const visuallyHidden = {
  position: 'absolute' as const, width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden' as const, clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' as const, border: 0,
}
