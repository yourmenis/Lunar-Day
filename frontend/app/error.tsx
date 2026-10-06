'use client'

import Link from 'next/link'

// หน้าแสดงเมื่อเกิดข้อผิดพลาดที่ไม่คาดคิดระหว่างแสดงผลหน้าเว็บ
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: '#faf7f5', fontFamily: "'Sarabun', sans-serif",
    }}>
      <div style={{
        width: '100%', maxWidth: 440, textAlign: 'center', background: '#fff',
        border: '1px solid #f5e6ec', borderRadius: 24, padding: '40px 28px',
        boxShadow: '0 8px 40px rgba(194,24,91,0.08)',
      }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h1 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 20, fontWeight: 600, color: '#1a0a14', margin: '12px 0 6px' }}>
          เกิดข้อผิดพลาดบางอย่าง
        </h1>
        <p style={{ fontSize: 14, color: '#7a5a6a', lineHeight: 1.7, marginBottom: 24 }}>
          ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} style={{
            padding: '12px 26px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #f06292, #c2185b)', color: '#fff',
            fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 500,
            boxShadow: '0 6px 20px rgba(194,24,91,0.35)',
          }}>
            ลองใหม่
          </button>
          <Link href="/home" style={{
            padding: '12px 26px', borderRadius: 14, textDecoration: 'none',
            border: '1.5px solid #f5c6d8', color: '#c2185b',
            fontFamily: "'Mitr', sans-serif", fontSize: 14,
          }}>
            กลับสู่หน้าแรก
          </Link>
        </div>
      </div>
    </main>
  )
}
