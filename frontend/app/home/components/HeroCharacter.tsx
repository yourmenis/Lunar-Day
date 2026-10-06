'use client'

import { useEffect, useRef, useState } from 'react'

// ภาพประกอบเคลื่อนไหวแบบ 3D (สไตล์ดินปั้น) ในส่วน hero ของหน้า Home — SVG + CSS ล้วน
// - ความนูน: ไล่แสงเงา + จุดสะท้อนแสงแบบเบลอ + เงาตรงรอยต่อ + ความหนาของวัตถุแบน
// - parallax: แต่ละชิ้นขยับตามเมาส์คนละระยะ (ทำใน SVG จึงคมชัดตลอด ไม่ใช้ CSS 3D rotate ที่ทำให้ภาพเบลอ)
// - ลูกตามองตามเมาส์ / สีหน้าเปลี่ยนเฉพาะตอนคลิก-แตะ แล้วกลับมายิ้มเอง
// ตำแหน่งเมาส์ส่งเข้า CSS variables (--px, --py, --ex, --ey) โดยตรง จึงไม่ re-render ทุกครั้งที่ขยับเมาส์

type Expression = 'smile' | 'laugh' | 'wink' | 'love' | 'surprised'
const POKE_EXPRESSIONS: Expression[] = ['laugh', 'wink', 'love', 'surprised']
const EXPRESSION_HOLD_MS = 1800

const VIEW = 320
const EYES_CENTER = { x: 160, y: 168 }   // จุดกึ่งกลางระหว่างตาสองข้าง (พิกัดใน SVG)
const PUPIL_MAX = 2.6                    // ลูกตาขยับได้ไกลสุด (หน่วย SVG)

const HAIR_DARK = '#4a2717'
const LIP = '#c2185b'

const D = (d: number) => ({ '--d': d } as React.CSSProperties)

function Heart({ x, y, s = 1, fill = 'url(#hcHeart)' }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 3 C0 -1 -6 -2 -6 2 C-6 5 -2 7 0 9 C2 7 6 5 6 2 C6 -2 0 -1 0 3 Z" fill={fill} />
      <ellipse cx="-3" cy="1" rx="1.6" ry="1" fill="#fff" opacity="0.7" />
    </g>
  )
}

type EyeMode = 'open' | 'closed' | 'heart' | 'wide'

function Eye({ cx, mode }: { cx: number; mode: EyeMode }) {
  if (mode === 'closed') {
    return <path d={`M${cx - 7.5} 170 Q${cx} 161 ${cx + 7.5} 170`} stroke={HAIR_DARK} strokeWidth={3} fill="none" strokeLinecap="round" />
  }
  if (mode === 'heart') {
    return <Heart x={cx} y={163} s={1.35} />
  }
  const wide = mode === 'wide'
  const rx = wide ? 8.5 : 7.2
  const ry = wide ? 9.8 : 8.6
  const ir = wide ? 5.6 : 5.2
  return (
    <g className="hc-blink">
      {/* ตาขาว (มีเงาเปลือกตาด้านบน) */}
      <ellipse cx={cx} cy={168} rx={rx} ry={ry} fill="url(#hcEyeWhite)" />
      {/* ลูกตา: มองตามเมาส์ */}
      <g className="hc-look">
        <circle cx={cx} cy={168.5} r={ir} fill="url(#hcIris)" />
        <circle cx={cx} cy={168.5} r={ir * 0.5} fill="#1c0d14" />
        <circle cx={cx + 1.9} cy={165.6} r={1.9} fill="#fff" />
        <circle cx={cx - 1.6} cy={171} r={0.9} fill="#fff" opacity="0.85" />
      </g>
      {/* เส้นเปลือกตาบน */}
      <path d={`M${cx - rx - 0.5} ${167} Q${cx} ${168 - ry - 2.5} ${cx + rx + 0.5} ${167}`} stroke={HAIR_DARK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  )
}

function Mouth({ expr }: { expr: Expression }) {
  switch (expr) {
    case 'laugh':
      return (
        <g>
          <path d="M146 192 Q160 215 174 192 Z" fill="url(#hcMouth)" />
          <path d="M152 203 Q160 210 168 203 Q160 199 152 203 Z" fill="#ff8fab" />
          <path d="M148 193 Q160 196 172 193" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
        </g>
      )
    case 'wink':
      return <path d="M148 195 Q162 206 174 191" stroke={LIP} strokeWidth={3.2} fill="none" strokeLinecap="round" />
    case 'love':
      return <path d="M150 194 Q160 203 170 194" stroke={LIP} strokeWidth={3.2} fill="none" strokeLinecap="round" />
    case 'surprised':
      return (
        <g>
          <ellipse cx="160" cy="198" rx="6.5" ry="8" fill="url(#hcMouth)" />
          <ellipse cx="158" cy="194.5" rx="2.2" ry="1.3" fill="#fff" opacity="0.5" />
        </g>
      )
    default:
      return (
        <g>
          <path d="M148 194 Q160 206 172 194" stroke={LIP} strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d="M155 199.5 Q160 201.5 165 199.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
        </g>
      )
  }
}

function eyeModes(expr: Expression): [EyeMode, EyeMode] {
  switch (expr) {
    case 'laugh':     return ['closed', 'closed']
    case 'wink':      return ['open', 'closed']
    case 'love':      return ['heart', 'heart']
    case 'surprised': return ['wide', 'wide']
    default:          return ['open', 'open']
  }
}

// รูปทรงที่ใช้ซ้ำ (เป็นทั้งพื้นผิวและ clip ของแสงเงา)
const HAIR_BACK = 'M98 168 C96 106 126 84 160 84 C194 84 224 106 222 168 L224 216 C210 224 196 220 190 212 L130 212 C124 220 110 224 96 216 Z'
const BANGS = 'M106 152 C104 112 130 96 160 96 C190 96 216 112 214 152 C204 134 186 124 168 122 C156 138 132 148 106 152 Z'
const SHIRT = 'M80 320 C82 262 112 236 160 236 C208 236 238 262 240 320 Z'

export default function HeroCharacter() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [expr, setExpr] = useState<Expression>('smile')
  const pokeCount = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // ── ติดตามเมาส์ทั้งหน้า → parallax / ลูกตา ──
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    let frame = 0
    let last: { x: number; y: number } | null = null

    const apply = () => {
      frame = 0
      if (!last) return
      const r = el.getBoundingClientRect()
      if (!r.width) return
      const px = Math.max(-1, Math.min(1, (last.x - (r.left + r.width / 2)) / (window.innerWidth / 2)))
      const py = Math.max(-1, Math.min(1, (last.y - (r.top + r.height / 2)) / (window.innerHeight / 2)))
      const scale = r.width / VIEW
      const dx = last.x - (r.left + EYES_CENTER.x * scale)
      const dy = last.y - (r.top + EYES_CENTER.y * scale)
      const dist = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, dist / 160)
      el.style.setProperty('--px', px.toFixed(3))
      el.style.setProperty('--py', py.toFixed(3))
      el.style.setProperty('--ex', ((dx / dist) * reach * PUPIL_MAX).toFixed(2))
      el.style.setProperty('--ey', ((dy / dist) * reach * PUPIL_MAX).toFixed(2))
    }
    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      last = null
      for (const k of ['--px', '--py', '--ex', '--ey']) el.style.setProperty(k, '0')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  // ── จิ้ม (คลิก/แตะ) → สีหน้าถัดไป แล้วกลับมายิ้ม ──
  const poke = () => {
    const next = POKE_EXPRESSIONS[pokeCount.current % POKE_EXPRESSIONS.length]
    pokeCount.current += 1
    setExpr(next)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setExpr('smile'), EXPRESSION_HOLD_MS)
  }

  const [leftEye, rightEye] = eyeModes(expr)
  const blush = expr === 'love' || expr === 'laugh' ? 0.85 : 0.55
  const browLift = expr === 'surprised' ? -4 : 0

  return (
    <div
      ref={wrapRef}
      className="hc-wrap"
      onPointerDown={poke}
      role="img"
      aria-label="ภาพประกอบผู้หญิงกับ AI วิเคราะห์ ปฏิทินรอบเดือน และผ้าอนามัย (คลิกเพื่อเปลี่ยนสีหน้า)"
    >
      <style>{`
        .hc-wrap {
          --px: 0; --py: 0; --ex: 0; --ey: 0;
          width: 100%; height: 100%; cursor: pointer;
          -webkit-tap-highlight-color: transparent; user-select: none;
        }
        .hc-wrap svg { width: 100%; height: 100%; overflow: visible; display: block; }
        .hc-wrap svg * { transform-box: fill-box; }

        /* parallax: ยิ่ง --d มาก ยิ่งอยู่ใกล้ (ขยับมาก) */
        .hc-depth {
          transform: translate(calc(var(--px) * var(--d) * 1px), calc(var(--py) * var(--d) * 1px));
          transition: transform 0.3s ease-out;
        }
        .hc-look {
          transform: translate(calc(var(--ex) * 1px), calc(var(--ey) * 1px));
          transition: transform 0.12s ease-out;
        }

        .hc-glow   { animation: hcGlow 4s ease-in-out infinite; transform-origin: center; }
        .hc-person { animation: hcBob 3.2s ease-in-out infinite; }
        .hc-head   { animation: hcSway 5s ease-in-out infinite; transform-origin: 50% 90%; }
        .hc-blink  { animation: hcBlink 4.2s infinite; transform-origin: center; }
        .hc-ai     { animation: hcFloat 3s ease-in-out infinite; }
        .hc-ai-ring{ animation: hcSpin 9s linear infinite; transform-origin: center; }
        .hc-cal    { animation: hcFloatTilt 3.6s ease-in-out infinite; transform-origin: center; }
        .hc-pad    { animation: hcFloatTilt2 4s ease-in-out infinite 0.6s; transform-origin: center; }
        .hc-drop   { animation: hcDrop 2.6s ease-in-out infinite; transform-origin: center; }
        .hc-spark  { animation: hcTwinkle 2.4s ease-in-out infinite; transform-origin: center; }
        .hc-spark.d1 { animation-delay: 0.8s; }
        .hc-spark.d2 { animation-delay: 1.6s; }
        .hc-face   { animation: hcPop 0.3s ease; transform-origin: center; }
        .hc-wrap:active .hc-person { animation: hcSquish 0.25s ease; }

        @keyframes hcGlow   { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: .85; transform: scale(1.06); } }
        @keyframes hcBob    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes hcSway   { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes hcBlink  { 0%,90%,100% { transform: scaleY(1); } 94% { transform: scaleY(0.1); } }
        @keyframes hcFloat  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes hcSpin   { to { transform: rotate(360deg); } }
        @keyframes hcFloatTilt  { 0%,100% { transform: translateY(0) rotate(-10deg); } 50% { transform: translateY(-9px) rotate(-4deg); } }
        @keyframes hcFloatTilt2 { 0%,100% { transform: translateY(0) rotate(14deg); }  50% { transform: translateY(-10px) rotate(8deg); } }
        @keyframes hcDrop   { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(5px) scale(0.92); } }
        @keyframes hcTwinkle{ 0%,100% { opacity: 0; transform: scale(.4); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes hcPop    { from { transform: scale(.88); opacity: .5; } to { transform: scale(1); opacity: 1; } }
        @keyframes hcSquish { 0% { transform: scale(1, 1); } 50% { transform: scale(1.04, .96); } 100% { transform: scale(1, 1); } }

        @media (prefers-reduced-motion: reduce) {
          .hc-wrap * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision">
        <defs>
          {/* ── แสงด้านหลัง ── */}
          <radialGradient id="hcGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f06292" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f06292" stopOpacity="0" />
          </radialGradient>

          {/* ── วัสดุแบบดินปั้น: แสงซ้ายบน → เงาขวาล่าง ── */}
          <radialGradient id="hcSkin" cx="36%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#ffeadb" />
            <stop offset="55%" stopColor="#f8cdb0" />
            <stop offset="100%" stopColor="#df9d7c" />
          </radialGradient>
          <linearGradient id="hcNeck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d99070" />
            <stop offset="45%" stopColor="#f2c1a1" />
            <stop offset="100%" stopColor="#f6c9ab" />
          </linearGradient>
          <radialGradient id="hcHair" cx="34%" cy="22%" r="88%">
            <stop offset="0%" stopColor="#a8693f" />
            <stop offset="50%" stopColor="#6e3f25" />
            <stop offset="100%" stopColor="#3b1f12" />
          </radialGradient>
          <radialGradient id="hcShirt" cx="34%" cy="18%" r="95%">
            <stop offset="0%" stopColor="#ffb3cf" />
            <stop offset="45%" stopColor="#f26a99" />
            <stop offset="100%" stopColor="#b8386b" />
          </radialGradient>
          <linearGradient id="hcEyeWhite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d4dc" />
            <stop offset="40%" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="hcIris" cx="50%" cy="65%" r="60%">
            <stop offset="0%" stopColor="#b07a52" />
            <stop offset="60%" stopColor="#6a3a22" />
            <stop offset="100%" stopColor="#3a1d10" />
          </radialGradient>
          <linearGradient id="hcMouth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8e1240" />
            <stop offset="100%" stopColor="#c2185b" />
          </linearGradient>

          {/* ── วัตถุรอบตัว ── */}
          <radialGradient id="hcAiSphere" cx="34%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#ffd1e4" />
            <stop offset="40%" stopColor="#ee6aa8" />
            <stop offset="100%" stopColor="#6f2aa6" />
          </radialGradient>
          <linearGradient id="hcCard" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#efdfe7" />
          </linearGradient>
          <linearGradient id="hcCalHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff8ab3" />
            <stop offset="100%" stopColor="#d43c77" />
          </linearGradient>
          <linearGradient id="hcRing" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8e1d4b" />
            <stop offset="45%" stopColor="#f27aa8" />
            <stop offset="100%" stopColor="#8e1d4b" />
          </linearGradient>
          <linearGradient id="hcPadBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f4f1f8" />
            <stop offset="100%" stopColor="#dcd7e8" />
          </linearGradient>
          <radialGradient id="hcPadCore" cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fff2f7" />
            <stop offset="100%" stopColor="#f8c6da" />
          </radialGradient>
          <radialGradient id="hcBlood" cx="35%" cy="35%" r="72%">
            <stop offset="0%" stopColor="#ff8fab" />
            <stop offset="55%" stopColor="#e5335e" />
            <stop offset="100%" stopColor="#9c1036" />
          </radialGradient>
          <radialGradient id="hcHeart" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffc2d6" />
            <stop offset="100%" stopColor="#e8457a" />
          </radialGradient>

          {/* ── ฟิลเตอร์ ── */}
          <filter id="hcShadow" x="-30%" y="-30%" width="160%" height="175%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1a0a14" floodOpacity="0.42" />
          </filter>
          <filter id="hcBlur1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4" /></filter>
          <filter id="hcBlur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="hcBlur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>

          <clipPath id="hcFaceClip"><ellipse cx="160" cy="162" rx="52" ry="56" /></clipPath>
          <clipPath id="hcHairClip"><path d={HAIR_BACK} /></clipPath>
          <clipPath id="hcBangsClip"><path d={BANGS} /></clipPath>
          <clipPath id="hcShirtClip"><path d={SHIRT} /></clipPath>
        </defs>

        {/* แสงฟุ้งด้านหลัง (ไกลสุด) */}
        <g className="hc-depth" style={D(-6)}>
          <circle className="hc-glow" cx="160" cy="185" r="130" fill="url(#hcGlowGrad)" />
        </g>

        {/* ── ตัวผู้หญิง ── */}
        <g className="hc-depth" style={D(4)}>
          <g className="hc-person" filter="url(#hcShadow)">
            {/* คอ */}
            <rect x="145" y="204" width="30" height="40" rx="11" fill="url(#hcNeck)" />

            {/* เสื้อ + แสงเงา */}
            <path d={SHIRT} fill="url(#hcShirt)" />
            <g clipPath="url(#hcShirtClip)">
              <ellipse cx="226" cy="300" rx="28" ry="60" fill="#8e2453" opacity="0.45" filter="url(#hcBlur6)" />
              <ellipse cx="160" cy="246" rx="34" ry="10" fill="#9c2a5c" opacity="0.45" filter="url(#hcBlur3)" />
              <ellipse cx="116" cy="268" rx="20" ry="10" fill="#fff" opacity="0.4" filter="url(#hcBlur3)" />
            </g>
            {/* คอเสื้อ (มีความหนา) */}
            <path d="M139 238 Q160 259 181 238" stroke="#c94677" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M139 237 Q160 257 181 237" stroke="#ffe0ec" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* ศีรษะหันตามเมาส์เล็กน้อย */}
            <g className="hc-depth" style={D(5)}>
              <g className="hc-head">
                {/* ผมด้านหลัง + เงาด้านขวา */}
                <path d={HAIR_BACK} fill="url(#hcHair)" />
                <g clipPath="url(#hcHairClip)">
                  <ellipse cx="218" cy="190" rx="14" ry="40" fill="#2a140b" opacity="0.5" filter="url(#hcBlur6)" />
                </g>

                {/* หู */}
                <ellipse cx="108" cy="168" rx="8" ry="11" fill="url(#hcSkin)" />
                <ellipse cx="109" cy="169" rx="3.5" ry="6" fill="#d98e6e" opacity="0.6" />
                <ellipse cx="212" cy="168" rx="8" ry="11" fill="url(#hcSkin)" />
                <ellipse cx="211" cy="169" rx="3.5" ry="6" fill="#d98e6e" opacity="0.6" />

                {/* หน้า + แสงเงาบนหน้า */}
                <ellipse cx="160" cy="162" rx="52" ry="56" fill="url(#hcSkin)" />
                <g clipPath="url(#hcFaceClip)">
                  {/* เงาจากผมหน้าม้าที่ตกลงบนหน้าผาก */}
                  <path d={BANGS} transform="translate(0 7)" fill="#cf8664" opacity="0.5" filter="url(#hcBlur3)" />
                  {/* เงาด้านขวาของใบหน้า */}
                  <ellipse cx="204" cy="176" rx="20" ry="46" fill="#c9805f" opacity="0.4" filter="url(#hcBlur6)" />
                  {/* เงาใต้คาง */}
                  <ellipse cx="160" cy="222" rx="38" ry="10" fill="#c27a5a" opacity="0.45" filter="url(#hcBlur3)" />
                  {/* จุดสะท้อนแสงที่แก้มซ้าย */}
                  <ellipse cx="128" cy="174" rx="12" ry="8" fill="#fff" opacity="0.4" filter="url(#hcBlur3)" />
                </g>

                {/* ผมหน้าม้า + ความเงา */}
                <path d={BANGS} fill="url(#hcHair)" />
                <g clipPath="url(#hcBangsClip)">
                  <path d="M120 124 C134 104 182 102 202 122" stroke="#fff" strokeOpacity="0.38" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#hcBlur1)" />
                  <path d="M150 104 C146 118 138 132 124 142" stroke={HAIR_DARK} strokeOpacity="0.55" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M176 104 C176 114 172 120 168 124" stroke={HAIR_DARK} strokeOpacity="0.5" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>

                {/* สีหน้า (เปลี่ยนเมื่อคลิก) */}
                <g key={expr} className="hc-face">
                  <g transform={`translate(0 ${browLift})`}>
                    <path d="M130 151 Q139 145.5 148 150" stroke={HAIR_DARK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                    <path d="M172 150 Q181 145.5 190 151" stroke={HAIR_DARK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                  </g>
                  <Eye cx={140} mode={leftEye} />
                  <Eye cx={180} mode={rightEye} />
                  <ellipse cx="125" cy="187" rx="11" ry="6" fill="#ff7fa2" opacity={blush} filter="url(#hcBlur1)" />
                  <ellipse cx="195" cy="187" rx="11" ry="6" fill="#ff7fa2" opacity={blush} filter="url(#hcBlur1)" />
                  {/* จมูก: เงาข้าง + จุดแสงปลายจมูก */}
                  <path d="M157 181 Q160 185 164 181" stroke="#c9805f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <ellipse cx="158.5" cy="177" rx="2.2" ry="1.4" fill="#fff" opacity="0.55" />
                  <Mouth expr={expr} />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* ── ป้าย AI (ทรงกลม) ── */}
        <g className="hc-depth" style={D(10)}>
          <g className="hc-ai" filter="url(#hcShadow)">
            <circle className="hc-ai-ring" cx="160" cy="46" r="31" fill="none" stroke="#ffadd0" strokeWidth="2" strokeDasharray="5 6" />
            <circle cx="160" cy="46" r="24" fill="url(#hcAiSphere)" />
            <ellipse cx="166" cy="62" rx="14" ry="5" fill="#4a1470" opacity="0.35" filter="url(#hcBlur3)" />
            <ellipse cx="151" cy="35" rx="9" ry="5.5" fill="#fff" opacity="0.75" filter="url(#hcBlur1)" />
            <text x="160.6" y="54.6" textAnchor="middle" fontSize="20" fontWeight="800" fill="#5a1b80" opacity="0.45" fontFamily="'Mitr', sans-serif">AI</text>
            <text x="160" y="53.5" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="'Mitr', sans-serif">AI</text>
            <path d="M184 22 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 Z" fill="#ffd36e" />
          </g>
        </g>

        {/* ── ปฏิทินรอบเดือน (ซ้าย) — มีความหนา ── */}
        <g className="hc-depth" style={D(16)}>
          <g className="hc-cal" filter="url(#hcShadow)">
            <rect x="26" y="143" width="66" height="62" rx="11" fill="#c5869f" />
            <rect x="22" y="138" width="66" height="62" rx="11" fill="url(#hcCard)" />
            <path d="M22 149 a11 11 0 0 1 11 -11 h44 a11 11 0 0 1 11 11 v8 h-66 Z" fill="url(#hcCalHead)" />
            <rect x="28" y="141" width="30" height="4" rx="2" fill="#fff" opacity="0.45" />
            {/* ห่วงปฏิทิน (ทรงกระบอก) */}
            <rect x="35" y="131" width="6.5" height="14" rx="3.2" fill="url(#hcRing)" />
            <rect x="68.5" y="131" width="6.5" height="14" rx="3.2" fill="url(#hcRing)" />
            {[0, 1, 2, 3].map(c => [0, 1, 2].map(r => {
              const hot = c === 2 && r === 1
              return (
                <g key={`${c}-${r}`}>
                  <rect x={31 + c * 13} y={164 + r * 11} width="8" height="7" rx="2" fill={hot ? '#a3123f' : '#e8b8ca'} />
                  <rect x={31 + c * 13} y={163 + r * 11} width="8" height="7" rx="2" fill={hot ? '#ef4672' : '#fbe3ec'} />
                </g>
              )
            }))}
            <path d="M84 187 C84 187 76.5 196.5 76.5 201 C76.5 205.5 80 208 84 208 C88 208 91.5 205.5 91.5 201 C91.5 196.5 84 187 84 187 Z" fill="url(#hcBlood)" />
            <ellipse cx="81" cy="199" rx="1.8" ry="2.8" fill="#fff" opacity="0.75" />
          </g>
        </g>

        {/* ── ผ้าอนามัย (ขวา) — มีความหนา ── */}
        <g className="hc-depth" style={D(13)}>
          <g className="hc-pad" filter="url(#hcShadow)">
            <ellipse cx="273" cy="172" rx="27" ry="13" fill="#c9c3da" />
            <ellipse cx="270" cy="168" rx="27" ry="12.5" fill="url(#hcPadBody)" />
            <rect x="258" y="126" width="32" height="92" rx="16" fill="#cfc8de" />
            <rect x="254" y="122" width="32" height="92" rx="16" fill="url(#hcPadBody)" />
            <rect x="262" y="134" width="16" height="68" rx="8" fill="url(#hcPadCore)" />
            <path d="M270 142 v52" stroke="#f3a9c6" strokeWidth="2" strokeDasharray="3 4" />
            <rect x="257" y="130" width="5" height="50" rx="2.5" fill="#fff" opacity="0.85" filter="url(#hcBlur1)" />
          </g>
        </g>

        {/* ── หยดเลือด + หัวใจ (ใกล้สุด) ── */}
        <g className="hc-depth" style={D(20)}>
          <g className="hc-drop" filter="url(#hcShadow)">
            <path d="M58 236 C58 236 48.5 248 48.5 253.5 C48.5 258.5 52.8 262 58 262 C63.2 262 67.5 258.5 67.5 253.5 C67.5 248 58 236 58 236 Z" fill="url(#hcBlood)" />
            <ellipse cx="54" cy="251" rx="2.4" ry="4" fill="#fff" opacity="0.75" />
          </g>
          <g className="hc-spark"><Heart x={262} y={248} s={1.6} /></g>
        </g>
        <g className="hc-depth" style={D(8)}>
          <path className="hc-spark d1" d="M100 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#fff" />
          <path className="hc-spark d2" d="M236 92 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 Z" fill="#ffd36e" />
        </g>
      </svg>
    </div>
  )
}
