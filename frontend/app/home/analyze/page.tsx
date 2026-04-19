'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles, ChevronRight, Shield, Zap, Activity } from 'lucide-react'
import Navbar from '../components/Navbar'

const STEPS = [
  {
    num: 1,
    emoji: '📸',
    emojiAlt: '🩺',
    color: '#f06292',
    colorLight: 'rgba(240,98,146,0.12)',
    colorBorder: 'rgba(240,98,146,0.25)',
    title: 'ถ่ายและส่ง',
    desc: 'เข้าเมนู "วิเคราะห์ลิ่มเลือด" แล้วอัปโหลดรูปภาพประจำเดือนของคุณให้ AI ประมวลผล',
    tag: 'เริ่มต้นง่ายมาก',
    detail: 'รองรับ JPG, PNG · ถ่ายในที่สว่าง วางบนพื้นขาว',
  },
  {
    num: 2,
    emoji: '📋',
    emojiAlt: '💬',
    color: '#e91e8c',
    colorLight: 'rgba(233,30,140,0.10)',
    colorBorder: 'rgba(233,30,140,0.22)',
    title: 'ระบุอาการ',
    desc: 'ระบุข้อมูลอาการเบื้องต้นตามความจริง เพื่อให้ AI วิเคราะห์ได้แม่นยำยิ่งขึ้น',
    tag: 'ใช้เวลาไม่นาน',
    detail: 'เลือกจากรายการที่เตรียมไว้ · ไม่ต้องพิมพ์เอง',
  },
  {
    num: 3,
    emoji: '🔍',
    emojiAlt: '📊',
    color: '#c2185b',
    colorLight: 'rgba(194,24,91,0.10)',
    colorBorder: 'rgba(194,24,91,0.22)',
    title: 'รับผลวิเคราะห์',
    desc: 'ทราบผลความเสี่ยงและสัญญาณโรคที่ควรเฝ้าระวัง พร้อมคำแนะนำการดูแลตัวเองที่ถูกต้อง',
    tag: 'ผลภายใน 30 วิ',
    detail: 'รายงานละเอียด · คำแนะนำเฉพาะบุคคล',
  },
]

const TRUST = [
  { icon: <Shield size={16} color="#c2185b" />, label: 'ข้อมูลปลอดภัย', sub: 'ไม่บันทึกภาพส่วนตัว' },
  { icon: <Zap size={16} color="#c2185b" />, label: 'รวดเร็ว', sub: 'ผลภายใน 30 วินาที' },
  { icon: <Activity size={16} color="#c2185b" />, label: 'แม่นยำ 94%', sub: 'ทดสอบทางคลินิก' },
]

// Floating particle
function Particle({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }} />
}

export default function IntroPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    intervalRef.current = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS.length)
    }, 2800)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const handleStepClick = (i: number) => {
    setActiveStep(i)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS.length)
    }, 2800)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .intro-root {
          min-height: 100vh;
          font-family: 'Sarabun', sans-serif;
          background: #faf7f5;
          overflow-x: hidden;
        }

        /* ════════════════════════════════
           HERO
        ════════════════════════════════ */
        .intro-hero {
          position: relative;
          background: linear-gradient(140deg, #1a0a14 0%, #3d1a2e 48%, #6b2646 100%);
          padding: 56px 40px 100px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          min-height: 440px;
        }
        .ih-bg { position: absolute; inset: 0; pointer-events: none; }
        .ih-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .ih-arc {
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 60px; background: #faf7f5;
          clip-path: ellipse(56% 100% at 50% 100%);
        }

        .ih-left {
          position: relative; z-index: 2; max-width: 520px;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .ih-left.visible { opacity: 1; transform: translateY(0); }

        .ih-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 15px; border-radius: 999px;
          background: rgba(240,98,146,0.16);
          border: 1px solid rgba(240,98,146,0.38);
          font-family: 'Mitr', sans-serif; font-size: 11.5px; color: #f8bbd0;
          letter-spacing: 0.5px; margin-bottom: 22px;
        }
        .ih-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #f06292;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }

        .ih-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: clamp(26px, 4vw, 42px); color: #fff;
          line-height: 1.28; margin-bottom: 6px; letter-spacing: 0.2px;
        }
        .ih-title-accent {
          background: linear-gradient(135deg, #f48fb1 30%, #f06292);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ih-title-sub {
          font-family: 'Mitr', sans-serif; font-weight: 400;
          font-size: clamp(16px, 2.5vw, 22px); color: rgba(255,255,255,0.55);
          margin-bottom: 28px; line-height: 1.4;
        }

        .ih-desc {
          font-size: 14.5px; color: rgba(255,255,255,0.62);
          line-height: 1.78; margin-bottom: 36px; max-width: 460px;
        }
        .ih-desc strong { color: rgba(255,255,255,0.88); font-weight: 500; }

        .ih-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-cta {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 14px 32px; border-radius: 16px; border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff; font-family: 'Mitr', sans-serif;
          font-size: 15px; font-weight: 500; cursor: pointer;
          box-shadow: 0 8px 28px rgba(194,24,91,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative; overflow: hidden;
          text-decoration: none;
        }
        .btn-cta::before {
          content:''; position:absolute; top:0; left:-100%; width:55%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transition: left 0.55s;
        }
        .btn-cta:hover::before { left:160%; }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(194,24,91,0.62); }

        .btn-ghost-hero {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 24px; border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.82); font-family: 'Mitr', sans-serif;
          font-size: 14px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .btn-ghost-hero:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.38); }

        /* Hero right — animated emoji stack */
        .ih-right {
          position: relative; z-index: 2; flex-shrink: 0;
          opacity: 0; transform: translateY(20px) scale(0.95);
          transition: opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s;
        }
        .ih-right.visible { opacity: 1; transform: translateY(0) scale(1); }
        .hero-orb-wrap {
          width: 260px; height: 260px; position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid rgba(240,98,146,0.22);
          animation: spinRing 20s linear infinite;
        }
        .hero-ring-2 {
          position: absolute; inset: 30px; border-radius: 50%;
          border: 1px dashed rgba(240,98,146,0.14);
          animation: spinRing 14s linear infinite reverse;
        }
        @keyframes spinRing { to { transform: rotate(360deg); } }
        .hero-core {
          width: 130px; height: 130px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(240,98,146,0.18), rgba(194,24,91,0.28));
          border: 1.5px solid rgba(240,98,146,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 52px;
          animation: corePulse 3.5s ease-in-out infinite;
          box-shadow: 0 0 48px rgba(240,98,146,0.2);
        }
        @keyframes corePulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 40px rgba(240,98,146,0.2); }
          50% { transform: scale(1.06); box-shadow: 0 0 64px rgba(240,98,146,0.35); }
        }
        .hero-orbit-dot {
          position: absolute; width: 12px; height: 12px; border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }
        .hero-orbit-dot:nth-child(3) { top: 8px; left: 50%; transform: translateX(-50%); background: #f06292; color: #f06292; }
        .hero-orbit-dot:nth-child(4) { bottom: 8px; left: 50%; transform: translateX(-50%); background: #f48fb1; color: #f48fb1; }
        .hero-orbit-dot:nth-child(5) { left: 8px; top: 50%; transform: translateY(-50%); background: #ce93d8; color: #ce93d8; }
        .hero-orbit-dot:nth-child(6) { right: 8px; top: 50%; transform: translateY(-50%); background: #f06292; color: #f06292; }

        /* floating mini emojis */
        .float-em {
          position: absolute; font-size: 22px;
          animation: floatEm 4s ease-in-out infinite;
        }
        .float-em-1 { top: 10px; right: 20px; animation-delay: 0s; }
        .float-em-2 { bottom: 20px; left: 10px; animation-delay: 1.4s; font-size: 18px; }
        .float-em-3 { top: 55%; right: -5px; animation-delay: 0.7s; font-size: 16px; }
        @keyframes floatEm {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }

        /* ════════════════════════════════
           ABOUT SECTION
        ════════════════════════════════ */
        .about-section {
          max-width: 800px; margin: 0 auto;
          padding: 60px 40px 0;
        }
        .section-eyebrow {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 36px; justify-content: center;
        }
        .ey-line {
          flex: 1; height: 1px; max-width: 100px;
          background: linear-gradient(to right, transparent, #f5c6d8);
        }
        .ey-line.r { background: linear-gradient(to left, transparent, #f5c6d8); }
        .ey-text {
          font-family: 'Mitr', sans-serif; font-size: 12px;
          color: #c2185b; letter-spacing: 2.5px; text-transform: uppercase;
        }

        .about-card {
          background: #fff; border-radius: 28px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 8px 40px rgba(194,24,91,0.08);
          padding: 40px 44px;
          position: relative; overflow: hidden;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .about-card.visible { opacity: 1; transform: translateY(0); }
        .about-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #f06292, #c2185b, #e91e8c);
          border-radius: 28px 28px 0 0;
        }
        .about-card-glow {
          position: absolute; top: -60px; right: -60px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.08), transparent 70%);
          pointer-events: none;
        }
        .about-title-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .about-icon {
          width: 48px; height: 48px; border-radius: 16px; flex-shrink: 0;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          box-shadow: 0 6px 20px rgba(194,24,91,0.18);
        }
        .about-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: 20px; color: #1a0a14; line-height: 1.3;
        }
        .about-body {
          font-size: 15px; color: #5a3a4a; line-height: 1.85;
          position: relative; z-index: 1;
        }
        .about-body strong { color: #c2185b; font-weight: 600; }
        .about-body em { font-style: normal; color: #1a0a14; font-weight: 500; }

        .about-tags {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px;
        }
        .about-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 10px;
          background: rgba(194,24,91,0.07);
          border: 1px solid rgba(194,24,91,0.15);
          font-family: 'Sarabun', sans-serif; font-size: 13px; color: #c2185b;
        }

        /* ════════════════════════════════
           STEPS SECTION
        ════════════════════════════════ */
        .steps-section {
          max-width: 900px; margin: 0 auto;
          padding: 64px 40px 0;
        }
        .steps-header {
          text-align: center; margin-bottom: 48px;
        }
        .steps-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: clamp(20px, 3vw, 28px); color: #1a0a14;
          margin-bottom: 8px;
        }
        .steps-title span { color: #c2185b; }
        .steps-subtitle {
          font-size: 14px; color: #9e7a8a; line-height: 1.6;
        }

        /* Step tabs + panel layout */
        .steps-layout {
          display: grid; grid-template-columns: 220px 1fr; gap: 24px;
          align-items: start;
        }

        /* Tab list */
        .step-tabs {
          display: flex; flex-direction: column; gap: 10px;
          position: sticky; top: 100px;
        }
        .step-tab {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px; border-radius: 16px;
          border: 1.5px solid #f5e6ec; background: #fff;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }
        .step-tab:hover { border-color: rgba(240,98,146,0.3); background: rgba(252,228,236,0.3); }
        .step-tab.active {
          border-color: #f06292;
          background: linear-gradient(135deg, rgba(252,228,236,0.5), rgba(248,187,208,0.3));
          box-shadow: 0 6px 20px rgba(194,24,91,0.15);
          transform: translateX(4px);
        }
        .step-tab-emoji { font-size: 24px; flex-shrink: 0; }
        .step-tab-info {}
        .step-tab-num {
          font-family: 'Mitr', sans-serif; font-size: 10px;
          color: #c2185b; letter-spacing: 1.5px; text-transform: uppercase;
        }
        .step-tab-name {
          font-family: 'Mitr', sans-serif; font-size: 14px; font-weight: 500; color: #1a0a14;
        }
        .step-tab.active .step-tab-name { color: #c2185b; }

        /* Detail panel */
        .step-panel {
          background: #fff; border-radius: 24px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 8px 40px rgba(194,24,91,0.08);
          overflow: hidden;
          min-height: 360px;
        }
        .sp-top {
          padding: 36px 36px 28px;
          border-bottom: 1px solid #f5e6ec;
          position: relative; overflow: hidden;
        }
        .sp-top-glow {
          position: absolute; top: -40px; right: -40px;
          width: 160px; height: 160px; border-radius: 50%;
          pointer-events: none;
        }
        .sp-step-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          font-family: 'Mitr', sans-serif; font-size: 11px; font-weight: 500;
          margin-bottom: 16px;
        }
        .sp-emoji-big { font-size: 64px; display: block; margin-bottom: 16px; line-height: 1; }
        .sp-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: 24px; color: #1a0a14; margin-bottom: 12px;
        }
        .sp-desc { font-size: 15px; color: #5a3a4a; line-height: 1.8; }

        .sp-bottom { padding: 24px 36px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .sp-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          background: rgba(194,24,91,0.07);
          border: 1px solid rgba(194,24,91,0.14);
          font-size: 12.5px; color: #c2185b;
        }
        .sp-detail { font-size: 12.5px; color: #9e7a8a; }

        /* progress dots */
        .step-dots {
          display: flex; gap: 6px; justify-content: center; margin-top: 20px;
        }
        .step-dot {
          height: 6px; border-radius: 3px;
          background: #f5c6d8; cursor: pointer;
          transition: all 0.3s ease;
        }
        .step-dot.active {
          background: linear-gradient(90deg, #f06292, #c2185b);
          width: 24px !important;
        }

        /* ════════════════════════════════
           MOBILE STEPS (cards)
        ════════════════════════════════ */
        .steps-cards-mobile {
          display: none;
          flex-direction: column; gap: 16px;
        }
        .step-card-mobile {
          background: #fff; border-radius: 20px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 20px rgba(194,24,91,0.07);
          padding: 24px; display: flex; gap: 16px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .step-card-mobile.visible { opacity: 1; transform: translateY(0); }
        .scm-left {
          display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .scm-num {
          width: 36px; height: 36px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, #f06292, #c2185b);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Mitr', sans-serif; font-size: 15px; font-weight: 600; color: #fff;
          box-shadow: 0 4px 14px rgba(194,24,91,0.38);
        }
        .scm-line { flex: 1; width: 2px; background: linear-gradient(to bottom, #f5c6d8, transparent); min-height: 20px; }
        .scm-emoji { font-size: 28px; margin-top: 4px; }
        .scm-body {}
        .scm-title { font-family: 'Mitr', sans-serif; font-size: 16px; font-weight: 600; color: #1a0a14; margin-bottom: 6px; }
        .scm-desc { font-size: 13.5px; color: #6a4a5a; line-height: 1.7; margin-bottom: 10px; }
        .scm-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 8px; background: rgba(194,24,91,0.07); font-size: 12px; color: #c2185b; }

        /* ════════════════════════════════
           TRUST STRIP
        ════════════════════════════════ */
        .trust-section {
          max-width: 900px; margin: 0 auto; padding: 48px 40px 0;
        }
        .trust-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
        }
        .trust-card {
          background: #fff; border-radius: 18px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 20px rgba(194,24,91,0.06);
          padding: 20px 20px; display: flex; gap: 12px; align-items: center;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .trust-card.visible { opacity: 1; transform: translateY(0); }
        .trust-card:hover { box-shadow: 0 8px 28px rgba(194,24,91,0.12); transform: translateY(-2px); }
        .trust-icon-wrap {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
        }
        .trust-label { font-family: 'Mitr', sans-serif; font-size: 13px; color: #1a0a14; }
        .trust-sub { font-size: 11.5px; color: #9e7a8a; margin-top: 2px; }

        /* ════════════════════════════════
           BOTTOM CTA
        ════════════════════════════════ */
        .bottom-cta {
          max-width: 900px; margin: 48px auto 0;
          padding: 0 40px;
        }
        .bcta-card {
          border-radius: 28px;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 60%, #6b2646 100%);
          padding: 52px 56px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
          position: relative; overflow: hidden;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .bcta-card.visible { opacity: 1; transform: translateY(0); }
        .bcta-card::before {
          content:''; position:absolute; top:-70px; right:-70px;
          width:260px; height:260px; border-radius:50%;
          background: radial-gradient(circle,rgba(240,98,146,0.22),transparent 60%);
        }
        .bcta-card::after {
          content:''; position:absolute; bottom:-50px; left:15%;
          width:180px; height:180px; border-radius:50%;
          background: radial-gradient(circle,rgba(206,147,216,0.14),transparent 60%);
        }
        .bcta-left { position:relative; z-index:1; }
        .bcta-tag {
          font-size: 11px; color: rgba(240,98,146,0.75);
          font-family: 'Mitr', sans-serif; letter-spacing: 2.5px;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .bcta-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: clamp(20px, 3vw, 28px); color: #fff;
          line-height: 1.3; margin-bottom: 10px;
        }
        .bcta-title span { color: #f48fb1; }
        .bcta-desc { font-size: 13.5px; color: rgba(255,255,255,0.5); line-height: 1.6; }
        .bcta-right { position:relative; z-index:1; flex-shrink:0; }

        /* ════════════════════════════════
           FOOTER
        ════════════════════════════════ */
        .intro-footer {
          margin-top: 60px;
          background: #fff; border-top: 1px solid #f5e6ec;
          padding: 26px 40px;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12.5px; color: #b09aa8;
        }

        /* Transition for step panel */
        .sp-content {
          transition: opacity 0.3s ease;
        }
        .sp-content.hidden { opacity: 0; }
        .sp-content.shown { opacity: 1; }

        @keyframes fadeUpIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-in { animation: fadeUpIn 0.45s ease forwards; }

        /* ════════════════════════════════
           RESPONSIVE
        ════════════════════════════════ */
        @media (max-width: 768px) {
          .intro-hero { padding: 40px 20px 80px; flex-direction: column; min-height: auto; }
          .ih-right { display: none; }
          .about-section { padding: 48px 20px 0; }
          .about-card { padding: 28px 24px; }
          .steps-section { padding: 48px 20px 0; }
          .steps-layout { display: none; }
          .steps-cards-mobile { display: flex; }
          .trust-section { padding: 40px 20px 0; }
          .trust-grid { grid-template-columns: 1fr; gap: 12px; }
          .bottom-cta { padding: 0 20px; }
          .bcta-card { padding: 36px 28px; flex-direction: column; }
          .intro-footer { flex-direction: column; gap: 6px; text-align: center; padding: 20px; }
        }
      `}</style>

      <div className="intro-root">
        <Navbar />

        {/* ══════════ HERO ══════════ */}
        <section className="intro-hero">
          <div className="ih-bg">
            {/* particles */}
            <Particle style={{ width:320,height:320,top:-120,right:-60, background:'radial-gradient(circle,rgba(244,143,177,0.18),transparent 60%)' }} />
            <Particle style={{ width:200,height:200,bottom:-70,left:'18%', background:'radial-gradient(circle,rgba(206,147,216,0.13),transparent 60%)' }} />
            <div className="ih-dots" />
          </div>

          <div className={`ih-left ${mounted ? 'visible' : ''}`}>
            <div className="ih-badge">
              <span className="ih-badge-dot" />
              <Sparkles size={11} style={{ flexShrink: 0 }} />
              Lunar Day · AI Health Analysis
            </div>

            <h1 className="ih-title">
              ดูแลสุขภาพ<br />
              <span className="ih-title-accent">เชิงลึก</span>ผ่าน
            </h1>
            <div className="ih-title-sub">ประจำเดือนและลิ่มเลือด</div>

            <p className="ih-desc">
              ช่วยคุณดูแลสุขภาพเชิงลึกผ่านประจำเดือน ด้วยระบบ AI ที่วิเคราะห์ได้ทั้ง
              <strong>ลิ่มเลือดและเนื้อเยื่อ</strong> เพียงอัปโหลดรูปและระบุอาการเบื้องต้น
              ระบบจะช่วยประเมินความเสี่ยงให้คุณ<em>ดูแลตัวเองได้อย่างมั่นใจ</em>
              และเตรียมพร้อมปรึกษาแพทย์ได้อย่างตรงจุด
            </p>

            <div className="ih-actions">
              <button className="btn-cta" onClick={() => router.push('/home/analyze/start')}>
                เริ่มวิเคราะห์เลย <ArrowRight size={16} />
              </button>
              <a href="/home/analyze/start" className="btn-ghost-hero">
                อ่านบทความ <ChevronRight size={15} />
              </a>
            </div>
          </div>

          {/* decorative orb */}
          <div className={`ih-right ${mounted ? 'visible' : ''}`}>
            <div className="hero-orb-wrap">
              <div className="hero-ring">
                <div className="hero-orbit-dot" />
                <div className="hero-orbit-dot" />
                <div className="hero-orbit-dot" />
                <div className="hero-orbit-dot" />
              </div>
              <div className="hero-ring-2" />
              <div className="hero-core">🩸</div>

              <span className="float-em float-em-1">🔬</span>
              <span className="float-em float-em-2">💊</span>
              <span className="float-em float-em-3">📋</span>
            </div>
          </div>

          <div className="ih-arc" />
        </section>

        {/* ══════════ ABOUT ══════════ */}
        <section className="about-section">
          <div className="section-eyebrow">
            <div className="ey-line" />
            <span className="ey-text">เกี่ยวกับระบบ</span>
            <div className="ey-line r" />
          </div>

          <div className={`about-card ${mounted ? 'visible' : ''}`}>
            <div className="about-card-glow" />
            <div className="about-title-row">
              <div className="about-icon">🌙</div>
              <div className="about-title">Lunar Day คืออะไร?</div>
            </div>
            <p className="about-body">
              Lunar Day คือระบบวิเคราะห์สุขภาพสตรีที่ใช้ <strong>AI ขั้นสูง</strong> ในการประเมินลิ่มเลือดและเนื้อเยื่อจากภาพถ่ายประจำเดือน
              ช่วยให้คุณ <em>ดูแลตัวเองได้อย่างมั่นใจ</em> และเตรียมพร้อมปรึกษาแพทย์ได้อย่างตรงจุด
              <br /><br />
              ระบบจะวิเคราะห์ลักษณะ สี ขนาด และปริมาณของลิ่มเลือด ร่วมกับอาการที่คุณระบุ
              เพื่อประเมิน<strong>ความเสี่ยงและสัญญาณโรค</strong>ที่ควรเฝ้าระวัง
              พร้อมคำแนะนำการดูแลตัวเองที่เหมาะสม
            </p>
            <div className="about-tags">
              <span className="about-tag">🩸 วิเคราะห์ลิ่มเลือด</span>
              <span className="about-tag">🔬 AI ขั้นสูง</span>
              <span className="about-tag">📊 ประเมินความเสี่ยง</span>
              <span className="about-tag">💡 คำแนะนำเฉพาะบุคคล</span>
              <span className="about-tag">🔒 ข้อมูลปลอดภัย</span>
            </div>
          </div>
        </section>

        {/* ══════════ STEPS — DESKTOP ══════════ */}
        <section className="steps-section">
          <div className="steps-header">
            <h2 className="steps-title">
              3 ขั้นตอนเช็กสุขภาพประจำเดือน<br />
              กับ <span>Lunar Day</span>
            </h2>
            <p className="steps-subtitle">ง่าย รวดเร็ว และแม่นยำ — เริ่มต้นได้ภายใน 1 นาที</p>
          </div>

          {/* Desktop: tab + panel */}
          <div className="steps-layout">
            <div className="step-tabs">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  className={`step-tab ${activeStep === i ? 'active' : ''}`}
                  onClick={() => handleStepClick(i)}
                >
                  <span className="step-tab-emoji">{s.emoji}</span>
                  <div className="step-tab-info">
                    <div className="step-tab-num">ขั้นตอนที่ {s.num}</div>
                    <div className="step-tab-name">{s.title}</div>
                  </div>
                </button>
              ))}

              <div className="step-dots">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`step-dot ${activeStep === i ? 'active' : ''}`}
                    style={{ width: activeStep === i ? 24 : 8 }}
                    onClick={() => handleStepClick(i)}
                  />
                ))}
              </div>
            </div>

            <div className="step-panel">
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`sp-content ${activeStep === i ? 'shown animate-in' : 'hidden'}`}
                  style={{ display: activeStep === i ? 'block' : 'none' }}
                >
                  <div className="sp-top" style={{ background: `linear-gradient(135deg, ${s.colorLight}, rgba(255,255,255,0))` }}>
                    <div
                      className="sp-top-glow"
                      style={{ background: `radial-gradient(circle, ${s.colorLight}, transparent 70%)` }}
                    />
                    <div
                      className="sp-step-badge"
                      style={{ background: s.colorLight, border: `1px solid ${s.colorBorder}`, color: s.color }}
                    >
                      <span>ขั้นตอนที่ {s.num}</span>
                    </div>
                    <span className="sp-emoji-big">{s.emoji}</span>
                    <h3 className="sp-title">{s.title}</h3>
                    <p className="sp-desc">{s.desc}</p>
                  </div>
                  <div className="sp-bottom">
                    <span className="sp-tag" style={{ background: s.colorLight, borderColor: s.colorBorder, color: s.color }}>
                      ✓ {s.tag}
                    </span>
                    <span className="sp-detail">{s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: stacked cards */}
          <div className="steps-cards-mobile">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`step-card-mobile ${mounted ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="scm-left">
                  <div className="scm-num">{s.num}</div>
                  {i < STEPS.length - 1 && <div className="scm-line" />}
                  <span className="scm-emoji">{s.emoji}</span>
                </div>
                <div className="scm-body">
                  <div className="scm-title">{s.title}</div>
                  <p className="scm-desc">{s.desc}</p>
                  <span className="scm-tag">✓ {s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ TRUST ══════════ */}
        <section className="trust-section">
          <div className="trust-grid">
            {TRUST.map((t, i) => (
              <div
                key={i}
                className={`trust-card ${mounted ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className="trust-icon-wrap">{t.icon}</div>
                <div>
                  <div className="trust-label">{t.label}</div>
                  <div className="trust-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ BOTTOM CTA ══════════ */}
        <div className="bottom-cta">
          <div className={`bcta-card ${mounted ? 'visible' : ''}`} style={{ transitionDelay: '0.5s' }}>
            <div className="bcta-left">
              <p className="bcta-tag">✦ พร้อมใช้งานแล้ววันนี้</p>
              <h2 className="bcta-title">
                เริ่มวิเคราะห์<span>สุขภาพ</span><br />
                ประจำเดือนของคุณ
              </h2>
              <p className="bcta-desc">ใช้เวลาไม่ถึง 2 นาที · ฟรี · ไม่ต้องลงทะเบียนเพิ่มเติม</p>
            </div>
            <div className="bcta-right">
              <button className="btn-cta" onClick={() => router.push('/home/analyze/start')}>
                <Activity size={16} />
                เริ่มวิเคราะห์เลย
              </button>
            </div>
          </div>
        </div>

        {/* ══════════ FOOTER ══════════ */}
        <footer className="intro-footer">
          <span>© 2568 Lunar Day — ดูแลสุขภาพสตรีด้วยเทคโนโลยี</span>
          <span>นโยบายความเป็นส่วนตัว · ติดต่อเรา</span>
        </footer>
      </div>
    </>
  )
}