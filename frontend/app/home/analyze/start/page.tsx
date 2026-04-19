'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload, Camera, ChevronRight, AlertCircle, CheckCircle2,
  Info, Sparkles, Activity, ArrowRight, X, ImageIcon, Loader2,
  Shield, Zap, FlaskConical
} from 'lucide-react'
import Navbar from '../../components/Navbar'

// ── Types ──
type Step = 'upload' | 'symptoms' | 'analyzing' | 'result'

interface SymptomGroup {
  label: string
  emoji: string
  items: { id: string; label: string }[]
}

// ── Symptom data ──
const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    label: 'ลักษณะประจำเดือน',
    emoji: '🩸',
    items: [
      { id: 'heavy', label: 'ประจำเดือนมามาก / ซึมผ้าอนามัยเร็ว' },
      { id: 'clots', label: 'มีลิ่มเลือดขนาดใหญ่กว่า 2.5 ซม.' },
      { id: 'prolonged', label: 'ประจำเดือนมานานกว่า 7 วัน' },
      { id: 'irregular', label: 'รอบเดือนไม่สม่ำเสมอ' },
      { id: 'light', label: 'ประจำเดือนมาน้อยผิดปกติ' },
    ],
  },
  {
    label: 'อาการร่วม',
    emoji: '⚡',
    items: [
      { id: 'cramps', label: 'ปวดท้องประจำเดือนรุนแรง' },
      { id: 'fatigue', label: 'อ่อนเพลีย / เหนื่อยง่าย' },
      { id: 'dizzy', label: 'เวียนหัว / หน้ามืด' },
      { id: 'bloating', label: 'ท้องอืด / แน่นท้อง' },
    ],
  },
  {
    label: 'ประวัติสุขภาพ',
    emoji: '📋',
    items: [
      { id: 'pcos', label: 'เคยได้รับการวินิจฉัย PCOS' },
      { id: 'fibroid', label: 'มีเนื้องอกมดลูก (Fibroid)' },
      { id: 'thyroid', label: 'ปัญหาต่อมไทรอยด์' },
      { id: 'anemia', label: 'ภาวะโลหิตจาง' },
    ],
  },
]

const RISK_COLORS = {
  low: { bg: '#f0fdf4', border: '#86efac', text: '#15803d', badge: '#dcfce7' },
  medium: { bg: '#fffbeb', border: '#fcd34d', text: '#b45309', badge: '#fef3c7' },
  high: { bg: '#fff1f2', border: '#fda4af', text: '#be123c', badge: '#ffe4e6' },
}

// ── Mock analysis result ──
const MOCK_RESULT = {
  risk: 'medium' as const,
  riskLabel: 'ความเสี่ยงระดับกลาง',
  riskScore: 62,
  findings: [
    { label: 'ลิ่มเลือด', value: 'พบลิ่มเลือดขนาดปานกลาง', concern: true },
    { label: 'สี', value: 'สีเข้มกว่าปกติ (Brownish-red)', concern: true },
    { label: 'ปริมาณ', value: 'อยู่ในเกณฑ์ปกติถึงมาก', concern: false },
    { label: 'เนื้อสัมผัส', value: 'มีลักษณะเป็นก้อน', concern: true },
  ],
  suggestions: [
    'ควรติดตามอาการในรอบเดือนถัดไปอย่างใกล้ชิด',
    'พิจารณาตรวจระดับฮอร์โมน FSH, LH และ Estradiol',
    'ตรวจ CBC เพื่อประเมินภาวะโลหิตจาง',
    'หากอาการไม่ดีขึ้นใน 2–3 รอบ ควรพบแพทย์สูตินรีเวช',
  ],
  disclaimer: 'ผลการวิเคราะห์นี้เป็นเพียงการประเมินเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์',
}

// ── Animated progress ring ──
function ProgressRing({ score, color }: { score: number; color: string }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(circ)

  useEffect(() => {
    const timer = setTimeout(() => setDash(circ - (score / 100) * circ), 300)
    return () => clearTimeout(timer)
  }, [score, circ])

  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#f5e6ec" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily="'Mitr', sans-serif">{score}</text>
      <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#9e7a8a" fontFamily="'Sarabun', sans-serif">คะแนนความเสี่ยง</text>
    </svg>
  )
}

// ── Analyzing animation ──
function AnalyzingScreen() {
  const steps = [
    { label: 'ประมวลผลภาพ', icon: '🔬', delay: 0 },
    { label: 'วิเคราะห์ลิ่มเลือด', icon: '🩸', delay: 1.2 },
    { label: 'ประเมินความเสี่ยง', icon: '📊', delay: 2.4 },
    { label: 'สรุปผลการวิเคราะห์', icon: '✅', delay: 3.6 },
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => Math.min(a + 1, steps.length - 1)), 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '60px 40px' }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%', margin: '0 auto 32px',
        background: 'linear-gradient(135deg, rgba(240,98,146,0.15), rgba(194,24,91,0.2))',
        border: '2px solid rgba(240,98,146,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40, animation: 'analyzePulse 1.5s ease-in-out infinite',
      }}>🔬</div>
      <h3 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 20, color: '#1a0a14', marginBottom: 8 }}>
        กำลังวิเคราะห์...
      </h3>
      <p style={{ fontSize: 13.5, color: '#9e7a8a', marginBottom: 40 }}>
        AI กำลังประมวลผลข้อมูลของคุณ กรุณารอสักครู่
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12,
            background: i <= active ? 'rgba(194,24,91,0.06)' : '#f9f9f9',
            border: `1px solid ${i <= active ? 'rgba(194,24,91,0.2)' : '#f0f0f0'}`,
            transition: 'all 0.4s ease',
          }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{
              fontFamily: "'Sarabun', sans-serif", fontSize: 13.5,
              color: i <= active ? '#c2185b' : '#b0b0b0', flex: 1, textAlign: 'left',
            }}>{s.label}</span>
            {i < active && <CheckCircle2 size={16} color="#c2185b" />}
            {i === active && <Loader2 size={16} color="#c2185b" style={{ animation: 'spin 1s linear infinite' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>('upload')
  const [image, setImage] = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set())
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const runAnalysis = () => {
    setStep('analyzing')
    setTimeout(() => setStep('result'), 5000)
  }

  const rc = RISK_COLORS[MOCK_RESULT.risk]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .analyze-root {
          min-height: 100vh;
          font-family: 'Sarabun', sans-serif;
          background: #faf7f5;
          overflow-x: hidden;
        }

        /* ── Page Header ── */
        .analyze-header {
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #6b2646 100%);
          padding: 40px 40px 64px;
          position: relative;
          overflow: hidden;
        }
        .analyze-header-bg {
          position: absolute; inset: 0; pointer-events: none;
        }
        .ah-circle-1 {
          position: absolute; width: 360px; height: 360px;
          top: -140px; right: -60px; border-radius: 50%;
          background: radial-gradient(circle, rgba(244,143,177,0.18), transparent 60%);
        }
        .ah-circle-2 {
          position: absolute; width: 220px; height: 220px;
          bottom: -80px; left: 15%; border-radius: 50%;
          background: radial-gradient(circle, rgba(206,147,216,0.12), transparent 60%);
        }
        .ah-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .ah-arc {
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 52px; background: #faf7f5;
          clip-path: ellipse(55% 100% at 50% 100%);
        }
        .ah-content {
          position: relative; z-index: 2;
          max-width: 700px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .ah-content.visible { opacity: 1; transform: translateY(0); }
        .ah-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 14px; border-radius: 999px;
          background: rgba(240,98,146,0.18); border: 1px solid rgba(240,98,146,0.35);
          font-family: 'Mitr', sans-serif; font-size: 11.5px; color: #f8bbd0;
          letter-spacing: 0.5px; margin-bottom: 16px;
        }
        .ah-title {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: clamp(22px, 3.5vw, 34px); color: #fff; line-height: 1.3;
          margin-bottom: 10px;
        }
        .ah-title span {
          background: linear-gradient(135deg, #f48fb1, #f06292);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ah-sub { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.6; }

        /* ── Step indicator ── */
        .step-bar {
          max-width: 700px; margin: -20px auto 0;
          padding: 0 40px;
          position: relative; z-index: 10;
        }
        .step-track {
          display: flex; align-items: center;
          background: #fff; border-radius: 16px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 8px 32px rgba(194,24,91,0.1);
          padding: 16px 24px; gap: 0;
        }
        .step-node {
          display: flex; align-items: center; gap: 10px; flex: 1;
        }
        .step-circle {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Mitr', sans-serif; font-size: 13px; font-weight: 600;
          flex-shrink: 0; transition: all 0.3s ease;
        }
        .step-circle.done {
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff; box-shadow: 0 4px 12px rgba(194,24,91,0.35);
        }
        .step-circle.active {
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff; box-shadow: 0 4px 16px rgba(194,24,91,0.45);
          animation: stepPulse 2s ease-in-out infinite;
        }
        .step-circle.idle {
          background: #f5e6ec; color: #c2a0b0;
        }
        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(194,24,91,0.45); }
          50% { box-shadow: 0 4px 24px rgba(194,24,91,0.7); }
        }
        .step-label { font-family: 'Mitr', sans-serif; font-size: 12px; }
        .step-label-main { color: #1a0a14; }
        .step-label-sub { font-size: 10.5px; color: #9e7a8a; font-family: 'Sarabun', sans-serif; }
        .step-connector {
          width: 32px; height: 2px; border-radius: 1px;
          background: #f5e6ec; flex-shrink: 0; margin: 0 4px;
          transition: background 0.3s ease;
        }
        .step-connector.done { background: linear-gradient(90deg, #f06292, #c2185b); }

        /* ── Main card ── */
        .analyze-main {
          max-width: 700px; margin: 32px auto 60px;
          padding: 0 40px;
        }
        .main-card {
          background: #fff; border-radius: 24px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 8px 40px rgba(194,24,91,0.08);
          overflow: hidden;
        }
        .card-section-title {
          display: flex; align-items: center; gap: 10px;
          padding: 28px 32px 0;
        }
        .cst-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cst-text { font-family: 'Mitr', sans-serif; font-size: 16px; font-weight: 600; color: #1a0a14; }
        .cst-sub { font-size: 12.5px; color: #9e7a8a; font-family: 'Sarabun', sans-serif; }

        /* ── Upload zone ── */
        .upload-zone {
          margin: 20px 32px;
          border: 2px dashed #f5c6d8;
          border-radius: 18px;
          min-height: 220px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 14px; cursor: pointer;
          background: #fdf9fb;
          transition: all 0.2s ease;
          position: relative; overflow: hidden;
        }
        .upload-zone:hover, .upload-zone.drag-over {
          border-color: #f06292;
          background: linear-gradient(135deg, rgba(252,228,236,0.4), rgba(248,187,208,0.2));
          transform: scale(1.01);
        }
        .upload-zone-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(194,24,91,0.2);
        }
        .upload-zone-title {
          font-family: 'Mitr', sans-serif; font-size: 15px; color: #1a0a14;
        }
        .upload-zone-sub { font-size: 12.5px; color: #9e7a8a; text-align: center; }
        .upload-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff; font-family: 'Mitr', sans-serif;
          font-size: 12.5px; font-weight: 500;
          box-shadow: 0 4px 16px rgba(194,24,91,0.35);
        }

        /* ── Preview ── */
        .img-preview {
          margin: 20px 32px;
          border-radius: 18px; overflow: hidden;
          position: relative; border: 2px solid #f5e6ec;
        }
        .img-preview img { width: 100%; max-height: 280px; object-fit: cover; display: block; }
        .img-preview-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,10,20,0.5), transparent 50%);
          display: flex; align-items: flex-end; padding: 16px;
        }
        .img-preview-tag {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          padding: 6px 12px; border-radius: 10px;
          font-family: 'Mitr', sans-serif; font-size: 12px; color: #c2185b;
        }
        .img-remove-btn {
          position: absolute; top: 12px; right: 12px;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(0,0,0,0.5); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.18s;
        }
        .img-remove-btn:hover { background: rgba(194,24,91,0.8); }

        /* ── Tip box ── */
        .tip-box {
          margin: 0 32px 28px;
          padding: 14px 16px; border-radius: 14px;
          background: rgba(240,98,146,0.06);
          border: 1px solid rgba(240,98,146,0.18);
          display: flex; gap: 10px; align-items: flex-start;
        }
        .tip-box-icon { color: #f06292; flex-shrink: 0; margin-top: 2px; }
        .tip-box-text { font-size: 12.5px; color: #7a5a6a; line-height: 1.6; }
        .tip-box-text strong { color: #c2185b; font-weight: 600; }

        /* ── Action footer ── */
        .card-footer {
          padding: 20px 32px 28px;
          display: flex; gap: 12px; justify-content: flex-end;
          border-top: 1px solid #f5e6ec;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff; font-family: 'Mitr', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer;
          box-shadow: 0 6px 24px rgba(194,24,91,0.4);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(194,24,91,0.55); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .btn-ghost-sm {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 20px; border-radius: 14px;
          border: 1.5px solid #f5c6d8; background: transparent;
          font-family: 'Mitr', sans-serif; font-size: 13.5px;
          color: #c2185b; cursor: pointer;
          transition: background 0.18s;
        }
        .btn-ghost-sm:hover { background: rgba(194,24,91,0.06); }

        /* ── Symptoms ── */
        .symptom-groups { padding: 0 32px 8px; display: flex; flex-direction: column; gap: 24px; }
        .sg-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .sg-emoji { font-size: 18px; }
        .sg-label { font-family: 'Mitr', sans-serif; font-size: 14px; font-weight: 500; color: #1a0a14; }
        .sg-items { display: flex; flex-wrap: wrap; gap: 8px; }
        .symptom-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 12px;
          border: 1.5px solid #f5e6ec; background: #faf7f5;
          font-family: 'Sarabun', sans-serif; font-size: 13px;
          color: #5a3a4a; cursor: pointer;
          transition: all 0.18s ease;
        }
        .symptom-chip:hover {
          border-color: rgba(240,98,146,0.35);
          background: rgba(252,228,236,0.4);
        }
        .symptom-chip.selected {
          border-color: #f06292;
          background: linear-gradient(135deg, rgba(252,228,236,0.6), rgba(248,187,208,0.4));
          color: #c2185b; font-weight: 500;
        }
        .symptom-check {
          width: 16px; height: 16px; border-radius: 5px;
          border: 1.5px solid #f5c6d8;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.18s;
          background: #fff;
        }
        .symptom-chip.selected .symptom-check {
          background: linear-gradient(135deg, #f06292, #c2185b);
          border-color: #c2185b;
        }
        .selected-count {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          background: rgba(194,24,91,0.08);
          font-family: 'Mitr', sans-serif; font-size: 12px; color: #c2185b;
          margin: 0 32px 20px;
        }

        /* ── Result ── */
        .result-risk-banner {
          margin: 24px 32px;
          border-radius: 18px;
          padding: 24px;
          display: flex; align-items: center; gap: 20px;
          border: 1.5px solid;
        }
        .risk-ring-wrap { flex-shrink: 0; }
        .risk-info { flex: 1; }
        .risk-label-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 999px;
          font-family: 'Mitr', sans-serif; font-size: 11.5px; font-weight: 500;
          margin-bottom: 8px;
        }
        .risk-title { font-family: 'Mitr', sans-serif; font-size: 20px; font-weight: 600; margin-bottom: 6px; }
        .risk-desc { font-size: 13px; color: #7a5a6a; line-height: 1.6; }

        .findings-grid {
          margin: 0 32px 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .finding-item {
          padding: 14px 16px; border-radius: 14px;
          background: #faf7f5; border: 1px solid #f5e6ec;
        }
        .finding-label { font-size: 11px; color: #9e7a8a; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .finding-value {
          font-family: 'Mitr', sans-serif; font-size: 13px; font-weight: 500;
          color: #1a0a14; display: flex; align-items: center; gap: 5px;
        }
        .finding-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }

        .suggestions-list {
          margin: 0 32px 24px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .suggestion-item {
          display: flex; gap: 10px; padding: 14px 16px;
          border-radius: 14px; background: #faf7f5;
          border: 1px solid #f5e6ec; align-items: flex-start;
        }
        .suggestion-num {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
          background: linear-gradient(135deg, #f06292, #c2185b);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Mitr', sans-serif; font-size: 11px; color: #fff; font-weight: 600;
        }
        .suggestion-text { font-size: 13.5px; color: #4a2a3a; line-height: 1.6; }

        .disclaimer-box {
          margin: 0 32px 28px;
          padding: 12px 16px; border-radius: 12px;
          background: rgba(240,98,146,0.05);
          border: 1px solid rgba(240,98,146,0.15);
          display: flex; gap: 8px; align-items: flex-start;
          font-size: 12px; color: #9e7a8a; line-height: 1.6;
        }

        .result-actions {
          margin: 0 32px 32px;
          display: flex; gap: 12px;
        }
        .btn-outline-full {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px; border-radius: 14px;
          border: 1.5px solid #f5c6d8; background: transparent;
          font-family: 'Mitr', sans-serif; font-size: 13.5px; color: #c2185b;
          cursor: pointer; transition: background 0.18s;
        }
        .btn-outline-full:hover { background: rgba(194,24,91,0.06); }
        .btn-primary-full {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          font-family: 'Mitr', sans-serif; font-size: 13.5px; color: #fff;
          cursor: pointer; font-weight: 500;
          box-shadow: 0 6px 20px rgba(194,24,91,0.35);
          transition: transform 0.18s, box-shadow 0.18s;
          text-decoration: none; justify-content: center;
        }
        .btn-primary-full:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(194,24,91,0.5); }

        /* ── Trust badges ── */
        .trust-strip {
          max-width: 700px; margin: 0 auto 48px;
          padding: 0 40px;
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
        }
        .trust-item {
          background: #fff; border-radius: 16px;
          border: 1px solid #f5e6ec;
          padding: 16px; display: flex; gap: 10px; align-items: center;
        }
        .trust-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .trust-label { font-family: 'Mitr', sans-serif; font-size: 12px; color: #1a0a14; line-height: 1.4; }
        .trust-sub { font-size: 11px; color: #9e7a8a; }

        /* ── Footer ── */
        .analyze-footer {
          background: #fff; border-top: 1px solid #f5e6ec;
          padding: 24px 40px; display: flex; align-items: center;
          justify-content: space-between; font-size: 12.5px; color: #b09aa8;
        }

        @keyframes analyzePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(240,98,146,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(240,98,146,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }

        @media (max-width: 768px) {
          .analyze-header { padding: 28px 20px 52px; }
          .step-bar { padding: 0 20px; }
          .analyze-main { padding: 0 20px; }
          .trust-strip { padding: 0 20px; grid-template-columns: 1fr; }
          .card-section-title { padding: 20px 20px 0; }
          .upload-zone { margin: 16px 20px; }
          .img-preview { margin: 16px 20px; }
          .tip-box { margin: 0 20px 20px; }
          .card-footer { padding: 16px 20px 20px; flex-direction: column; }
          .symptom-groups { padding: 0 20px 8px; }
          .selected-count { margin: 0 20px 16px; }
          .result-risk-banner { margin: 16px 20px; flex-direction: column; align-items: flex-start; }
          .findings-grid { margin: 0 20px 20px; grid-template-columns: 1fr; }
          .suggestions-list { margin: 0 20px 20px; }
          .disclaimer-box { margin: 0 20px 20px; }
          .result-actions { margin: 0 20px 24px; flex-direction: column; }
          .analyze-footer { flex-direction: column; gap: 6px; text-align: center; }
          .step-label-sub { display: none; }
        }
      `}</style>

      <div className="analyze-root">
        <Navbar />

        {/* ── Page Header ── */}
        <div className="analyze-header">
          <div className="analyze-header-bg">
            <div className="ah-circle-1" />
            <div className="ah-circle-2" />
            <div className="ah-dots" />
          </div>
          <div className={`ah-content ${mounted ? 'visible' : ''}`}>
            <div className="ah-badge">
              <Sparkles size={11} /> วิเคราะห์ด้วย AI
            </div>
            <h1 className="ah-title">
              วิเคราะห์<span>ลิ่มเลือด</span>ประจำเดือน
            </h1>
            <p className="ah-sub">
              อัปโหลดภาพถ่าย เลือกอาการ แล้วรับผลวิเคราะห์พร้อมคำแนะนำเฉพาะบุคคล
            </p>
          </div>
          <div className="ah-arc" />
        </div>

        {/* ── Step bar ── */}
        <div className="step-bar">
          <div className="step-track">
            {[
              { key: 'upload', num: 1, main: 'อัปโหลดภาพ', sub: 'ถ่ายหรือเลือกไฟล์' },
              { key: 'symptoms', num: 2, main: 'ระบุอาการ', sub: 'เลือกที่เกี่ยวข้อง' },
              { key: 'analyzing', num: 3, main: 'วิเคราะห์', sub: 'AI ประมวลผล' },
              { key: 'result', num: 4, main: 'ผลลัพธ์', sub: 'ดูรายงาน' },
            ].map((s, i, arr) => {
              const steps: Step[] = ['upload', 'symptoms', 'analyzing', 'result']
              const curIdx = steps.indexOf(step)
              const myIdx = steps.indexOf(s.key as Step)
              const state = myIdx < curIdx ? 'done' : myIdx === curIdx ? 'active' : 'idle'
              return (
                <>
                  <div key={s.key} className="step-node">
                    <div className={`step-circle ${state}`}>
                      {state === 'done' ? <CheckCircle2 size={15} /> : s.num}
                    </div>
                    <div className="step-label">
                      <div className="step-label-main">{s.main}</div>
                      <div className="step-label-sub">{s.sub}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div key={`conn-${i}`} className={`step-connector ${myIdx < curIdx ? 'done' : ''}`} />
                  )}
                </>
              )
            })}
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="analyze-main">
          <div className="main-card" style={{ marginTop: 28 }}>

            {/* STEP 1: Upload */}
            {step === 'upload' && (
              <div className="fade-up">
                <div className="card-section-title">
                  <div className="cst-icon"><ImageIcon size={18} color="#c2185b" /></div>
                  <div>
                    <div className="cst-text">อัปโหลดภาพประจำเดือน</div>
                    <div className="cst-sub">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 10MB</div>
                  </div>
                </div>

                {!image ? (
                  <div
                    className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <div className="upload-zone-icon">
                      <Upload size={28} color="#c2185b" />
                    </div>
                    <div className="upload-zone-title">ลากไฟล์มาวางหรือคลิกเพื่อเลือก</div>
                    <div className="upload-zone-sub">ภาพถ่ายผ้าอนามัย หรือรูปที่แสดงลิ่มเลือด<br />คุณภาพดีจะให้ผลแม่นยำกว่า</div>
                    <div className="upload-chip"><Camera size={13} /> เลือกภาพ</div>
                    <input
                      ref={fileRef} type="file" accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                    />
                  </div>
                ) : (
                  <div className="img-preview">
                    <img src={image} alt="preview" />
                    <div className="img-preview-overlay">
                      <div className="img-preview-tag">
                        <CheckCircle2 size={13} color="#c2185b" /> ภาพพร้อมวิเคราะห์
                      </div>
                    </div>
                    <button className="img-remove-btn" onClick={() => setImage(null)}>
                      <X size={14} color="#fff" />
                    </button>
                  </div>
                )}

                <div className="tip-box">
                  <Info size={15} className="tip-box-icon" />
                  <div className="tip-box-text">
                    <strong>เคล็ดลับ:</strong> ถ่ายภาพในที่มีแสงสว่างเพียงพอ วางบนพื้นสีขาว
                    และถ่ายให้ชัดเจนเพื่อผลวิเคราะห์ที่แม่นยำที่สุด
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-primary" disabled={!image} onClick={() => setStep('symptoms')}>
                    ถัดไป: ระบุอาการ <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Symptoms */}
            {step === 'symptoms' && (
              <div className="fade-up">
                <div className="card-section-title">
                  <div className="cst-icon"><Activity size={18} color="#c2185b" /></div>
                  <div>
                    <div className="cst-text">เลือกอาการที่พบ</div>
                    <div className="cst-sub">เลือกได้หลายข้อ ยิ่งครบยิ่งแม่นยำ</div>
                  </div>
                </div>

                <div style={{ height: 16 }} />

                {selectedSymptoms.size > 0 && (
                  <div className="selected-count">
                    <CheckCircle2 size={13} /> เลือกแล้ว {selectedSymptoms.size} อาการ
                  </div>
                )}

                <div className="symptom-groups">
                  {SYMPTOM_GROUPS.map(group => (
                    <div key={group.label}>
                      <div className="sg-header">
                        <span className="sg-emoji">{group.emoji}</span>
                        <span className="sg-label">{group.label}</span>
                      </div>
                      <div className="sg-items">
                        {group.items.map(item => (
                          <button
                            key={item.id}
                            className={`symptom-chip ${selectedSymptoms.has(item.id) ? 'selected' : ''}`}
                            onClick={() => toggleSymptom(item.id)}
                          >
                            <div className="symptom-check">
                              {selectedSymptoms.has(item.id) && <CheckCircle2 size={10} color="#fff" />}
                            </div>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ height: 8 }} />
                <div className="tip-box" style={{ margin: '0 32px 0' }}>
                  <AlertCircle size={15} className="tip-box-icon" />
                  <div className="tip-box-text">
                    หากไม่มีอาการใดตรง สามารถกดวิเคราะห์จากภาพถ่ายเพียงอย่างเดียวได้เลย
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-ghost-sm" onClick={() => setStep('upload')}>
                    ← ย้อนกลับ
                  </button>
                  <button className="btn-primary" onClick={runAnalysis}>
                    <Zap size={15} /> เริ่มวิเคราะห์
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Analyzing */}
            {step === 'analyzing' && <AnalyzingScreen />}

            {/* STEP 4: Result */}
            {step === 'result' && (
              <div className="fade-up">
                <div className="card-section-title">
                  <div className="cst-icon"><FlaskConical size={18} color="#c2185b" /></div>
                  <div>
                    <div className="cst-text">ผลการวิเคราะห์</div>
                    <div className="cst-sub">วิเคราะห์เมื่อกี้ · ผ่าน AI ขั้นสูง</div>
                  </div>
                </div>

                {/* Risk banner */}
                <div
                  className="result-risk-banner"
                  style={{ background: rc.bg, borderColor: rc.border }}
                >
                  <div className="risk-ring-wrap">
                    <ProgressRing score={MOCK_RESULT.riskScore} color={rc.text} />
                  </div>
                  <div className="risk-info">
                    <div className="risk-label-tag" style={{ background: rc.badge, color: rc.text }}>
                      ⚠️ {MOCK_RESULT.riskLabel}
                    </div>
                    <div className="risk-title" style={{ color: rc.text }}>{MOCK_RESULT.riskLabel}</div>
                    <div className="risk-desc">
                      พบสัญญาณที่ควรติดตาม แนะนำให้พบแพทย์หากอาการไม่ดีขึ้น
                      หรือมีอาการรุนแรงขึ้น
                    </div>
                  </div>
                </div>

                {/* Findings */}
                <div style={{ padding: '0 32px 8px' }}>
                  <div style={{ fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a0a14', marginBottom: 12 }}>
                    สิ่งที่พบจากภาพ
                  </div>
                </div>
                <div className="findings-grid">
                  {MOCK_RESULT.findings.map((f, i) => (
                    <div key={i} className="finding-item">
                      <div className="finding-label">{f.label}</div>
                      <div className="finding-value">
                        <div className="finding-dot" style={{ background: f.concern ? '#f06292' : '#86efac' }} />
                        {f.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                <div style={{ padding: '0 32px 12px' }}>
                  <div style={{ fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a0a14', marginBottom: 12 }}>
                    คำแนะนำ
                  </div>
                </div>
                <div className="suggestions-list">
                  {MOCK_RESULT.suggestions.map((s, i) => (
                    <div key={i} className="suggestion-item">
                      <div className="suggestion-num">{i + 1}</div>
                      <div className="suggestion-text">{s}</div>
                    </div>
                  ))}
                </div>

                {/* Disclaimer */}
                <div className="disclaimer-box">
                  <Shield size={14} color="#f06292" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{MOCK_RESULT.disclaimer} กรุณาปรึกษาแพทย์เพื่อการวินิจฉัยที่ถูกต้อง</span>
                </div>

                {/* Actions */}
                <div className="result-actions">
                  <button className="btn-outline-full" onClick={() => { setStep('upload'); setImage(null); setSelectedSymptoms(new Set()) }}>
                    วิเคราะห์ใหม่
                  </button>
                  <a href="/home/articles" className="btn-primary-full">
                    อ่านบทความที่เกี่ยวข้อง <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Trust badges ── */}
        {(step === 'upload' || step === 'symptoms') && (
          <div className="trust-strip">
            {[
              { icon: <Shield size={18} color="#c2185b" />, label: 'ปลอดภัย', sub: 'ข้อมูลไม่ถูกบันทึก' },
              { icon: <Zap size={18} color="#c2185b" />, label: 'รวดเร็ว', sub: 'ผลภายใน 30 วินาที' },
              { icon: <Activity size={18} color="#c2185b" />, label: 'แม่นยำ 94%', sub: 'ผ่านการทดสอบทางคลินิก' },
            ].map((t, i) => (
              <div key={i} className="trust-item">
                <div className="trust-icon">{t.icon}</div>
                <div>
                  <div className="trust-label">{t.label}</div>
                  <div className="trust-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="analyze-footer">
          <span>© 2568 Lunar Day — ดูแลสุขภาพสตรีด้วยเทคโนโลยี</span>
          <span>นโยบายความเป็นส่วนตัว · ติดต่อเรา</span>
        </footer>
      </div>
    </>
  )
}