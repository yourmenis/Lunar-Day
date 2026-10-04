'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export type AuthToastState = { msg: string; type: 'error' | 'success'; id: number } | null

export const AUTH_TOAST_MS = 3000

// หน้า signup ตั้งค่านี้ใน sessionStorage เมื่อสมัครสำเร็จ → หน้า login แสดงโนติยืนยัน
export const SIGNUP_SUCCESS_KEY = 'signup_success'

// state + ฟังก์ชันเรียกโนติ (ล้าง timer เก่าทุกครั้ง เพื่อไม่ให้ปิดโนติใหม่ก่อนเวลา)
export function useAuthToast() {
  const [toast, setToast] = useState<AuthToastState>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const showToast = useCallback((msg: string, type: 'error' | 'success' = 'error') => {
    clearTimeout(timer.current)
    setToast({ msg, type, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), AUTH_TOAST_MS)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return { toast, showToast }
}

// โนติเด้งลงจากด้านบนแล้วหายเอง (ใช้แทน alert ในหน้า login / signup)
// ตำแหน่ง fixed จึงไม่กระทบ layout ของหน้า
export default function AuthToast({ toast }: { toast: AuthToastState }) {
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div
      key={toast.id}
      role="alert"
      style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, padding: '11px 18px', borderRadius: 13,
        background: isError ? '#fee2e2' : '#d1fae5',
        color: isError ? '#991b1b' : '#065f46',
        border: `1px solid ${isError ? '#fca5a5' : '#6ee7b7'}`,
        fontSize: 13, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        fontFamily: "'Sarabun',sans-serif", display: 'flex', alignItems: 'center', gap: 8,
        maxWidth: 'calc(100vw - 32px)', pointerEvents: 'none',
        animation: `authToastAutoHide ${AUTH_TOAST_MS}ms ease forwards`,
      }}
    >
      <style>{`
        @keyframes authToastAutoHide {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          10%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          85%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
      {isError ? <AlertCircle size={15} style={{ flexShrink: 0 }} /> : <CheckCircle2 size={15} style={{ flexShrink: 0 }} />}
      <span>{toast.msg}</span>
    </div>
  )
}
