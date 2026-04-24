'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import {
  Upload, Camera, ChevronRight, AlertCircle, CheckCircle2,
  Info, Sparkles, Activity, ArrowRight, X, ImageIcon, Loader2,
  Shield, Zap, FlaskConical, Baby, Clock, Ruler
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import LoginToast from '../../components/LoginToast'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Step = 'upload' | 'symptoms' | 'analyzing' | 'result'

interface SymptomForm {
  pain_level: string
  duration: string
  is_pregnant: string   // "true" | "false"
  size: string          // only required when ai_result === "clot"
}

interface ImageResult {
  status: string
  ai_result: string
  detect_label: string
  confidence: number
  processing_time: number
  image_path: string | null
}

interface RiskResult {
  status: string
  Detect1: string
  Detect2: string
  Risk_Level: string
  Potential_Disease: string
  Recommendation: string
  processing_time: number
  saved: boolean
}

// ─────────────────────────────────────────────
// Config  ← เปลี่ยน BASE_URL ให้ตรงกับ backend
// ─────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ─────────────────────────────────────────────
// Form Options (ตรงกับ VALID_* ใน backend)
// ─────────────────────────────────────────────
const PAIN_OPTIONS = [
  { value: 'ปกติ/ปวดเล็กน้อย', label: '😊 ปกติ / ปวดเล็กน้อย' },
  { value: 'ปวดปานกลาง',       label: '😐 ปวดปานกลาง' },
  { value: 'ปวดรุนแรง',        label: '😣 ปวดรุนแรง' },
]

const DURATION_OPTIONS = [
  { value: '1-7 วัน',       label: '📅 1–7 วัน' },
  { value: 'มากกว่า 7 วัน', label: '📅 มากกว่า 7 วัน' },
]

const SIZE_OPTIONS = [
  { value: 'เล็กกว่าเหรียญสิบ', label: '🪙 เล็กกว่าเหรียญสิบบาท' },
  { value: 'ใหญ่กว่าเหรียญสิบ', label: '🩸 ใหญ่กว่าเหรียญสิบบาท' },
]

// ─────────────────────────────────────────────
// Risk colour map
// ─────────────────────────────────────────────
const RISK_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  ปกติ:         { bg: '#f0fdf4', border: '#86efac', text: '#15803d', badge: '#dcfce7' },
  เสี่ยงปานกลาง: { bg: '#fffbeb', border: '#fcd34d', text: '#b45309', badge: '#fef3c7' },
  เสี่ยงสูง:    { bg: '#fff1f2', border: '#fda4af', text: '#be123c', badge: '#ffe4e6' },
  ฉุกเฉิน:      { bg: '#fdf2f8', border: '#f0abfc', text: '#86198f', badge: '#fae8ff' },
}
const DEFAULT_RC = { bg: '#f0fdf4', border: '#86efac', text: '#15803d', badge: '#dcfce7' }

// ─────────────────────────────────────────────
// Progress ring
// ─────────────────────────────────────────────
function ProgressRing({ score, color }: { score: number; color: string }) {
  const r    = 54
  const circ = 2 * Math.PI * r
  const [dash, setDash] = useState(circ)
  useEffect(() => {
    const t = setTimeout(() => setDash(circ - (score / 100) * circ), 300)
    return () => clearTimeout(t)
  }, [score, circ])
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="#f5e6ec" strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}
        fontFamily="'Mitr', sans-serif">{score}</text>
      <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#9e7a8a"
        fontFamily="'Sarabun', sans-serif">คะแนนความเสี่ยง</text>
    </svg>
  )
}

// ─────────────────────────────────────────────
// Analyzing screen
// ─────────────────────────────────────────────
function AnalyzingScreen() {
  const steps = [
    { label: 'ประมวลผลภาพ',        icon: '🔬' },
    { label: 'วิเคราะห์ลิ่มเลือด', icon: '🩸' },
    { label: 'ประเมินความเสี่ยง',  icon: '📊' },
    { label: 'สรุปผลการวิเคราะห์', icon: '✅' },
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => Math.min(a + 1, steps.length - 1)), 1200)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ textAlign: 'center', padding: '60px 40px' }}>
      <div style={{
        width:96, height:96, borderRadius:'50%', margin:'0 auto 32px',
        background:'linear-gradient(135deg,rgba(240,98,146,0.15),rgba(194,24,91,0.2))',
        border:'2px solid rgba(240,98,146,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:40, animation:'analyzePulse 1.5s ease-in-out infinite',
      }}>🔬</div>
      <h3 style={{ fontFamily:"'Mitr',sans-serif", fontSize:20, color:'#1a0a14', marginBottom:8 }}>
        กำลังวิเคราะห์...
      </h3>
      <p style={{ fontSize:13.5, color:'#9e7a8a', marginBottom:40 }}>
        AI กำลังประมวลผลข้อมูลของคุณ กรุณารอสักครู่
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:320, margin:'0 auto' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:12,
            padding:'12px 16px', borderRadius:12,
            background: i <= active ? 'rgba(194,24,91,0.06)' : '#f9f9f9',
            border:`1px solid ${i <= active ? 'rgba(194,24,91,0.2)' : '#f0f0f0'}`,
            transition:'all 0.4s ease',
          }}>
            <span style={{ fontSize:18 }}>{s.icon}</span>
            <span style={{
              fontFamily:"'Sarabun',sans-serif", fontSize:13.5,
              color: i <= active ? '#c2185b' : '#b0b0b0', flex:1, textAlign:'left',
            }}>{s.label}</span>
            {i < active  && <CheckCircle2 size={16} color="#c2185b" />}
            {i === active && <Loader2 size={16} color="#c2185b" style={{ animation:'spin 1s linear infinite' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Radio group helper
// ─────────────────────────────────────────────
function RadioGroup({
  options, value, onChange, name,
}: { options: {value:string;label:string}[]; value:string; onChange:(v:string)=>void; name:string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {options.map(opt => (
        <label key={opt.value} style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'11px 16px', borderRadius:12, cursor:'pointer',
          border:`1.5px solid ${value === opt.value ? '#f06292' : '#f5e6ec'}`,
          background: value === opt.value
            ? 'linear-gradient(135deg,rgba(252,228,236,0.6),rgba(248,187,208,0.3))'
            : '#faf7f5',
          transition:'all 0.18s',
        }}>
          <input type="radio" name={name} value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ display:'none' }} />
          <div style={{
            width:18, height:18, borderRadius:'50%', flexShrink:0,
            border:`2px solid ${value === opt.value ? '#f06292' : '#f5c6d8'}`,
            background: value === opt.value ? '#f06292' : '#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all 0.18s',
          }}>
            {value === opt.value && <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} />}
          </div>
          <span style={{
            fontFamily:"'Sarabun',sans-serif", fontSize:14,
            color: value === opt.value ? '#c2185b' : '#5a3a4a',
            fontWeight: value === opt.value ? 500 : 400,
          }}>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function AnalyzePage() {
  const router = useRouter()
  const [mounted,    setMounted]   = useState(false)
  const [step,       setStep]      = useState<Step>('upload')
  const [image,      setImage]     = useState<string | null>(null)
  const [imageFile,  setImageFile] = useState<File | null>(null)
  const [dragOver,   setDragOver]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [showLoginToast, setShowLoginToast] = useState(false)

  // symptom form state
  const [form, setForm] = useState<SymptomForm>({
    pain_level:   '',
    duration:     '',
    is_pregnant:  '',
    size:         '',
  })

  // API results
  const [imageResult,  setImageResult]  = useState<ImageResult | null>(null)
  const [riskResult,   setRiskResult]   = useState<RiskResult  | null>(null)
  const [apiError,     setApiError]     = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => { 
    setMounted(true) 
  }, [])

  // ── file helpers ──
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]; if (file) handleFile(file)
  }

  // ── form valid: บล็อกถ้า image API ยังไม่เสร็จ ──
  const formValid = (() => {
    if (imageLoading) return false
    if (!imageResult) return false
    if (apiError) return false
    if (!form.pain_level || !form.duration || !form.is_pregnant) return false
    if (imageResult?.ai_result === 'clot' && !form.size) return false
    return true
})()

  // ── Step 1→2: ส่งรูปไป /analysis/image พร้อมกับแสดง form ──
  const goToSymptoms = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setShowLoginToast(true)
        return
      }
      if (!imageFile) return
      setApiError(null)
      setImageLoading(true)
      setStep('symptoms')

      try {
        const fd = new FormData()
        fd.append('image', imageFile)
        const res = await fetch(`${BASE_URL}/analysis/image`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        })
        const data: ImageResult = await res.json()
        if (data.status !== 'success') {
          setApiError((data as any).msg ?? 'วิเคราะห์ภาพไม่สำเร็จ')
        } else {
          setImageResult(data)
          if (data.ai_result !== 'clot') setForm(f => ({ ...f, size: '' }))
        }
      } catch {
        setApiError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
      } finally {
        setImageLoading(false)
      }
    }


  // ── Step 3: analyzing → call /analysis/risk ──
  const runAnalysis = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setShowLoginToast(true)
        return
      }
      if (!formValid) return
      setStep('analyzing')
      setApiError(null)

      try {
        const fd = new FormData()
        fd.append('ai_result',    imageResult?.ai_result ?? 'none')
        fd.append('pain_level',   form.pain_level)
        fd.append('duration',     form.duration)
        fd.append('is_pregnant',  form.is_pregnant)
        fd.append('image_path',   imageResult?.image_path ?? '')
        if (imageResult?.ai_result === 'clot' && form.size) fd.append('size', form.size)

        const res = await fetch(`${BASE_URL}/analysis/risk`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        })
        const data: RiskResult = await res.json()
        if (data.status !== 'success') {
          setApiError((data as any).msg ?? 'ประเมินความเสี่ยงไม่สำเร็จ')
          setStep('symptoms')
        } else {
          setRiskResult(data)
          setStep('result')
        }
      } catch {
        setApiError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
        setStep('symptoms')
      }
    }

  // ── result helpers ──
  const rc = riskResult ? (RISK_COLORS[riskResult.Risk_Level] ?? DEFAULT_RC) : DEFAULT_RC
  const riskScore = riskResult ? ({
    ปกติ: 15, เสี่ยงปานกลาง: 50, เสี่ยงสูง: 75, ฉุกเฉิน: 95,
  }[riskResult.Risk_Level] ?? 30) : 0

  const resetAll = () => {
    setStep('upload'); setImage(null); setImageFile(null)
    setImageResult(null); setRiskResult(null); setApiError(null); setImageLoading(false)
    setForm({ pain_level:'', duration:'', is_pregnant:'', size:'' })
  }

  // ─────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        .analyze-root { min-height:100vh; font-family:'Sarabun',sans-serif; background:#faf7f5; overflow-x:hidden; }

        /* Header */
        .analyze-header { background:linear-gradient(135deg,#1a0a14 0%,#3d1a2e 50%,#6b2646 100%); padding:40px 40px 64px; position:relative; overflow:hidden; }
        .ah-circle-1 { position:absolute; width:360px; height:360px; top:-140px; right:-60px; border-radius:50%; background:radial-gradient(circle,rgba(244,143,177,0.18),transparent 60%); }
        .ah-circle-2 { position:absolute; width:220px; height:220px; bottom:-80px; left:15%; border-radius:50%; background:radial-gradient(circle,rgba(206,147,216,0.12),transparent 60%); }
        .ah-dots { position:absolute; inset:0; background-image:radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px); background-size:26px 26px; }
        .ah-arc { position:absolute; bottom:-1px; left:0; right:0; height:52px; background:#faf7f5; clip-path:ellipse(55% 100% at 50% 100%); }
        .ah-content { position:relative; z-index:2; max-width:700px; opacity:0; transform:translateY(20px); transition:opacity 0.7s ease,transform 0.7s ease; }
        .ah-content.visible { opacity:1; transform:translateY(0); }
        .ah-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:999px; background:rgba(240,98,146,0.18); border:1px solid rgba(240,98,146,0.35); font-family:'Mitr',sans-serif; font-size:11.5px; color:#f8bbd0; letter-spacing:0.5px; margin-bottom:16px; }
        .ah-title { font-family:'Mitr',sans-serif; font-weight:600; font-size:clamp(22px,3.5vw,34px); color:#fff; line-height:1.3; margin-bottom:10px; }
        .ah-title span { background:linear-gradient(135deg,#f48fb1,#f06292); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .ah-sub { font-size:14px; color:rgba(255,255,255,0.55); line-height:1.6; }

        /* Step bar */
        .step-bar { max-width:700px; margin:-20px auto 0; padding:0 40px; position:relative; z-index:10; }
        .step-track { display:flex; align-items:center; background:#fff; border-radius:16px; border:1px solid #f5e6ec; box-shadow:0 8px 32px rgba(194,24,91,0.1); padding:16px 24px; gap:0; }
        .step-node { display:flex; align-items:center; gap:10px; flex:1; }
        .step-circle { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Mitr',sans-serif; font-size:13px; font-weight:600; flex-shrink:0; transition:all 0.3s ease; }
        .step-circle.done { background:linear-gradient(135deg,#f06292,#c2185b); color:#fff; box-shadow:0 4px 12px rgba(194,24,91,0.35); }
        .step-circle.active { background:linear-gradient(135deg,#f06292,#c2185b); color:#fff; box-shadow:0 4px 16px rgba(194,24,91,0.45); animation:stepPulse 2s ease-in-out infinite; }
        .step-circle.idle { background:#f5e6ec; color:#c2a0b0; }
        @keyframes stepPulse { 0%,100%{box-shadow:0 4px 16px rgba(194,24,91,0.45)} 50%{box-shadow:0 4px 24px rgba(194,24,91,0.7)} }
        .step-label { font-family:'Mitr',sans-serif; font-size:12px; }
        .step-label-main { color:#1a0a14; }
        .step-label-sub { font-size:10.5px; color:#9e7a8a; font-family:'Sarabun',sans-serif; }
        .step-connector { width:32px; height:2px; border-radius:1px; background:#f5e6ec; flex-shrink:0; margin:0 4px; transition:background 0.3s ease; }
        .step-connector.done { background:linear-gradient(90deg,#f06292,#c2185b); }

        /* Main */
        .analyze-main { max-width:700px; margin:32px auto 60px; padding:0 40px; }
        .main-card { background:#fff; border-radius:24px; border:1px solid #f5e6ec; box-shadow:0 8px 40px rgba(194,24,91,0.08); overflow:hidden; }
        .card-section-title { display:flex; align-items:center; gap:10px; padding:28px 32px 0; }
        .cst-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#fce4ec,#f8bbd0); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .cst-text { font-family:'Mitr',sans-serif; font-size:16px; font-weight:600; color:#1a0a14; }
        .cst-sub { font-size:12.5px; color:#9e7a8a; font-family:'Sarabun',sans-serif; }

        /* Upload */
        .upload-zone { margin:20px 32px; border:2px dashed #f5c6d8; border-radius:18px; min-height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; cursor:pointer; background:#fdf9fb; transition:all 0.2s ease; position:relative; overflow:hidden; }
        .upload-zone:hover,.upload-zone.drag-over { border-color:#f06292; background:linear-gradient(135deg,rgba(252,228,236,0.4),rgba(248,187,208,0.2)); transform:scale(1.01); }
        .upload-zone-icon { width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg,#fce4ec,#f8bbd0); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 24px rgba(194,24,91,0.2); }
        .upload-zone-title { font-family:'Mitr',sans-serif; font-size:15px; color:#1a0a14; }
        .upload-zone-sub { font-size:12.5px; color:#9e7a8a; text-align:center; }
        .upload-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:999px; background:linear-gradient(135deg,#f06292,#c2185b); color:#fff; font-family:'Mitr',sans-serif; font-size:12.5px; font-weight:500; box-shadow:0 4px 16px rgba(194,24,91,0.35); }
        .img-preview { margin:20px 32px; border-radius:18px; overflow:hidden; position:relative; border:2px solid #f5e6ec; }
        .img-preview img { width:100%; max-height:280px; object-fit:cover; display:block; }
        .img-preview-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(26,10,20,0.5),transparent 50%); display:flex; align-items:flex-end; padding:16px; }
        .img-preview-tag { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.9); backdrop-filter:blur(8px); padding:6px 12px; border-radius:10px; font-family:'Mitr',sans-serif; font-size:12px; color:#c2185b; }
        .img-remove-btn { position:absolute; top:12px; right:12px; width:32px; height:32px; border-radius:50%; background:rgba(0,0,0,0.5); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.18s; }
        .img-remove-btn:hover { background:rgba(194,24,91,0.8); }

        /* Tip / error */
        .tip-box { margin:0 32px 28px; padding:14px 16px; border-radius:14px; background:rgba(240,98,146,0.06); border:1px solid rgba(240,98,146,0.18); display:flex; gap:10px; align-items:flex-start; }
        .tip-box-icon { color:#f06292; flex-shrink:0; margin-top:2px; }
        .tip-box-text { font-size:12.5px; color:#7a5a6a; line-height:1.6; }
        .tip-box-text strong { color:#c2185b; font-weight:600; }
        .error-box { margin:0 32px 20px; padding:14px 16px; border-radius:14px; background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.25); display:flex; gap:10px; align-items:flex-start; font-size:13px; color:#b91c1c; }

        /* Footer */
        .card-footer { padding:20px 32px 28px; display:flex; gap:12px; justify-content:flex-end; border-top:1px solid #f5e6ec; }
        .btn-primary { display:inline-flex; align-items:center; gap:8px; padding:12px 28px; border-radius:14px; border:none; background:linear-gradient(135deg,#f06292,#c2185b); color:#fff; font-family:'Mitr',sans-serif; font-size:14px; font-weight:500; cursor:pointer; box-shadow:0 6px 24px rgba(194,24,91,0.4); transition:transform 0.18s,box-shadow 0.18s; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(194,24,91,0.55); }
        .btn-primary:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
        .btn-ghost-sm { display:inline-flex; align-items:center; gap:6px; padding:12px 20px; border-radius:14px; border:1.5px solid #f5c6d8; background:transparent; font-family:'Mitr',sans-serif; font-size:13.5px; color:#c2185b; cursor:pointer; transition:background 0.18s; }
        .btn-ghost-sm:hover { background:rgba(194,24,91,0.06); }

        /* Symptom form */
        .symptom-form { padding:0 32px 8px; display:flex; flex-direction:column; gap:28px; }
        .sf-group {}
        .sf-label { display:flex; align-items:center; gap:8px; font-family:'Mitr',sans-serif; font-size:14px; font-weight:600; color:#1a0a14; margin-bottom:12px; }
        .sf-label svg { color:#c2185b; }

        /* Loading badge on symptom step */
        .ai-loading-badge { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:999px; background:rgba(194,24,91,0.08); border:1px solid rgba(194,24,91,0.2); font-family:'Mitr',sans-serif; font-size:12px; color:#c2185b; margin:0 32px 20px; }
        .ai-result-badge { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:999px; background:rgba(194,24,91,0.08); border:1px solid rgba(194,24,91,0.2); font-family:'Mitr',sans-serif; font-size:12px; color:#c2185b; margin:0 32px 20px; }

        /* Result */
        .result-risk-banner { margin:24px 32px; border-radius:18px; padding:24px; display:flex; align-items:center; gap:20px; border:1.5px solid; }
        .risk-info { flex:1; }
        .risk-label-tag { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:999px; font-family:'Mitr',sans-serif; font-size:11.5px; font-weight:500; margin-bottom:8px; }
        .risk-title { font-family:'Mitr',sans-serif; font-size:20px; font-weight:600; margin-bottom:6px; }
        .risk-desc { font-size:13px; color:#7a5a6a; line-height:1.6; }
        .result-detail { margin:0 32px 20px; background:#faf7f5; border-radius:16px; border:1px solid #f5e6ec; overflow:hidden; }
        .rd-row { display:flex; align-items:flex-start; gap:12px; padding:14px 18px; border-bottom:1px solid #f5e6ec; }
        .rd-row:last-child { border-bottom:none; }
        .rd-icon { width:32px; height:32px; border-radius:10px; background:linear-gradient(135deg,#fce4ec,#f8bbd0); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .rd-label { font-size:11.5px; color:#9e7a8a; margin-bottom:3px; }
        .rd-value { font-family:'Mitr',sans-serif; font-size:14px; font-weight:500; color:#1a0a14; }
        .suggestions-list { margin:0 32px 24px; display:flex; flex-direction:column; gap:10px; }
        .suggestion-item { display:flex; gap:10px; padding:14px 16px; border-radius:14px; background:#faf7f5; border:1px solid #f5e6ec; align-items:flex-start; }
        .suggestion-num { width:22px; height:22px; border-radius:7px; flex-shrink:0; background:linear-gradient(135deg,#f06292,#c2185b); display:flex; align-items:center; justify-content:center; font-family:'Mitr',sans-serif; font-size:11px; color:#fff; font-weight:600; }
        .suggestion-text { font-size:13.5px; color:#4a2a3a; line-height:1.6; }
        .disclaimer-box { margin:0 32px 28px; padding:12px 16px; border-radius:12px; background:rgba(240,98,146,0.05); border:1px solid rgba(240,98,146,0.15); display:flex; gap:8px; align-items:flex-start; font-size:12px; color:#9e7a8a; line-height:1.6; }
        .result-actions { margin:0 32px 32px; display:flex; gap:12px; }
        .btn-outline-full { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:13px; border-radius:14px; border:1.5px solid #f5c6d8; background:transparent; font-family:'Mitr',sans-serif; font-size:13.5px; color:#c2185b; cursor:pointer; transition:background 0.18s; }
        .btn-outline-full:hover { background:rgba(194,24,91,0.06); }
        .btn-primary-full { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:13px; border-radius:14px; border:none; background:linear-gradient(135deg,#f06292,#c2185b); font-family:'Mitr',sans-serif; font-size:13.5px; color:#fff; cursor:pointer; font-weight:500; box-shadow:0 6px 20px rgba(194,24,91,0.35); transition:transform 0.18s,box-shadow 0.18s; text-decoration:none; }
        .btn-primary-full:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(194,24,91,0.5); }

        /* Trust */
        .trust-strip { max-width:700px; margin:0 auto; padding:0 40px; display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .trust-item { background:#fff; border-radius:16px; border:1px solid #f5e6ec; padding:16px; display:flex; gap:10px; align-items:center; }
        .trust-icon { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#fce4ec,#f8bbd0); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .trust-label { font-family:'Mitr',sans-serif; font-size:12px; color:#1a0a14; line-height:1.4; }
        .trust-sub { font-size:11px; color:#9e7a8a; }

        /* Footer */
        .analyze-footer { background:#fff; border-top:1px solid #f5e6ec; padding:24px 40px; display:flex; align-items:center; justify-content:space-between; font-size:12.5px; color:#b09aa8; }

        @keyframes analyzePulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(240,98,146,0.3)} 50%{transform:scale(1.05);box-shadow:0 0 0 16px rgba(240,98,146,0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp 0.5s ease forwards; }

        @media(max-width:768px){
          .analyze-header{padding:28px 20px 52px}
          .step-bar{padding:0 20px}
          .analyze-main{padding:0 20px}
          .trust-strip{padding:0 20px;grid-template-columns:1fr}
          .card-section-title,.upload-zone,.img-preview,.tip-box,.error-box{margin-left:20px;margin-right:20px}
          .card-section-title{padding:20px 20px 0}
          .upload-zone,.img-preview{margin:16px 20px}
          .tip-box{margin:0 20px 20px}
          .card-footer{padding:16px 20px 20px;flex-direction:column}
          .symptom-form{padding:0 20px 8px}
          .ai-loading-badge,.ai-result-badge{margin:0 20px 16px}
          .result-risk-banner{margin:16px 20px}
          .result-detail,.suggestions-list,.disclaimer-box,.result-actions{margin-left:20px;margin-right:20px}
          .result-actions{flex-direction:column}
          .analyze-footer{flex-direction:column;gap:6px;text-align:center}
          .step-label-sub{display:none}
        }
      `}</style>

      <div className="analyze-root">
        <Navbar />

        {/* ── Header ── */}
        <div className="analyze-header">
          <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
            <div className="ah-circle-1" /><div className="ah-circle-2" /><div className="ah-dots" />
          </div>
          <div className={`ah-content ${mounted ? 'visible' : ''}`}>
            <div className="ah-badge"><Sparkles size={11} /> วิเคราะห์ด้วย AI</div>
            <h1 className="ah-title">วิเคราะห์<span>ลิ่มเลือด</span>ประจำเดือน</h1>
            <p className="ah-sub">อัปโหลดภาพถ่าย ระบุอาการ แล้วรับผลวิเคราะห์พร้อมคำแนะนำเฉพาะบุคคล</p>
          </div>
          <div className="ah-arc" />
        </div>

        {/* ── Step bar ── */}
        <div className="step-bar">
          <div className="step-track">
            {([
              { key:'upload',    num:1, main:'อัปโหลดภาพ',  sub:'ถ่ายหรือเลือกไฟล์' },
              { key:'symptoms',  num:2, main:'ระบุอาการ',    sub:'กรอกข้อมูล' },
              { key:'analyzing', num:3, main:'วิเคราะห์',    sub:'AI ประมวลผล' },
              { key:'result',    num:4, main:'ผลลัพธ์',      sub:'ดูรายงาน' },
            ] as const).map((s, i, arr) => {
              const order: Step[] = ['upload','symptoms','analyzing','result']
              const curIdx = order.indexOf(step)
              const myIdx  = i
              const state  = myIdx < curIdx ? 'done' : myIdx === curIdx ? 'active' : 'idle'
              return (
                <Fragment key={s.key}>
                  <div className="step-node">
                    <div className={`step-circle ${state}`}>
                      {state === 'done' ? <CheckCircle2 size={15}/> : s.num}
                    </div>
                    <div className="step-label">
                      <div className="step-label-main">{s.main}</div>
                      <div className="step-label-sub">{s.sub}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`step-connector ${myIdx < curIdx ? 'done':''}`} />
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* ── Main card ── */}
        <div className="analyze-main">
          <div className="main-card" style={{ marginTop:28 }}>

            {/* ══ STEP 1: Upload ══ */}
            {step === 'upload' && (
              <div className="fade-up">
                <div className="card-section-title">
                  <div className="cst-icon"><ImageIcon size={18} color="#c2185b"/></div>
                  <div>
                    <div className="cst-text">อัปโหลดภาพประจำเดือน</div>
                    <div className="cst-sub">รองรับ JPG, PNG ขนาดไม่เกิน 10MB</div>
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
                    <div className="upload-zone-icon"><Upload size={28} color="#c2185b"/></div>
                    <div className="upload-zone-title">ลากไฟล์มาวางหรือคลิกเพื่อเลือก</div>
                    <div className="upload-zone-sub">ภาพถ่ายผ้าอนามัย หรือรูปที่แสดงลิ่มเลือด<br/>คุณภาพดีจะให้ผลแม่นยำกว่า</div>
                    <div className="upload-chip"><Camera size={13}/> เลือกภาพ</div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                  </div>
                ) : (
                  <div className="img-preview">
                    <img src={image} alt="preview"/>
                    <div className="img-preview-overlay">
                      <div className="img-preview-tag">
                        <CheckCircle2 size={13} color="#c2185b"/> ภาพพร้อมวิเคราะห์
                      </div>
                    </div>
                    <button className="img-remove-btn" onClick={() => { setImage(null); setImageFile(null) }}>
                      <X size={14} color="#fff"/>
                    </button>
                  </div>
                )}

                <div className="tip-box" style={{ margin:'0 32px 28px' }}>
                  <Info size={15} className="tip-box-icon"/>
                  <div className="tip-box-text">
                    <strong>เคล็ดลับ:</strong> ถ่ายภาพในที่มีแสงสว่างเพียงพอ วางบนพื้นสีขาว
                    และถ่ายให้ชัดเจนเพื่อผลวิเคราะห์ที่แม่นยำที่สุด
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-primary" disabled={!image} onClick={goToSymptoms}>
                    ถัดไป: ระบุอาการ <ChevronRight size={15}/>
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 2: Symptoms ══ */}
            {step === 'symptoms' && (
              <div className="fade-up">
                <div className="card-section-title">
                  <div className="cst-icon"><Activity size={18} color="#c2185b"/></div>
                  <div>
                    <div className="cst-text">ระบุอาการ</div>
                    <div className="cst-sub">กรอกข้อมูลให้ครบเพื่อผลที่แม่นยำ</div>
                  </div>
                </div>

                <div style={{ height:16 }}/>

                {/* AI image status badge */}
                {!imageResult && !apiError && (
                  <div className="ai-loading-badge">
                    <Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/>
                    กำลังวิเคราะห์ภาพ...
                  </div>
                )}
                {imageResult && (
                  <div className="ai-result-badge">
                    <CheckCircle2 size={13}/>
                    ผลภาพ: <strong>{imageResult.detect_label}</strong>
                    &nbsp;(ความมั่นใจ {imageResult.confidence.toFixed(1)}%)
                  </div>
                )}
                {apiError && (
                  <div className="error-box" style={{ margin:'0 32px 16px' }}>
                    <AlertCircle size={15} style={{ flexShrink:0 }}/>
                    {apiError}
                  </div>
                )}

                <div className="symptom-form">
                  {/* pain level */}
                  <div className="sf-group">
                    <div className="sf-label"><Activity size={15}/> ระดับอาการปวด</div>
                    <RadioGroup name="pain" options={PAIN_OPTIONS} value={form.pain_level}
                      onChange={v => setForm(f => ({ ...f, pain_level:v }))} />
                  </div>

                  {/* duration */}
                  <div className="sf-group">
                    <div className="sf-label"><Clock size={15}/> ระยะเวลาที่มีเลือดออก</div>
                    <RadioGroup name="duration" options={DURATION_OPTIONS} value={form.duration}
                      onChange={v => setForm(f => ({ ...f, duration:v }))} />
                  </div>

                  {/* pregnant */}
                  <div className="sf-group">
                    <div className="sf-label"><Baby size={15}/> มีความเป็นไปได้ว่าตั้งครรภ์?</div>
                    <RadioGroup name="preg"
                      options={[
                        { value:'true',  label:'🤰 ใช่ / อาจเป็นไปได้' },
                        { value:'false', label:'🙅 ไม่ใช่ / ไม่ทราบ' },
                      ]}
                      value={form.is_pregnant}
                      onChange={v => setForm(f => ({ ...f, is_pregnant:v }))} />
                  </div>

                  {/* size — show only when ai_result === clot (or still loading) */}
                  {(!imageResult || imageResult.ai_result === 'clot') && (
                    <div className="sf-group">
                      <div className="sf-label">
                        <Ruler size={15}/>
                        ขนาดลิ่มเลือด
                        {!imageResult && <span style={{ fontSize:11, color:'#9e7a8a', fontWeight:400, marginLeft:6 }}>(กรอกไว้ก่อนหากพบลิ่มเลือด)</span>}
                      </div>
                      <RadioGroup name="size" options={SIZE_OPTIONS} value={form.size}
                        onChange={v => setForm(f => ({ ...f, size:v }))} />
                    </div>
                  )}
                </div>

                <div style={{ height:16 }}/>
                <div className="tip-box" style={{ margin:'0 32px 0' }}>
                  <AlertCircle size={15} className="tip-box-icon"/>
                  <div className="tip-box-text">
                    ข้อมูลทุกอย่างจะถูกใช้เพื่อการวิเคราะห์เท่านั้น
                    ไม่มีการแชร์ข้อมูลส่วนตัว
                  </div>
                </div>

                <div className="card-footer">
                  <button className="btn-ghost-sm" onClick={() => { setStep('upload'); setImageResult(null); setApiError(null) }}>
                    ← ย้อนกลับ
                  </button>
                  <button className="btn-primary" disabled={!formValid} onClick={runAnalysis}>
                    <Zap size={15}/> เริ่มวิเคราะห์
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 3: Analyzing ══ */}
            {step === 'analyzing' && <AnalyzingScreen/>}

            {/* ══ STEP 4: Result ══ */}
            {step === 'result' && riskResult && (
              <div className="fade-up">
                <div className="card-section-title">
                  <div className="cst-icon"><FlaskConical size={18} color="#c2185b"/></div>
                  <div>
                    <div className="cst-text">ผลการวิเคราะห์</div>
                    <div className="cst-sub">
                      ประมวลผลใน {((imageResult?.processing_time ?? 0) + riskResult.processing_time).toFixed(1)} วินาที
                    </div>
                  </div>
                </div>

                {/* Risk banner */}
                <div className="result-risk-banner" style={{ background:rc.bg, borderColor:rc.border }}>
                  <div style={{ flexShrink:0 }}>
                    <ProgressRing score={riskScore} color={rc.text}/>
                  </div>
                  <div className="risk-info">
                    <div className="risk-label-tag" style={{ background:rc.badge, color:rc.text }}>
                      {riskResult.Risk_Level === 'ฉุกเฉิน' ? '🚨' :
                       riskResult.Risk_Level === 'เสี่ยงสูง' ? '⚠️' :
                       riskResult.Risk_Level === 'เสี่ยงปานกลาง' ? '⚡' : '✅'}
                      &nbsp;{riskResult.Risk_Level}
                    </div>
                    <div className="risk-title" style={{ color:rc.text }}>{riskResult.Risk_Level}</div>
                    <div className="risk-desc">{riskResult.Potential_Disease}</div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding:'0 32px 12px' }}>
                  <div style={{ fontFamily:"'Mitr',sans-serif", fontSize:14, fontWeight:600, color:'#1a0a14', marginBottom:12 }}>
                    รายละเอียด
                  </div>
                </div>
                <div className="result-detail">
                  <div className="rd-row">
                    <div className="rd-icon">🩸</div>
                    <div>
                      <div className="rd-label">ผลการวิเคราะห์ภาพ (AI)</div>
                      <div className="rd-value">{riskResult.Detect1}</div>
                    </div>
                  </div>
                  <div className="rd-row">
                    <div className="rd-icon">🔬</div>
                    <div>
                      <div className="rd-label">รายละเอียดที่พบ</div>
                      <div className="rd-value">{riskResult.Detect2}</div>
                    </div>
                  </div>
                  {imageResult && (
                    <div className="rd-row">
                      <div className="rd-icon">📊</div>
                      <div>
                        <div className="rd-label">ความมั่นใจของ AI</div>
                        <div className="rd-value">{imageResult.confidence.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}
                  <div className="rd-row">
                    <div className="rd-icon">🎯</div>
                    <div>
                      <div className="rd-label">โรคที่อาจเกี่ยวข้อง</div>
                      <div className="rd-value">{riskResult.Potential_Disease}</div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{ padding:'16px 32px 12px' }}>
                  <div style={{ fontFamily:"'Mitr',sans-serif", fontSize:14, fontWeight:600, color:'#1a0a14', marginBottom:12 }}>
                    คำแนะนำ
                  </div>
                </div>
                <div className="suggestions-list">
                  {riskResult.Recommendation.split(/[·•]/).filter(Boolean).map((s, i) => (
                    <div key={i} className="suggestion-item">
                      <div className="suggestion-num">{i + 1}</div>
                      <div className="suggestion-text">{s.trim()}</div>
                    </div>
                  ))}
                  {/* fallback: if no · separator, show as single item */}
                  {!riskResult.Recommendation.includes('·') && !riskResult.Recommendation.includes('•') && (
                    <div className="suggestion-item" style={{ marginTop:-10 }}>
                      <div className="suggestion-num">→</div>
                      <div className="suggestion-text">{riskResult.Recommendation}</div>
                    </div>
                  )}
                </div>

                <div className="disclaimer-box">
                  <Shield size={14} color="#f06292" style={{ flexShrink:0, marginTop:2 }}/>
                  <span>
                    ผลการวิเคราะห์นี้เป็นเพียงการประเมินเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์
                    กรุณาปรึกษาแพทย์เพื่อการวินิจฉัยที่ถูกต้อง
                  </span>
                </div>

                <div className="result-actions">
                  <button className="btn-outline-full" onClick={resetAll}>วิเคราะห์ใหม่</button>
                  <a href="/home/articles" className="btn-primary-full">
                    อ่านบทความที่เกี่ยวข้อง <ArrowRight size={15}/>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Trust badges ── */}
        {(step === 'upload' || step === 'symptoms') && (
          <div className="trust-strip" style={{ marginBottom:48 }}>
            {[
              { icon:<Shield size={18} color="#c2185b"/>,   label:'ปลอดภัย',    sub:'ข้อมูลไม่ถูกแชร์' },
              { icon:<Zap size={18} color="#c2185b"/>,      label:'รวดเร็ว',     sub:'ผลภายใน 30 วินาที' },
              { icon:<Activity size={18} color="#c2185b"/>, label:'แม่นยำ',     sub:'วิเคราะห์ด้วย AI' },
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

        <footer className="analyze-footer">
          <span>© 2568 Lunar Day — ดูแลสุขภาพสตรีด้วยเทคโนโลยี</span>
          <span>นโยบายความเป็นส่วนตัว · ติดต่อเรา</span>
        </footer>
         <LoginToast
          show={showLoginToast}
          onClose={() => setShowLoginToast(false)}
        />
      </div>
    </>
  )
}