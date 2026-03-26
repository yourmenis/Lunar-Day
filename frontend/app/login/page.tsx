'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Sarabun', sans-serif;
          background-color: #0d0a1a;
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

        .card-wrap {
          position: relative;
          z-index: 10;
          width: calc(100% - 40px);
          max-width: 400px;
          padding: 60px 36px 40px;
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
          font-size: 26px;
          color: #fff;
          text-align: center;
          margin-bottom: 32px;
          letter-spacing: 0.5px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.15);
        }
        .divider-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,180,200,0.5);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 12px;
        }
        .field-wrap {
          position: relative;
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
        .field-input {
          width: 100%;
          padding: 13px 18px;
          border-radius: 16px;
          font-family: 'Sarabun', sans-serif;
          font-size: 14.5px;
          color: #fff;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.16);
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.38);
        }
        .field-input:focus {
          background: rgba(255,255,255,0.13);
          border-color: rgba(240, 120, 170, 0.7);
          box-shadow: 0 0 0 4px rgba(220, 80, 140, 0.15);
        }
        .field-input.has-value {
          border-color: rgba(255,255,255,0.22);
        }
        .pw-toggle {
          position: absolute;
          right: 16px;
          bottom: 13px;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.55;
          color: white;
          padding: 0;
          display: flex;
          align-items: center;
          transition: opacity 0.2s;
        }
        .pw-toggle:hover { opacity: 1; }

        .forgot-row {
          text-align: right;
          margin-bottom: 22px;
          margin-top: 4px;
        }
        .forgot-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Sarabun', sans-serif;
          font-size: 12px;
          color: rgba(255, 200, 215, 0.7);
          transition: color 0.2s;
          padding: 0;
        }
        .forgot-btn:hover { color: rgba(255,200,215,1); }

        .btn-login {
          width: 100%;
          padding: 14px;
          border-radius: 18px;
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
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          margin-bottom: 20px;
        }
        .btn-login::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease;
        }
        .btn-login:hover::before { left: 160%; }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(210, 50, 120, 0.65), 0 1px 0 rgba(255,255,255,0.2) inset;
        }
        .btn-login:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }
        .btn-login:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .sep {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .sep-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .sep-text {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-family: 'Sarabun', sans-serif;
        }

        .signup-row {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          font-family: 'Sarabun', sans-serif;
        }
        .signup-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: rgba(255, 180, 200, 0.95);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255,180,200,0.4);
          transition: color 0.2s, text-decoration-color 0.2s;
          padding: 0;
          margin-left: 4px;
        }
        .signup-btn:hover {
          color: #fff;
          text-decoration-color: rgba(255,180,200,0.9);
        }
      `}</style>

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
              <button type="button" className="forgot-btn">ลืมรหัสผ่าน?</button>
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