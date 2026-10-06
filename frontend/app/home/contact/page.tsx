'use client'

import { useState, useEffect } from 'react'
import { MapPin, Mail, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // ตั้งค่าในเฟรมถัดไป (ไม่ setState ตรง ๆ ใน effect) — ผลที่ผู้ใช้เห็นเหมือนเดิม
    const raf = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-root {
          min-height: 100vh;
          font-family: 'Sarabun', sans-serif;
          background: #faf7f5;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Shared container (เหมือนหน้าบทความ) ── */
        .contact-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding-left: clamp(16px, 3vw, 40px);
          padding-right: clamp(16px, 3vw, 40px);
        }

        /* ── Hero Banner ── */
        .contact-hero {
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #6b2646 100%);
          padding: 56px clamp(16px, 3vw, 40px) 72px;
          text-align: center;
        }
        .contact-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .contact-hero-circle-1 {
          position: absolute;
          width: 520px; height: 520px;
          top: -200px; right: -100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,143,177,0.2), transparent 60%);
        }
        .contact-hero-circle-2 {
          position: absolute;
          width: 340px; height: 340px;
          bottom: -120px; left: 8%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(206,147,216,0.15), transparent 60%);
        }
        .contact-hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }
        .orb-1 {
          width: 220px; height: 220px;
          top: 20%; left: 5%;
          background: rgba(240,98,146,0.15);
          animation: floatOrb 7s ease-in-out infinite;
        }
        .orb-2 {
          width: 160px; height: 160px;
          bottom: 10%; right: 15%;
          background: rgba(206,147,216,0.12);
          animation: floatOrb 9s ease-in-out infinite reverse;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        .contact-hero-content {
          position: relative;
          z-index: 2;
          max-width: 760px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .contact-hero-content.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(240,98,146,0.15);
          border: 1px solid rgba(240,98,146,0.35);
          font-family: 'Mitr', sans-serif;
          font-size: 12px;
          color: #f8bbd0;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f06292;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .contact-hero-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: clamp(28px, 4vw, 46px);
          color: #fff;
          line-height: 1.3;
          margin-bottom: 14px;
        }
        .contact-hero-title span {
          background: linear-gradient(135deg, #f48fb1, #f06292);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .contact-hero-sub {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto;
        }
        .hero-arc {
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 48px;
          background: #faf7f5;
          clip-path: ellipse(55% 100% at 50% 100%);
        }

        /* ── Main Content ── */
        .contact-body {
          flex: 1;
          padding-top: 40px;
          padding-bottom: 64px;
        }
        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          justify-content: center;
        }
        .label-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #f5c6d8);
          max-width: 160px;
        }
        .label-line.right {
          background: linear-gradient(to left, transparent, #f5c6d8);
        }
        .label-text {
          font-family: 'Mitr', sans-serif;
          font-size: 13px;
          color: #c2185b;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* ── Layout: การ์ดซ้าย + แผนที่ขวา ── */
        .contact-layout {
          display: grid;
          grid-template-columns: minmax(360px, 440px) 1fr;
          gap: clamp(16px, 1.8vw, 24px);
          align-items: stretch;
          margin-bottom: clamp(16px, 1.8vw, 24px);
        }
        .cards-col {
          display: flex;
          flex-direction: column;
          gap: clamp(16px, 1.8vw, 24px);
        }

        /* ── Contact Card ── */
        .contact-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 24px rgba(194,24,91,0.07);
          padding: 28px 28px 30px;
          position: relative;
          overflow: hidden;
          flex: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.25s ease;
        }
        .contact-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .contact-card:hover {
          box-shadow: 0 12px 40px rgba(194,24,91,0.13);
          transform: translateY(-4px);
        }
        .contact-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #f06292, #c2185b);
          border-radius: 24px 24px 0 0;
        }
        .card-corner-glow {
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.1), transparent 70%);
          pointer-events: none;
        }
        .card-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }
        .card-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(194,24,91,0.15);
          flex-shrink: 0;
        }
        .card-type {
          font-family: 'Mitr', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #c2185b;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .card-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #1a0a14;
        }
        .card-divider {
          height: 1px;
          background: linear-gradient(90deg, #f5e6ec, transparent);
          margin-bottom: 16px;
        }
        .card-content {
          font-size: 14.5px;
          color: #7a5a6a;
          line-height: 1.8;
        }
        .address-line {
          display: flex;
          gap: 8px;
        }
        .address-line span:first-child {
          color: #c2185b;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .address-line strong {
          color: #3d1a2e;
          font-weight: 600;
        }
        .email-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .email-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #faf7f5;
          border: 1px solid #f5e6ec;
          transition: background 0.18s, border-color 0.18s;
          cursor: pointer;
          text-decoration: none;
          min-width: 0;
        }
        .email-chip:hover {
          background: #fce4ec;
          border-color: rgba(194,24,91,0.25);
        }
        .email-chip-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f06292, #c2185b);
          flex-shrink: 0;
        }
        .email-chip-text {
          font-family: 'Sarabun', sans-serif;
          font-size: 14px;
          color: #3d1a2e;
          flex: 1;
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .email-chip-icon {
          color: #c2185b;
          opacity: 0.5;
          transition: opacity 0.18s;
          flex-shrink: 0;
        }
        .email-chip:hover .email-chip-icon {
          opacity: 1;
        }

        /* ── Map Card ── */
        .map-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 24px rgba(194,24,91,0.07);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 520px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
        }
        .map-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .map-header {
          padding: 20px 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .map-title {
          font-family: 'Mitr', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1a0a14;
        }
        .map-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(194,24,91,0.08);
          font-size: 11.5px;
          color: #c2185b;
          font-family: 'Mitr', sans-serif;
          white-space: nowrap;
        }
        .map-frame {
          margin: 16px 0 0;
          flex: 1;
          min-height: 320px;
          position: relative;
          overflow: hidden;
        }
        .map-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .map-footer {
          padding: 16px 28px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid #f5e6ec;
        }
        .map-address-short {
          font-size: 13px;
          color: #9e7a8a;
          line-height: 1.5;
        }
        .map-open-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          border: 1.5px solid rgba(194,24,91,0.2);
          background: transparent;
          font-family: 'Mitr', sans-serif;
          font-size: 12.5px;
          color: #c2185b;
          cursor: pointer;
          transition: background 0.18s;
          text-decoration: none;
          white-space: nowrap;
        }
        .map-open-btn:hover { background: rgba(194,24,91,0.06); }

        /* ── Bottom CTA ── */
        .contact-cta {
          border-radius: 24px;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 60%, #6b2646 100%);
          padding: clamp(28px, 3vw, 44px) clamp(24px, 4vw, 56px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s;
        }
        .contact-cta.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .contact-cta::before {
          content: '';
          position: absolute;
          top: -80px; right: 10%;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.22), transparent 60%);
          pointer-events: none;
        }
        .contact-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }
        .cta-left { position: relative; z-index: 1; }
        .cta-tag {
          font-size: 11px;
          color: rgba(240,98,146,0.75);
          font-family: 'Mitr', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .cta-text {
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: clamp(18px, 2vw, 24px);
          color: #fff;
          line-height: 1.4;
        }
        .cta-text span { color: #f48fb1; }
        .cta-right { position: relative; z-index: 1; flex-shrink: 0; }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff;
          font-family: 'Mitr', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(194,24,91,0.45);
          transition: transform 0.18s, box-shadow 0.18s;
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(194,24,91,0.55);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .contact-layout { grid-template-columns: 1fr; }
          .cards-col { flex-direction: row; }
          .map-card { min-height: 420px; }
        }
        @media (max-width: 720px) {
          .contact-hero { padding-top: 44px; padding-bottom: 64px; }
          .contact-body { padding-top: 28px; padding-bottom: 48px; }
          .cards-col { flex-direction: column; }
          .contact-card { padding: 24px 20px; }
          .map-card { min-height: 380px; }
          .map-header, .map-footer { padding-left: 20px; padding-right: 20px; }
          .map-footer { flex-direction: column; align-items: flex-start; }
          .contact-cta { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="contact-root">
        <Navbar />

        {/* ── Hero ── */}
        <section className="contact-hero">
          <div className="contact-hero-bg">
            <div className="contact-hero-circle-1" />
            <div className="contact-hero-circle-2" />
            <div className="contact-hero-dots" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
          </div>

          <div className={`contact-hero-content ${mounted ? 'visible' : ''}`}>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              ติดต่อสอบถาม
            </div>
            <h1 className="contact-hero-title">
              พร้อมให้<span>ความช่วยเหลือ</span>ทุกคำถาม
            </h1>
            <p className="contact-hero-sub">
              ทีมงานของเรายินดีตอบทุกข้อสงสัยเกี่ยวกับสุขภาพสตรีและการใช้งานระบบ
            </p>
          </div>

          <div className="hero-arc" />
        </section>

        {/* ── Body ── */}
        <main className="contact-body contact-container">

          <div className="section-label">
            <div className="label-line" />
            <span className="label-text">ช่องทางติดต่อ</span>
            <div className="label-line right" />
          </div>

          <div className="contact-layout">
            {/* Cards Column */}
            <div className="cards-col">

              {/* Address Card */}
              <div
                className={`contact-card ${mounted ? 'visible' : ''}`}
                style={{ transitionDelay: '0.1s' }}
              >
                <div className="card-corner-glow" />
                <div className="card-head">
                  <div className="card-icon-wrap">
                    <MapPin size={22} color="#c2185b" />
                  </div>
                  <div>
                    <div className="card-type">ที่อยู่</div>
                    <div className="card-title">สถานที่ตั้ง</div>
                  </div>
                </div>
                <div className="card-divider" />
                <div className="card-content">
                  <div className="address-line">
                    <span>📍</span>
                    <div>
                      <p><strong>คณะวิทยาศาสตร์และเทคโนโลยี</strong></p>
                      <p>สาขาวิทยาการคอมพิวเตอร์</p>
                      <p>มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต</p>
                      <p>เลขที่ 99 หมู่ 18 ถนนพหลโยธิน</p>
                      <p>ต.คลองหนึ่ง อ.คลองหลวง ปทุมธานี 12120</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div
                className={`contact-card ${mounted ? 'visible' : ''}`}
                style={{ transitionDelay: '0.2s' }}
              >
                <div className="card-corner-glow" />
                <div className="card-head">
                  <div className="card-icon-wrap">
                    <Mail size={22} color="#c2185b" />
                  </div>
                  <div>
                    <div className="card-type">อีเมล</div>
                    <div className="card-title">ส่งอีเมลหาเรา</div>
                  </div>
                </div>
                <div className="card-divider" />
                <div className="email-list">
                  <a href="mailto:achiraya.choo@dome.tu.ac.th" className="email-chip">
                    <span className="email-chip-dot" />
                    <span className="email-chip-text">achiraya.choo@dome.tu.ac.th</span>
                    <ExternalLink size={13} className="email-chip-icon" />
                  </a>
                  <a href="mailto:aumboon.rap@dome.tu.ac.th" className="email-chip">
                    <span className="email-chip-dot" />
                    <span className="email-chip-text">aumboon.rap@dome.tu.ac.th</span>
                    <ExternalLink size={13} className="email-chip-icon" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className={`map-card ${mounted ? 'visible' : ''}`}>
              <div className="map-header">
                <span className="map-title">แผนที่</span>
                <span className="map-badge">📍 คณะวิทย์ฯ มธ. รังสิต</span>
              </div>
              <div className="map-frame">
                <iframe
                  src="https://maps.google.com/maps?q=Faculty%20of%20Science%20and%20Technology%2C%20Thammasat%20University%20Rangsit%20Campus&hl=th&z=17&output=embed"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="คณะวิทยาศาสตร์และเทคโนโลยี มธ. รังสิต"
                />
              </div>
              <div className="map-footer">
                <div className="map-address-short">
                  คณะวิทยาศาสตร์และเทคโนโลยี สาขาวิทยาการคอมพิวเตอร์<br />
                  มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต ปทุมธานี
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Faculty%20of%20Science%20and%20Technology%2C%20Thammasat%20University%20Rangsit%20Campus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-open-btn"
                >
                  <ExternalLink size={13} /> เปิดใน Maps
                </a>
              </div>
            </div>
          </div>

          {/* CTA Strip */}
          <div className={`contact-cta ${mounted ? 'visible' : ''}`}>
            <div className="cta-left">
              <p className="cta-tag">✦ Lunar Day</p>
              <p className="cta-text">
                เริ่มวิเคราะห์<span>สุขภาพประจำเดือน</span>ของคุณ
              </p>
            </div>
            <div className="cta-right">
              <a href="/home/analyze" className="btn-primary">
                เริ่มวิเคราะห์เลย →
              </a>
            </div>
          </div>
        </main>

      </div>
    </>
  )
}
