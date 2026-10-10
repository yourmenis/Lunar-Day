'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

// ปุ่มแบบ Interactive Hover (ดัดแปลงจาก 21st.dev / shadcn)
// โปรเจกต์นี้ไม่ได้ใช้ shadcn และ utility class ของ Tailwind (bg-primary ฯลฯ) ใช้ไม่ได้
// จึงเขียนสไตล์เป็น CSS ในไฟล์เดียวกันแบบคอมโพเนนต์อื่นในโปรเจกต์ และใช้สีธีมชมพูของ Lunar Day
// ชี้เมาส์: จุดชมพูขยายเต็มปุ่ม → ข้อความเดิมเลื่อนออกขวา → ข้อความสีขาว + ลูกศรเลื่อนเข้ามา

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ text = 'Button', className, ...props }, ref) => (
    <button ref={ref} type="button" className={`ihb${className ? ` ${className}` : ''}`} {...props}>
      <style>{`
        .ihb {
          position: relative; overflow: hidden; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 128px; height: 38px; padding: 0 18px; border-radius: 999px;
          border: 1.5px solid rgba(240,98,146,0.45);
          background: rgba(255,255,255,0.7);
          font-family: 'Mitr', sans-serif; font-size: 13.5px; font-weight: 500; color: #c2185b;
          white-space: nowrap; -webkit-tap-highlight-color: transparent;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .ihb:hover, .ihb:focus-visible { border-color: #e04882; box-shadow: 0 6px 18px rgba(194,24,91,0.25); outline: none; }
        .ihb-label {
          position: relative; z-index: 2; display: inline-block; transform: translateX(4px);
          transition: transform 0.3s, opacity 0.3s;
        }
        .ihb-hover {
          position: absolute; inset: 0; z-index: 3;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          color: #fff; opacity: 0; transform: translateX(48px);
          transition: transform 0.3s, opacity 0.3s;
        }
        .ihb-dot {
          position: absolute; z-index: 1; left: 16px; top: 50%;
          width: 8px; height: 8px; margin-top: -4px; border-radius: 8px;
          background: linear-gradient(135deg, #f06292, #c2185b);
          transition: all 0.3s;
        }
        .ihb:hover .ihb-label, .ihb:focus-visible .ihb-label { transform: translateX(48px); opacity: 0; }
        .ihb:hover .ihb-hover, .ihb:focus-visible .ihb-hover { transform: translateX(-2px); opacity: 1; }
        .ihb:hover .ihb-dot, .ihb:focus-visible .ihb-dot {
          left: 0; top: 0; width: 100%; height: 100%; margin-top: 0; border-radius: 999px; transform: scale(1.8);
        }
        @media (prefers-reduced-motion: reduce) {
          .ihb, .ihb * { transition: none !important; }
        }
      `}</style>
      <span className="ihb-label">{text}</span>
      <span className="ihb-hover" aria-hidden="true">
        <span>{text}</span>
        <ArrowRight size={16} />
      </span>
      <span className="ihb-dot" aria-hidden="true" />
    </button>
  ),
)

InteractiveHoverButton.displayName = 'InteractiveHoverButton'

export { InteractiveHoverButton }
