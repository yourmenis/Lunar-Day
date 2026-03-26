'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url(/bg-login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      {/* Bottom-right glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F9A8C9, transparent)', transform: 'translate(30%,30%)' }} />

      <div className="absolute bottom-44 left-28 w-5 h-5 rounded-full pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, #F9A8C9, #E0407A)' }} />

      {/* Glass Card */}
      <div
        className="relative w-full mx-6 px-10 py-10 overflow-hidden"
        style={{
          maxWidth: 420,
          borderRadius: '28px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1.5px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '8px 12px 40px rgba(100, 20, 60, 0.4), -2px -2px 10px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {/* Light streak left side */}
        <div className="absolute top-0 left-0 w-2/3 h-2/3 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)',
            borderRadius: 'inherit',
          }} />

        {/* Bottom circle glow inside card */}
        <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 70%)' }} />

        <div className="relative z-10">
          <h1 className="text-center text-2xl font-semibold text-white mb-8 tracking-wide"
            style={{ fontFamily: 'Mitr, sans-serif' , color: 'white'}}>
            เข้าสู่ระบบ
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-5 py-3 rounded-full text-sm text-white outline-none placeholder-white/60"
              style={{
                maxWidth: 350,
                margin: '0 auto',
                display: 'block', 
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255,255,255,0.35)',
                //backdropFilter: 'blur(8px)',
                fontFamily: 'Sarabun, sans-serif', 
                marginBottom: '12px',
              }}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-full text-sm text-white outline-none placeholder-white/60"
                style={{
                  maxWidth: 350,
                  margin: '0 auto',
                  display: 'block',
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  //backdropFilter: 'blur(8px)',
                  fontFamily: 'Sarabun, sans-serif',
                  marginBottom: '12px',
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity">
                {showPassword ? <Eye size={17} color="white" /> : <EyeOff size={17} color="white" />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button type="button" className="text-xs hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'Sarabun, sans-serif', color: 'white' }}>
                ลืมรหัสผ่าน?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-white font-semibold text-sm tracking-wide transition-all hover:brightness-110 active:scale-95 disabled:opacity-70"
              style={{
                fontFamily: 'Mitr, sans-serif',
                background: 'linear-gradient(135deg, #F06292, #E91E8C)',
                boxShadow: '0 4px 20px rgba(233,30,140,0.4)',
              }}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ fontFamily: 'Sarabun, sans-serif', color: 'white' }}>
            ยังไม่มีบัญชี?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: 'white' }}>
              ลงทะเบียน
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}