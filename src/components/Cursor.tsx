import { useEffect, useRef } from 'react'
import { gsap, isFine } from '../lib/motion'

/** A soft aura that trails the pointer, swells over anything clickable and can carry a label. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isFine() || !dot.current || !ring.current) return
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3.out' })
    const root = document.documentElement
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      root.dataset.pointer = '1'
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, textarea, select, label')
      const text = t?.dataset.cursor ?? ''
      ring.current!.dataset.state = t ? (text ? 'label' : 'hover') : ''
      if (label.current) label.current.textContent = text
    }
    const leave = () => delete root.dataset.pointer
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])

  if (!isFine()) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
