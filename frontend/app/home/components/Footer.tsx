// Footer กลางของทุกหน้าในส่วน /home (ค่าทั้งหมดอิงจาก footer ของหน้า Home)
export default function Footer() {
  return (
    <footer style={{
      // ถ้าหน้าครอบด้วย flex คอลัมน์ footer จะถูกดันไปติดขอบล่าง (หน้าปกติไม่มีผล)
      marginTop: 'auto',
      background: '#fff',
      borderTop: '1px solid #f5e6ec',
      padding: '28px clamp(20px, 5vw, 72px)',
      fontSize: 12.5,
      color: '#b09aa8',
      fontFamily: "'Sarabun', sans-serif",
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>© {new Date().getFullYear() + 543} Lunar Day — ดูแลสุขภาพสตรีด้วยเทคโนโลยี</span>
      </div>
    </footer>
  )
}
