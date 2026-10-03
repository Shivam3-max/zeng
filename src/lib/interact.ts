import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { calm, getLenis, isStill, ScrollTrigger } from './motion'

/** Screenshot harness: `?still=1&beat=2` freezes pinned sequences on a beat. */
export const stillBeat = () => (isStill() ? Number(new URLSearchParams(location.search).get('beat') ?? NaN) : NaN)
/** Pinned sequences fall back to a plain stacked layout under reduced motion. */
export const stackedSequences = () => calm() && !Number.isFinite(stillBeat())

/**
 * A sticky section that shows one "beat" at a time.  The section's scroll
 * distance is split into `count` equal steps; `index` is the beat on screen.
 * `onProgress` receives the raw 0..1 progress (for scrubbed art).
 */
export function useScrollSteps(ref: RefObject<HTMLElement | null>, count: number, onProgress?: (p: number) => void) {
  const [index, setIndex] = useState(() => (Number.isFinite(stillBeat()) ? Math.min(count - 1, stillBeat()) : 0))
  const cb = useRef(onProgress)
  useEffect(() => {
    cb.current = onProgress
  })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || calm()) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const i = Math.min(count - 1, Math.floor(self.progress * count))
        setIndex((prev) => (prev === i ? prev : i))
        cb.current?.(self.progress)
      },
    })
    return () => st.kill()
  }, [ref, count])

  /** Scroll so that beat `i` is centred in its slice of the section. */
  const jump = useCallback(
    (i: number) => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      const y = top + ((i + 0.5) / count) * Math.max(0, el.offsetHeight - window.innerHeight)
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { duration: 1.2 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    },
    [ref, count],
  )

  return { index, jump }
}

/**
 * Plays through `count` items on its own while the group is on screen,
 * pauses while the pointer rests on it, and stops for good once the visitor
 * picks something themselves.
 */
export function useAutoCycle(count: number, ref: RefObject<HTMLElement | null>, delay: (i: number) => number = () => 3800) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(() => !calm())
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)
  const delayRef = useRef(delay)
  useEffect(() => {
    delayRef.current = delay
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    const enter = (e: PointerEvent) => e.pointerType === 'mouse' && setHover(true)
    const leave = () => setHover(false)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref])

  const running = auto && inView && !hover && count > 1
  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), delayRef.current(index))
    return () => window.clearTimeout(t)
  }, [running, index, count])

  const select = useCallback((i: number) => {
    setAuto(false)
    setIndex(i)
  }, [])

  return { index, select, running, delay: delayRef.current(index) }
}
