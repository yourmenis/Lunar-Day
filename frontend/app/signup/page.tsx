'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/home/analyze')
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.4)',
    color: '#ffffff',
    width: '100%',
    padding: '12px 20px',
    borderRadius: '999px',
    outline: 'none',
    fontSize: '14px',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-10 text-white !text-white"
      style={{
        backgroundImage: 'url(/bg-login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Prompt, sans-serif',
      }}
    >
      {/* Blood drop */}
      <div className="absolute bottom-24 left-16 pointer-events-none">
        <svg width="56" height="74" viewBox="0 0 56 74" fill="none">
          <path d="M28 0 C28 0 0 32 0 48 C0 63 12.5 74 28 74 C43.5 74 56 63 56 48 C56 32 28 0 28 0Z" fill="url(#dg2)" />
          <defs>
            <linearGradient id="dg2" x1="0" y1="0" x2="56" y2="74">
              <stop stopColor="#F472A0" />
              <stop offset="1" stopColor="#E0407A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Card */}
      <div
        className="relative w-full mx-6 px-10 py-10 overflow-hidden text-white !text-white"
        style={{
          maxWidth: 480,
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1.5px solid rgba(255,255,255,0.45)',
          boxShadow: '8px 12px 40px rgba(100,20,60,0.4)',
        }}
      >
        <h1 className="text-center text-2xl mb-7 text-white !text-white">
          ลงทะเบียน
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="ชื่อ"
            value={form.firstName}
            onChange={e => handleChange('firstName', e.target.value)}
            className="!text-white placeholder-white"
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="นามสกุล"
            value={form.lastName}
            onChange={e => handleChange('lastName', e.target.value)}
            className="!text-white placeholder-white"
            style={inputStyle}
          />

          <input
            type="date"
            value={form.birthDate}
            onChange={e => handleChange('birthDate', e.target.value)}
            className="!text-white"
            style={{
              ...inputStyle,
              color: '#ffffff',
              colorScheme: 'dark',
            }}
          />

          <input
            type="email"
            placeholder="อีเมล"
            value={form.email}
            onChange={e => handleChange('email', e.target.value)}
            className="!text-white placeholder-white"
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={form.username}
            onChange={e => handleChange('username', e.target.value)}
            className="!text-white placeholder-white"
            style={inputStyle}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              className="!text-white placeholder-white"
              style={{ ...inputStyle, paddingRight: '48px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <Eye size={18} color="white" /> : <EyeOff size={18} color="white" />}
            </button>
          </div>

          {/* Confirm */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="ยืนยันรหัสผ่าน"
              value={form.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              className="!text-white placeholder-white"
              style={{ ...inputStyle, paddingRight: '48px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? <Eye size={18} color="white" /> : <EyeOff size={18} color="white" />}
            </button>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 mt-2 text-white !text-white">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                border: '2px solid white',
                background: agreed ? 'white' : 'transparent',
              }}
            >
              {agreed && (
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF98CF' }} />
              )}
            </button>

            <p className="text-xs leading-relaxed text-white !text-white">
              ฉันมีอายุครบ 13 ปี เพื่อลงชื่อเข้าใช้ฉันยอมรับ คุณรับทราบและยอมรับว่าคุณได้อ่าน
              และตกลงที่จะถูกผูกมัดด้วย{' '}
              <span style={{ color: '#FF98CF' }}>
                เงื่อนไขการใช้งาน
              </span>
              {' '}และ{' '}
              <span style={{ color: '#FF98CF' }}>
                นโยบายความเป็นส่วนตัว
              </span>
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!agreed || loading}
            className="w-full py-3 rounded-full mt-2 text-white !text-white"
            style={{
              background: 'linear-gradient(135deg, #F06292, #E91E8C)',
            }}
          >
            {loading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
          </button>
        </form>

        <p className="text-center text-xs mt-5 text-white !text-white">
          มีบัญชีผู้ใช้อยู่แล้ว?{' '}
          <button onClick={() => router.push('/login')} className="underline text-white !text-white">
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  )
}