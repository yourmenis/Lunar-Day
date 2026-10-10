'use client'

import { useEffect, useRef, useState } from 'react'

// dropdown ขนาดเล็กสำหรับเลือกเดือน/ปีในปฏิทินวันเกิด
// ใช้แทน <select> เพราะรายการของ <select> เบราว์เซอร์เป็นผู้วาด กำหนดความสูงไม่ได้ (รายการปี 101 ปีจึงยาวทะลุจอ)
// รายการนี้สูงไม่เกิน LIST_MAX_H แล้วเลื่อนดูภายในกรอบ เปิดมาจะเลื่อนไปที่ค่าที่เลือกอยู่ให้เอง

type Option = { value: number; label: string }

const LIST_MAX_H = 168

export default function MiniSelect({ value, options, onChange, theme = 'light', ariaLabel }: {
  value: number
  options: Option[]
  onChange: (v: number) => void
  theme?: 'light' | 'dark'
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const current = options.find(o => o.value === value)

  useEffect(() => {
    if (!open) return
    // เลื่อนรายการให้ค่าที่เลือกอยู่ตรงกลางกรอบ
    const list = listRef.current
    const sel = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (list && sel) list.scrollTop = sel.offsetTop - list.clientHeight / 2 + sel.clientHeight / 2

    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); setOpen(false) }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className={`ms ms-${theme}`}>
      <style>{`
        .ms { position: relative; flex: 1; min-width: 0; }
        .ms-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 4px;
          padding: 3px 6px; border-radius: 8px; font-family: 'Sarabun', sans-serif; font-size: 10px;
          cursor: pointer; outline: none; white-space: nowrap;
        }
        .ms-btn span { overflow: hidden; text-overflow: ellipsis; }
        .ms-btn::after { content: '▾'; font-size: 9px; opacity: 0.7; }
        .ms-list {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 5;
          max-height: ${LIST_MAX_H}px; overflow-y: auto; overscroll-behavior: contain;
          border-radius: 8px; padding: 3px;
        }
        .ms-opt {
          display: block; width: 100%; text-align: left; border: none; background: transparent;
          padding: 4px 7px; border-radius: 6px; font-family: 'Sarabun', sans-serif; font-size: 10.5px;
          cursor: pointer; white-space: nowrap;
        }
        /* แถบเลื่อนแบบกระจก: รางโปร่งใส แท่งเลื่อนโปร่งแสงขอบมน */
        .ms-list::-webkit-scrollbar { width: 6px; }
        .ms-list::-webkit-scrollbar-track { background: transparent; margin: 4px 0; }
        .ms-list::-webkit-scrollbar-thumb { border-radius: 999px; background-clip: padding-box; border: 1px solid transparent; }

        .ms-light .ms-btn { border: 1px solid #fce7f3; background: #fff; color: #1a0a14; }
        .ms-light .ms-btn:focus-visible { border-color: #f06292; }
        .ms-light .ms-list {
          background: rgba(255,255,255,0.72); border: 1px solid rgba(255,255,255,0.8);
          -webkit-backdrop-filter: blur(14px) saturate(160%); backdrop-filter: blur(14px) saturate(160%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 24px rgba(194,24,91,0.15);
          scrollbar-color: rgba(240,98,146,0.45) transparent; scrollbar-width: thin;
        }
        .ms-light .ms-opt { color: #1a0a14; }
        .ms-light .ms-opt:hover { background: #fce4ec; }
        .ms-light .ms-opt[aria-selected="true"] { background: #f06292; color: #fff; }
        .ms-light .ms-list::-webkit-scrollbar-thumb { background-color: rgba(240,98,146,0.3); }
        .ms-light .ms-list::-webkit-scrollbar-thumb:hover { background-color: rgba(240,98,146,0.5); }

        .ms-dark .ms-btn { border: 1px solid rgba(255,255,255,0.16); background: rgba(255,255,255,0.08); color: #fff; }
        .ms-dark .ms-btn:focus-visible { border-color: rgba(240,120,170,0.7); }
        .ms-dark .ms-list {
          background: rgba(60,24,80,0.32); border: 1px solid rgba(255,255,255,0.22);
          -webkit-backdrop-filter: blur(16px) saturate(170%); backdrop-filter: blur(16px) saturate(170%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 28px rgba(0,0,0,0.45);
          scrollbar-color: rgba(255,255,255,0.4) transparent; scrollbar-width: thin;
        }
        .ms-dark .ms-opt { color: #fff; }
        .ms-dark .ms-opt:hover { background: rgba(255,255,255,0.12); }
        .ms-dark .ms-opt[aria-selected="true"] { background: linear-gradient(135deg, #f06292, #c2185b); }
        .ms-dark .ms-list::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.22); }
        .ms-dark .ms-list::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.38); }
      `}</style>
      <button
        type="button" className="ms-btn" onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel}
      >
        <span>{current?.label ?? ''}</span>
      </button>
      {open && (
        <div ref={listRef} className="ms-list" role="listbox" aria-label={ariaLabel}>
          {options.map(o => (
            <button
              key={o.value} type="button" role="option" aria-selected={o.value === value}
              className="ms-opt"
              onClick={() => { onChange(o.value); setOpen(false) }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
