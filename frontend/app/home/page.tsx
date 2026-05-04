'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, BookOpen, ArrowRight, ChevronRight, Sparkles, Activity } from 'lucide-react'
import Navbar from './components/Navbar'
import api from '../lib/api'
import LoginToast from './components/LoginToast'

export default function HomePage() {
  const [showLoginToast, setShowLoginToast] = useState(false)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [waveBars, setWaveBars] = useState<number[]>([])
  const [articles, setArticles] = useState<any[]>([])

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles')
      setArticles(res.data)
    } catch {
      console.error('โหลดบทความไม่สำเร็จ')
    }
  }

  useEffect(() => {
    setMounted(true)
    setWaveBars(
      Array.from({ length: 16 }, (_, i) =>
        20 + Math.sin(i * 0.8) * 14 + Math.random() * 10
      )
    )
    fetchArticles()
  }, [])

  const topArticles = [...articles]

  // ── ตรวจ token ก่อนไปหน้าวิเคราะห์ ──
  // const goToAnalyze = () => {
  //   const token = localStorage.getItem('access_token')
  //   if (!token) {
  //     setShowLoginToast(true)
  //     return
  //   }
  //   console.log('go analyze')
  //   router.push('/home/analyze')
  // }

  const goToAnalyze = () => {
    const token = localStorage.getItem('access_token')
    console.log('TOKEN:', token)

    if (!token) {
      console.log('BLOCKED: no token')
      setShowLoginToast(true)
      return
    }

    console.log('GO TO ANALYZE')
    router.push('/home/analyze')
  }

  return (
    
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          min-height: 100vh;
          font-family: 'Sarabun', sans-serif;
          background: #faf7f5;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          min-height: 480px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #6b2646 100%);
          padding: 60px 40px;
        }
        .hero-bg-circles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .hero-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.12;
        }
        .hero-circle-1 {
          width: 500px; height: 500px;
          top: -200px; right: -100px;
          background: radial-gradient(circle, #f48fb1, transparent 60%);
          opacity: 0.2;
        }
        .hero-circle-2 {
          width: 300px; height: 300px;
          bottom: -100px; left: 20%;
          background: radial-gradient(circle, #ce93d8, transparent 60%);
          opacity: 0.15;
        }
        .hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 560px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .hero-content.visible { opacity: 1; transform: translateY(0); }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(240,98,146,0.2);
          border: 1px solid rgba(240,98,146,0.4);
          font-size: 12px;
          color: #f8bbd0;
          font-family: 'Mitr', sans-serif;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }
        .hero-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: clamp(28px, 4vw, 42px);
          color: #fff;
          line-height: 1.3;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }
        .hero-desc {
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 440px;
        }
        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff;
          font-family: 'Mitr', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(194,24,91,0.45);
          transition: transform 0.18s, box-shadow 0.18s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }
        .btn-primary:hover::before { left: 160%; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(194,24,91,0.55); }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.85);
          font-family: 'Mitr', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.35); }

        /* Hero graphic */
        .hero-graphic {
          position: absolute;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          opacity: 0;
          transition: opacity 0.9s ease 0.3s;
        }
        .hero-graphic.visible { opacity: 1; }
        .cycle-ring {
          width: 280px; height: 280px;
          border-radius: 50%;
          border: 2px solid rgba(240,98,146,0.25);
          position: relative;
          display: flex; align-items: center; justify-content: center;
          animation: slowSpin 18s linear infinite;
        }
        @keyframes slowSpin { to { transform: rotate(360deg); } }
        .cycle-inner {
          width: 200px; height: 200px;
          border-radius: 50%;
          border: 1.5px solid rgba(240,98,146,0.15);
          background: rgba(240,98,146,0.05);
          display: flex; align-items: center; justify-content: center;
          animation: slowSpin 12s linear infinite reverse;
        }
        .cycle-core {
          width: 120px; height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(240,98,146,0.2), rgba(194,24,91,0.3));
          border: 1px solid rgba(240,98,146,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 40px;
          animation: pulse 3s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(240,98,146,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(240,98,146,0); }
        }
        .cycle-dot {
          position: absolute;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #f06292;
          box-shadow: 0 0 8px rgba(240,98,146,0.8);
        }
        .cycle-dot:nth-child(1) { top: -5px; left: 50%; transform: translateX(-50%); }
        .cycle-dot:nth-child(2) { bottom: -5px; left: 50%; transform: translateX(-50%); background: #f48fb1; }
        .cycle-dot:nth-child(3) { left: -5px; top: 50%; transform: translateY(-50%); background: #ce93d8; }

        /* ── Section ── */
        .section {
          padding: 56px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-icon {
          width: 32px; height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
        }
        .section-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 20px;
          color: #1a0a14;
        }
        .section-subtitle {
          font-size: 13px;
          color: #9e7a8a;
          margin-top: 2px;
        }
        .see-all-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(194,24,91,0.2);
          background: transparent;
          font-family: 'Sarabun', sans-serif;
          font-size: 13px;
          color: #c2185b;
          cursor: pointer;
          transition: background 0.18s;
        }
        .see-all-btn:hover { background: rgba(194,24,91,0.06); }

        /* ── Article cards ── */
        .articles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .article-featured {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 24px rgba(194,24,91,0.08);
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .article-featured:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(194,24,91,0.15); }
        .article-featured-img {
          background: linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1);
          min-height: 240px;
          position: relative;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 80px;
        }
        .article-featured-img::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(194,24,91,0.15), transparent);
        }
        .article-featured-body {
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }
        .article-rank {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
        }
        .article-rank.hot {
          background: linear-gradient(135deg, #fff3e0, #ffe0b2);
          color: #e65100;
          border: 1px solid rgba(230,81,0,0.2);
        }
        .article-rank.trending {
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          color: #c2185b;
          border: 1px solid rgba(194,24,91,0.2);
        }
        .article-category-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(194,24,91,0.08);
          color: #c2185b;
          font-size: 11.5px;
          font-weight: 500;
        }
        .article-featured-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #1a0a14;
          line-height: 1.4;
        }
        .article-featured-excerpt {
          font-size: 13.5px;
          color: #7a5a6a;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: #9e7a8a;
        }
        .article-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #c2185b;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 4px;
          transition: gap 0.18s;
        }
        .read-more:hover { gap: 8px; }

        .article-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 2px 12px rgba(194,24,91,0.05);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s, box-shadow 0.22s;
          display: flex;
          flex-direction: column;
        }
        .article-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(194,24,91,0.12); }
        .article-card-img {
          height: 160px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          font-size: 52px;
          position: relative;
          overflow: hidden;
        }
        .article-card-img::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to top, rgba(255,255,255,0.5), transparent);
        }
        .article-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
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
        }
        .article-card-excerpt {
          font-size: 12.5px;
          color: #9e7a8a;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f5e6ec;
          font-size: 11.5px;
          color: #b09aa8;
        }
        .views-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #c2185b;
          font-weight: 500;
        }

        /* ── CTA ── */
        .cta-section {
          margin: 0 40px 56px;
          border-radius: 24px;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 100%);
          padding: 48px 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.2), transparent 60%);
        }
        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 20%;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(206,147,216,0.15), transparent 60%);
        }
        .cta-content { position: relative; z-index: 1; }
        .cta-label {
          font-size: 12px;
          color: rgba(240,98,146,0.8);
          font-family: 'Mitr', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .cta-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 26px;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 12px;
        }
        .cta-desc { font-size: 14px; color: rgba(255,255,255,0.55); }
        .cta-graphic {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        .waveform {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 48px;
          margin-right: 35px;
        }
        .wave-bar {
          width: 4px;
          border-radius: 2px;
          background: linear-gradient(to top, rgba(240,98,146,0.3), #f06292);
          animation: wavePulse 1.4s ease-in-out infinite;
        }
        @keyframes wavePulse {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }

        /* ── Footer ── */
        .home-footer {
          background: #fff;
          border-top: 1px solid #f5e6ec;
          padding: 28px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: #b09aa8;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero { padding: 48px 20px; min-height: auto; }
          .hero-graphic { display: none; }
          .section { padding: 40px 20px; }
          .articles-grid { grid-template-columns: 1fr; }
          .article-featured { grid-template-columns: 1fr; }
          .article-featured-img { min-height: 180px; }
          .cta-section { margin: 0 20px 40px; padding: 32px 24px; flex-direction: column; }
          .cta-graphic { display: none; }
        }
      `}</style>

      <div className="home-root">
        <Navbar />

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-bg-circles">
            <div className="hero-circle hero-circle-1" />
            <div className="hero-circle hero-circle-2" />
            <div className="hero-dots" />
          </div>

          <div className={`hero-content ${mounted ? 'visible' : ''}`}>
            <div className="hero-badge">
              <Sparkles size={11} /> เทคโนโลยีวิเคราะห์ขั้นสูง
            </div>
            <h1 className="hero-title">
              ดูแลสุขภาพสตรี<br />
              ด้วยการวิเคราะห์<br />
              ลิ่มเลือด
            </h1>
            <p className="hero-desc">
              วิเคราะห์ผลเลือดประจำเดือนอย่างแม่นยำด้วย AI
              พร้อมคำแนะนำเฉพาะบุคคล เพื่อสุขภาพที่ดีกว่า
            </p>
            <div className="hero-actions">
              {/* <button className="btn-primary" onClick={() => router.push('/home/analyze')}> */}
              <button className="btn-primary" onClick={goToAnalyze}>
                <Activity size={15} /> เริ่มวิเคราะห์เลย
              </button>
              <button className="btn-ghost" onClick={() => router.push('/home/articles')}>
                <BookOpen size={15} /> อ่านบทความ
              </button>
            </div>
          </div>

          <div className={`hero-graphic ${mounted ? 'visible' : ''}`}>
            <div className="cycle-ring">
              <div className="cycle-dot" />
              <div className="cycle-dot" />
              <div className="cycle-dot" />
              <div className="cycle-inner">
                <div className="cycle-core">🩸</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Articles ── */}
        <div className="section">
          <div className="section-header">
            <div>
              <div className="section-title-wrap">
                <div className="section-icon">
                  <TrendingUp size={16} color="#c2185b" />
                </div>
                <h2 className="section-title">บทความแนะนำ</h2>
              </div>
              <p className="section-subtitle">คัดสรรจากบทความที่มีผู้เข้าชมสูงสุด</p>
            </div>
            <button className="see-all-btn" onClick={() => router.push('/home/articles')}>
              ดูทั้งหมด <ChevronRight size={14} />
            </button>
          </div>

          <div className="articles-grid">
            {topArticles.length > 0 && (
              <div
                className="article-featured"
                onClick={() => router.push(`/home/articles/${topArticles[0].ArticleID}`)}
              >
                <div className="article-featured-img">🔬</div>
                <div className="article-featured-body">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="article-rank hot">🔥 อันดับ 1</span>
                  </div>
                  <h3 className="article-featured-title">{topArticles[0].Title}</h3>
                  <span className="read-more">อ่านต่อ <ArrowRight size={14} /></span>
                </div>
              </div>
            )}

            {topArticles.slice(1, 4).map((article, i) => {
              const emojis = ['💊', '🌸', '📊']
              return (
                <div
                  key={article.ArticleID}
                  className="article-card"
                  onClick={() => router.push(`/home/articles/${article.ArticleID}`)}
                >
                  <div className="article-card-img">{emojis[i]}</div>
                  <div className="article-card-body">
                    <h3 className="article-card-title">{article.Title}</h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="cta-section">
          <div className="cta-content">
            <p className="cta-label">✦ เริ่มต้นวันนี้</p>
            <h2 className="cta-title">
              วิเคราะห์ผลเลือด<br />
              เพื่อสุขภาพที่ดีกว่า
            </h2>
            <p className="cta-desc">รับผลวิเคราะห์ละเอียดพร้อมคำแนะนำเฉพาะบุคคลภายในไม่กี่นาที</p>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={goToAnalyze}>
              เริ่มวิเคราะห์ฟรี <ArrowRight size={15} />
            </button>
          </div>

          <div className="cta-graphic">
            <div className="waveform">
              {waveBars.map((h, i) => (
                <div key={i} className="wave-bar" style={{ height: `${h}px`, animationDelay: `${i * 0.09}s` }} />
              ))}
            </div>
            <div style={{
              background: 'rgba(240,98,146,0.12)',
              border: '1px solid rgba(240,98,146,0.25)',
              borderRadius: 14,
              padding: '14px 20px',
              color: '#f48fb1',
              fontFamily: "'Mitr', sans-serif",
              fontSize: 13,
              textAlign: 'center',
            }}>
              🩸 ผลวิเคราะห์พร้อมแล้ว<br />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="home-footer">
          <span>© 2568 Lunar Day — ดูแลสุขภาพสตรีด้วยเทคโนโลยี</span>
        </footer>
      </div>
      <LoginToast show={showLoginToast} onClose={() => setShowLoginToast(false)} />
    </>
  )
}