'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, Calendar, AtSign, ChevronRight, ChevronLeft } from 'lucide-react'
import './signup.css'

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