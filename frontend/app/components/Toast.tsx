'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

// โนติกลางของทั้งเว็บ: ทุกข้อความที่ backend แจ้งกลับมาให้แสดงผ่าน useToast()
// ตัว provider อยู่ใน root layout จึงไม่หายตอนเปลี่ยนหน้า (เช่น ออกจากระบบแล้ว redirect)

export type ToastType = 'success' | 'error' | 'info'
type ToastState = { msg: string; type: ToastType; id: number } | null
type ShowToast = (msg: string, type?: ToastType) => void

export const TOAST_MS = 3000

// หน้า signup ตั้งค่านี้ใน sessionStorage เมื่อสมัครสำเร็จ → หน้า login แสดงโนติยืนยัน
export const SIGNUP_SUCCESS_KEY = 'signup_success'

const ToastContext = createContext<ShowToast>(() => {})

export function useToast(): ShowToast {
  return useContext(ToastContext)
}

const STYLES: Record<ToastType, { background: string; color: string; border: string }> = {
  success: { background: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  error:   { background: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  info:    { background: '#fce4ef', color: '#9d174d', border: '#f9a8d4' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showToast = useCallback<ShowToast>((msg, type = 'success') => {
    if (!msg) return
    clearTimeout(timer.current)
    setToast({ msg, type, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), TOAST_MS)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  const s = toast ? STYLES[toast.type] : null
  const Icon = toast?.type === 'success' ? CheckCircle2 : toast?.type === 'error' ? AlertCircle : Info

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && s && (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          style={{
            position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 10000, padding: '12px 20px', borderRadius: 14,
            background: s.background, color: s.color, border: `1px solid ${s.border}`,
            fontSize: 13, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            fontFamily: "'Sarabun',sans-serif", display: 'flex', alignItems: 'center', gap: 8,
            maxWidth: 'calc(100vw - 32px)', pointerEvents: 'none',
            animation: `toastAutoHide ${TOAST_MS}ms ease forwards`,
          }}
        >
          <style>{`
            @keyframes toastAutoHide {
              0%   { opacity: 0; transform: translateX(-50%) translateY(-8px); }
              10%  { opacity: 1; transform: translateX(-50%) translateY(0); }
              85%  { opacity: 1; transform: translateX(-50%) translateY(0); }
              100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
            }
          `}</style>
          <Icon size={15} style={{ flexShrink: 0 }} />
          <span>{toast.msg}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}
