'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 600))
    setSent(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-mitr font-bold text-2xl mb-2" style={{ color: 'var(--text-dark)' }}>
          ติดต่อเรา
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
          มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมตอบเสมอ
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Contact info */}
        <div className="space-y-4">
          <h2 className="font-mitr font-semibold text-lg mb-4" style={{ color: 'var(--text-dark)' }}>
            ข้อมูลการติดต่อ
          </h2>

          {[
            { icon: Mail, label: 'อีเมล', value: 'support@lunarday.app', color: '#FFE4EE' },
            { icon: Phone, label: 'โทรศัพท์', value: '02-xxx-xxxx', color: '#FFF0F5' },
            { icon: MapPin, label: 'ที่อยู่', value: 'กรุงเทพมหานคร ประเทศไทย', color: '#FDE8EF' },
            { icon: Clock, label: 'เวลาทำการ', value: 'จันทร์–ศุกร์ 9:00–18:00', color: '#FFE9F3' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: color }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(232,99,138,0.15)' }}>
                <Icon size={20} style={{ color: 'var(--pink-primary)' }} />
              </div>
              <div>
                <div className="text-xs font-medium" style={{ color: 'var(--text-soft)' }}>{label}</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{value}</div>
              </div>
            </div>
          ))}

          {/* Social */}
          <div className="p-4 rounded-2xl" style={{ background: 'white', border: '1.5px solid var(--pink-light)' }}>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={16} style={{ color: 'var(--pink-primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>
                ติดตามเราได้ที่
              </span>
            </div>
            <div className="flex gap-2">
              {['LINE', 'Facebook', 'Instagram'].map(s => (
                <button key={s}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--pink-pale)', color: 'var(--pink-deep)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h2 className="font-mitr font-semibold text-lg mb-4" style={{ color: 'var(--text-dark)' }}>
            ส่งข้อความ
          </h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-3xl"
              style={{ background: 'var(--pink-pale)' }}>
              <CheckCircle size={48} style={{ color: 'var(--pink-primary)' }} className="mb-3" />
              <p className="font-mitr font-semibold text-lg" style={{ color: 'var(--text-dark)' }}>
                ส่งข้อความสำเร็จ!
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>
                เราจะติดต่อกลับภายใน 24 ชั่วโมง
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                className="mt-5 px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #E8638A, #C94B70)' }}
              >
                ส่งอีกครั้ง
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'ชื่อ-นามสกุล', type: 'text', placeholder: 'กรอกชื่อของคุณ' },
                { key: 'email', label: 'อีเมล', type: 'email', placeholder: 'example@email.com' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-mid)' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{
                      background: 'white',
                      border: '1.5px solid var(--pink-light)',
                      color: 'var(--text-dark)',
                    }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-mid)' }}>
                  ข้อความ
                </label>
                <textarea
                  rows={5}
                  placeholder="เขียนข้อความของคุณ..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                  style={{
                    background: 'white',
                    border: '1.5px solid var(--pink-light)',
                    color: 'var(--text-dark)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-mitr font-semibold text-sm text-white hover:opacity-90 transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #E8638A, #C94B70)' }}
              >
                <Send size={16} />
                ส่งข้อความ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}