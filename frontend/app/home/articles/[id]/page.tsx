'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Bookmark, Share2, AlertCircle, Calendar } from 'lucide-react'
import Navbar from '../../components/Navbar'
import api from '../../../lib/api'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData]       = useState<any>(null)
  const [lines, setLines]     = useState<string[]>([])
  const [links, setLinks]     = useState<{ text: string; url?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [liked, setLiked]     = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    if (!id || typeof id !== 'string') return

    window.scrollTo(0, 0)
    api.get(`/articles/${id}`)
      .then(res => {
        setData(res.data)
        let raw: string = res.data.Content ?? res.data.content ?? ''
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            raw = parsed.map((b: any) =>
              b.type === 'image' ? `[IMG:${b.value}]` : (b.value ?? '')
            ).join('\n')
          }
        } catch {}
        setLines(raw.split('\n').filter(Boolean))
        try {
          const pl = typeof res.data.Link === 'string'
            ? JSON.parse(res.data.Link ?? '[]')
            : (res.data.Link ?? [])
          setLinks(Array.isArray(pl) ? pl : [])
        } catch { setLinks([]) }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (iso?: string) => iso
    ? new Date(iso).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5', fontFamily: "'Sarabun', sans-serif" }}>
      <Navbar />

      <div style={{ background: 'linear-gradient(135deg,#1a0a14,#3d1a2e,#6b2646)', padding: '40px 0 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 32px 48px' }}>
          <button onClick={() => router.back()} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            color: 'rgba(255,255,255,.65)', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 13, marginBottom: 24, fontFamily: 'Sarabun, sans-serif'
          }}>
            <ArrowLeft size={15} /> กลับไปบทความ
          </button>
          {loading
            ? <div style={{ height: 32, borderRadius: 8, background: 'rgba(255,255,255,.1)', width: '60%' }} />
            : <h1 style={{ fontFamily: 'Mitr, sans-serif', fontWeight: 600, fontSize: 'clamp(20px,3.5vw,30px)', color: '#fff', lineHeight: 1.4 }}>
                {data?.Title}
              </h1>
          }
          {data?.Created_at && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={12} /> {formatDate(data.Created_at)}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px' }}>
        {/* <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {[
            { icon: <Heart size={14} fill={liked ? 'currentColor' : 'none'} />, label: 'ถูกใจ', active: liked, fn: () => setLiked(p => !p) },
            { icon: <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />, label: saved ? 'บันทึกแล้ว' : 'บันทึก', active: saved, fn: () => setSaved(p => !p) },
            { icon: <Share2 size={14} />, label: 'แชร์', active: false, fn: () => {} }
          ].map((btn, i) => (
            <button key={i} onClick={btn.fn} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 18px', borderRadius: 12,
              border: `1.5px solid ${btn.active ? '#f06292' : '#f5e6ec'}`,
              background: btn.active ? '#fce4ec' : '#fff',
              color: btn.active ? '#c2185b' : '#7a5a6a',
              cursor: 'pointer', fontSize: 13, fontFamily: 'Sarabun, sans-serif'
            }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div> */}

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f5e6ec', padding: 40, boxShadow: '0 4px 24px rgba(194,24,91,.06)' }}>
          {loading && [...Array(8)].map((_, i) => (
            <div key={i} style={{ height: 16, borderRadius: 6, background: '#f5e6ec', marginBottom: 14, width: `${[100,75,90,60,100,80,65,85][i]}%` }} />
          ))}

          {!loading && error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 14, background: '#fff8e1', border: '1px solid #ffe082', fontSize: 13, color: '#7b5800' }}>
              <AlertCircle size={16} color="#f59e0b" /> ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่
            </div>
          )}

          {!loading && !error && lines.map((line, i) => {
            if (line.startsWith('[IMG:')) {
              const src = line.slice(5, -1)
              return <img key={i} src={src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_API_URL}${src}`} alt="" style={{ width: '100%', borderRadius: 14, margin: '16px 0', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
            }
            if (line.startsWith('**') && line.endsWith('**'))
              return <strong key={i} style={{ display: 'block', color: '#c2185b', fontSize: 17, margin: '28px 0 10px', fontFamily: 'Mitr, sans-serif' }}>{line.slice(2, -2)}</strong>
            if (line.startsWith('• '))
              return <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 15, color: '#3a2030', lineHeight: 1.75 }}>
                <span style={{ color: '#f06292', fontWeight: 700, flexShrink: 0 }}>•</span>{line.slice(2)}
              </div>
            return <p key={i} style={{ fontSize: 15.5, color: '#3a2030', lineHeight: 1.9, marginBottom: 18 }}>{line}</p>
          })}

          {!loading && !error && lines.length === 0 && (
            <p style={{ color: '#9e7a8a', fontSize: 14 }}>ยังไม่มีเนื้อหาบทความนี้</p>
          )}

          {!loading && links.length > 0 && (
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f5e6ec' }}>
              <p style={{ fontFamily: 'Mitr, sans-serif', fontWeight: 600, color: '#c2185b', marginBottom: 10, fontSize: 14 }}>แหล่งอ้างอิง</p>
              {links.map((l, i) => (
                <a key={i} href={l.url ?? '#'} target={l.url ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ display: 'block', fontSize: 12.5, color: '#9e7a8a', lineHeight: 1.8, textDecoration: 'none' }}>
                  {i + 1}. {typeof l === 'string' ? l : l.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}