'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Droplets, Activity, BookOpen, Phone, LogOut, User } from 'lucide-react'

const tabs = [
  { href: '/home/analyze', label: 'วิเคราะห์ลิ่มเลือด', icon: Activity },
  { href: '/home/articles', label: 'บทความ', icon: BookOpen },
  { href: '/home/contact', label: 'ติดต่อเรา', icon: Phone },
]

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: 'var(--pink-bg)' }}>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b"
        style={{ borderColor: 'var(--pink-pale)' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/home/analyze" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E8638A, #C94B70)' }}>
              <Droplets size={18} color="white" />
            </div>
            <div className="leading-tight">
              <div className="font-mitr font-semibold text-sm" style={{ color: 'var(--pink-primary)' }}>
                Lunar
              </div>
              <div className="font-mitr text-xs" style={{ color: 'var(--text-soft)' }}>
                Day
              </div>
            </div>
          </Link>

          {/* Tab Links */}
          <div className="hidden md:flex items-center gap-2">
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all
                    ${active
                      ? 'text-white shadow-md'
                      : 'hover:bg-pink-50'
                    }`}
                  style={active
                    ? { background: 'linear-gradient(135deg, #E8638A, #C94B70)', color: 'white' }
                    : { color: 'var(--text-mid)' }
                  }
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
          </div>

          {/* User avatar + logout */}
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center border-2"
              style={{ borderColor: 'var(--pink-light)', background: 'var(--pink-pale)' }}
            >
              <User size={16} style={{ color: 'var(--pink-primary)' }} />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-pink-50"
              title="ออกจากระบบ"
            >
              <LogOut size={16} style={{ color: 'var(--text-soft)' }} />
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-t" style={{ borderColor: 'var(--pink-pale)' }}>
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-all
                  ${active ? '' : 'opacity-60'}`}
                style={{ color: active ? 'var(--pink-primary)' : 'var(--text-soft)' }}
              >
                <Icon size={18} />
                <span className="text-[10px]">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>

    </div>
  )
}