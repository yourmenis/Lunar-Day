'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, Calendar, AtSign, ChevronRight, ChevronLeft } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'ข้อมูลส่วนตัว', subtitle: 'บอกเราเกี่ยวกับคุณ' },
  { id: 2, title: 'ข้อมูลบัญชี', subtitle: 'สร้างบัญชีของคุณ' },
  { id: 3, title: 'ยืนยันตัวตน', subtitle: 'ตั้งรหัสผ่านให้ปลอดภัย' },
]


const THAI_MONTHS = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
]
const DOW = ['อา','จ','อ','พ','พฤ','ศ','ส']

function ThaiDatePicker({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  const today = new Date()
  const [open, setOpen] = useState(false)

  // parse stored value (YYYY-MM-DD) or default to today
  const parsed = value ? new Date(value) : null
  const initYear  = parsed ? parsed.getFullYear()  : today.getFullYear()
  const initMonth = parsed ? parsed.getMonth()      : today.getMonth()

  const [viewYear,  setViewYear]  = useState(initYear)
  const [viewMonth, setViewMonth] = useState(initMonth)

  // years: 100 years back to current (CE); displayed as BE (+543)
  const currentCE = today.getFullYear()
  const years = Array.from({ length: 51 }, (_, i) => currentCE - 50 + i)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay()

  const selectedDay   = parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth
    ? parsed.getDate() : null

  const selectDay = (d: number) => {
    const ce = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    onChange(ce)
    setOpen(false)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // display label in Thai (BE year)
  const displayLabel = parsed
    ? `${parsed.getDate()} ${THAI_MONTHS[parsed.getMonth()]} ${parsed.getFullYear() + 543}`
    : null

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className={`date-trigger${open ? ' open' : ''}${!displayLabel ? ' placeholder' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {displayLabel ?? 'วัน/เดือน/ปี (พ.ศ.)'}
      </button>

      {open && (
        <div className="dp-popup">
          {/* Month/Year selects */}
          <div className="dp-selects">
            <select
              className="dp-select"
              value={viewMonth}
              onChange={e => setViewMonth(Number(e.target.value))}
            >
              {THAI_MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select
              className="dp-select"
              value={viewYear}
              onChange={e => setViewYear(Number(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y + 543}</option>
              ))}
            </select>
          </div>

          {/* Header nav */}
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth}>‹</button>
            <span className="dp-title">
              {THAI_MONTHS[viewMonth]} {viewYear + 543}
            </span>
            <button type="button" className="dp-nav" onClick={nextMonth}>›</button>
          </div>

          {/* Day grid */}
          <div className="dp-grid">
            {DOW.map(d => (
              <div key={d} className="dp-dow">{d}</div>
            ))}
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`e${i}`} className="dp-day empty" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
              <button
                key={d}
                type="button"
                className={`dp-day${selectedDay === d ? ' selected' : ''}${
                  d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear() ? ' today' : ''
                }`}
                onClick={() => selectDay(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [stars, setStars] = useState<Array<React.CSSProperties>>([])

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    setMounted(true)
    setStars(
      Array.from({ length: 28 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        '--dur': `${2.5 + Math.random() * 4}s`,
        '--delay': `${Math.random() * 4}s`,
        '--bright': `${0.4 + Math.random() * 0.6}`,
        width: `${Math.random() > 0.7 ? 4 : 2}px`,
        height: `${Math.random() > 0.7 ? 4 : 2}px`,
      } as React.CSSProperties))
    )
  }, [])

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  const nextStep = () => {
    if (step < 3) {
      setAnimating(true)
      setTimeout(() => {
        setStep(s => s + 1)
        setAnimating(false)
      }, 220)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setAnimating(true)
      setTimeout(() => {
        setStep(s => s - 1)
        setAnimating(false)
      }, 220)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed || loading) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    router.push('/home/analyze')
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '13px 18px 13px 44px',
    borderRadius: '16px',
    fontFamily: "'Sarabun', sans-serif",
    fontSize: '14.5px',
    color: '#fff',
    outline: 'none',
    background: 'rgba(255,255,255,0.08)',
    border: '1.5px solid rgba(255,255,255,0.16)',
    transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signup-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Sarabun', sans-serif;
          background-color: #0d0a1a;
          padding: 24px 20px;
        }

        .bg-image {
          position: absolute;
          inset: 0;
          background-image: url('/bg-login.png');
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(8, 5, 25, 0.72) 0%,
            rgba(30, 10, 50, 0.65) 40%,
            rgba(80, 20, 60, 0.55) 100%
          );
          z-index: 1;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2;
          filter: blur(60px);
        }
        .orb-1 {
          width: 520px; height: 520px;
          top: -180px; right: -160px;
          background: radial-gradient(circle, rgba(220, 80, 150, 0.28), transparent 65%);
        }
        .orb-2 {
          width: 400px; height: 400px;
          bottom: -140px; left: -100px;
          background: radial-gradient(circle, rgba(100, 60, 200, 0.25), transparent 65%);
        }
        .orb-3 {
          width: 240px; height: 240px;
          top: 30%; left: 8%;
          background: radial-gradient(circle, rgba(255, 160, 200, 0.12), transparent 70%);
        }

        .stars {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          pointer-events: none;
        }
        .star {
          position: absolute;
          width: 3px; height: 3px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle var(--dur, 4s) ease-in-out infinite var(--delay, 0s);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: var(--bright, 0.7); transform: scale(1); }
        }

        /* ── Moon ── */
        .moon-motif {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px; height: 56px;
          z-index: 20;
        }
        .moon-circle {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: linear-gradient(145deg, #fde8c8, #f7b3d0, #e078b8);
          box-shadow: 0 0 24px rgba(247, 160, 190, 0.7), 0 0 48px rgba(220, 100, 160, 0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
        }

        /* ── Card ── */
        .card-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 60px 36px 36px;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.55),
            0 0 0 0.5px rgba(255,255,255,0.06) inset,
            0 1px 0 rgba(255,255,255,0.20) inset;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .card-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .card-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 50%);
          pointer-events: none;
        }

        /* ── Header text ── */
        .app-name {
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 190, 210, 0.75);
          text-align: center;
          margin-bottom: 6px;
        }
        .headline {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 24px;
          color: #fff;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .subheadline {
          font-size: 12.5px;
          color: rgba(255,200,215,0.6);
          text-align: center;
          margin-top: 4px;
          margin-bottom: 24px;
        }

        /* ── Step indicators ── */
        .step-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 28px;
        }
        .step-dot {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Mitr', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .step-dot.active {
          background: linear-gradient(135deg, #e8639a, #c83880);
          color: #fff;
          box-shadow: 0 4px 16px rgba(210, 50, 120, 0.5);
        }
        .step-dot.done {
          background: rgba(232, 99, 154, 0.25);
          color: rgba(255, 180, 200, 0.9);
          border: 1.5px solid rgba(232, 99, 154, 0.5);
        }
        .step-dot.inactive {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.3);
          border: 1.5px solid rgba(255,255,255,0.12);
        }
        .step-line {
          width: 48px; height: 1.5px;
          transition: background 0.3s ease;
        }
        .step-line.done { background: rgba(232, 99, 154, 0.4); }
        .step-line.inactive { background: rgba(255,255,255,0.1); }

        /* ── Fields ── */
        .field-wrap {
          position: relative;
          margin-bottom: 14px;
        }
        .field-label {
          display: block;
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(255,200,215,0.75);
          margin-bottom: 6px;
          margin-left: 4px;
          letter-spacing: 0.5px;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          bottom: 13px;
          opacity: 0.45;
          pointer-events: none;
          color: white;
        }
        .field-input {
          width: 100%;
          padding: 13px 18px 13px 44px;
          border-radius: 16px;
          font-family: 'Sarabun', sans-serif;
          font-size: 14.5px;
          color: #fff;
          outline: none;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.16);
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.35); }
        .field-input:focus {
          background: rgba(255,255,255,0.13);
          border-color: rgba(240, 120, 170, 0.7);
          box-shadow: 0 0 0 4px rgba(220, 80, 140, 0.15);
        }

        .pw-toggle {
          position: absolute;
          right: 16px;
          bottom: 13px;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.5;
          color: white;
          padding: 0;
          display: flex;
          align-items: center;
          transition: opacity 0.2s;
        }
        .pw-toggle:hover { opacity: 1; }

        /* ── Two-col grid ── */
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ── Step content ── */
        .step-content {
          transition: opacity 0.22s ease, transform 0.22s ease;
        }
        .step-content.exit {
          opacity: 0;
          transform: translateX(-16px);
        }

        /* ── Checkbox ── */
        .checkbox-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 6px;
          margin-bottom: 18px;
        }
        .checkbox-btn {
          flex-shrink: 0;
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          padding: 0;
          margin-top: 1px;
        }
        .checkbox-btn.checked {
          border-color: rgba(255,180,200,0.9);
          background: rgba(255,180,200,0.15);
        }
        .checkbox-inner {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f06292, #e91e8c);
        }
        .checkbox-text {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
        }
        .checkbox-link {
          color: rgba(255, 180, 200, 0.9);
          cursor: pointer;
        }

        /* ── Nav buttons ── */
        .btn-row {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .btn-back {
          flex: 0 0 auto;
          width: 48px; height: 48px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.18s;
        }
        .btn-back:hover {
          background: rgba(255,255,255,0.12);
          transform: translateX(-2px);
        }
        .btn-next, .btn-submit {
          flex: 1;
          height: 48px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.5px;
          color: #fff;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #e8639a 0%, #c83880 50%, #a0206a 100%);
          box-shadow: 0 6px 28px rgba(210, 50, 120, 0.55), 0 1px 0 rgba(255,255,255,0.2) inset;
          transition: transform 0.18s, box-shadow 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .btn-next:hover, .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(210, 50, 120, 0.65), 0 1px 0 rgba(255,255,255,0.2) inset;
        }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-next::before, .btn-submit::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease;
        }
        .btn-next:hover::before, .btn-submit:hover:not(:disabled)::before { left: 160%; }

        /* ── Spinner ── */
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.12); }
        .divider-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,180,200,0.45); }

        /* ── Footer ── */
        .footer-row {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin-top: 20px;
        }
        .login-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Mitr', sans-serif;
          font-size: 13px;
          color: rgba(255, 180, 200, 0.9);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255,180,200,0.35);
          margin-left: 4px;
          transition: color 0.2s;
          padding: 0;
        }
        .login-btn:hover { color: #fff; }

        /* ── Thai Date Picker ── */
        .date-trigger {
          width: 100%;
          padding: 13px 18px 13px 44px;
          border-radius: 16px;
          font-family: 'Sarabun', sans-serif;
          font-size: 14.5px;
          color: #fff;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.16);
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
        }
        .date-trigger:hover, .date-trigger.open {
          background: rgba(255,255,255,0.13);
          border-color: rgba(240, 120, 170, 0.7);
          box-shadow: 0 0 0 4px rgba(220, 80, 140, 0.15);
        }
        .date-trigger.placeholder { color: rgba(255,255,255,0.35); }

        .dp-popup {
          position: absolute;
          top: calc(100% + 8px);
          left: 0; right: 0;
          z-index: 100;
          background: rgba(30, 10, 50, 0.97);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 14px;
          padding: 10px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.65);
          animation: dpFadeIn 0.18s ease;
        }
        @keyframes dpFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dp-selects {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }
        .dp-select {
          flex: 1;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 8px;
          color: white;
          font-family: 'Sarabun', sans-serif;
          font-size: 11px;
          padding: 4px 6px;
          outline: none;
          cursor: pointer;
          text-align: center;
        }
        .dp-select option { background: #1e0a32; color: white; }

        .dp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .dp-nav {
          width: 22px; height: 22px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          transition: background 0.15s;
        }
        .dp-nav:hover { background: rgba(255,255,255,0.14); }
        .dp-title {
          font-family: 'Mitr', sans-serif;
          font-size: 11px;
          color: rgba(255,200,215,0.9);
          font-weight: 500;
        }

        .dp-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .dp-dow {
          text-align: center;
          font-size: 9px;
          color: rgba(255,180,200,0.55);
          padding: 2px 0;
          font-family: 'Mitr', sans-serif;
        }
        .dp-day {
          aspect-ratio: 1;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
          border-radius: 5px;
          cursor: pointer;
          color: rgba(255,255,255,0.8);
          transition: background 0.15s;
          background: none;
          border: none;
          font-family: 'Sarabun', sans-serif;
        }
        .dp-day:hover:not(.empty):not(.selected) { background: rgba(255,255,255,0.1); }
        .dp-day.today { color: rgba(255,180,200,1); font-weight: 700; }
        .dp-day.selected {
          background: linear-gradient(135deg, #e8639a, #c83880);
          color: #fff;
          font-weight: 600;
        }
        .dp-day.empty { pointer-events: none; }
      `}</style>

      <div className="signup-root">
        <div className="bg-image" />
        <div className="bg-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="stars">
          {stars.map((style, i) => (
            <div key={i} className="star" style={style} />
          ))}
        </div>

        <div className={`card-wrap ${mounted ? 'visible' : ''}`}>
          {/* Moon */}
          <div className="moon-motif">
            <div className="moon-circle">🌙</div>
          </div>

          <p className="app-name">Lunar Day</p>
          <h1 className="headline">สมัครสมาชิก</h1>
          <p className="subheadline">{STEPS[step - 1].subtitle}</p>

          {/* Step indicators */}
          <div className="step-row">
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`step-dot ${step === s.id ? 'active' : step > s.id ? 'done' : 'inactive'}`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-line ${step > s.id ? 'done' : 'inactive'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── Step 1: Personal Info ── */}
            <div className={`step-content ${animating ? 'exit' : ''}`} style={{ display: step === 1 ? 'block' : 'none' }}>
              <div className="grid-2">
                <div className="field-wrap">
                  <label className="field-label">ชื่อ</label>
                  <User className="field-icon" size={16} />
                  <input
                    type="text"
                    className="field-input"
                    placeholder="ชื่อจริง"
                    value={form.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                  />
                </div>
                <div className="field-wrap">
                  <label className="field-label">นามสกุล</label>
                  <User className="field-icon" size={16} />
                  <input
                    type="text"
                    className="field-input"
                    placeholder="นามสกุล"
                    value={form.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="field-wrap">
                <label className="field-label">วันเกิด</label>
                <Calendar className="field-icon" size={16} style={{ pointerEvents: 'none' }} />
                <ThaiDatePicker
                  value={form.birthDate}
                  onChange={v => handleChange('birthDate', v)}
                />
              </div>

              <div className="btn-row" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-next" onClick={nextStep}>
                  ถัดไป <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* ── Step 2: Account Info ── */}
            <div className={`step-content ${animating ? 'exit' : ''}`} style={{ display: step === 2 ? 'block' : 'none' }}>
              <div className="field-wrap">
                <label className="field-label">อีเมล</label>
                <Mail className="field-icon" size={16} />
                <input
                  type="email"
                  className="field-input"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>
              <div className="field-wrap">
                <label className="field-label">ชื่อผู้ใช้</label>
                <AtSign className="field-icon" size={16} />
                <input
                  type="text"
                  className="field-input"
                  placeholder="username"
                  value={form.username}
                  onChange={e => handleChange('username', e.target.value)}
                />
              </div>

              <div className="btn-row" style={{ marginTop: '20px' }}>
                <button type="button" className="btn-back" onClick={prevStep}>
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  ถัดไป <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* ── Step 3: Password ── */}
            <div className={`step-content ${animating ? 'exit' : ''}`} style={{ display: step === 3 ? 'block' : 'none' }}>
              <div className="field-wrap">
                <label className="field-label">รหัสผ่าน</label>
                <Lock className="field-icon" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="field-input"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              <div className="field-wrap">
                <label className="field-label">ยืนยันรหัสผ่าน</label>
                <Lock className="field-icon" size={16} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="field-input"
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                  value={form.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              {/* Agreement */}
              <div className="checkbox-row">
                <button
                  type="button"
                  className={`checkbox-btn ${agreed ? 'checked' : ''}`}
                  onClick={() => setAgreed(v => !v)}
                >
                  {agreed && <div className="checkbox-inner" />}
                </button>
                <p className="checkbox-text">
                  ฉันยอมรับ{' '}
                  <span className="checkbox-link">เงื่อนไขการใช้งาน</span>
                  {' '}และ{' '}
                  <span className="checkbox-link">นโยบายความเป็นส่วนตัว</span>
                  {' '}และยืนยันว่ามีอายุครบ 13 ปีบริบูรณ์
                </p>
              </div>

              <div className="btn-row">
                <button type="button" className="btn-back" onClick={prevStep}>
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={!agreed || loading}
                >
                  {loading ? (
                    <><div className="spinner" /> กำลังสมัคร...</>
                  ) : (
                    'สมัครสมาชิก'
                  )}
                </button>
              </div>
            </div>
          </form>

          <p className="footer-row">
            มีบัญชีแล้ว?
            <button className="login-btn" onClick={() => router.push('/login')}>
              เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>
    </>
  )
}