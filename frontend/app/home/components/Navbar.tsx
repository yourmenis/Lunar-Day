'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Activity, BookOpen, Phone, User, LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../../lib/api'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/home/analyze',  label: 'วิเคราะห์ลิ่มเลือด', icon: Activity },
  { href: '/home/articles', label: 'บทความ',              icon: BookOpen },
  { href: '/home/contact',  label: 'ติดต่อเรา',           icon: Phone },
]

export default function Navbar() {
  const router   = useRouter()
  const pathname = usePathname()

  const [profileImage,    setProfileImage]    = useState<string | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [drawerOpen,      setDrawerOpen]      = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ล็อก scroll เมื่อ drawer เปิด
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // ปิด drawer เมื่อเปลี่ยนหน้า
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) return
      try {
        const res = await api.get('/profile/')
        const img = res.data?.data?.Profile_Image
        if (img) {
          setProfileImage(
            img.startsWith('http')
              ? img
              : `${process.env.NEXT_PUBLIC_API_URL}/static/uploads/profiles/${img}`
          )
        }
      } catch {}
    }
    fetchAvatar()
  }, [pathname])

  const handleLogout = () => {
    setShowLogoutModal(false)
    setDrawerOpen(false)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    showToast('ออกจากระบบเรียบร้อยแล้ว')
    setTimeout(() => router.push('/login'), 1000)
  }

  const navigate = (href: string) => {
    setDrawerOpen(false)
    router.push(href)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:wght@300;400;500;600&display=swap');

        /* ── Navbar ── */
        .navbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(220,80,120,0.1);
          font-family: 'Sarabun', sans-serif;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; text-decoration: none; flex-shrink: 0;
        }
        .nav-logo-icon {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #f06292, #c2185b);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 4px 12px rgba(192,24,91,0.3);
          overflow: hidden;
        }
        .nav-logo-text {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: 22px; color: #1a0a14; letter-spacing: 0.3px;
        }

        /* Desktop links */
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 10px; border: none;
          background: transparent; font-family: 'Sarabun', sans-serif;
          font-size: 14px; color: #5a3a4a; cursor: pointer;
          transition: background 0.18s, color 0.18s; text-decoration: none;
          white-space: nowrap;
        }
        .nav-link:hover  { background: rgba(240,98,146,0.08); color: #c2185b; }
        .nav-link.active { background: rgba(240,98,146,0.12); color: #c2185b; font-weight: 500; }

        /* Right icons */
        .nav-right { display: flex; align-items: center; gap: 8px; }
        .nav-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #f8bbd0, #f48fb1);
          border: 2px solid rgba(240,98,146,0.3);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          overflow: hidden; transition: border-color 0.18s, box-shadow 0.18s;
          flex-shrink: 0;
        }
        .nav-avatar:hover { border-color: #f06292; box-shadow: 0 0 0 3px rgba(240,98,146,0.15); }
        .nav-logout-btn {
          width: 36px; height: 36px; border-radius: 50%; border: none;
          background: transparent; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.18s; color: #9e7a8a; flex-shrink: 0;
        }
        .nav-logout-btn:hover { background: rgba(240,98,146,0.08); color: #c2185b; }

        /* Hamburger button (mobile only) */
        .nav-hamburger {
          display: none;
          width: 38px; height: 38px; border-radius: 10px; border: none;
          background: rgba(240,98,146,0.08);
          align-items: center; justify-content: center;
          cursor: pointer; color: #c2185b;
          transition: background 0.18s;
          flex-shrink: 0;
        }
        .nav-hamburger:hover { background: rgba(240,98,146,0.15); }

        /* ── Drawer overlay ── */
        .drawer-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(26,10,20,0.45);
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* ── Drawer panel ── */
        .drawer-panel {
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 201;
          width: 280px;
          background: #fff;
          box-shadow: 8px 0 40px rgba(26,10,20,0.18);
          transform: translateX(-100%);
          transition: transform 0.30s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        .drawer-panel.open {
          transform: translateX(0);
        }

        /* Drawer header */
        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f5e6ec;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 100%);
        }
        .drawer-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .drawer-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #f06292, #c2185b);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; box-shadow: 0 4px 12px rgba(194,24,91,0.4);
        }
        .drawer-logo-text {
          font-family: 'Mitr', sans-serif; font-weight: 600;
          font-size: 20px; color: #fff; letter-spacing: 0.3px;
        }
        .drawer-close {
          width: 34px; height: 34px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.8);
          transition: background 0.18s;
        }
        .drawer-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

        /* Drawer user section */
        .drawer-user {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #f5e6ec;
          cursor: pointer;
        }
        .drawer-user:hover { background: rgba(240,98,146,0.04); }
        .drawer-user-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #f8bbd0, #f48fb1);
          border: 2px solid rgba(240,98,146,0.3);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
        }
        .drawer-user-info {}
        .drawer-user-name {
          font-family: 'Mitr', sans-serif; font-size: 14px;
          font-weight: 500; color: #1a0a14;
        }
        .drawer-user-sub {
          font-size: 12px; color: #9e7a8a; margin-top: 2px;
        }

        /* Drawer nav links */
        .drawer-nav {
          display: flex; flex-direction: column; gap: 4px;
          padding: 16px 12px; flex: 1;
        }
        .drawer-nav-label {
          font-family: 'Mitr', sans-serif; font-size: 10px;
          color: #c2a0b0; letter-spacing: 1.5px; text-transform: uppercase;
          padding: 0 8px; margin-bottom: 4px; margin-top: 8px;
        }
        .drawer-link {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px; border-radius: 14px; border: none;
          background: transparent; font-family: 'Sarabun', sans-serif;
          font-size: 15px; color: #3d1a2e; cursor: pointer;
          transition: background 0.18s, color 0.18s; text-align: left;
          width: 100%;
        }
        .drawer-link:hover { background: rgba(240,98,146,0.07); color: #c2185b; }
        .drawer-link.active {
          background: linear-gradient(135deg, rgba(252,228,236,0.8), rgba(248,187,208,0.4));
          color: #c2185b; font-weight: 500;
        }
        .drawer-link-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(240,98,146,0.08);
          transition: background 0.18s;
        }
        .drawer-link.active .drawer-link-icon {
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
        }

        /* Drawer footer */
        .drawer-footer {
          padding: 16px 12px;
          border-top: 1px solid #f5e6ec;
        }
        .drawer-logout-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px; border-radius: 14px; border: none;
          background: transparent; font-family: 'Sarabun', sans-serif;
          font-size: 15px; color: #9e7a8a; cursor: pointer;
          transition: background 0.18s, color 0.18s; width: 100%;
        }
        .drawer-logout-btn:hover { background: rgba(239,68,68,0.06); color: #dc2626; }
        .drawer-logout-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(239,68,68,0.08);
        }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 300;
          display: flex; align-items: flex-end; justify-content: center;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
        }
        .modal-sheet {
          width: 100%; max-width: 480px; background: #fff;
          border-radius: 28px 28px 0 0; padding: 32px 28px 40px;
          animation: slideUp 0.28s ease; box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
        }
        .modal-handle {
          width: 40px; height: 4px; border-radius: 2px;
          background: #e5d0d8; margin: 0 auto 24px;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff; font-family: 'Mitr', sans-serif;
          font-size: 14px; font-weight: 500; cursor: pointer;
          box-shadow: 0 6px 24px rgba(194,24,91,0.4);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(194,24,91,0.5); }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .navbar { padding: 0 16px; }
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          /* ซ่อน logout btn บน desktop mobile ให้ใช้ใน drawer แทน */
          .nav-logout-desktop { display: none; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none; }
          .drawer-overlay, .drawer-panel { display: none !important; }
        }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999, padding: '12px 20px', borderRadius: 14,
          fontSize: 13, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          border: '1px solid', animation: 'fadeSlideDown 0.3s ease',
          whiteSpace: 'nowrap', fontFamily: "'Sarabun', sans-serif",
          ...(toast.type === 'success'
            ? { background: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' }
            : toast.type === 'error'
            ? { background: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' }
            : { background: '#fce4ef', color: '#9d174d', borderColor: '#f9a8d4' })
        }}>
          {toast.type === 'success' ? '✓ ' : toast.type === 'error' ? '✕ ' : 'ℹ '}{toast.msg}
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="navbar">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/home')}>
          <div className="nav-logo-icon">
            <Image src="/logolunar.png" alt="Lunar Day Logo" width={48} height={48} style={{ borderRadius: '50%' }} />
          </div>
          <span className="nav-logo-text">Lunar Day</span>
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
              onClick={() => navigate(href)}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">
          {/* Avatar (desktop + mobile) */}
          <div className="nav-avatar" onClick={() => navigate('/home/profile')}>
            {profileImage ? (
              <img src={profileImage} alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setProfileImage(null)} />
            ) : (
              <User size={18} color="#c2185b" strokeWidth={1.5} />
            )}
          </div>

          {/* Logout (desktop only) */}
          <button className="nav-logout-btn nav-logout-desktop" onClick={() => setShowLogoutModal(true)}>
            <LogOut size={18} />
          </button>

          {/* Hamburger (mobile only) */}
          <button className="nav-hamburger" onClick={() => setDrawerOpen(true)} aria-label="เปิดเมนู">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ── Drawer overlay ── */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Drawer panel ── */}
      <div className={`drawer-panel ${drawerOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-logo">
            <div className="drawer-logo-icon">
              <Image src="/logolunar.png" alt="Lunar Day" width={36} height={36} style={{ borderRadius: '50%' }} />
            </div>
            <span className="drawer-logo-text">Lunar Day</span>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="ปิดเมนู">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="drawer-user" onClick={() => navigate('/home/profile')}>
          <div className="drawer-user-avatar">
            {profileImage ? (
              <img src={profileImage} alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setProfileImage(null)} />
            ) : (
              <User size={20} color="#c2185b" strokeWidth={1.5} />
            )}
          </div>
          <div className="drawer-user-info">
            <div className="drawer-user-name">โปรไฟล์ของฉัน</div>
            <div className="drawer-user-sub">ดูและแก้ไขข้อมูล →</div>
          </div>
        </div>

        {/* Nav links */}
        <div className="drawer-nav">
          <div className="drawer-nav-label">เมนูหลัก</div>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              className={`drawer-link ${pathname.startsWith(href) ? 'active' : ''}`}
              onClick={() => navigate(href)}
            >
              <div className="drawer-link-icon">
                <Icon size={17} color="#c2185b" />
              </div>
              {label}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="drawer-footer">
          <button className="drawer-logout-btn" onClick={() => { setDrawerOpen(false); setShowLogoutModal(true) }}>
            <div className="drawer-logout-icon">
              <LogOut size={17} color="#dc2626" />
            </div>
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LogOut size={26} color="#c2185b" strokeWidth={1.5} />
              </div>
              <h3 style={{
                fontFamily: "'Mitr', sans-serif", fontSize: 18, fontWeight: 600,
                color: '#1a0a14', textAlign: 'center',
              }}>
                คุณต้องการออกจากระบบใช่ไหม?
              </h3>
              <p style={{ fontSize: 13, color: '#9e7a8a', textAlign: 'center', lineHeight: 1.6 }}>
                คุณสามารถเข้าสู่ระบบอีกครั้งได้ตลอดเวลา
              </p>
              <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 14,
                    border: '1.5px solid rgba(194,24,91,0.2)',
                    background: 'transparent', color: '#c2185b',
                    fontFamily: "'Mitr', sans-serif", fontSize: 14, cursor: 'pointer',
                  }}
                >
                  ยกเลิก
                </button>
                <button onClick={handleLogout} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}