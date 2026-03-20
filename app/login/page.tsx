'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Droplets } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate auth — replace with real API call
    await new Promise(r => setTimeout(r, 800))
    router.push('/home/analyze')
  }

  return (
    <div className="min-h-screen pink-gradient-bg flex items-center justify-center relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-16 left-10 w-32 h-32 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #F9A8C9, transparent)' }} />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #FDE8EF, transparent)' }} />

      {/* Blood drop decoration (bottom left, matching design) */}
      <div className="absolute bottom-28 left-20 opacity-90">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <path d="M30 0 C30 0 0 35 0 52 C0 68 13.4 80 30 80 C46.6 80 60 68 60 52 C60 35 30 0 30 0Z"
            fill="url(#dropGrad)" />
          <defs>
            <linearGradient id="dropGrad" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F472A0" />
              <stop offset="1" stopColor="#D63070" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-48 left-32 opacity-50">
        <div className="w-4 h-4 rounded-full" style={{ background: '#F472A0' }} />
      </div>

      {/* Glass Card */}
      <div className="glass-card w-full max-w-md mx-4 px-10 py-10 shadow-2xl"
        style={{ boxShadow: '0 8px 40px rgba(180, 40, 90, 0.25)' }}>

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.3)' }}>
              <Droplets size={28} color="white" />
            </div>
          </div>
          <h1 className="font-mitr text-2xl font-semibold text-white tracking-wide">
            เข้าสู่ระบบ
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl outline-none text-sm font-sarabun placeholder-pink-300 text-white"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl outline-none text-sm placeholder-pink-300 text-white pr-12"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-200 hover:text-white"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button type="button" className="text-xs text-pink-100 hover:text-white underline underline-offset-2">
              ลืมรหัสผ่าน?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-mitr font-semibold text-white text-sm tracking-wide transition-all hover:opacity-90 active:scale-95 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #E8638A, #C94B70)' }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-xs text-pink-100 mt-6">
          ยังไม่มีบัญชี?{' '}
          <button className="text-white font-semibold underline underline-offset-2 hover:text-pink-200">
            ลงทะเบียน
          </button>
        </p>
      </div>
    </div>
  )
}