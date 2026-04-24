'use client'

import { useState, useEffect } from 'react'
import { MapPin, Mail, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function ContactPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
        }

        /* ── Hero Banner ── */
        .contact-hero {
          position: relative;
          min-height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #6b2646 100%);
          padding: 60px 40px;
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
          width: 420px; height: 420px;
          top: -160px; right: -80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,143,177,0.2), transparent 60%);
        }
        .contact-hero-circle-2 {
          position: absolute;
          width: 280px; height: 280px;
          bottom: -100px; left: 10%;
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
          width: 200px; height: 200px;
          top: 20%; left: 5%;
          background: rgba(240,98,146,0.15);
          animation: floatOrb 7s ease-in-out infinite;
        }
        .orb-2 {
          width: 140px; height: 140px;
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
          font-size: clamp(28px, 4vw, 42px);
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
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          max-width: 420px;
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
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 40px 80px;
        }
        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
          justify-content: center;
        }
        .label-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #f5c6d8);
          max-width: 120px;
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

        /* ── Cards Grid ── */
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        .contact-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid #f5e6ec;
          box-shadow: 0 4px 24px rgba(194,24,91,0.07);
          padding: 36px 32px;
          position: relative;
          overflow: hidden;
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
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.1), transparent 70%);
          pointer-events: none;
        }
        .card-icon-wrap {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #fce4ec, #f8bbd0);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 4px 16px rgba(194,24,91,0.15);
        }
        .card-type {
          font-family: 'Mitr', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #c2185b;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .card-title {
          font-family: 'Mitr', sans-serif;
          font-weight: 600;
          font-size: 18px;
          color: #1a0a14;
          margin-bottom: 16px;
        }
        .card-divider {
          height: 1px;
          background: linear-gradient(90deg, #f5e6ec, transparent);
          margin-bottom: 16px;
        }
        .card-content {
          font-size: 14px;
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
        .email-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .email-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          background: #faf7f5;
          border: 1px solid #f5e6ec;
          transition: background 0.18s, border-color 0.18s;
          cursor: pointer;
          text-decoration: none;
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
          font-size: 13.5px;
          color: #3d1a2e;
          flex: 1;
        }
        .email-chip-icon {
          color: #c2185b;
          opacity: 0.5;
          transition: opacity 0.18s;
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
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
          margin-bottom: 24px;
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
        }
        .map-title {
          font-family: 'Mitr', sans-serif;
          font-size: 15px;
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
        }
        .map-frame {
          margin: 16px 0 0;
          height: 260px;
          position: relative;
          overflow: hidden;
        }
        .map-frame iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .map-footer {
          padding: 16px 28px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f5e6ec;
        }
        .map-address-short {
          font-size: 12.5px;
          color: #9e7a8a;
          line-height: 1.5;
        }
        .map-open-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(194,24,91,0.2);
          background: transparent;
          font-family: 'Mitr', sans-serif;
          font-size: 12px;
          color: #c2185b;
          cursor: pointer;
          transition: background 0.18s;
          text-decoration: none;
          white-space: nowrap;
        }
        .map-open-btn:hover { background: rgba(194,24,91,0.06); }

        /* ── Bottom CTA ── */
        .contact-cta {
          border-radius: 20px;
          background: linear-gradient(135deg, #1a0a14 0%, #3d1a2e 100%);
          padding: 36px 40px;
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
          top: -50px; right: -50px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,98,146,0.2), transparent 60%);
          pointer-events: none;
        }
        .cta-left { position: relative; z-index: 1; }
        .cta-tag {
          font-size: 11px;
          color: rgba(240,98,146,0.7);
          font-family: 'Mitr', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .cta-text {
          font-family: 'Mitr', sans-serif;
          font-weight: 500;
          font-size: 18px;
          color: #fff;
          line-height: 1.4;
        }
        .cta-text span { color: #f48fb1; }
        .cta-right { position: relative; z-index: 1; flex-shrink: 0; }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #f06292, #c2185b);
          color: #fff;
          font-family: 'Mitr', sans-serif;
          font-size: 14px;
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

        /* ── Footer ── */
        .contact-footer {
          background: #fff;
          border-top: 1px solid #f5e6ec;
          padding: 28px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: #b09aa8;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .contact-hero { padding: 48px 20px; }
          .contact-body { padding: 40px 20px 60px; }
          .cards-grid { grid-template-columns: 1fr; }
          .contact-cta { flex-direction: column; text-align: center; }
          .contact-footer { flex-direction: column; gap: 8px; text-align: center; }
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
              พร้อมให้<span>ความช่วยเหลือ</span><br />
              ทุกคำถาม
            </h1>
            <p className="contact-hero-sub">
              ทีมงานของเรายินดีตอบทุกข้อสงสัยเกี่ยวกับสุขภาพสตรีและการใช้งานระบบ
            </p>
          </div>

          <div className="hero-arc" />
        </section>

        {/* ── Body ── */}
        <div className="contact-body">

          <div className="section-label">
            <div className="label-line" />
            <span className="label-text">ช่องทางติดต่อ</span>
            <div className="label-line right" />
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">

            {/* Address Card */}
            <div
              className={`contact-card ${mounted ? 'visible' : ''}`}
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="card-corner-glow" />
              <div className="card-icon-wrap">
                <MapPin size={22} color="#c2185b" />
              </div>
              <div className="card-type">ที่อยู่</div>
              <div className="card-title">สถานที่ตั้ง</div>
              <div className="card-divider" />
              <div className="card-content">
                <div className="address-line">
                  <span>📍</span>
                  <div>
                    <p>คณะวิทยาศาสตร์และเทคโนโลยี</p>
                    <p>สาขาวิทยาการคอมพิวเตอร์</p>
                    <p>มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต</p>
                    <p>เลขที่ 99 หมู่ 18 ถนนพหลโยธิน</p>
                    <p>ต.คลองหนึ่ง อ.คลองหลวง</p>
                    <p>ปทุมธานี 12120</p>
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
              <div className="card-icon-wrap">
                <Mail size={22} color="#c2185b" />
              </div>
              <div className="card-type">อีเมล</div>
              <div className="card-title">ส่งอีเมลหาเรา</div>
              <div className="card-divider" />
              <div className="email-list">
                <a
                  href="mailto:achiraya.choo@dome.tu.ac.th"
                  className="email-chip"
                >
                  <span className="email-chip-dot" />
                  <span className="email-chip-text">achiraya.choo@dome.tu.ac.th</span>
                  <ExternalLink size={13} className="email-chip-icon" />
                </a>
                <a
                  href="mailto:aumboon.rap@dome.tu.ac.th"
                  className="email-chip"
                >
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
              <span className="map-badge">📍 มธ. รังสิต</span>
            </div>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.3!2d100.6167!3d14.0706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d60a5bad66a35%3A0x29c71e9e6e45bdf!2sThammasat%20University%2C%20Rangsit%20Campus!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Thammasat University Rangsit"
              />
            </div>
            <div className="map-footer">
              <div className="map-address-short">
                มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต<br />
                ต.คลองหนึ่ง อ.คลองหลวง ปทุมธานี
              </div>
              <a
                href="https://maps.google.com/?q=Thammasat+University+Rangsit+Campus"
                target="_blank"
                rel="noopener noreferrer"
                className="map-open-btn"
              >
                <ExternalLink size={13} /> เปิดใน Maps
              </a>
            </div>
          </div>

          {/* CTA Strip */}
          <div className={`contact-cta ${mounted ? 'visible' : ''}`}>
            <div className="cta-left">
              <p className="cta-tag">✦ Lunar Day</p>
              <p className="cta-text">
                ลองใช้งานระบบวิเคราะห์<br />
                <span>สุขภาพสตรี</span>
              </p>
            </div>
            <div className="cta-right">
              <a href="/home/analyze" className="btn-primary">
                เริ่มวิเคราะห์เลย →
              </a>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="contact-footer">
          <span>© 2568 Lunar Day — ดูแลสุขภาพสตรีด้วยเทคโนโลยี</span>
          <span>นโยบายความเป็นส่วนตัว · ติดต่อเรา</span>
        </footer>
      </div>
    </>
  )
}