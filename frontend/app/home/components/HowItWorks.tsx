'use client'

import { useEffect, useState } from 'react'
import { ImageIcon, Droplets, CalendarDays, Zap, HeartPulse, ChevronRight } from 'lucide-react'

// แผนภาพเคลื่อนไหว "Lunar Day ทำงานอย่างไร" ในหน้า Home
// ซ้าย: ข้อมูลที่ผู้ใช้ส่ง (ภาพ + อาการ) รวมที่โลโก้ → กลาง: ส่งต่อให้ AI → ขวา: รายงานผลวิเคราะห์
// - จุดแสงวิ่งตามเส้น, เส้นประเลื่อน, โหนดรอบโลโก้กะพริบสลับกัน
// - รายงานใหม่ทุก REPORT_MS: เลขรายงานเพิ่มขึ้น แท่งกราฟโตขึ้นใหม่ และระดับความเสี่ยงเปลี่ยน
// - ปิดการเคลื่อนไหวทั้งหมดเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว

const REPORT_MS = 3600
const FIRST_REPORT = 155

// ตำแหน่งข้อมูลรอบโลโก้ (พิกัดในระนาบ 1000×300 แสดงเฉพาะช่วง x 60–1000, y 18–266)
const HUB = { x: 190, y: 128 }
const INPUTS = [
  { x: 112, y: 70,  Icon: ImageIcon,    label: 'ภาพลิ่มเลือด' },
  { x: 196, y: 42,  Icon: Droplets,     label: 'ปริมาณ' },
  { x: 276, y: 74,  Icon: CalendarDays, label: 'รอบเดือน' },
  { x: 96,  y: 166, Icon: Zap,          label: 'อาการปวด' },
  { x: 262, y: 196, Icon: HeartPulse,   label: 'อาการอื่น ๆ' },
]

// ผลที่วนแสดงในรายงาน (ชื่อระดับเดียวกับตารางระดับความเสี่ยง)
const RESULTS = [
  { level: 'ปกติ',          color: '#3ccf2a', badgeW: 40, bars: [34, 46, 28, 58, 40, 64] },
  { level: 'เสี่ยงปานกลาง', color: '#e2dc12', badgeW: 76, bars: [44, 30, 56, 38, 62, 48] },
  { level: 'เสี่ยงสูง',     color: '#ff8a00', badgeW: 52, bars: [26, 52, 40, 66, 34, 56] },
]

const PATH_IN_A  = 'M226 120 C 300 116, 330 130, 398 158 S 440 168, 452 168'
const PATH_IN_B  = 'M226 136 C 290 150, 330 186, 400 196 S 440 194, 452 192'
const PATH_OUT_A = 'M642 168 C 690 168, 700 150, 748 150'
const PATH_OUT_B = 'M642 192 C 690 196, 712 212, 748 214'

export default function HowItWorks() {
  const [report, setReport] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setReport(r => r + 1), REPORT_MS)
    return () => clearInterval(t)
  }, [])

  const result = RESULTS[report % RESULTS.length]

  return (
    <div className="hiw">
      <style>{`
        .hiw {
          position: relative; overflow: hidden; border-radius: 26px;
          background: linear-gradient(160deg, #241019 0%, #1a0a14 60%, #261020 100%);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 10px 40px rgba(194,24,91,0.10);
        }
        .hiw-svg { position: relative; display: block; width: calc(100% - 64px); max-width: 900px; height: auto; margin: 30px auto 6px; }

        .hiw-line { fill: none; stroke: rgba(255,255,255,0.18); stroke-width: 1.3; }
        .hiw-line.dash { stroke-dasharray: 5 6; animation: hiwDash 1.4s linear infinite; }
        .hiw-spoke { stroke: rgba(255,255,255,0.16); stroke-width: 1.2; stroke-dasharray: 3 5; animation: hiwDash 1.8s linear infinite; }
        @keyframes hiwDash { to { stroke-dashoffset: -22; } }

        .hiw-node { animation: hiwBlink 4s ease-in-out infinite; }
        @keyframes hiwBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

        .hiw-ai { animation: hiwGlow 2.4s ease-in-out infinite; }
        @keyframes hiwGlow { 0%, 100% { stroke: rgba(255,255,255,0.22); } 50% { stroke: rgba(240,98,146,0.7); } }

        .hiw-bar { transform-box: fill-box; transform-origin: bottom; animation: hiwGrow 0.9s cubic-bezier(0.2,0.8,0.2,1) both; }
        @keyframes hiwGrow { from { transform: scaleY(0.05); } to { transform: scaleY(1); } }
        .hiw-report { animation: hiwIn 0.5s ease both; }
        @keyframes hiwIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        .hiw-caps {
          /* กว้างเท่ากราฟิกและจัดกลางเหมือนกัน → ซ้ายอยู่ใต้ส่วนรับข้อมูล, ขวาอยู่ใต้ส่วนรายงาน */
          position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          width: calc(100% - 64px); max-width: 900px; margin: 0 auto; padding: 10px 0 34px;
        }
        .hiw-cap-title { font-family: 'Mitr', sans-serif; font-weight: 500; font-size: 16px; color: #fff; margin-bottom: 6px; }
        .hiw-cap-text { font-size: 14.5px; line-height: 1.75; color: rgba(255,255,255,0.5); }
        .hiw-caps > div:last-child { text-align: right; }
        .hiw-caps > div:last-child .hiw-cap-text { margin-left: auto; }

        @media (max-width: 768px) {
          .hiw { border-radius: 20px; }
          .hiw-svg { width: calc(100% - 28px); margin: 20px auto 4px; }
          .hiw-line, .hiw-spoke { stroke-width: 2.4; }
          .hiw-caps { grid-template-columns: 1fr; gap: 20px; width: calc(100% - 40px); padding: 12px 0 24px; }
          .hiw-caps > div:last-child { text-align: left; }
          .hiw-cap-title { font-size: 16px; }
          .hiw-cap-text { font-size: 14px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hiw *, .hiw-svg * { animation: none !important; }
          .hiw-dot { display: none; }
        }
      `}</style>

        <svg className="hiw-svg" viewBox="64 20 920 240" role="img"
          aria-label="ผู้ใช้ส่งภาพลิ่มเลือดและข้อมูลอาการ ระบบ AI ของ Lunar Day วิเคราะห์ แล้วสร้างรายงานผลการประเมินความเสี่ยงอัตโนมัติ">
          <defs>
            <clipPath id="hiwLogoClip"><rect x={HUB.x - 17} y={HUB.y - 17} width="34" height="34" rx="9" /></clipPath>
            <clipPath id="hiwAiLogoClip"><rect x="470" y="166" width="28" height="28" rx="8" /></clipPath>
          </defs>

          {/* ── ข้อมูลรอบโลโก้ ── */}
          {INPUTS.map((n, i) => (
            <line key={`s${i}`} className="hiw-spoke" x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} />
          ))}
          {INPUTS.map(({ x, y, Icon, label }, i) => (
            <g key={label} className="hiw-node" style={{ animationDelay: `${i * 0.6}s` }}>
              <title>{label}</title>
              <circle cx={x} cy={y} r="17" fill="#2a1320" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
              <Icon x={x - 9} y={y - 9} width={18} height={18} color="rgba(255,209,225,0.85)" strokeWidth={1.6} />
              <circle cx={x + 12} cy={y + 12} r="3.2" fill="#f06292" stroke="#1a0a14" strokeWidth="1.5" />
            </g>
          ))}
          <rect x={HUB.x - 21} y={HUB.y - 21} width="42" height="42" rx="11" fill="#1a0a14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <image href="/logolunar.png" x={HUB.x - 17} y={HUB.y - 17} width="34" height="34" clipPath="url(#hiwLogoClip)" preserveAspectRatio="xMidYMid slice" />

          {/* ── เส้นส่งข้อมูลเข้า AI ── */}
          <path className="hiw-line" d={PATH_IN_A} />
          <path className="hiw-line dash" d={PATH_IN_B} />
          <circle cx="228" cy="120" r="3" fill="rgba(255,255,255,0.85)" />
          <circle cx="228" cy="136" r="3" fill="rgba(255,255,255,0.85)" />
          <circle className="hiw-dot" r="3" fill="#ff9ec0">
            <animateMotion dur="2.6s" repeatCount="indefinite" path={PATH_IN_A} />
          </circle>

          {/* ── กล่อง AI ── */}
          <rect className="hiw-ai" x="452" y="150" width="190" height="60" rx="12" fill="#22101b" strokeWidth="1.6" />
          <image href="/logolunar.png" x="470" y="166" width="28" height="28" clipPath="url(#hiwAiLogoClip)" preserveAspectRatio="xMidYMid slice" />
          <text x="510" y="186" fill="#fff" fontFamily="'Mitr', sans-serif" fontSize="15" fontWeight="500" letterSpacing="2.5">LUNAR AI</text>
          <ChevronRight x={612} y={170} width={20} height={20} color="rgba(255,255,255,0.7)" />

          {/* ── เส้นส่งผลไปที่รายงาน ── */}
          <path className="hiw-line" d={PATH_OUT_A} />
          <path className="hiw-line dash" d={PATH_OUT_B} />
          <circle cx="644" cy="168" r="3" fill="rgba(255,255,255,0.85)" />
          <circle cx="644" cy="192" r="3" fill="rgba(255,255,255,0.85)" />
          <circle className="hiw-dot" r="3" fill="#ff9ec0">
            <animateMotion dur="1.6s" repeatCount="indefinite" path={PATH_OUT_A} />
          </circle>

          {/* ── รายงานผลวิเคราะห์ (ซ้อนกัน 3 ใบ) ── */}
          <rect x="764" y="50" width="200" height="176" rx="10" fill="#211019" stroke="rgba(255,255,255,0.1)" />
          <g key={report} className="hiw-report">
            <rect x="748" y="64" width="200" height="176" rx="10" fill="#26121d" stroke="rgba(255,255,255,0.2)" />
            <text x="764" y="88" fill="rgba(255,255,255,0.7)" fontFamily="ui-monospace, Consolas, monospace" fontSize="10.5" letterSpacing="1">
              REPORT #{FIRST_REPORT + report}
            </text>
            <rect x="764" y="100" width="104" height="7" rx="2" fill="rgba(255,255,255,0.75)" />
            <rect x="764" y="114" width="148" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
            {result.bars.map((h, i) => (
              <rect key={i} className="hiw-bar" x={764 + i * 18} y={222 - h} width="11" height={h} rx="1.5"
                fill={i === result.bars.length - 1 ? result.color : `rgba(255,255,255,${0.32 + i * 0.07})`}
                style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
            {/* ป้ายระดับความเสี่ยง (มุมขวาบน) — กว้างตามความยาวชื่อระดับ */}
            <rect x={936 - result.badgeW} y="75" width={result.badgeW} height="18" rx="9" fill={result.color} opacity="0.2" />
            <text x={936 - result.badgeW / 2} y="88" textAnchor="middle" fill={result.color} fontFamily="'Sarabun', sans-serif" fontSize="10.5" fontWeight="600">{result.level}</text>
            <rect x="882" y="170" width="52" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
            <rect x="882" y="182" width="52" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          </g>
        </svg>

        <div className="hiw-caps">
          <div>
            <div className="hiw-cap-title">ภาพและอาการ รวมไว้ในที่เดียว</div>
            <p className="hiw-cap-text">
              อัปโหลดภาพลิ่มเลือดและตอบแบบสอบถามอาการ ระบบรวบรวมข้อมูลทั้งหมดส่งให้ AI วิเคราะห์ในขั้นตอนเดียว
            </p>
          </div>
          <div>
            <div className="hiw-cap-title">สรุปผลวิเคราะห์อัตโนมัติ</div>
            <p className="hiw-cap-text">
              รับผลประเมินระดับความเสี่ยง โรคที่อาจเกี่ยวข้อง และคำแนะนำเบื้องต้นภายในไม่กี่วินาที พร้อมบันทึกไว้ในประวัติ
            </p>
          </div>
        </div>
    </div>
  )
}
