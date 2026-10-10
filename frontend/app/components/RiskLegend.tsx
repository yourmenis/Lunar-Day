import { RISK_LEVELS } from '../lib/riskLevels'

// ตาราง "ระดับความเสี่ยงของประจำเดือน" (5 ช่อง: ปกติ / ปานกลาง / สูง / ฉุกเฉิน / ไม่พบความเสี่ยงที่ชัดเจน)
// current = ระดับของผลนี้ (ถ้ามี) จะถูกเน้นให้เด่นกว่าช่องอื่น
export default function RiskLegend({ current }: { current?: string | null }) {
  const hasCurrent = !!current && RISK_LEVELS.some(r => r.key === current)
  return (
    <div className="risk-legend">
      <style>{`
        .risk-legend-title {
          font-family: 'Mitr', sans-serif; font-size: 15px; font-weight: 600;
          color: #1a0a14; margin-bottom: 12px;
        }
        .risk-legend-box {
          display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
          border: 1.5px solid #e6d9df; border-radius: 22px; background: #fff;
          padding: 14px 6px 18px;
        }
        .risk-legend-col {
          padding: 0 14px; text-align: center; border-left: 1.5px solid #e6d9df;
          transition: opacity 0.2s, transform 0.2s;
        }
        .risk-legend-col:first-child { border-left: none; }
        .risk-legend-col.dim { opacity: 0.45; }
        .risk-legend-col.on { transform: translateY(-2px); }
        .risk-legend-head {
          display: block; padding: 7px 8px; border-radius: 6px 6px 18px 6px;
          font-family: 'Mitr', sans-serif; font-size: 14.5px; font-weight: 500;
          margin-bottom: 10px; line-height: 1.35;
        }
        .risk-legend-col.on .risk-legend-head { box-shadow: 0 6px 16px rgba(0,0,0,0.18); }
        .risk-legend-text { font-family: 'Sarabun', sans-serif; font-size: 13.5px; color: #3a2030; line-height: 1.7; }
        @media (max-width: 900px) {
          .risk-legend-box { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 16px; }
          .risk-legend-col:nth-child(odd) { border-left: none; }
        }
        @media (max-width: 480px) {
          .risk-legend-box { grid-template-columns: 1fr; }
          .risk-legend-col { border-left: none; }
        }
      `}</style>
      <div className="risk-legend-title">ระดับความเสี่ยงของประจำเดือน</div>
      <div className="risk-legend-box">
        {RISK_LEVELS.map(r => {
          const state = !hasCurrent ? '' : r.key === current ? ' on' : ' dim'
          return (
            <div key={r.key} className={`risk-legend-col${state}`}>
              <span className="risk-legend-head" style={{ background: r.solid, color: r.onSolid }}>{r.label}</span>
              <div className="risk-legend-text">{r.meaning}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
