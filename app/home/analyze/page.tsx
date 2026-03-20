'use client'

import { useState } from 'react'
import { Upload, Scan, ChevronRight, Calendar, Heart, AlertCircle } from 'lucide-react'

const featuredArticles = [
  {
    id: 1,
    title: 'ลิ่มเลือดประจำเดือน บอกอะไรได้บ้าง?',
    excerpt: 'ลิ่มเลือดที่พบในประจำเดือนอาจเป็นสัญญาณของร่างกายที่ควรใส่ใจ...',
    tag: 'สุขภาพ',
    readTime: '5 นาที',
    color: '#FFE4EE',
  },
  {
    id: 2,
    title: 'เมื่อไหร่ควรพบแพทย์เรื่องประจำเดือน',
    excerpt: 'หากประจำเดือนมาไม่ปกติหรือมีอาการผิดปกติ ควรปรึกษาแพทย์ทันที...',
    tag: 'คำแนะนำ',
    readTime: '3 นาที',
    color: '#FFF0F5',
  },
  {
    id: 3,
    title: 'โภชนาการที่ดีเพื่อรอบเดือนที่สมดุล',
    excerpt: 'อาหารที่เหมาะสมช่วยลดอาการปวดและทำให้รอบเดือนสม่ำเสมอขึ้น...',
    tag: 'โภชนาการ',
    readTime: '7 นาที',
    color: '#FDE8EF',
  },
]

export default function AnalyzePage() {
  const [dragOver, setDragOver] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F9AABF 0%, #E8638A 50%, #C94B70 100%)', minHeight: 340 }}>

        {/* Calendar texture overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 flex items-center">
          <div className="max-w-xl">
            <h1 className="hero-title text-3xl md:text-4xl leading-tight mb-4">
              เทคโนโลยีวิเคราะห์ลิ่มเลือด<br />
              เพื่อช่วยดูแลสุขภาพผู้หญิง
            </h1>
            <p className="text-pink-100 text-sm leading-relaxed mb-6">
              อัปโหลดรูปภาพและให้ AI ช่วยวิเคราะห์สุขภาพของคุณ
            </p>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full font-mitr font-semibold text-sm text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <Scan size={18} />
              เริ่มวิเคราะห์ตอนนี้
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="absolute right-40 bottom-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
      </section>

      {/* Upload Section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--pink-primary)' }}>
            <Scan size={12} color="white" />
          </div>
          <h2 className="font-mitr font-semibold text-lg" style={{ color: 'var(--text-dark)' }}>
            อัปโหลดเพื่อวิเคราะห์
          </h2>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); setUploaded(true) }}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
            ${dragOver ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
          style={{
            borderColor: dragOver ? 'var(--pink-primary)' : 'var(--pink-light)',
            background: dragOver ? 'var(--pink-pale)' : 'white',
          }}
        >
          {uploaded ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--pink-pale)' }}>
                <Heart size={28} style={{ color: 'var(--pink-primary)' }} />
              </div>
              <p className="font-mitr font-semibold" style={{ color: 'var(--pink-primary)' }}>
                อัปโหลดสำเร็จ! กำลังวิเคราะห์...
              </p>
              <div className="w-48 h-2 rounded-full overflow-hidden" style={{ background: 'var(--pink-pale)' }}>
                <div className="h-full rounded-full animate-pulse w-2/3"
                  style={{ background: 'linear-gradient(90deg, var(--pink-primary), var(--pink-deep))' }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--pink-pale)' }}>
                <Upload size={28} style={{ color: 'var(--pink-primary)' }} />
              </div>
              <p className="font-mitr font-medium" style={{ color: 'var(--text-mid)' }}>
                ลากวางรูปภาพหรือคลิกเพื่ออัปโหลด
              </p>
              <p className="text-xs" style={{ color: 'var(--text-soft)' }}>
                รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 10MB
              </p>
            </div>
          )}
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: Calendar, label: 'รอบเดือนล่าสุด', value: '28 วัน', color: '#FFE4EE' },
            { icon: Heart, label: 'สุขภาพโดยรวม', value: 'ปกติ', color: '#FFE9F3' },
            { icon: AlertCircle, label: 'ต้องติดตาม', value: '0 รายการ', color: '#FFF0F5' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: color }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(232,99,138,0.15)' }}>
                <Icon size={18} style={{ color: 'var(--pink-primary)' }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-soft)' }}>{label}</div>
                <div className="font-mitr font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl">✦</span>
          <h2 className="font-mitr font-semibold text-xl" style={{ color: 'var(--text-dark)' }}>
            บทความแนะนำ
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {featuredArticles.map(article => (
            <div key={article.id}
              className="rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
              {/* Image placeholder */}
              <div className="h-44 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${article.color}, #F7B8CC)` }}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Heart size={64} style={{ color: 'var(--pink-primary)' }} />
                </div>
                <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full text-white"
                  style={{ background: 'var(--pink-primary)' }}>
                  {article.tag}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-mitr font-semibold text-sm mb-1 group-hover:text-pink-600 transition-colors"
                  style={{ color: 'var(--text-dark)' }}>
                  {article.title}
                </h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-soft)' }}>
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-soft)' }}>
                    อ่าน {article.readTime}
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--pink-primary)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}