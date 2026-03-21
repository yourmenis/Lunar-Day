'use client'

import { useState } from 'react'
import { Search, Clock, Tag, ChevronRight, Heart } from 'lucide-react'

const categories = ['ทั้งหมด', 'สุขภาพ', 'โภชนาการ', 'ฮอร์โมน', 'การออกกำลังกาย', 'คำแนะนำ']

const articles = [
  { id: 1, title: 'ลิ่มเลือดประจำเดือน หมายความว่าอะไร?', excerpt: 'ลิ่มเลือดในประจำเดือนมักเกิดขึ้นเมื่อเลือดออกมากและเร็วเกินไปจนร่างกายไม่สามารถสลายได้ทัน', category: 'สุขภาพ', readTime: '5 นาที', color: '#FFE4EE' },
  { id: 2, title: '5 สัญญาณที่ต้องพบแพทย์ทันที', excerpt: 'มีเลือดออกมากผิดปกติ ปวดท้องรุนแรง หรือรอบเดือนมาไม่ปกติ คือสัญญาณที่ไม่ควรมองข้าม', category: 'คำแนะนำ', readTime: '3 นาที', color: '#FFF0F5' },
  { id: 3, title: 'อาหารที่ช่วยลดปวดประจำเดือน', excerpt: 'อาหารที่มีแมกนีเซียม โอเมก้า 3 และวิตามิน D ช่วยลดการอักเสบและบรรเทาอาการปวด', category: 'โภชนาการ', readTime: '6 นาที', color: '#FDE8EF' },
  { id: 4, title: 'ฮอร์โมนกับรอบเดือน เชื่อมโยงอย่างไร?', excerpt: 'เอสโตรเจนและโปรเจสเตอโรนควบคุมวงจรประจำเดือน ความไม่สมดุลของฮอร์โมนส่งผลต่อทุกอย่าง', category: 'ฮอร์โมน', readTime: '8 นาที', color: '#FFE9F3' },
  { id: 5, title: 'ออกกำลังกายระหว่างมีประจำเดือน ดีหรือไม่?', excerpt: 'การออกกำลังกายเบาๆ ช่วยเพิ่มการไหลเวียนเลือดและลดความเจ็บปวดได้จริง', category: 'การออกกำลังกาย', readTime: '4 นาที', color: '#FFE4EE' },
  { id: 6, title: 'PCOS คืออะไร และรักษาอย่างไร?', excerpt: 'ภาวะถุงน้ำรังไข่หลายใบส่งผลต่อฮอร์โมน ประจำเดือน และความสามารถในการตั้งครรภ์', category: 'สุขภาพ', readTime: '10 นาที', color: '#FFF5F8' },
]

export default function ArticlesPage() {
  const [selected, setSelected] = useState('ทั้งหมด')
  const [search, setSearch] = useState('')

  const filtered = articles.filter(a =>
    (selected === 'ทั้งหมด' || a.category === selected) &&
    (a.title.includes(search) || a.excerpt.includes(search))
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mitr font-bold text-2xl mb-1" style={{ color: 'var(--text-dark)' }}>
          บทความ
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
          ความรู้เพื่อสุขภาพผู้หญิงที่ดีขึ้น
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-soft)' }} />
        <input
          type="text"
          placeholder="ค้นหาบทความ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm outline-none"
          style={{
            background: 'white',
            border: '1.5px solid var(--pink-light)',
            color: 'var(--text-dark)',
          }}
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all`}
            style={selected === cat
              ? { background: 'linear-gradient(135deg, #E8638A, #C94B70)', color: 'white' }
              : { background: 'white', color: 'var(--text-mid)', border: '1.5px solid var(--pink-light)' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map(article => (
          <div key={article.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex">
            {/* Color strip */}
            <div className="w-2 flex-shrink-0" style={{ background: 'var(--pink-primary)' }} />

            {/* Content */}
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: article.color, color: 'var(--pink-deep)' }}>
                  <Tag size={10} className="inline mr-1" />
                  {article.category}
                </span>
                <span className="text-xs flex items-center gap-1 flex-shrink-0"
                  style={{ color: 'var(--text-soft)' }}>
                  <Clock size={11} /> {article.readTime}
                </span>
              </div>
              <h3 className="font-mitr font-semibold text-sm mb-1 group-hover:text-pink-600 transition-colors"
                style={{ color: 'var(--text-dark)' }}>
                {article.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                {article.excerpt}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs font-semibold"
                style={{ color: 'var(--pink-primary)' }}>
                อ่านต่อ <ChevronRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Heart size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--pink-primary)' }} />
          <p style={{ color: 'var(--text-soft)' }}>ไม่พบบทความที่ค้นหา</p>
        </div>
      )}
    </div>
  )
}