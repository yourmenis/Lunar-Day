'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// เลื่อนหน้าลงแล้วส่วนด้านล่างค่อย ๆ ปรากฏขึ้น (ใช้กับทุกหน้า — วางไว้ใน root layout)
// - ซ่อนเฉพาะบล็อกที่ "ยังอยู่ใต้ขอบจอ" ตอนตรวจพบ → ส่วนที่เห็นอยู่แล้วไม่กะพริบ
// - เลื่อนมาถึงแล้วค่อยจางเข้า + เลื่อนขึ้น, บล็อกที่โผล่พร้อมกันจะเหลื่อมเวลากันเล็กน้อย
// - เนื้อหาที่โหลดทีหลัง (เช่น บทความจาก API) ตรวจจับด้วย MutationObserver
// - ปิดเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
// เพิ่ม data-reveal ให้ element ใดก็ได้เพื่อให้ใช้เอฟเฟกต์นี้

const SELECTORS = [
  '[data-reveal]',
  // หน้าแรก
  '.section-header', '.kc', '.hiw', '.hiw-caps > div', '.article-card', '.cta-section',
  // วิเคราะห์ (หน้าแนะนำ + ผลลัพธ์)
  '.about-card', '.steps-header', '.steps-layout', '.step-card-mobile', '.trust-card', '.bcta-card',
  '.trust-item', '.result-detail', '.risk-legend', '.suggestion-item',
  // ติดต่อเรา
  '.contact-card', '.map-card', '.contact-cta',
  // โปรไฟล์ / ประวัติ
  '.pf-card', '.pf-menu-section', '.pf-history-card',
].join(',')

const STAGGER_MS = 90
const MAX_STAGGER = 4

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    const seen = new WeakSet<Element>()

    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting)
      visible
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, i) => {
          const el = entry.target as HTMLElement
          io.unobserve(el)
          el.style.transitionDelay = `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`
          el.classList.add('reveal-in')
          // จบแอนิเมชันแล้วคืนสไตล์เดิม (ให้ hover/transition ของ element ทำงานตามปกติ)
          let finished = false
          const done = () => {
            if (finished) return
            finished = true
            el.removeEventListener('transitionend', onEnd)
            el.classList.remove('reveal-pending', 'reveal-in')
            el.style.transitionDelay = ''
          }
          // transitionend ของลูกจะ bubble ขึ้นมาด้วย → นับเฉพาะของ element นี้เอง
          const onEnd = (e: TransitionEvent) => { if (e.target === el && e.propertyName === 'opacity') done() }
          el.addEventListener('transitionend', onEnd)
          setTimeout(done, 1600)
        })
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' })  // เริ่มเมื่อขอบบนเข้ามาในจอ 5%

    const scan = () => {
      const fold = window.innerHeight
      document.querySelectorAll<HTMLElement>(SELECTORS).forEach(el => {
        if (seen.has(el)) return
        seen.add(el)
        // ไม่ยุ่งกับเมนู, หน้าต่าง popup และ element ที่ลอยอยู่กับที่
        if (el.closest('nav, [role="dialog"], .navbar, .drawer-panel')) return
        // ซ้อนอยู่ในบล็อกที่กำลังรอปรากฏ → ให้ปรากฏพร้อมบล็อกแม่
        if (el.parentElement?.closest('.reveal-pending')) return
        const pos = getComputedStyle(el).position
        if (pos === 'fixed' || pos === 'sticky') return
        // อยู่ในจอหรือเหนือจออยู่แล้ว → แสดงตามปกติ
        if (el.getBoundingClientRect().top < fold) return
        el.classList.add('reveal-pending')
        io.observe(el)
      })
    }

    let frame = 0
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; scan() })
    }
    schedule()
    const mo = new MutationObserver(schedule)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      mo.disconnect()
      io.disconnect()
      // เปลี่ยนหน้า: ไม่ให้มีอะไรค้างซ่อนอยู่
      document.querySelectorAll('.reveal-pending').forEach(el => {
        el.classList.remove('reveal-pending', 'reveal-in')
        ;(el as HTMLElement).style.transitionDelay = ''
      })
    }
  }, [pathname])

  return null
}
