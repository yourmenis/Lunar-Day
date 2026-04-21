'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, X, Clock, Eye, TrendingUp, BookOpen, ChevronRight,
  ArrowLeft, Share2, Bookmark, History, Sparkles, Tag, Filter,
  ArrowRight, Heart, Star
} from 'lucide-react'
import Navbar from '../components/Navbar'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  views: number
  category: string
  categoryColor: string
  readTime: string
  emoji: string
  hot: boolean
  tags: string[]
  publishedAt: string
}

// ─── Data ────────────────────────────────────────────────────────────────────
const CATEGORIES = ['ทั้งหมด', 'สุขภาพรังไข่', 'PCOS', 'การเจริญพันธุ์', 'การวิเคราะห์', 'ฮอร์โมน', 'โภชนาการ']

const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'ภาวะตกไข่ผิดปกติ (Ovulatory Dysfunction) — สาเหตุ อาการ และแนวทางดูแล',
    excerpt: 'ภาวะตกไข่ผิดปกติเป็นหนึ่งในสาเหตุสำคัญที่ให้ประจำเดือนมาไม่ปกติ ทั้งที่เกิดการตกไข่ผิดปกติ...',
    content: `ภาวะตกไข่ผิดปกติเป็นหนึ่งในสาเหตุสำคัญที่ให้ประจำเดือนมาไม่ปกติ ทั้งที่เกิดการตกไข่ผิดปกติหรือไม่เกิดการตกไข่เลย

**ภาวะตกไข่ผิดปกติคืออะไร**

ภาวะตกไข่ผิดปกติ คือภาวะที่ร่างกายไม่สามารถปล่อยไข่ตามรอบเดือนปกติ ทำให้เกิดรอบเดือนผิดปกติ รอบเดือนห่างกันมาก หรือไม่มีประจำเดือนเลย

**สาเหตุที่พบบ่อย**
• ความเครียดสูง
• น้ำหนักตัวที่ต่ำหรือสูงเกินไป
• ออกกำลังกายหนักเกินไป
• ความผิดปกติของต่อมไทรอยด์
• กลุ่มอาการรังไข่หลายใบ (PCOS)

**อาการที่ควรสังเกต**
• รอบเดือนไม่สม่ำเสมอ มาน้อยกว่า 8 ครั้งต่อปี
• ปวดประจำเดือนรุนแรงผิดปกติ
• มีเลือดออกกะปริดกะปรอยระหว่างรอบเดือน

**แนวทางการดูแล**
การรักษาขึ้นอยู่กับสาเหตุ หากเกิดจากความเครียดหรือน้ำหนัก อาจปรับพฤติกรรมได้ แต่หากเป็น PCOS หรือความผิดปกติทางฮอร์โมน ควรปรึกษาแพทย์เพื่อรับการรักษาที่เหมาะสม`,
    views: 12480,
    category: 'สุขภาพรังไข่',
    categoryColor: '#e91e63',
    readTime: '5 นาที',
    emoji: '🔬',
    hot: true,
    tags: ['ตกไข่', 'รอบเดือน', 'ฮอร์โมน'],
    publishedAt: '15 เม.ย. 2568',
  },
  {
    id: 2,
    title: 'โรค PCOS และภาวะการตกไข่ผิดปกติ — อาการ แบบไหนบ่งบอกว่าควรใส่ใจ',
    excerpt: 'ปัญหาที่เกี่ยวกับฮอร์โมน ระบบตกไข่ และรอบเดือนผิดปกติ สามารถส่งผลกับสุขภาพและการมีบุตร...',
    content: `PCOS หรือกลุ่มอาการรังไข่หลายใบ เป็นความผิดปกติทางฮอร์โมนที่พบบ่อยในผู้หญิงวัยเจริญพันธุ์

**PCOS คืออะไร**

PCOS ย่อมาจาก Polycystic Ovary Syndrome คือกลุ่มอาการที่เกิดจากความไม่สมดุลของฮอร์โมนในร่างกาย ทำให้รังไข่ผลิตฮอร์โมนแอนโดรเจนมากเกินไป

**อาการที่พบบ่อย**
• รอบเดือนไม่สม่ำเสมอหรือขาดประจำเดือน
• สิวและผิวมัน
• ขนตามร่างกายมากผิดปกติ
• น้ำหนักเพิ่มขึ้นง่าย
• ผมร่วง

**ผลกระทบต่อการมีบุตร**

PCOS เป็นสาเหตุอันดับหนึ่งของภาวะมีบุตรยากในผู้หญิง เนื่องจากการตกไข่ผิดปกติทำให้ยากต่อการตั้งครรภ์ตามธรรมชาติ`,
    views: 9320,
    category: 'PCOS',
    categoryColor: '#9c27b0',
    readTime: '7 นาที',
    emoji: '💊',
    hot: true,
    tags: ['PCOS', 'ฮอร์โมน', 'มีบุตร'],
    publishedAt: '12 เม.ย. 2568',
  },
  {
    id: 3,
    title: 'ภาวะตกไข่ผิดปกติ (Ovulatory Disorders) — สาเหตุ อาการ และผลต่อการมีบุตร',
    excerpt: 'ภาวะตกไข่ผิดปกติ คือภาวะที่ร่างกายไม่สามารถปล่อยไข่ตามรอบเดือนปกติ ทำให้เกิดรอบเดือนผิดปกติ...',
    content: `ภาวะตกไข่ผิดปกติส่งผลโดยตรงต่อความสามารถในการมีบุตร และคุณภาพชีวิตของผู้หญิงวัยเจริญพันธุ์

**ประเภทของภาวะตกไข่ผิดปกติ**

WHO แบ่งประเภทไว้ 3 กลุ่มหลัก ตามระดับฮอร์โมนและสาเหตุ ได้แก่ Hypogonadotropic hypogonadism, Normogonadotropic normoestrogenic anovulation และ Hypergonadotropic hypoestrogism

**การวินิจฉัย**
• ตรวจเลือดวัดระดับฮอร์โมน LH, FSH, Estrogen
• ตรวจอัลตราซาวด์รังไข่
• วัดอุณหภูมิร่างกายพื้นฐาน (BBT Chart)

**การรักษา**
การรักษาขึ้นอยู่กับสาเหตุและความต้องการของผู้ป่วย อาจใช้ยากระตุ้นการตกไข่ หรือการรักษาด้วย ART (Assisted Reproductive Technology)`,
    views: 8150,
    category: 'การเจริญพันธุ์',
    categoryColor: '#00897b',
    readTime: '6 นาที',
    emoji: '🌸',
    hot: false,
    tags: ['การตกไข่', 'มีบุตรยาก', 'การรักษา'],
    publishedAt: '8 เม.ย. 2568',
  },
  {
    id: 4,
    title: 'วิธีอ่านผลการวิเคราะห์ประจำเดือนและความหมายของแต่ละค่า',
    excerpt: 'เข้าใจผลการวิเคราะห์เลือดประจำเดือนอย่างละเอียด พร้อมคำแนะนำจากผู้เชี่ยวชาญ...',
    content: `การอ่านผลเลือดเพื่อตรวจสุขภาพประจำเดือนอาจดูซับซ้อน แต่เมื่อเข้าใจแล้วจะช่วยให้ดูแลสุขภาพได้ดียิ่งขึ้น

**ค่าที่ควรรู้**

**FSH (Follicle Stimulating Hormone)**
ค่าปกติวันที่ 2-3 ของรอบเดือน: 3-10 mIU/mL
ถ้าสูง: อาจบ่งบอกว่ารังไข่ทำงานลดลง
ถ้าต่ำ: อาจเกี่ยวกับต่อมใต้สมอง

**LH (Luteinizing Hormone)**
ค่าปกติ: 2-15 mIU/mL
การเพิ่มขึ้นอย่างรวดเร็ว (LH surge) บ่งบอกการตกไข่ใกล้เกิด

**Estradiol (E2)**
ค่าปกติ: 20-150 pg/mL ในช่วงต้นรอบเดือน

**AMH (Anti-Müllerian Hormone)**
บ่งบอกปริมาณไข่สำรองในรังไข่ ค่าปกติ: 1-3.5 ng/mL`,
    views: 6890,
    category: 'การวิเคราะห์',
    categoryColor: '#1565c0',
    readTime: '4 นาที',
    emoji: '📊',
    hot: false,
    tags: ['ผลเลือด', 'ฮอร์โมน', 'การวิเคราะห์'],
    publishedAt: '5 เม.ย. 2568',
  },
  {
    id: 5,
    title: 'ประจำเดือนผิดปกติ (Abnormal Menstruation) — อาการ สาเหตุ และแนวทางดูแล',
    excerpt: 'ประจำเดือนที่เกิดขึ้นเป็นสัญญาณว่าระบบฮอร์โมนและการทำงานของมดลูกทำงานร่วมกันได้อย่างปกติ...',
    content: `ประจำเดือนที่เกิดขึ้นเป็นสัญญาณว่าระบบฮอร์โมนและการทำงานของมดลูกทำงานร่วมกันได้อย่างปกติ แต่เมื่อประจำเดือนผิดรูปแบบ อาจเป็นสัญญาณของความผิดปกติที่ควรได้รับการตรวจจากแพทย์

**ประจำเดือนผิดปกติคืออะไร**

ประจำเดือนผิดปกติ หมายถึง รอบเดือนหรือการมีเลือดออกจากโพรงมดลูกที่แตกต่างจากรูปแบบปกติ โดยอาจเปลี่ยนแปลงได้ทั้ง ความถี่ของรอบเดือน ระยะเวลาที่มีเลือดออก ปริมาณเลือดที่ออก และการมีเลือดออกนอกช่วงประจำเดือนปกติ

**ลักษณะความผิดปกติ**
• Menorrhagia — ประจำเดือนมาตรงรอบ แต่มีเลือดออกมากหรือนานเกินปกติ
• Metrorrhagia — มีเลือดออกระหว่างรอบเดือน
• Oligomenorrhea — รอบเดือนห่างกันมากและไม่สม่ำเสมอ

**เมื่อไหร่ควรพบแพทย์**
ควรพบแพทย์หากมีเลือดออกมากผิดปกติ ปวดรุนแรง หรือไม่มีประจำเดือนติดต่อกันมากกว่า 3 เดือน`,
    views: 5640,
    category: 'สุขภาพรังไข่',
    categoryColor: '#e91e63',
    readTime: '8 นาที',
    emoji: '🩺',
    hot: false,
    tags: ['ประจำเดือน', 'ผิดปกติ', 'มดลูก'],
    publishedAt: '2 เม.ย. 2568',
  },
  {
    id: 6,
    title: 'อาหารที่ช่วยสมดุลฮอร์โมนเพศหญิง — โภชนาการเพื่อสุขภาพประจำเดือน',
    excerpt: 'การรับประทานอาหารที่เหมาะสมมีส่วนช่วยปรับสมดุลฮอร์โมนและลดอาการผิดปกติของประจำเดือน...',
    content: `โภชนาการที่ดีมีบทบาทสำคัญในการควบคุมฮอร์โมนและสุขภาพระบบสืบพันธุ์

**สารอาหารสำคัญ**

**โอเมก้า-3**
พบในปลาแซลมอน วอลนัต เมล็ดแฟลกซ์ ช่วยลดการอักเสบและปรับสมดุลฮอร์โมน

**แมกนีเซียม**
พบในผักใบเขียว ถั่ว เมล็ดฟักทอง ช่วยลดอาการ PMS และปวดประจำเดือน

**วิตามิน D**
ได้จากแสงแดดและอาหารเสริม ช่วยควบคุมรอบเดือนและลดความเสี่ยง PCOS

**อาหารที่ควรหลีกเลี่ยง**
• น้ำตาลและของหวานในปริมาณมาก
• อาหารแปรรูปสูง
• คาเฟอีนมากเกินไป
• แอลกอฮอล์`,
    views: 4210,
    category: 'โภชนาการ',
    categoryColor: '#2e7d32',
    readTime: '5 นาที',
    emoji: '🥗',
    hot: false,
    tags: ['อาหาร', 'ฮอร์โมน', 'โภชนาการ'],
    publishedAt: '28 มี.ค. 2568',
  },
]

const SEARCH_SUGGESTIONS = [
  { label: 'เลือดออกเยอะ', type: 'history' },
  { label: 'เลือดประจำเดือน', type: 'search' },
  { label: 'สีของเลือดประจำเดือน', type: 'search' },
  { label: 'เลือดประจำเดือนผิดปกติ', type: 'search' },
  { label: 'เลือดประจำเดือนเป็นลิ่ม', type: 'search' },
  { label: 'ปวดท้องประจำเดือน', type: 'search' },
  { label: 'PCOS อาการ', type: 'search' },
]

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

// ─── Article Reader ───────────────────────────────────────────────────────────
function ArticleReader({ article, onBack }: { article: Article; onBack: () => void }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(article.views * 0.12))

  const lines = article.content.split('\n').filter(Boolean)

  return (
    <>
      <style>{`
        .reader-wrap {
          min-height: 100vh;
          background: #faf7f5;
          font-family: 'Sarabun', sans-serif;
        }
        .reader-hero {
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 60%, #6b2646 100%);
          padding: 40px 0 0;
          position: relative;
          overflow: hidden;
        }
        .reader-hero::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.18), transparent 65%);
        }
        .reader-hero-inner {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 32px 48px;
          position: relative;
          z-index: 2;
        }
        .reader-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.65);
          font-size: 13px;
          cursor: pointer;
          padding: 8px 0;
          transition: color 0.18s;
          margin-bottom: 28px;
          background: none;
          border: none;
          font-family: 'Sarabun', sans-serif;
        }
        .reader-back:hover { color: rgba(255,255,255,0.95); }
        .reader-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .reader-category {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(240,98,146,0.2);
          border: 1px solid rgba(240,98,146,0.35);
          font-size: 12px;
          color: #f8bbd0;
          font-family: 'Mitr', sans-serif;
        }
        .reader-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: clamp(22px, 3.5vw, 32px);
          color: #fff;
          line-height: 1.4;
          margin-bottom: 20px;
        }
        .reader-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }
        .reader-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .reader-emoji-hero {
          position: absolute;
          right: 32px;
          bottom: 0;
          font-size: 100px;
          opacity: 0.12;
          line-height: 1;
        }
        .reader-body {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 32px;
        }
        .reader-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 40px;
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 12px;
          border: 1.5px solid #f5e6ec;
          background: #fff;
          font-size: 13px;
          color: #7a5a6a;
          cursor: pointer;
          font-family: 'Sarabun', sans-serif;
          transition: all 0.18s;
        }
        .action-btn:hover { border-color: #f06292; color: #c2185b; }
        .action-btn.active { background: #fce4ec; border-color: #f06292; color: #c2185b; }
        .reader-content {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #f5e6ec;
          padding: 40px;
          box-shadow: 0 4px 24px rgba(194,24,91,0.06);
        }
        .reader-content p {
          font-size: 15.5px;
          color: #3a2030;
          line-height: 1.9;
          margin-bottom: 18px;
        }
        .reader-content strong, .content-heading {
          display: block;
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 17px;
          color: #c2185b;
          margin: 28px 0 10px;
        }
        .content-bullet {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 7px 0;
          font-size: 15px;
          color: #3a2030;
          line-height: 1.75;
        }
        .content-bullet::before {
          content: '•';
          color: #f06292;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .reader-tags-footer {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid #f5e6ec;
        }
        .tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border-radius: 8px;
          background: #fce4ec;
          color: #c2185b;
          font-size: 12px;
          font-weight: 500;
        }
        .related-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #f5e6ec;
        }
        .related-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #1a0a14;
          margin-bottom: 20px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .related-card {
          border-radius: 14px;
          border: 1.5px solid #f5e6ec;
          padding: 18px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fff;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .related-card:hover { border-color: #f06292; transform: translateY(-2px); }
        .related-emoji { font-size: 28px; flex-shrink: 0; }
        .related-info { flex: 1; }
        .related-card-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 13.5px;
          color: #1a0a14;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .related-views {
          font-size: 11.5px;
          color: #b09aa8;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        @media (max-width: 640px) {
          .reader-hero-inner { padding: 0 20px 40px; }
          .reader-body { padding: 32px 20px; }
          .reader-content { padding: 24px 20px; }
          .related-grid { grid-template-columns: 1fr; }
          .reader-emoji-hero { display: none; }
        }
      `}</style>

      <div className="reader-wrap">
        <Navbar />

        <div className="reader-hero">
          <div className="reader-hero-inner">
            <button className="reader-back" onClick={onBack}>
              <ArrowLeft size={16} /> กลับไปบทความ
            </button>
            <div className="reader-tags">
              <span className="reader-category">
                {article.hot ? '🔥' : '📖'} {article.category}
              </span>
            </div>
            <h1 className="reader-title">{article.title}</h1>
            <div className="reader-meta">
              <span className="reader-meta-item"><Eye size={13} /> {formatViews(article.views)} วิว</span>
              <span className="reader-meta-item"><Clock size={13} /> {article.readTime}</span>
              <span className="reader-meta-item">📅 {article.publishedAt}</span>
            </div>
          </div>
          <span className="reader-emoji-hero">{article.emoji}</span>
        </div>

        <div className="reader-body">
          <div className="reader-actions">
            <button
              className={`action-btn ${liked ? 'active' : ''}`}
              onClick={() => { setLiked(p => !p); setLikeCount(n => liked ? n - 1 : n + 1) }}
            >
              <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
              {likeCount.toLocaleString()}
            </button>
            <button
              className={`action-btn ${bookmarked ? 'active' : ''}`}
              onClick={() => setBookmarked(p => !p)}
            >
              <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
              {bookmarked ? 'บันทึกแล้ว' : 'บันทึก'}
            </button>
            <button className="action-btn">
              <Share2 size={14} /> แชร์
            </button>
          </div>

          <div className="reader-content">
            {lines.map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <span key={i} className="content-heading">{line.slice(2, -2)}</span>
              }
              if (line.startsWith('• ')) {
                return <div key={i} className="content-bullet">{line.slice(2)}</div>
              }
              return <p key={i}>{line}</p>
            })}

            <div className="reader-tags-footer">
              {article.tags.map(tag => (
                <span key={tag} className="tag-chip"><Tag size={11} /> {tag}</span>
              ))}
            </div>
          </div>

          <div className="related-section">
            <h3 className="related-title">บทความที่เกี่ยวข้อง</h3>
            <div className="related-grid">
              {ARTICLES.filter(a => a.id !== article.id).slice(0, 4).map(a => (
                <div key={a.id} className="related-card" onClick={() => window.scrollTo(0, 0)}>
                  <span className="related-emoji">{a.emoji}</span>
                  <div className="related-info">
                    <div className="related-card-title">{a.title}</div>
                    <div className="related-views"><Eye size={11} /> {formatViews(a.views)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Main Articles Page ───────────────────────────────────────────────────────
export default function articles() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [openArticle, setOpenArticle] = useState<Article | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const filtered = ARTICLES.filter(a => {
    const matchCat = activeCategory === 'ทั้งหมด' || a.category === activeCategory
    const q = query.toLowerCase()
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)) || a.category.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  const suggestions = query
    ? SEARCH_SUGGESTIONS.filter(s => s.label.includes(query))
    : SEARCH_SUGGESTIONS

  const showSuggestions = focused && suggestions.length > 0

  const handleSuggestion = (label: string) => {
    setQuery(label)
    setFocused(false)
    inputRef.current?.blur()
  }

  if (openArticle) {
    return <ArticleReader article={openArticle} onBack={() => setOpenArticle(null)} />
  }

  const topArticles = [...ARTICLES].sort((a, b) => b.views - a.views)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .articles-root {
          min-height: 100vh;
          background: #faf7f5;
          font-family: 'Sarabun', sans-serif;
          overflow-x: hidden;
        }

        /* ── Article Header Banner ── */
        .articles-banner {
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 55%, #6b2646 100%);
          padding: 48px 40px 0;
          position: relative;
          overflow: hidden;
        }
        .articles-banner::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.2), transparent 65%);
        }
        .articles-banner::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 10%;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(206,147,216,0.12), transparent 65%);
        }
        .banner-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
          pointer-events: none;
        }
        .banner-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .banner-inner.visible { opacity: 1; transform: translateY(0); }
        .banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(240,98,146,0.18);
          border: 1px solid rgba(240,98,146,0.35);
          font-size: 12px;
          color: #f8bbd0;
          font-family: 'Mitr', sans-serif;
          margin-bottom: 18px;
        }
        .banner-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: clamp(24px, 3.5vw, 36px);
          color: #fff;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .banner-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 36px;
        }

        /* ── Search ── */
        .search-container {
          position: relative;
          max-width: 600px;
          margin-bottom: 32px;
        }
        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 18px;
          color: rgba(255,255,255,0.45);
          pointer-events: none;
          z-index: 1;
          transition: color 0.2s;
        }
        .search-input-wrap:focus-within .search-icon { color: #f48fb1; }
        .search-input {
          width: 100%;
          padding: 15px 50px 15px 50px;
          border-radius: 18px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          color: #fff;
          font-family: 'Sarabun', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.4); }
        .search-input:focus {
          border-color: rgba(240,98,146,0.6);
          background: rgba(255,255,255,0.14);
        }
        .search-clear {
          position: absolute;
          right: 16px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: background 0.18s;
        }
        .search-clear:hover { background: rgba(255,255,255,0.3); }

        /* Suggestions Dropdown */
        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0; right: 0;
          background: #fff;
          border-radius: 18px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 16px 48px rgba(26,10,20,0.18);
          overflow: hidden;
          z-index: 100;
          animation: dropDown 0.18s ease;
        }
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 20px;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #fdf0f5;
        }
        .suggestion-item:last-child { border-bottom: none; }
        .suggestion-item:hover { background: #fdf0f5; }
        .suggestion-icon {
          width: 32px; height: 32px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .suggestion-icon.history { background: #fce4ec; color: #f06292; }
        .suggestion-icon.search { background: #f5f5f5; color: #9e9e9e; }
        .suggestion-text {
          font-family: 'Sarabun', sans-serif;
          font-size: 14.5px;
          color: #3a2030;
        }
        .suggestion-text strong {
          color: #c2185b;
          font-weight: 600;
        }
        .suggestion-arrow { margin-left: auto; color: #d8c0c8; }

        /* Category pills  */
        .category-pills {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 0;
          scrollbar-width: none;
          margin-top: 4px;
        }
        .category-pills::-webkit-scrollbar { display: none; }

        /* Tab-style bottom border for active */
        .cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 10px 20px;
          border-radius: 0;
          border: none;
          background: none;
          font-family: 'Mitr', sans-serif;
          font-size: 13.5px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.18s;
          position: relative;
        }
        .cat-pill::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #f06292;
          border-radius: 2px 2px 0 0;
          transform: scaleX(0);
          transition: transform 0.22s ease;
        }
        .cat-pill.active { color: #fff; }
        .cat-pill.active::after { transform: scaleX(1); }
        .cat-pill:hover { color: rgba(255,255,255,0.8); }

        /* ── Content area ── */
        .content-area {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 40px 80px;
        }

        /* ── Featured strip (top 3 hot) ── */
        .featured-strip {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 48px;
        }
        .featured-main {
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 24px rgba(194,24,91,0.08);
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s;
          display: flex;
          flex-direction: column;
        }
        .featured-main:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(194,24,91,0.16); }
        .featured-main-img {
          height: 200px;
          background: linear-gradient(135deg, #1a0a14, #6b2646, #f06292);
          display: flex; align-items: center; justify-content: center;
          font-size: 72px;
          position: relative;
          overflow: hidden;
        }
        .featured-main-img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(26,10,20,0.4));
        }
        .featured-main-body { padding: 22px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .rank-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-family: 'Mitr', sans-serif;
          background: linear-gradient(135deg, #fff3e0, #ffe0b2);
          color: #e65100;
          border: 1px solid rgba(230,81,0,0.2);
          width: fit-content;
        }
        .cat-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(194,24,91,0.08);
          color: #c2185b;
          font-size: 11px;
          font-weight: 500;
        }
        .featured-main-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 16px;
          color: #1a0a14;
          line-height: 1.45;
          flex: 1;
        }
        .featured-main-meta {
          display: flex;
          gap: 14px;
          font-size: 12px;
          color: #9e7a8a;
          align-items: center;
        }
        .featured-side {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .featured-side-card {
          flex: 1;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #f5e6ec;
          box-shadow: 0 2px 12px rgba(194,24,91,0.05);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .featured-side-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(194,24,91,0.12); }
        .featured-side-img {
          height: 110px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1);
          display: flex; align-items: center; justify-content: center;
          font-size: 44px;
        }
        .featured-side-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 7px; }
        .featured-side-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: #1a0a14;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Section header ── */
        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .section-head-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-icon-box {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
        }
        .section-head-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 19px;
          color: #1a0a14;
        }
        .section-head-sub {
          font-size: 12.5px;
          color: #9e7a8a;
          margin-top: 2px;
        }
        .results-count {
          font-size: 13px;
          color: #9e7a8a;
          background: #f5e6ec;
          padding: 5px 12px;
          border-radius: 8px;
        }

        /* ── Articles grid ── */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .article-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 2px 12px rgba(194,24,91,0.04);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s;
          display: flex;
          flex-direction: column;
        }
        .article-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(194,24,91,0.13); }
        .article-card-img {
          height: 150px;
          display: flex; align-items: center; justify-content: center;
          font-size: 52px;
          position: relative;
          overflow: hidden;
        }
        .article-card-img::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50px;
          background: linear-gradient(to top, rgba(255,255,255,0.6), transparent);
        }
        .article-card-body { padding: 18px; display: flex; flex-direction: column; gap: 9px; flex: 1; }
        .article-card-header { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
        .article-card-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 14.5px;
          color: #1a0a14;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .article-card-excerpt {
          font-size: 12.5px;
          color: #9e7a8a;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid #f5e6ec;
          font-size: 12px;
          color: #b09aa8;
          margin-top: auto;
        }
        .views-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #c2185b;
          font-weight: 500;
        }
        .read-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #c2185b;
          font-size: 12px;
          font-weight: 500;
          transition: gap 0.18s;
        }
        .article-card:hover .read-link { gap: 7px; }

        /* Empty state */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 40px;
        }
        .empty-emoji { font-size: 56px; margin-bottom: 16px; }
        .empty-title {
          font-family: 'Mitr', sans-serif;
          font-size: 18px;
          color: #3a2030;
          margin-bottom: 8px;
        }
        .empty-sub { font-size: 14px; color: #9e7a8a; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .featured-strip { grid-template-columns: 1fr; }
          .featured-side { flex-direction: row; }
          .articles-grid { grid-template-columns: 1fr 1fr; }
          .content-area { padding: 32px 20px 60px; }
          .articles-banner { padding: 40px 20px 0; }
        }
        @media (max-width: 600px) {
          .articles-grid { grid-template-columns: 1fr; }
          .featured-side { flex-direction: column; }
        }
      `}</style>

      <div className="articles-root">
        <Navbar />

        {/* Banner */}
        <div className="articles-banner">
          <div className="banner-dots" />
          <div className={`banner-inner ${mounted ? 'visible' : ''}`}>
            <div className="banner-badge">
              <BookOpen size={11} /> คลังบทความสุขภาพสตรี
            </div>
            <h1 className="banner-title">บทความ & ความรู้</h1>
            <p className="banner-subtitle">คัดสรรบทความคุณภาพจากผู้เชี่ยวชาญด้านสุขภาพสตรี</p>

            {/* Search */}
            <div className="search-container">
              <div className="search-input-wrap">
                <Search size={17} className="search-icon" />
                <input
                  ref={inputRef}
                  className="search-input"
                  placeholder="ค้นหาบทความ..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 160)}
                />
                {query && (
                  <button className="search-clear" onClick={() => { setQuery(''); inputRef.current?.focus() }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              {showSuggestions && (
                <div className="suggestions-dropdown">
                  {suggestions.map((s, i) => {
                    const parts = s.label.split(new RegExp(`(${query})`, 'gi'))
                    return (
                      <div key={i} className="suggestion-item" onMouseDown={() => handleSuggestion(s.label)}>
                        <div className={`suggestion-icon ${s.type}`}>
                          {s.type === 'history' ? <History size={14} /> : <Search size={14} />}
                        </div>
                        <span className="suggestion-text">
                          {parts.map((p, j) =>
                            p.toLowerCase() === query.toLowerCase()
                              ? <strong key={j}>{p}</strong>
                              : p
                          )}
                        </span>
                        <ArrowRight size={13} className="suggestion-arrow" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="category-pills">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content-area">
          {/* Show featured strip only when not searching/filtering */}
          {!query && activeCategory === 'ทั้งหมด' && (
            <>
              <div className="section-head" style={{ marginBottom: 22 }}>
                <div className="section-head-left">
                  <div className="section-icon-box">
                    <Star size={15} color="#c2185b" />
                  </div>
                  <div>
                    <div className="section-head-title">บทความแนะนำ</div>
                    <div className="section-head-sub">ยอดนิยมสูงสุดประจำสัปดาห์</div>
                  </div>
                </div>
              </div>

              <div className="featured-strip" style={{ marginBottom: 52 }}>
                <div className="featured-main" onClick={() => setOpenArticle(topArticles[0])}>
                  <div className="featured-main-img">{topArticles[0].emoji}</div>
                  <div className="featured-main-body">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="rank-badge">🔥 อันดับ 1</span>
                      <span className="cat-tag">{topArticles[0].category}</span>
                    </div>
                    <h3 className="featured-main-title">{topArticles[0].title}</h3>
                    <div className="featured-main-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={13} /> {formatViews(topArticles[0].views)} วิว
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {topArticles[0].readTime}
                      </span>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#c2185b', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                      อ่านต่อ <ArrowRight size={13} />
                    </span>
                  </div>
                </div>

                <div className="featured-side">
                  {topArticles.slice(1, 3).map((a, i) => (
                    <div key={a.id} className="featured-side-card" onClick={() => setOpenArticle(a)}>
                      <div className="featured-side-img" style={{
                        background: i === 0
                          ? 'linear-gradient(135deg, #f3e5f5, #ce93d8)'
                          : 'linear-gradient(135deg, #e8f5e9, #81c784)'
                      }}>{a.emoji}</div>
                      <div className="featured-side-body">
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {a.hot && <span style={{ fontSize: 10, background: '#fce4ec', color: '#e91e63', padding: '2px 8px', borderRadius: 999, fontFamily: "'Mitr',sans-serif" }}>📈 Hot</span>}
                          <span className="cat-tag">{a.category}</span>
                        </div>
                        <div className="featured-side-title">{a.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#b09aa8', marginTop: 'auto' }}>
                          <Eye size={11} /> {formatViews(a.views)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* All / filtered articles */}
          <div className="section-head">
            <div className="section-head-left">
              <div className="section-icon-box">
                <TrendingUp size={15} color="#c2185b" />
              </div>
              <div>
                <div className="section-head-title">
                  {query ? `ผลการค้นหา "${query}"` : activeCategory === 'ทั้งหมด' ? 'บทความสุขภาพ' : activeCategory}
                </div>
                <div className="section-head-sub">
                  {query ? '' : 'บทความคุณภาพทั้งหมด'}
                </div>
              </div>
            </div>
            <span className="results-count">{filtered.length} บทความ</span>
          </div>

          <div className="articles-grid">
            {filtered.length > 0 ? filtered.map((article, idx) => (
              <div key={article.id} className="article-card"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => setOpenArticle(article)}
              >
                <div className="article-card-img" style={{
                  background: [
                    'linear-gradient(135deg,#fce4ec,#f8bbd0,#f48fb1)',
                    'linear-gradient(135deg,#f3e5f5,#e1bee7,#ce93d8)',
                    'linear-gradient(135deg,#e8f5e9,#c8e6c9,#81c784)',
                    'linear-gradient(135deg,#e3f2fd,#bbdefb,#64b5f6)',
                    'linear-gradient(135deg,#fff3e0,#ffe0b2,#ffb74d)',
                    'linear-gradient(135deg,#fce4ec,#f48fb1,#e91e63)',
                  ][idx % 6]
                }}>
                  {article.emoji}
                </div>
                <div className="article-card-body">
                  <div className="article-card-header">
                    {article.hot && (
                      <span style={{ fontSize: 10.5, background: '#fce4ec', color: '#e91e63', padding: '2px 9px', borderRadius: 999, fontFamily: "'Mitr',sans-serif" }}>🔥 Hot</span>
                    )}
                    <span className="cat-tag" style={{ color: article.categoryColor }}>
                      {article.category}
                    </span>
                  </div>
                  <h3 className="article-card-title">{article.title}</h3>
                  <p className="article-card-excerpt">{article.excerpt}</p>
                  <div className="article-card-footer">
                    <span className="views-pill"><Eye size={12} /> {formatViews(article.views)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#b09aa8' }}>
                      <Clock size={12} /> {article.readTime}
                    </span>
                    <span className="read-link">อ่าน <ArrowRight size={12} /></span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <div className="empty-emoji">🔍</div>
                <div className="empty-title">ไม่พบบทความที่ตรงกัน</div>
                <div className="empty-sub">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}