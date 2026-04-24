'use client'

import { useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

interface Props {
  show: boolean
  onClose: () => void
}

export default function LoginToast({ show, onClose }: Props) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [show, onClose])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: '#1a0a14',
      border: '1px solid rgba(240,98,146,0.4)',
      borderRadius: 16,
      padding: '14px 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      minWidth: 280,
      animation: 'slideUp 0.3s ease',
      fontFamily: "'Sarabun', sans-serif",
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'rgba(240,98,146,0.15)',
        border: '1px solid rgba(240,98,146,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AlertCircle size={18} color="#f06292" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Mitr', sans-serif",
          fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2,
        }}>
          กรุณาเข้าสู่ระบบก่อน
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
          ต้องล็อกอินเพื่อใช้งานฟีเจอร์นี้
        </div>
      </div>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.4)', padding: 4, flexShrink: 0,
      }}>
        <X size={16} />
      </button>
    </div>
  )
}