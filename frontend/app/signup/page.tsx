'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Lock, Calendar, AtSign, ChevronRight, ChevronLeft } from 'lucide-react'
import './signup.css'
import Image from 'next/image'
import { SIGNUP_SUCCESS_KEY, useToast } from '../components/Toast'
import { postJson } from '../lib/postJson'
import { ageFrom, parseYmd } from '../lib/birthDate'
import { PASSWORD_MAX, PASSWORD_PLACEHOLDER, USERNAME_MAX, passwordRuleError, usernameError } from '../lib/authRules'
import { PRIVACY_TEXT, TERMS_INTRO, TERMS_TEXT } from '../lib/policyText'
import PolicyBody from '../components/PolicyBody'

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

// รูปแบบเดียวกับที่ backend ตรวจ (routes/auth.py)
const EMAIL_PATTERN = /^[\w.-]+@[\w.-]+\.\w+$/

  function ThaiDatePicker({
    value, onChange,
  }: { value: string; onChange: (v: string) => void }) {
    const today = new Date()
    const [open, setOpen] = useState(false)
    const wrapRef = useRef<HTMLDivElement>(null)

    // ปิดปฏิทินเมื่อคลิกนอกกรอบ
    useEffect(() => {
      if (!open) return
      const onDown = (e: MouseEvent | TouchEvent) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', onDown)
      document.addEventListener('touchstart', onDown)
      return () => {
        document.removeEventListener('mousedown', onDown)
        document.removeEventListener('touchstart', onDown)
      }
    }, [open])

    const parsed = parseYmd(value)
    const initYear  = parsed ? parsed.getFullYear()  : today.getFullYear()
    const initMonth = parsed ? parsed.getMonth()      : today.getMonth()

    const [viewYear,  setViewYear]  = useState(initYear)
    const [viewMonth, setViewMonth] = useState(initMonth)

    const currentCE = today.getFullYear()
    const years = Array.from({ length: 101 }, (_, i) => currentCE - 100 + i)

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const firstDow    = new Date(viewYear, viewMonth, 1).getDay()

    const selectedDay = parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth
      ? parsed.getDate() : null

    // วันในอนาคตเลือกไม่ได้
    const isFuture = (d: number) => new Date(viewYear, viewMonth, d) > today

    const selectDay = (d: number) => {
      if (isFuture(d)) return
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

    const displayLabel = parsed
      ? `${parsed.getDate()} ${THAI_MONTHS[parsed.getMonth()]} ${parsed.getFullYear() + 543}`
      : null

    return (
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <button
          type="button"
          className={`date-trigger${open ? ' open' : ''}${!displayLabel ? ' placeholder' : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          {displayLabel ?? 'วัน/เดือน/ปี (พ.ศ.)'}
        </button>

        {open && (
          <div className="dp-popup">
            {/* Month / Year selects */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <select
                className="dp-select"
                value={viewMonth}
                onChange={e => setViewMonth(Number(e.target.value))}
                style={{ display: 'block' }}
              >
                {THAI_MONTHS.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <select
                className="dp-select"
                value={viewYear}
                onChange={e => setViewYear(Number(e.target.value))}
                style={{ display: 'block' }}
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
                  disabled={isFuture(d)}
                  style={isFuture(d) ? { opacity: 0.3, cursor: 'not-allowed' } : undefined}
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
  const showToast = useToast()
  const [policyDoc, setPolicyDoc] = useState<'terms' | 'privacy' | null>(null)

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
    // ตั้งค่าในเฟรมถัดไป (ไม่ setState ตรง ๆ ใน effect) — ผลที่ผู้ใช้เห็นเหมือนเดิม
    requestAnimationFrame(() => {
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
    })
  }, [])

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  // ตรวจข้อมูลของแต่ละขั้น คืนข้อความ error หรือ null ถ้าผ่าน
  const validateStep = (n: number): string | null => {
    if (n === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) return 'กรุณากรอกชื่อและนามสกุล'
      const birth = parseYmd(form.birthDate)
      if (!birth) return 'กรุณาเลือกวันเกิด'
      if (birth > new Date()) return 'วันเกิดต้องไม่เป็นวันในอนาคต'
      if (ageFrom(birth) < 13) return 'ผู้สมัครต้องมีอายุตั้งแต่ 13 ปีขึ้นไปจึงจะใช้งานได้'
    }
    if (n === 2) {
      if (!form.email.trim()) return 'กรุณากรอกอีเมล'
      if (!EMAIL_PATTERN.test(form.email.trim())) return 'รูปแบบอีเมลไม่ถูกต้อง'
      const nameErr = usernameError(form.username)
      if (nameErr) return nameErr
    }
    if (n === 3) {
      // backend ตัดช่องว่างหัว-ท้ายรหัสผ่านก่อนตรวจ จึงตรวจแบบเดียวกัน
      const pw = form.password.trim()
      if (!pw) return 'กรุณากรอกรหัสผ่าน'
      const pwErr = passwordRuleError(form.password)
      if (pwErr) return pwErr
      if (pw !== form.confirmPassword.trim()) return 'โปรดระบุรหัสผ่านทั้งสองช่องให้ตรงกัน'
      if (!agreed) return 'กรุณากดยอมรับเงื่อนไขและนโยบายความเป็นส่วนตัวก่อนดำเนินการต่อ'
    }
    return null
  }

  const goToStep = (target: number) => {
    if (target === step) return
    setAnimating(true)
    setTimeout(() => {
      setStep(target)
      setAnimating(false)
    }, 220)
  }

  const nextStep = () => {
    if (step >= 3) return
    const err = validateStep(step)
    if (err) { showToast(err, 'error'); return }
    goToStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) goToStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    // กด Enter ในขั้นที่ 1-2 → ไปขั้นถัดไปแทนการส่งฟอร์ม
    if (step < 3) { nextStep(); return }

    // ตรวจทุกขั้นอีกครั้ง ถ้าขั้นไหนผิดให้พากลับไปที่ขั้นนั้น
    for (const n of [1, 2, 3]) {
      const err = validateStep(n)
      if (err) { showToast(err, 'error'); goToStep(n); return }
    }

    setLoading(true)
    const result = await postJson('/auth/register', {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      birthDate: form.birthDate,
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      isConsent: agreed,
    })

    if (result.data && result.ok) {
      try { sessionStorage.setItem(SIGNUP_SUCCESS_KEY, '1') } catch {}
      router.push('/login')
      return
    }

    const msg = result.data ? (result.data.msg ?? 'สมัครสมาชิกไม่สำเร็จ') : result.error
    showToast(msg, 'error')
    // พากลับไปขั้นที่มีช่องผิด (ชื่อผู้ใช้/อีเมลซ้ำ → ขั้น 2, อายุ/วันที่ → ขั้น 1)
    if (/ชื่อผู้ใช้|อีเมล/.test(msg)) goToStep(2)
    else if (/อายุ|วันที่/.test(msg)) goToStep(1)
    setLoading(false)
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
          <div className="moon-motif" style={{ display: 'flex', justifyContent: 'center' }}>
            <Image 
              src="/logolunar.png" 
              alt="Lunar Day Logo" 
              width={80} 
              height={80}
              style={{ borderRadius: '50%' }}
            />
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

          <form onSubmit={handleSubmit} noValidate>
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
                  placeholder="อีเมลของผู้ใช้งาน"
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
                  placeholder="ชื่อผู้ใช้งาน"
                  value={form.username}
                  maxLength={USERNAME_MAX}
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
                  placeholder={PASSWORD_PLACEHOLDER}
                  value={form.password}
                  maxLength={PASSWORD_MAX}
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
                  maxLength={PASSWORD_MAX}
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
                  <span className="checkbox-link" role="button" tabIndex={0} style={{ cursor: 'pointer' }}
                    onClick={() => setPolicyDoc('terms')}
                    onKeyDown={e => e.key === 'Enter' && setPolicyDoc('terms')}>เงื่อนไขการใช้งาน</span>
                  {' '}และ{' '}
                  <span className="checkbox-link" role="button" tabIndex={0} style={{ cursor: 'pointer' }}
                    onClick={() => setPolicyDoc('privacy')}
                    onKeyDown={e => e.key === 'Enter' && setPolicyDoc('privacy')}>นโยบายความเป็นส่วนตัว</span>
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
                  disabled={loading}
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

      {policyDoc && (
        <div
          onClick={() => setPolicyDoc(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(26,10,20,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            role="dialog" aria-modal="true"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560,
              maxHeight: '85vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: "'Sarabun', sans-serif",
            }}
          >
            <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid #f5e6ec' }}>
              <p style={{ fontFamily: "'Mitr', sans-serif", fontSize: 17, fontWeight: 600, color: '#1a0a14' }}>
                {policyDoc === 'terms' ? 'ข้อตกลงเงื่อนไขการใช้งาน' : 'ประกาศนโยบายความเป็นส่วนตัว'}
              </p>
            </div>
            <div style={{ padding: '16px 24px', overflowY: 'auto' }}>
              {policyDoc === 'terms' && (
                <p style={{ fontSize: 13.5, color: '#5a3a4a', lineHeight: 1.8, marginBottom: 16 }}>{TERMS_INTRO}</p>
              )}
              {(policyDoc === 'terms' ? TERMS_TEXT : PRIVACY_TEXT).map((sec, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <p style={{ fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 600, color: '#c2185b', marginBottom: 6 }}>{sec.title}</p>
                  <PolicyBody paragraphs={sec.paragraphs} fontSize={13.5} />
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #f5e6ec', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setPolicyDoc(null)} style={{
                padding: '10px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #f06292, #c2185b)', color: '#fff',
                fontFamily: "'Mitr', sans-serif", fontSize: 14,
              }}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}