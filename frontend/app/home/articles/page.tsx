'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Search, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../../lib/api'

export default function ArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/articles')
      .then(res => setArticles(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles.filter(a =>
    a.Title?.toLowerCase().includes(search.toLowerCase())
  )

  const emojis = ['🔬', '💊', '🌸', '📊', '🩸', '💉', '🧬', '🫀']

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f5', fontFamily: "'Sarabun', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1a0a14,#3d1a2e,#6b2646)',
        padding: '48px 40px 40px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <BookOpen size={20} color="#f48fb1" />
            <h1 style={{ fontFamily: 'Mitr, sans-serif', fontWeight: 600, fontSize: 26, color: '#fff' }}>
              บทความสุขภาพ
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 24 }}>
            ความรู้เกี่ยวกับสุขภาพสตรีและการดูแลตัวเอง
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาบทความ..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                borderRadius: 12,
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 14,
                fontFamily: 'Sarabun, sans-serif',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px' }}>

        {/* Skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid #f5e6ec', overflow: 'hidden' }}>
                <div style={{ height: 160, background: '#f5e6ec' }} />
                <div style={{ padding: 18 }}>
                  <div style={{ height: 16, borderRadius: 6, background: '#f5e6ec', marginBottom: 10, width: '80%' }} />
                  <div style={{ height: 12, borderRadius: 6, background: '#f5e6ec', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9e7a8a' }}>
            <BookOpen size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 15 }}>ไม่พบบทความที่ค้นหา</p>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map((article, i) => (
              <div
                key={article.ArticleID}
                onClick={() => router.push(`/home/articles/${article.ArticleID}`)}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid #f5e6ec',
                  boxShadow: '0 2px 12px rgba(194,24,91,0.05)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.22s, box-shadow 0.22s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(194,24,91,0.12)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(194,24,91,0.05)'
                }}
              >
                {/* Image */}
                <div style={{
                  height: 160,
                  background: article.ImageURL
                    ? `url(${article.ImageURL}) center/cover no-repeat`
                    : 'linear-gradient(135deg,#fce4ec,#f8bbd0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 52,
                }}>
                  {!article.ImageURL && emojis[i % emojis.length]}
                </div>

                {/* Body */}
                <div style={{ padding: '18px 18px 20px' }}>
                  <h3 style={{
                    fontFamily: 'Mitr, sans-serif',
                    fontWeight: 500,
                    fontSize: 15,
                    color: '#1a0a14',
                    lineHeight: 1.5,
                    marginBottom: 12,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  } as React.CSSProperties}>
                    {article.Title}
                  </h3>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    color: '#c2185b', fontSize: 13, fontWeight: 500,
                  }}>
                    อ่านต่อ <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}