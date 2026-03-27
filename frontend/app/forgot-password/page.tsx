'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react'
import './forgot-password.css'

// ── Constants ──────────────────────────────────────────────────────────────
const OTP_LENGTH = 5
const OTP_EXPIRE_SECONDS = 5 * 60  // 5 minutes
const CIRCUMFERENCE = 2 * Math.PI * 14  // r=14

const STEPS = [
  { id: 1, label: 'อีเมล' },
  { id: 2, label: 'OTP'   },
  { id: 3, label: 'รหัส'  },
]

// ── Password strength helper ───────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' }
  let s = 0
  if (pw.length >= 8)   s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const labels = ['', 'อ่อน', 'พอใช้', 'ดี', 'แข็งแกร่ง']
  return { score: s, label: labels[s] }
}

// ── Star helper ───────────────────────────────────────────────────────────
function makeStars(n: number): React.CSSProperties[] {
  return Array.from({ length: n }).map(() => ({
    left: `${Math.random() * 100}%`,
    top:  `${Math.random() * 100}%`,
    '--dur':    `${2.5 + Math.random() * 4}s`,
    '--delay':  `${Math.random() * 4}s`,
    '--bright': `${0.4 + Math.random() * 0.6}`,
    width:  `${Math.random() > 0.7 ? 4 : 2}px`,
    height: `${Math.random() > 0.7 ? 4 : 2}px`,
  } as React.CSSProperties))
}

// ── OTP Input component ───────────────────────────────────────────────────
function OtpInput({
  value, onChange, hasError,
}: { value: string[]; onChange: (v: string[]) => void; hasError: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handleChange = (i: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[i] = char
    onChange(next)
    if (char && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? '')
    onChange(next)
    refs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus()
  }

  return (
    <div className="otp-row">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={`otp-box${value[i] ? ' filled' : ''}${hasError ? ' error' : ''}`}
          value={value[i] ?? ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}

// ── Timer component ───────────────────────────────────────────────────────
function CountdownTimer({
  seconds, onExpire,
}: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    setLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (left <= 0) { onExpire(); return }
    const id = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(id)
  }, [left, onExpire])

  const pct  = left / OTP_EXPIRE_SECONDS
  const dash = CIRCUMFERENCE * (1 - pct)
  const mm   = String(Math.floor(left / 60)).padStart(2, '0')
  const ss   = String(left % 60).padStart(2, '0')

  return (
    <div className="timer-ring-wrap">
      <div className="timer-ring">
        <svg width="36" height="36" viewBox="0 0 36 36">
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#e8639a" />
              <stop offset="100%" stopColor="#c83880" />
            </linearGradient>
          </defs>
          <circle className="timer-ring-bg" cx="18" cy="18" r="14"
            strokeWidth="2.5" fill="none" />
          <circle className="timer-ring-fg" cx="18" cy="18" r="14"
            strokeWidth="2.5" fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dash}
          />
        </svg>
      </div>
      <span className="timer-digits">{mm}:{ss}</span>
    </div>
  )
}

// ── Password strength bar ─────────────────────────────────────────────────
function StrengthBar({ password }: { password: string }) {
  const { score, label } = getStrength(password)
  if (!password) return null
  const levels = ['', 'weak', 'fair', 'good', 'strong']
  return (
    <div className="pw-strength">
      <div className="pw-strength-bars">
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className={`pw-bar${n <= score ? ' ' + levels[score] : ''}`}
          />
        ))}
      </div>
      <div className="pw-strength-label">{label}</div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const router = useRouter()
  const [mounted,   setMounted]   = useState(false)
  const [step,      setStep]      = useState(1)
  const [animating, setAnimating] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [stars,     setStars]     = useState<React.CSSProperties[]>([])

  // Step 1
  const [email,      setEmail]      = useState('')
  const [emailError, setEmailError] = useState('')

  // Step 2
  const [otp,       setOtp]       = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [otpError,  setOtpError]  = useState(false)
  const [expired,   setExpired]   = useState(false)
  const [timerKey,  setTimerKey]  = useState(0)

  // Step 3
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw,          setShowPw]          = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [pwError,         setPwError]         = useState('')

  // Step 4 (success)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setMounted(true)
    setStars(makeStars(28))
  }, [])

  // ── Transitions ──────────────────────────────────────────────────────────
  const goTo = (target: number) => {
    setAnimating(true)
    setTimeout(() => { setStep(target); setAnimating(false) }, 220)
  }

  // ── Step 1: send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRx.test(email)) {
      setEmailError('กรุณากรอกอีเมลให้ถูกต้อง')
      return
    }
    setEmailError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    goTo(2)
  }

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length < OTP_LENGTH) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    // Simulate wrong OTP with "00000"
    if (code === '00000') {
      setOtpError(true)
      setTimeout(() => setOtpError(false), 600)
      return
    }
    goTo(3)
  }

  const handleResend = () => {
    if (!expired) return
    setOtp(Array(OTP_LENGTH).fill(''))
    setExpired(false)
    setTimerKey(k => k + 1)
  }

  // ── Step 3: set new password ──────────────────────────────────────────────
  const handleSetPassword = async () => {
    if (password.length < 8) { setPwError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'); return }
    if (password !== confirmPassword) { setPwError('รหัสผ่านไม่ตรงกัน'); return }
    setPwError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    setLoading(false)
    setDone(true)
  }

  const canSubmitOtp = otp.join('').length === OTP_LENGTH && !expired

  return (
    <div className="fp-root">
      <div className="bg-image" />
      <div className="bg-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="stars">
        {stars.map((s, i) => <div key={i} className="star" style={s} />)}
      </div>

      <div className={`card-wrap ${mounted ? 'visible' : ''}`}>
        {/* Moon */}
        <div className="moon-motif">
          <div className="moon-circle">🌙</div>
        </div>

        <p className="app-name">Lunar Day</p>

        {done ? (
          /* ── Success ── */
          <div className="success-wrap">
            <h1 className="headline" style={{ marginBottom: 20 }}>เปลี่ยนรหัสผ่านสำเร็จ</h1>
            <div className="success-icon">✨</div>
            <p className="success-title">พร้อมใช้งานแล้ว!</p>
            <p className="success-sub">รหัสผ่านใหม่ของคุณถูกบันทึกเรียบร้อยแล้ว<br />สามารถเข้าสู่ระบบได้ทันที</p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => router.push('/login')}>
              เข้าสู่ระบบ <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <h1 className="headline">
              {step === 1 ? 'ลืมรหัสผ่าน' : step === 2 ? 'กรอกรหัส OTP' : 'ตั้งรหัสผ่านใหม่'}
            </h1>
            <p className="subheadline">
              {step === 1
                ? 'กรอกอีเมลที่ใช้ลงทะเบียน เพื่อรับรหัสยืนยัน'
                : step === 2
                ? 'รหัส OTP ถูกส่งไปยังอีเมลของคุณ'
                : 'ตั้งรหัสผ่านใหม่ที่ปลอดภัย'}
            </p>

            {/* Step indicators */}
            <div className="step-progress">
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

            {/* ── Step 1 ── */}
            <div
              className={`step-content${animating ? ' exit' : ''}`}
              style={{ display: step === 1 ? 'block' : 'none' }}
            >
              <div className="field-wrap">
                <label className="field-label">อีเมล</label>
                <Mail className="field-icon" size={16} />
                <input
                  type="email"
                  className={`field-input${emailError ? ' error' : ''}`}
                  placeholder="example@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                />
                {emailError && <p className="field-hint err">{emailError}</p>}
              </div>

              <div className="btn-row" style={{ marginTop: 20 }}>
                <button type="button" className="btn-primary" onClick={handleSendOtp} disabled={loading || !email}>
                  {loading ? <><div className="spinner" /> กำลังส่ง...</> : <>ส่งรหัส OTP <ChevronRight size={16} /></>}
                </button>
              </div>
            </div>

            {/* ── Step 2 ── */}
            <div
              className={`step-content${animating ? ' exit' : ''}`}
              style={{ display: step === 2 ? 'block' : 'none' }}
            >
              <div className="email-badge">
                <p className="email-sent-label">รหัส OTP ถูกส่งไปยังอีเมล</p>
                <span className="email-value">{email || 'your@email.com'}</span>
                <p className="email-note">รหัส OTP ของคุณมีอายุ 5 นาที<br />หลังจากที่คุณได้รับรหัส</p>
              </div>

              <p className="field-label" style={{ textAlign: 'center', marginBottom: 0 }}>ระบุรหัส OTP</p>
              <OtpInput value={otp} onChange={setOtp} hasError={otpError} />

              {/* Countdown */}
              <CountdownTimer
                key={timerKey}
                seconds={OTP_EXPIRE_SECONDS}
                onExpire={() => setExpired(true)}
              />

              <div className="btn-row" style={{ marginTop: 16 }}>
                <button type="button" className="btn-back" onClick={() => goTo(1)}>
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleVerifyOtp}
                  disabled={!canSubmitOtp || loading}
                >
                  {loading ? <><div className="spinner" /> กำลังตรวจสอบ...</> : <>ยืนยัน OTP <ChevronRight size={16} /></>}
                </button>
              </div>

              <div className="timer-row" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className={`timer-resend ${expired ? 'active' : 'disabled'}`}
                  onClick={handleResend}
                  disabled={!expired}
                >
                  {expired ? 'ส่ง OTP อีกครั้ง' : `รหัส OTP หมดอายุแล้ว กด "ส่ง OTP อีกครั้ง"`}
                </button>
              </div>
            </div>

            {/* ── Step 3 ── */}
            <div
              className={`step-content${animating ? ' exit' : ''}`}
              style={{ display: step === 3 ? 'block' : 'none' }}
            >
              <div className="field-wrap">
                <label className="field-label">รหัสผ่านใหม่</label>
                <Lock className="field-icon" size={16} />
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`field-input${pwError ? ' error' : ''}`}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPwError('') }}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                  {showPw ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <StrengthBar password={password} />
                <p className="field-hint">รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
              </div>

              <div className="field-wrap">
                <label className="field-label">ยืนยันรหัสผ่านใหม่</label>
                <Lock className="field-icon" size={16} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`field-input${pwError === 'รหัสผ่านไม่ตรงกัน' ? ' error' : ''}`}
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setPwError('') }}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {pwError && <p className="field-hint err">{pwError}</p>}
              </div>

              <div className="btn-row" style={{ marginTop: 8 }}>
                <button type="button" className="btn-back" onClick={() => goTo(2)}>
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSetPassword}
                  disabled={!password || !confirmPassword || loading}
                >
                  {loading ? <><div className="spinner" /> กำลังบันทึก...</> : 'บันทึกรหัสผ่าน'}
                </button>
              </div>
            </div>
          </>
        )}

        <p className="footer-row">
          จำรหัสผ่านได้แล้ว?
          <button className="text-btn" onClick={() => router.push('/login')}>
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  )
}