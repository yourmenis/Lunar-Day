'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import './login.css'
import Image from 'next/image'
import { SIGNUP_SUCCESS_KEY, useToast } from '../components/Toast'
import { postJson } from '../lib/postJson'
import { setCachedAvatar } from '../lib/avatarCache'
import { clearProfileCache } from '../lib/profileCache'
import { PASSWORD_MAX, USERNAME_MAX } from '../lib/authRules'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [stars, setStars] = useState<Array<React.CSSProperties>>([])
  const showToast = useToast()

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
    // มาจากหน้าสมัครสมาชิกที่สำเร็จแล้ว
    try {
      if (sessionStorage.getItem(SIGNUP_SUCCESS_KEY)) {
        sessionStorage.removeItem(SIGNUP_SUCCESS_KEY)
        showToast('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ', 'success')
      }
    } catch {}

    // มี token อยู่แล้ว → เช็กกับ backend ก่อนว่ายังใช้ได้ ค่อยพาไปหน้า home
    // (token หมดอายุ/ถูก logout แล้ว → ลบทิ้งและอยู่หน้า login ต่อ)
    const token = localStorage.getItem('access_token')
    if (!token) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) router.replace('/home')
        else if (res.status === 401 || res.status === 422) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
        }
      })
      .catch(() => {})
  }, [router, showToast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    const name = username.trim()
    if (!name || !password.trim()) {
      showToast('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน', 'error')
      return
    }
    if (/\s/.test(name)) {
      showToast('ชื่อผู้ใช้ห้ามมีช่องว่าง', 'error')
      return
    }
    if (name.length > USERNAME_MAX) {
      showToast(`ชื่อผู้ใช้ต้องมีความยาวไม่เกิน ${USERNAME_MAX} ตัวอักษร`, 'error')
      return
    }
    if (password.length > PASSWORD_MAX) {
      showToast(`รหัสผ่านต้องมีความยาวไม่เกิน ${PASSWORD_MAX} ตัวอักษร`, 'error')
      return
    }
    setLoading(true)

    const result = await postJson<{ access_token: string; user: unknown }>(
      '/auth/login', { username: name, password },
    )
    if (result.data && result.ok) {
      setCachedAvatar(null)
      clearProfileCache()
      localStorage.setItem('access_token', result.data.access_token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      router.replace('/home')
      return
    }
    showToast(result.data ? (result.data.msg ?? 'เข้าสู่ระบบไม่สำเร็จ') : result.error, 'error')
    setLoading(false)
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
                  maxLength={USERNAME_MAX}
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
                    maxLength={PASSWORD_MAX}
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