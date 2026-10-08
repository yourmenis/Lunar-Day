// แสดงเนื้อหา 1 หัวข้อของนโยบาย/ข้อตกลง (ย่อหน้า + รายการแบบจุด)
// ย่อหน้าที่ขึ้นต้นด้วย "• " = รายการแบบจุด และข้อความก่อน ":" แรกจะเป็นตัวหนา
export default function PolicyBody({ paragraphs, fontSize = 14 }: { paragraphs: string[]; fontSize?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {paragraphs.map((p, i) => {
        if (!p.startsWith('• ')) {
          return <p key={i} style={{ fontSize, color: '#5a3a4a', lineHeight: 1.8 }}>{p}</p>
        }
        const text = p.slice(2)
        const cut = text.indexOf(':')
        const head = cut > 0 ? text.slice(0, cut + 1) : ''
        const rest = cut > 0 ? text.slice(cut + 1) : text
        return (
          <div key={i} style={{ display: 'flex', gap: 8, paddingLeft: 4 }}>
            <span style={{ color: '#f06292', fontWeight: 700, lineHeight: 1.8, flexShrink: 0 }}>•</span>
            <p style={{ fontSize, color: '#5a3a4a', lineHeight: 1.8 }}>
              {head && <strong style={{ color: '#3a2030', fontWeight: 600 }}>{head}</strong>}
              {rest}
            </p>
          </div>
        )
      })}
    </div>
  )
}
