import Link from 'next/link'

// หน้า 404 (ไม่พบหน้าที่ต้องการ)
export default function NotFound() {
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
        <div style={{ fontFamily: "'Mitr', sans-serif", fontSize: 64, fontWeight: 700, color: '#f06292', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 20, fontWeight: 600, color: '#1a0a14', margin: '14px 0 6px' }}>
          ไม่พบหน้าที่คุณต้องการ
        </h1>
        <p style={{ fontSize: 14, color: '#7a5a6a', lineHeight: 1.7, marginBottom: 24 }}>
          หน้านี้อาจถูกย้าย ถูกลบ หรือพิมพ์ที่อยู่ไม่ถูกต้อง
        </p>
        <Link href="/home" style={{
          display: 'inline-flex', padding: '12px 28px', borderRadius: 14, textDecoration: 'none',
          background: 'linear-gradient(135deg, #f06292, #c2185b)', color: '#fff',
          fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 500,
          boxShadow: '0 6px 20px rgba(194,24,91,0.35)',
        }}>
          กลับสู่หน้าแรก
        </Link>
      </div>
    </main>
  )
}
