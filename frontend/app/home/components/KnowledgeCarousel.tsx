'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

// สไลด์ข่าวสารและความรู้ในหน้า Home: ภาพอินโฟกราฟิกจาก public/graphic
// - เลื่อนอัตโนมัติทุก AUTOPLAY_MS (หยุดเมื่อเอาเมาส์ชี้ / โฟกัส / ตั้งค่าลดการเคลื่อนไหว)
// - ปุ่มซ้าย-ขวา, จุดบอกตำแหน่ง, ปัดบนมือถือ, ปุ่มลูกศรบนคีย์บอร์ด
// - กดที่ภาพหรือปุ่ม "ดูภาพเต็ม" เพื่อเปิดภาพขนาดใหญ่
// ภาพต้นฉบับมีขนาดใหญ่มาก จึงใช้ next/image ให้ย่อขนาด/บีบอัดให้อัตโนมัติ

type Slide = { src: string; tag: string; title: string; desc: string }

const SLIDES: Slide[] = [
  {
    src: '/graphic/1-1.png',
    tag: 'MENSTRUAL CYCLE',
    title: '4 ระยะของรอบประจำเดือน',
    desc: 'รู้จักการเปลี่ยนแปลงของร่างกายตลอดรอบเดือน ตั้งแต่ระยะมีประจำเดือน ระยะฟอลลิคิวลาร์ ระยะไข่ตก จนถึงระยะลูเทียล',
  },
  {
    src: '/graphic/1-2.png',
    tag: 'PERIOD COLOR GUIDE',
    title: 'สีประจำเดือนช่วยบอกอะไร',
    desc: 'สีของเลือดประจำเดือนบอกสุขภาพได้ สังเกตความต่างของสีแดงเข้ม แดงสด ชมพู แดงอมส้ม เทา ดำ และน้ำตาล และสีแบบไหนที่ควรปรึกษาแพทย์',
  },
  {
    src: '/graphic/1-3.png',
    tag: 'PERIOD DIET',
    title: 'อาหารแนะนำ และอาหารควรหลีกเลี่ยงช่วงมีประจำเดือน',
    desc: 'ลดอาหารเค็ม หวาน คาเฟอีน แอลกอฮอล์ และอาหารรสจัด เพิ่มน้ำเปล่า โปรตีน โอเมกา 3 สมุนไพร และวิตามินซี เพื่อให้สบายตัวขึ้น',
  },
  {
    src: '/graphic/1-4.png',
    tag: 'PMS CARE',
    title: 'อาการก่อนมีประจำเดือน',
    desc: 'สาเหตุของอาการก่อนมีประจำเดือน (PMS) และแนวทางดูแล ทั้งการใช้ยา การปรับอาหาร การลดความเครียด และการออกกำลังกาย',
  },
]

const AUTOPLAY_MS = 6000
const SWIPE_PX = 50

export default function KnowledgeCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [viewing, setViewing] = useState<number | null>(null)
  const touchX = useRef<number | null>(null)
  const count = SLIDES.length

  const go = (i: number) => setIndex((i + count) % count)

  // เลื่อนอัตโนมัติ (เริ่มนับใหม่ทุกครั้งที่เปลี่ยนสไลด์)
  useEffect(() => {
    if (paused || viewing !== null) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [index, paused, viewing, count])

  // ภาพเต็มจอ: ปิดด้วย Esc / เลื่อนด้วยลูกศร / ล็อกการเลื่อนหน้า
  useEffect(() => {
    if (viewing === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewing(null)
      if (e.key === 'ArrowRight') setViewing(v => (v === null ? v : (v + 1) % count))
      if (e.key === 'ArrowLeft') setViewing(v => (v === null ? v : (v - 1 + count) % count))
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [viewing, count])

  return (
    <>
      <style>{`
        .kc {
          position: relative; border-radius: 26px; overflow: hidden;
          background: linear-gradient(135deg, #fff7fa 0%, #fde8f0 45%, #efe3fb 100%);
          border: 1px solid #f5e6ec;
          box-shadow: 0 10px 40px rgba(194,24,91,0.10);
          outline: none;
        }
        .kc:focus-visible { box-shadow: 0 0 0 3px rgba(240,98,146,0.45); }
        .kc-track { display: flex; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .kc-slide {
          position: relative; flex: 0 0 100%; min-width: 0; overflow: hidden;
          display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          align-items: center; gap: clamp(20px, 4vw, 56px);
          padding: 36px clamp(56px, 7vw, 96px) 52px;
          min-height: 440px;
        }
        /* วงกลมตกแต่งพื้นหลัง */
        .kc-slide::before, .kc-slide::after {
          content: ''; position: absolute; border-radius: 50%; pointer-events: none;
        }
        .kc-slide::before {
          width: 460px; height: 460px; left: -120px; bottom: -220px;
          background: radial-gradient(circle, rgba(186,148,236,0.35), transparent 65%);
        }
        .kc-slide::after {
          width: 360px; height: 360px; right: -80px; top: -160px;
          background: radial-gradient(circle, rgba(240,98,146,0.22), transparent 65%);
        }

        /* ภาพอินโฟกราฟิก (แนวตั้ง) ในกรอบขาว */
        .kc-media { position: relative; z-index: 1; display: flex; justify-content: center; }
        .kc-poster {
          position: relative; height: 360px; aspect-ratio: 4419 / 6250;
          border-radius: 18px; overflow: hidden; background: #fff;
          border: 8px solid #fff;
          box-shadow: 0 18px 40px rgba(122,34,84,0.22), 0 0 0 1px rgba(194,24,91,0.06);
          transform: rotate(-3deg); transition: transform 0.35s ease;
          cursor: zoom-in; padding: 0;
        }
        .kc-poster:hover, .kc-poster:focus-visible { transform: rotate(0deg) scale(1.03); }
        .kc-poster img { object-fit: cover; }
        .kc-poster-back {
          position: absolute; height: 360px; aspect-ratio: 4419 / 6250;
          border-radius: 18px; background: rgba(255,255,255,0.6);
          transform: translate(22px, 10px) rotate(5deg);
          box-shadow: 0 10px 30px rgba(122,34,84,0.12);
        }

        .kc-text { position: relative; z-index: 1; }
        .kc-tag {
          display: inline-flex; align-items: center;
          font-family: 'Mitr', sans-serif; font-size: 12px; letter-spacing: 2px;
          color: #fff; background: #1a0a14; border-radius: 999px;
          padding: 5px 14px; margin-bottom: 18px;
        }
        .kc-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: clamp(26px, 3.2vw, 42px); line-height: 1.25;
          background: linear-gradient(90deg, #8e44c9, #c2185b);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          margin-bottom: 16px;
        }
        .kc-desc { font-size: 15.5px; line-height: 1.75; color: #5a3a4a; max-width: 560px; }
        .kc-view {
          margin-top: 26px; display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px; border-radius: 999px;
          border: 2px solid rgba(142,68,201,0.45); background: rgba(255,255,255,0.7);
          font-family: 'Mitr', sans-serif; font-size: 14px; color: #6a2c9a;
          cursor: pointer; transition: background 0.18s, border-color 0.18s, transform 0.18s;
        }
        .kc-view:hover { background: #fff; border-color: #8e44c9; transform: translateY(-2px); }

        /* ปุ่มซ้าย-ขวา */
        .kc-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
          width: 42px; height: 42px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.92); color: #1a0a14;
          box-shadow: 0 4px 14px rgba(26,10,20,0.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.18s, transform 0.18s;
        }
        .kc-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.08); }
        .kc-arrow.prev { left: 14px; }
        .kc-arrow.next { right: 14px; }

        /* จุดบอกตำแหน่ง */
        .kc-dots {
          position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 2;
          display: flex; gap: 7px;
        }
        .kc-dot {
          width: 9px; height: 9px; border-radius: 999px; border: none; padding: 0;
          background: rgba(26,10,20,0.15); cursor: pointer;
          transition: width 0.3s, background 0.3s;
        }
        .kc-dot.active { width: 26px; background: #fff; box-shadow: 0 0 0 1px rgba(194,24,91,0.25); }

        /* ภาพเต็มจอ */
        .kc-lightbox {
          position: fixed; inset: 0; z-index: 400;
          background: rgba(26,10,20,0.82); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; animation: kcFade 0.2s ease;
        }
        .kc-lightbox-img {
          position: relative; height: min(92vh, calc((100vw - 48px) * 6250 / 4419));
          aspect-ratio: 4419 / 6250; border-radius: 12px; overflow: hidden; background: #fff;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .kc-lightbox-img img { object-fit: contain; }
        .kc-lightbox-close {
          position: absolute; top: 18px; right: 18px;
          width: 42px; height: 42px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.15); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .kc-lightbox-close:hover { background: rgba(255,255,255,0.28); }
        @keyframes kcFade { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: 768px) {
          .kc-slide {
            grid-template-columns: 1fr; text-align: center;
            padding: 28px 24px 48px; gap: 22px; min-height: 0;
          }
          .kc-poster, .kc-poster-back { height: 260px; }
          .kc-desc { margin: 0 auto; font-size: 14.5px; }
          .kc-view { margin-top: 20px; }
          .kc-arrow { width: 36px; height: 36px; top: 150px; }
          .kc-arrow:hover { transform: translateY(-50%); }
          .kc-arrow.prev { left: 8px; }
          .kc-arrow.next { right: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kc-track, .kc-poster, .kc-dot { transition: none; }
        }
      `}</style>

      <div
        className="kc"
        role="region"
        aria-roledescription="carousel"
        aria-label="ข่าวสารและความรู้"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') go(index + 1)
          if (e.key === 'ArrowLeft') go(index - 1)
        }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1))
        }}
      >
        <div className="kc-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {SLIDES.map((s, i) => (
            <div
              key={s.src}
              className="kc-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} จาก ${count}: ${s.title}`}
              aria-hidden={i !== index}
            >
              <div className="kc-media">
                <div className="kc-poster-back" />
                <button
                  type="button"
                  className="kc-poster"
                  onClick={() => setViewing(i)}
                  tabIndex={i === index ? 0 : -1}
                  aria-label={`ดูภาพเต็ม: ${s.title}`}
                >
                  <Image src={s.src} alt={s.title} fill sizes="260px" priority={i === 0} />
                </button>
              </div>
              <div className="kc-text">
                <span className="kc-tag">{s.tag}</span>
                <h3 className="kc-title">{s.title}</h3>
                <p className="kc-desc">{s.desc}</p>
                <button type="button" className="kc-view" onClick={() => setViewing(i)} tabIndex={i === index ? 0 : -1}>
                  <Expand size={15} /> ดูภาพเต็ม
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="kc-arrow prev" onClick={() => go(index - 1)} aria-label="สไลด์ก่อนหน้า">
          <ChevronLeft size={20} />
        </button>
        <button type="button" className="kc-arrow next" onClick={() => go(index + 1)} aria-label="สไลด์ถัดไป">
          <ChevronRight size={20} />
        </button>

        <div className="kc-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`kc-dot${i === index ? ' active' : ''}`}
              onClick={() => go(i)}
              aria-label={`ไปที่สไลด์ ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

      {viewing !== null && (
        <div className="kc-lightbox" role="dialog" aria-modal="true" aria-label={SLIDES[viewing].title} onClick={() => setViewing(null)}>
          <div className="kc-lightbox-img" onClick={e => e.stopPropagation()}>
            <Image src={SLIDES[viewing].src} alt={SLIDES[viewing].title} fill sizes="(max-width: 768px) 95vw, 760px" />
          </div>
          <button type="button" className="kc-lightbox-close" onClick={() => setViewing(null)} aria-label="ปิด">
            <X size={20} />
          </button>
        </div>
      )}
    </>
  )
}
