import { useEffect, useRef, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { getLenis } from '../lib/motion'

const PHASES: [number, string][] = [
  [0.18, 'midnight'],
  [0.45, 'deep night'],
  [0.7, 'before dawn'],
  [0.9, 'first light'],
  [1.01, 'sunrise'],
]

/** Scroll progress told as the hours from midnight to sunrise. Click to travel. */
export function SkyMeter() {
  const { pathname } = useLocation()
  const root = useRef<HTMLDivElement>(null)
  const time = useRef<HTMLSpanElement>(null)
  const phase = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const mins = Math.round(p * 390)
      root.current?.style.setProperty('--p', p.toFixed(4))
      if (time.current) time.current.textContent = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
      if (phase.current) phase.current.textContent = PHASES.find(([t]) => p < t)![1]
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const id = window.setTimeout(update, 600)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.clearTimeout(id)
    }
  }, [pathname])

  const travel = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const f = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const y = f * (document.documentElement.scrollHeight - window.innerHeight)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.6 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div ref={root} className="skym" aria-hidden="true">
      <span ref={time} className="skym__time">
        00:00
      </span>
      <button type="button" className="skym__track" onClick={travel} tabIndex={-1} data-cursor="Travel">
        <i className="skym__dot" />
      </button>
      <span ref={phase} className="skym__phase">
        midnight
      </span>
    </div>
  )
}
