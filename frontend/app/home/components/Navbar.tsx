'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Activity, BookOpen, Phone, LogOut, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../../lib/api'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/home/analyze', label: 'วิเคราะห์เลือด', icon: Activity },
  { href: '/home/articles', label: 'บทความ', icon: BookOpen },
  { href: '/home/contact', label: 'ติดต่อเรา', icon: Phone },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await api.get('/profile/')
        const img = res.data?.data?.Profile_Image
        if (img) {
          setProfileImage(`http://localhost:5000/static/uploads/profiles/${img}`)
        }
      } catch {}
    }
    fetchAvatar()
  }, [pathname]) 

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(220,80,120,0.1);
          font-family: 'Sarabun', sans-serif;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f06292, #c2185b);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(192,24,91,0.3);
        }
        .nav-logo-text {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 30px;
          color: #1a0a14;
          letter-spacing: 0.3px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          background: transparent;
          font-family: 'Sarabun', sans-serif;
          font-size: 14px;
          color: #5a3a4a;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          text-decoration: none;
        }
        .nav-link:hover { background: rgba(240,98,146,0.08); color: #c2185b; }
        .nav-link.active {
          background: rgba(240,98,146,0.12);
          color: #c2185b;
          font-weight: 500;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f8bbd0, #f48fb1);
          border: 2px solid rgba(240,98,146,0.3);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .nav-avatar:hover {
          border-color: #f06292;
          box-shadow: 0 0 0 3px rgba(240,98,146,0.15);
        }
        .nav-logout {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.18s;
          color: #9e7a8a;
        }
        .nav-logout:hover { background: rgba(240,98,146,0.08); color: #c2185b; }

        @media (max-width: 768px) {
          .navbar { padding: 0 20px; }
          .nav-links { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-logo" onClick={() => router.push('/home')}>
          <div className="nav-logo-icon">
            <Image 
              src="/logolunar.png" 
              alt="Lunar Day Logo" 
              width={45} 
              height={45}
              style={{ borderRadius: '50%' }}
            />
          </div>
          <span className="nav-logo-text">Lunar Day</span>
        </div>

        <div className="nav-links">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
              onClick={() => router.push(href)}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <div className="nav-avatar" onClick={() => router.push('/home/profile')}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setProfileImage(null)}
              />
            ) : (
              <User size={18} color="#c2185b" strokeWidth={1.5} />
            )}
          </div>

          <button
            className="nav-logout"
            title="ออกจากระบบ"
            onClick={() => {
              localStorage.removeItem('access_token')
              router.replace('/login')
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </>
  )
}