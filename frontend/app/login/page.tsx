'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import './login.css'


export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [stars, setStars] = useState<Array<React.CSSProperties>>([])

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    router.push('/home/analyze')
  }

  return (
    <>

      <div className="login-root">
        <div className="bg-image" />
        <div className="bg-overlay" />

        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Stars — rendered only after mount to avoid hydration mismatch */}
        <div className="stars">
          {stars.map((style, i) => (
            <div key={i} className="star" style={style} />
          ))}
        </div>

        <div className={`card-wrap ${mounted ? 'visible' : ''}`}>

          <div className="moon-motif">
            <div className="moon-circle">🌙</div>
          </div>

          <p className="app-name">Lunar Day</p>
          <h1 className="headline">เข้าสู่ระบบ</h1>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line" />
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="field-wrap">
                <label className="field-label">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  className={`field-input ${username ? 'has-value' : ''}`}
                  placeholder="กรอกชื่อผู้ใช้ของคุณ"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                />
              </div>

              <div className="field-wrap">
                <label className="field-label">รหัสผ่าน</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`field-input ${password ? 'has-value' : ''}`}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    style={{ paddingRight: '44px' }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="forgot-row">
              <button type="button" className="forgot-btn" onClick={() => router.push('/forgot-password')}>ลืมรหัสผ่าน?</button>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="sep">
            <div className="sep-line" />
            <span className="sep-text">หรือ</span>
            <div className="sep-line" />
          </div>

          <p className="signup-row">
            ยังไม่มีบัญชี?
            <button className="signup-btn" onClick={() => router.push('/signup')}>
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </div>
    </>
  )
}