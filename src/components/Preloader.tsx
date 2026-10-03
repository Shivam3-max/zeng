import { useLayoutEffect, useRef, useState } from 'react'
import { calm, gsap, markIntroReady } from '../lib/motion'

/** First visit only: one slow breath while fonts and the scene wake up. */
export function Preloader() {
  const [gone, setGone] = useState(() => calm())
  const el = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const word = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (calm()) {
      markIntroReady()
      return
    }
    const root = el.current!
    const ring = root.querySelector('.pre__ring-draw')
    const counter = { v: 0 }
    const intro = gsap.timeline()
    intro
      .to(counter, {
        v: 100,
        duration: 1.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })
      .fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.9, ease: 'power2.inOut' }, 0)
      .fromTo(root.querySelector('.pre__orb'), { scale: 0.6, autoAlpha: 0.4 }, { scale: 1.12, autoAlpha: 1, duration: 1.9, ease: 'sine.inOut' }, 0)
      .to(word.current, { autoAlpha: 0, duration: 0.3 }, 0.95)
      .add(() => {
        if (word.current) word.current.textContent = 'and let go'
      }, 1.25)
      .to(word.current, { autoAlpha: 1, duration: 0.4 }, 1.25)

    const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 3000))])
    const minTime = new Promise((r) => setTimeout(r, 2050))
    Promise.all([fonts, minTime]).then(() => {
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to(root.querySelectorAll('.pre__inner, .pre__name, .pre__num'), { autoAlpha: 0, y: -10, duration: 0.5, ease: 'power2.in' })
        .add(markIntroReady, '-=0.05')
        .to(root, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.05')
    })
    return () => {
      intro.kill()
    }
  }, [])

  if (gone) return null
  return (
    <div ref={el} className="pre" aria-hidden="true">
      <div className="pre__inner">
        <svg className="pre__ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" className="pre__ring-base" />
          <circle cx="100" cy="100" r="92" className="pre__ring-draw" pathLength={1} />
        </svg>
        <div className="pre__orb" />
        <span ref={word} className="pre__word">
          breathe in
        </span>
      </div>
      <span className="pre__name">Hardeep Kaur</span>
      <span ref={num} className="pre__num">
        000
      </span>
    </div>
  )
}
