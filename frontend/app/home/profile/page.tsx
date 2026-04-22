'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Settings, Droplets, Shield, FileText,
  LogOut, Trash2, ChevronRight, ArrowLeft,
  Camera, Eye, EyeOff, Sparkles, Activity,
  Calendar, Edit3, X, Check, AlertTriangle
} from 'lucide-react'
import Navbar from '../components/Navbar'

// ============================================================
// TYPES
// ============================================================
type View = 'profile' | 'editProfile' | 'history' | 'privacy' | 'terms'

// ============================================================
// STATIC TEXT
// ============================================================
const PRIVACY_TEXT = [
  { title: '1. ข้อมูลที่เราจัดเก็บ', body: 'เราเก็บรวบรวมข้อมูลส่วนบุคคล เช่น ชื่อผู้ใช้ อีเมล วันเกิด และรหัสผ่านในรูปแบบที่ผ่านการเข้ารหัส (Hashing) เพื่อความปลอดภัยสูงสุด ไม่มีการจัดเก็บหรือรับข้อมูลโปรไฟล์จากผู้ให้บริการภายนอก' },
  { title: '2. การประมวลผลข้อมูล', body: 'เราประมวลผลข้อมูลเพื่ออำนวยความสะดวกในการสร้างบัญชี แสดงโปรไฟล์ และปรับปรุงบริการตามที่ผู้ใช้ร้องขอ' },
  { title: '3. ฐานทางกฎหมาย', body: 'เราดำเนินการภายใต้ PDPA โดยอาศัยฐานความยินยอม การปฏิบัติตามสัญญา และผลประโยชน์อันชอบธรรม' },
  { title: '4. การเปิดเผยข้อมูล', body: 'เราไม่มีนโยบายในการขายข้อมูลส่วนบุคคลของท่านให้แก่บุคคลที่สาม อาจมีการแบ่งปันเฉพาะกรณีที่กฎหมายกำหนดเท่านั้น' },
  { title: '5. ความปลอดภัยของข้อมูล', body: 'เราเข้ารหัสรหัสผ่านด้วยอัลกอริทึมความปลอดภัยสูง มีมาตรการทางเทคนิคและการบริหารจัดการเพื่อปกป้องข้อมูลของท่าน' },
  { title: '6. การเก็บรักษาข้อมูล', body: 'เราจัดเก็บข้อมูลตลอดระยะเวลาที่ท่านมีบัญชี และจะลบข้อมูลทั้งหมดทันทีเมื่อท่านลบบัญชีผู้ใช้งาน' },
]

// FIX #2 — เพิ่ม TERMS_TEXT ที่หายไป
const TERMS_TEXT = [
  { title: '1. การยอมรับเงื่อนไข', body: 'การใช้งานบริการ Luna Day ถือว่าท่านได้อ่านและยอมรับเงื่อนไขการใช้งานทั้งหมดแล้ว หากท่านไม่ยอมรับเงื่อนไขเหล่านี้ กรุณาหยุดใช้บริการ' },
  { title: '2. การใช้บริการ', body: 'ท่านตกลงใช้บริการเพื่อวัตถุประสงค์ที่ถูกกฎหมายเท่านั้น และไม่กระทำการใดๆ ที่อาจก่อให้เกิดความเสียหายต่อระบบหรือผู้ใช้รายอื่น' },
  { title: '3. ข้อมูลสุขภาพ', body: 'ข้อมูลที่ได้จากการวิเคราะห์ในแอปพลิเคชันเป็นเพียงข้อมูลเบื้องต้น ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ผู้เชี่ยวชาญได้' },
  { title: '4. ทรัพย์สินทางปัญญา', body: 'เนื้อหา โลโก้ และซอฟต์แวร์ทั้งหมดในแอปพลิเคชันเป็นทรัพย์สินของ Luna Day ห้ามทำซ้ำหรือนำไปใช้โดยไม่ได้รับอนุญาต' },
  { title: '5. การยกเลิกบริการ', body: 'เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่ละเมิดเงื่อนไขการใช้งานโดยไม่ต้องแจ้งล่วงหน้า' },
  { title: '6. การเปลี่ยนแปลงเงื่อนไข', body: 'เราอาจปรับปรุงเงื่อนไขการใช้งานเป็นครั้งคราว การใช้งานต่อเนื่องหลังจากมีการเปลี่ยนแปลงถือว่าท่านยอมรับเงื่อนไขใหม่' },
]

// ============================================================
// HELPERS
// ============================================================
function buddhistDate(iso: string) {
  if (!iso) return '-'
  const [y, m, d] = iso.split('-')
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${parseInt(y)+543}`
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ProfilePage() {
  const router = useRouter()
  const [view, setView] = useState<View>('profile')
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Modals
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Edit form
  const [editForm, setEditForm] = useState({
    name: '',
    lastname: '',
    username: '',
    avatarFile: null as File | null,
  })

  // FIX #4 — previewUrl state แยกออกมาเพื่อไม่ให้เกิด memory leak
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!editForm.avatarFile) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(editForm.avatarFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url) // cleanup ทุกครั้งที่ file เปลี่ยน
  }, [editForm.avatarFile])

  // FIX #5 — เพิ่ม error handling
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch('http://localhost:5000/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      })
      if (!res.ok) {
        if (res.status === 401) router.push('/login')
        return
      }
      const data = await res.json()
      if (data.data) setProfile(data.data)
    } catch {
      showToast('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', 'error')
    }
  }

  // FIX #5 — เพิ่ม error handling
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch('http://localhost:5000/history/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.status === 'success') setHistory(data.data)
    } catch {
      showToast('ไม่สามารถโหลดประวัติได้', 'error')
    }
  }

  // FIX #6 — เพิ่ม router ใน dependency array
  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchProfile()
    fetchHistory()
  }, [router])

  const handleLogout = () => {
    setShowLogoutModal(false)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // FIX #3 — เรียก API จริงก่อนลบบัญชี
  const handleDeleteAccount = async () => {
    if (!deletePassword) return showToast('กรุณากรอกรหัสผ่าน', 'error')
    try {
      const token = localStorage.getItem('access_token')
      const res = await fetch('http://localhost:5000/profile/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      })
      const data = await res.json()
      if (!res.ok) return showToast(data.msg || 'รหัสผ่านไม่ถูกต้อง', 'error')
      setShowDeleteConfirm(false)
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push('/login')
    } catch {
      showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error')
    }
  }

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('access_token')
    const form = new FormData()
    form.append('username', editForm.username)
    form.append('name', editForm.name)
    form.append('lastname', editForm.lastname)
    form.append('birthday', profile?.Birthday || '')
    if (editForm.avatarFile) form.append('profile_img', editForm.avatarFile)

    try {
      const res = await fetch('http://localhost:5000/profile/update', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      const data = await res.json()
      if (res.ok) {
        showToast('บันทึกข้อมูลเรียบร้อย')
        setEditForm(f => ({ ...f, avatarFile: null }))
        setPreviewUrl(null)
        await fetchProfile()
        setView('profile')
      } else {
        showToast(data.msg || 'เกิดข้อผิดพลาด', 'error')
      }
    } catch {
      showToast('ไม่สามารถบันทึกข้อมูลได้', 'error')
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditForm(f => ({ ...f, avatarFile: file }))
  }

  const riskConfig: Record<string, { bg: string; color: string; dot: string }> = {
    low:    { bg: 'rgba(16,185,129,0.1)',  color: '#059669', dot: '#10b981' },
    medium: { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', dot: '#f59e0b' },
    high:   { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', dot: '#ef4444' },
  }

  // ============================================================
  // PROFILE VIEW
  // ============================================================
  const ProfileView = () => (
    <div style={{ paddingBottom: 60 }}>
      {/* Profile Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #6b2646 100%)',
        padding: '40px 40px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,98,146,0.18), transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: '30%',
          width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(206,147,216,0.12), transparent 60%)',
        }} />
        <div style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          position: 'absolute', inset: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999,
              background: 'rgba(240,98,146,0.2)',
              border: '1px solid rgba(240,98,146,0.35)',
              fontSize: 11, color: '#f8bbd0',
              fontFamily: "'Mitr', sans-serif", letterSpacing: '0.5px',
            }}>
              <Sparkles size={10} /> โปรไฟล์ของฉัน
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Mitr', sans-serif",
            fontSize: 28, fontWeight: 600,
            color: '#fff', lineHeight: 1.3,
          }}>สวัสดี, {profile?.Name} 👋</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            @{profile?.Username}
          </p>
        </div>
      </div>

      {/* Avatar card floating */}
      <div style={{
        maxWidth: 680, margin: '20px auto 0',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 150, height: 150, borderRadius: '50%',
            border: '3px solid #f48fb1',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(194,24,91,0.25)',
          }}>
            {profile?.Profile_Image
              ? <img src={`http://localhost:5000/static/uploads/profiles/${profile.Profile_Image}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <User size={36} color="#c2185b" strokeWidth={1.5} />
            }
          </div>
        </div>
      </div>

      {/* Info + Edit card */}
      <div style={{ maxWidth: 680, margin: '-75px auto 0', padding: '0 24px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '20px 22px',
          boxShadow: '0 4px 20px rgba(194,24,91,0.07)',
          border: '1px solid #f5e6ec',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Mitr', sans-serif", fontSize: 18, fontWeight: 600, color: '#1a0a14' }}>
              {profile?.Name} {profile?.LastName}
            </p>
            <p style={{ fontSize: 13, color: '#9e7a8a', marginTop: 2 }}>@{profile?.Username}</p>
          </div>
          <button
            onClick={() => {
              setEditForm({ name: profile?.Name || '', lastname: profile?.LastName || '', username: profile?.Username || '', avatarFile: null })
              setView('editProfile')
            }}
            style={{
              width: 40, height: 40, borderRadius: 12,
              border: '1.5px solid rgba(194,24,91,0.2)',
              background: 'rgba(194,24,91,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#c2185b', flexShrink: 0,
            }}
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>

      {/* Menu */}
      <div style={{ maxWidth: 680, margin: '20px auto 0', padding: '0 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9e7a8a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
          บัญชีและข้อมูล
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <MenuItem
            icon={<Settings size={18} />}
            label="จัดการโปรไฟล์"
            desc="แก้ไขข้อมูลส่วนตัวและรูปภาพ"
            onClick={() => {
              setEditForm({ name: profile?.Name || '', lastname: profile?.LastName || '', username: profile?.Username || '', avatarFile: null })
              setView('editProfile')
            }}
          />
          <MenuItem
            icon={<Droplets size={18} />}
            label="ประวัติการวิเคราะห์ลิ่มเลือด"
            desc={`${history.length} รายการ`}
            onClick={() => setView('history')}
            badge={history.length.toString()}
          />
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: '#9e7a8a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
          กฎหมายและนโยบาย
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <MenuItem
            icon={<Shield size={18} />}
            label="ประกาศนโยบายความเป็นส่วนตัว"
            desc="การใช้งานและการคุ้มครองข้อมูล"
            onClick={() => setView('privacy')}
          />
          <MenuItem
            icon={<FileText size={18} />}
            label="ข้อตกลงเงื่อนไขการใช้งาน"
            desc="เงื่อนไขการใช้บริการ Luna day"
            onClick={() => setView('terms')}
          />
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: '#9e7a8a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10, padding: '0 4px' }}>
          บัญชี
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MenuItem
            icon={<LogOut size={18} />}
            label="ออกจากระบบ"
            onClick={() => setShowLogoutModal(true)}
          />
          <MenuItem
            icon={<Trash2 size={18} />}
            label="ลบบัญชีผู้ใช้"
            danger
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>
    </div>
  )

  // ============================================================
  // EDIT PROFILE VIEW
  // ============================================================
  const EditProfileView = () => (
    <div style={{ paddingBottom: 60 }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 100%)',
        padding: '40px 24px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px', position: 'absolute', inset: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setView('profile')} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
          }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 20, fontWeight: 600, color: '#fff' }}>จัดการโปรไฟล์</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>แก้ไขข้อมูลส่วนตัวของคุณ</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 24px' }}>
        {/* Avatar Section */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '28px',
          border: '1px solid #f5e6ec',
          boxShadow: '0 4px 20px rgba(194,24,91,0.06)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          marginBottom: 16,
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              border: '3px solid #f48fb1', overflow: 'hidden',
              background: 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(194,24,91,0.2)',
            }}>
              {/* FIX #4 — ใช้ previewUrl แทน URL.createObjectURL ตรงๆ */}
              {previewUrl
                ? <img src={previewUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : profile?.Profile_Image
                  ? <img src={`http://localhost:5000/static/uploads/profiles/${profile.Profile_Image}`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={40} color="#c2185b" strokeWidth={1.5} />
              }
            </div>
            <label style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f06292, #c2185b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(194,24,91,0.4)',
            }}>
              <Camera size={14} color="#fff" />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </label>
          </div>
          <p style={{ fontSize: 13, color: '#c2185b', fontWeight: 500 }}>แตะเพื่อเปลี่ยนรูปโปรไฟล์</p>
        </div>

        {/* Form */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: '24px',
          border: '1px solid #f5e6ec',
          boxShadow: '0 4px 20px rgba(194,24,91,0.06)',
          display: 'flex', flexDirection: 'column', gap: 16,
          marginBottom: 20,
        }}>
          <FormField label="ชื่อ" value={editForm.name} onChange={v => setEditForm(f => ({ ...f, name: v }))} />
          <FormField label="นามสกุล" value={editForm.lastname} onChange={v => setEditForm(f => ({ ...f, lastname: v }))} />
          <FormField
            label="วัน-เดือน-ปีเกิด (พ.ศ.)"
            value={buddhistDate(profile?.Birthday || '')}
            readOnly
            icon={<Calendar size={14} />}
          />
          <FormField label="ชื่อผู้ใช้" value={editForm.username} onChange={v => setEditForm(f => ({ ...f, username: v }))} prefix="@" />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setView('profile')} style={{
            flex: 1, padding: '14px', borderRadius: 14,
            border: '1.5px solid rgba(194,24,91,0.25)',
            background: 'transparent', color: '#c2185b',
            fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <X size={15} /> ยกเลิก
          </button>
          <button onClick={handleSaveProfile} className="btn-primary" style={{ flex: 1, padding: '14px', justifyContent: 'center' }}>
            <Check size={15} /> บันทึก
          </button>
        </div>
      </div>
    </div>
  )

  // ============================================================
  // HISTORY VIEW — FIX #1: ปิด div ให้ครบ
  // ============================================================
  const HistoryView = () => (
    <div style={{ paddingBottom: 60 }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 100%)',
        padding: '40px 24px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px', position: 'absolute', inset: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setView('profile')} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
          }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 20, fontWeight: 600, color: '#fff' }}>ประวัติการวิเคราะห์</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>ลิ่มเลือดทั้งหมด {history.length} รายการ</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9e7a8a' }}>
            <Droplets size={48} color="#f8bbd0" strokeWidth={1} style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: "'Mitr', sans-serif", fontSize: 16 }}>ยังไม่มีประวัติการวิเคราะห์</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map((item, i) => {
              const levelMap: Record<string, string> = {
                'ฉุกเฉิน': 'high',
                'เสี่ยงสูง': 'high',
                'เสี่ยงปานกลาง': 'medium',
                'ปกติ': 'low',
              }
              const cfg = riskConfig[levelMap[item.Risk_Level] || 'low']

              return (
                <div key={item.AssessmentID} style={{
                  background: '#fff', borderRadius: 18, padding: '16px 20px',
                  border: '1px solid #f5e6ec',
                  boxShadow: '0 2px 12px rgba(194,24,91,0.04)',
                  display: 'flex', alignItems: 'center', gap: 16,
                  cursor: 'pointer',
                  opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.07}s forwards`,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: cfg.bg, border: `2px solid ${cfg.dot}30`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Droplets size={20} color={cfg.color} strokeWidth={1.5} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 10px', borderRadius: 999,
                        background: cfg.bg, color: cfg.color,
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                        {item.Risk_Level}
                      </span>
                    </div>

                    <p style={{
                      fontSize: 13, color: '#1a0a14', fontWeight: 500,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      marginBottom: 4,
                    }}>
                      {item.Detect2}
                    </p>

                    <p style={{ fontSize: 12, color: '#9e7a8a', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} />
                      {item.Create_At
                        ? new Date(item.Create_At).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })
                        : '-'
                      }
                    </p>
                  </div>

                  <ChevronRight size={16} color="#d6b4c4" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>  // ← FIX #1: div ที่ปิดให้ครบ
  )

  // ============================================================
  // DOC VIEW (Privacy / Terms)
  // ============================================================
  const DocView = ({ title, sections, icon }: { title: string; sections: {title:string; body:string}[]; icon: React.ReactNode }) => (
    <div style={{ paddingBottom: 60 }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 100%)',
        padding: '40px 24px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px', position: 'absolute', inset: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setView('profile')} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
          }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(240,98,146,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#f8bbd0',
              }}>{icon}</div>
              <h1 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 18, fontWeight: 600, color: '#fff' }}>{title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 18, padding: '20px 22px',
              border: '1px solid #f5e6ec',
              boxShadow: '0 2px 12px rgba(194,24,91,0.04)',
            }}>
              <p style={{ fontFamily: "'Mitr', sans-serif", fontSize: 14, fontWeight: 600, color: '#c2185b', marginBottom: 8 }}>{s.title}</p>
              <p style={{ fontSize: 13.5, color: '#5a3a4a', lineHeight: 1.75 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .profile-root {
          min-height: 100vh;
          font-family: 'Sarabun', sans-serif;
          background: #faf7f5;
          overflow-x: hidden;
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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .modal-overlay {
          position: fixed; inset: 0; z-index: 40;
          display: flex; align-items: flex-end; justify-content: center;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px);
        }
        .modal-sheet {
          width: 100%; max-width: 480px;
          background: #fff;
          border-radius: 28px 28px 0 0;
          padding: 32px 28px 40px;
          animation: slideUp 0.28s ease;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
        }
        .modal-handle {
          width: 40px; height: 4px; border-radius: 2px;
          background: #e5d0d8; margin: 0 auto 24px;
        }
      `}</style>

      <div className="profile-root">
        <Navbar />

        {/* TOAST */}
        {toast && (
          <div style={{
            position: 'fixed', top: 80, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50, padding: '12px 20px', borderRadius: 14,
            fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid',
            animation: 'fadeSlideDown 0.3s ease',
            whiteSpace: 'nowrap',
            ...(toast.type === 'success' ? { background: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' }
              : toast.type === 'error'   ? { background: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5' }
              : { background: '#fce4ef', color: '#9d174d', borderColor: '#f9a8d4' })
          }}>
            {toast.type === 'success' ? '✓ ' : toast.type === 'error' ? '✕ ' : 'ℹ '}{toast.msg}
          </div>
        )}

        {view === 'profile'     && <ProfileView />}
        {view === 'editProfile' && <EditProfileView />}
        {view === 'history'     && <HistoryView />}
        {view === 'privacy'     && <DocView title="ประกาศนโยบายความเป็นส่วนตัว" sections={PRIVACY_TEXT} icon={<Shield size={14} />} />}
        {view === 'terms'       && <DocView title="ข้อตกลงเงื่อนไขการใช้งาน" sections={TERMS_TEXT} icon={<FileText size={14} />} />}

        {/* LOGOUT MODAL */}
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
                <h3 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 18, fontWeight: 600, color: '#1a0a14', textAlign: 'center' }}>
                  คุณต้องการออกจากระบบใช่ไหม?
                </h3>
                <p style={{ fontSize: 13, color: '#9e7a8a', textAlign: 'center', lineHeight: 1.6 }}>
                  คุณสามารถเข้าสู่ระบบอีกครั้งได้ตลอดเวลา
                </p>
                <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                  <button onClick={() => setShowLogoutModal(false)} style={{
                    flex: 1, padding: '14px', borderRadius: 14,
                    border: '1.5px solid rgba(194,24,91,0.2)',
                    background: 'transparent', color: '#c2185b',
                    fontFamily: "'Mitr', sans-serif", fontSize: 14, cursor: 'pointer',
                  }}>ยกเลิก</button>
                  <button onClick={handleLogout} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE ACCOUNT MODAL */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: '#fee2e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle size={26} color="#ef4444" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 18, fontWeight: 600, color: '#1a0a14', textAlign: 'center' }}>
                  คุณต้องการลบบัญชีผู้ใช้ใช่ไหม?
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 1.7 }}>
                  การกระทำนี้จะลบข้อมูลส่วนบุคคลและข้อมูลสุขภาพทั้งหมดออกจากฐานข้อมูลอย่างถาวร{' '}
                  <span style={{ color: '#c2185b', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setShowDeleteModal(false); setView('privacy') }}>
                    ตามที่ระบุไว้ในประกาศความเป็นส่วนตัว
                  </span>
                </p>
                <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                  <button onClick={() => setShowDeleteModal(false)} style={{
                    flex: 1, padding: '14px', borderRadius: 14,
                    border: '1.5px solid #fca5a5',
                    background: 'transparent', color: '#ef4444',
                    fontFamily: "'Mitr', sans-serif", fontSize: 14, cursor: 'pointer',
                  }}>ยกเลิก</button>
                  <button onClick={() => { setShowDeleteModal(false); setShowDeleteConfirm(true) }} style={{
                    flex: 1, padding: '14px', borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(135deg, #f87171, #ef4444)',
                    color: '#fff',
                    fontFamily: "'Mitr', sans-serif", fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                  }}>ยืนยัน</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM (password) */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <h3 style={{ fontFamily: "'Mitr', sans-serif", fontSize: 17, fontWeight: 600, color: '#1a0a14', marginBottom: 6 }}>
                กรุณากรอกรหัสยืนยันตัวตน
              </h3>
              <p style={{ fontSize: 13, color: '#9e7a8a', marginBottom: 20 }}>กรอกรหัสผ่านเพื่อยืนยันการลบบัญชี</p>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="รหัสผ่านของคุณ"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    borderRadius: 14, border: '2px solid #fca5a5',
                    fontSize: 14, outline: 'none',
                    fontFamily: "'Sarabun', sans-serif",
                    color: '#1a0a14', background: '#fff',
                  }}
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9e7a8a',
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword('') }} style={{
                  flex: 1, padding: '14px', borderRadius: 14,
                  border: '1.5px solid #fca5a5', background: 'transparent', color: '#ef4444',
                  fontFamily: "'Mitr', sans-serif", fontSize: 14, cursor: 'pointer',
                }}>ยกเลิก</button>
                <button onClick={handleDeleteAccount} style={{
                  flex: 1, padding: '14px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #f87171, #ef4444)',
                  color: '#fff', fontFamily: "'Mitr', sans-serif", fontSize: 14, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                }}>ลบบัญชีผู้ใช้</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function MenuItem({ icon, label, desc, onClick, danger = false, badge }: {
  icon: React.ReactNode; label: string; desc?: string;
  onClick: () => void; danger?: boolean; badge?: string
}) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px', borderRadius: 16,
      background: '#fff', border: `1px solid ${danger ? '#fee2e2' : '#f5e6ec'}`,
      boxShadow: '0 2px 10px rgba(194,24,91,0.04)',
      cursor: 'pointer', textAlign: 'left',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(194,24,91,0.1)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'none'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(194,24,91,0.04)'
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: danger ? '#fff1f2' : 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? '#ef4444' : '#c2185b',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: danger ? '#ef4444' : '#1a0a14', fontFamily: "'Mitr', sans-serif" }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: '#9e7a8a', marginTop: 2 }}>{desc}</p>}
      </div>
      {badge && (
        <span style={{
          padding: '3px 10px', borderRadius: 999,
          background: 'rgba(194,24,91,0.08)', color: '#c2185b',
          fontSize: 12, fontWeight: 600,
        }}>{badge}</span>
      )}
      <ChevronRight size={16} color={danger ? '#fca5a5' : '#d6b4c4'} />
    </button>
  )
}

function FormField({ label, value, onChange, readOnly = false, prefix, icon }: {
  label: string; value: string; onChange?: (v: string) => void;
  readOnly?: boolean; prefix?: string; icon?: React.ReactNode
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9d174d', marginBottom: 6, paddingLeft: 2 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: '#c2185b', fontWeight: 500,
          }}>{prefix}</span>
        )}
        {icon && (
          <span style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            color: '#9e7a8a',
          }}>{icon}</span>
        )}
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: prefix ? '13px 16px 13px 28px' : '13px 16px',
            borderRadius: 12,
            border: `2px solid ${readOnly ? '#f3f4f6' : '#fce7f3'}`,
            fontSize: 14, outline: 'none',
            fontFamily: "'Sarabun', sans-serif",
            background: readOnly ? '#f9fafb' : '#fff',
            color: readOnly ? '#9ca3af' : '#1a0a14',
            cursor: readOnly ? 'not-allowed' : 'text',
            transition: 'border-color 0.18s',
          }}
          onFocus={e => { if (!readOnly) e.target.style.borderColor = '#f06292' }}
          onBlur={e => { if (!readOnly) e.target.style.borderColor = '#fce7f3' }}
        />
      </div>
      {readOnly && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, paddingLeft: 2 }}>ไม่สามารถแก้ไขได้</p>}
    </div>
  )
}