import { createContext, useCallback, useContext, useLayoutEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { calm, getLenis, gsap, scrollToTarget, scrollToTop } from '../lib/motion'

type Go = (to: string, at?: { x: number; y: number }) => void
const Ctx = createContext<Go>(() => {})
export const useGo = () => useContext(Ctx)

const NAMES: Record<string, string> = { '/': 'Home', '/about': 'About', '/contact': 'Contact' }

/** Route changes pass behind a veil of light that blooms from the click point. */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const veil = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const pending = useRef(false)

  const go = useCallback<Go>(
    (to, at) => {
      const url = new URL(to, window.location.origin)
      if (url.pathname === window.location.pathname) {
        if (url.hash) scrollToTarget(url.hash)
        else if (getLenis()) getLenis()!.scrollTo(0, { duration: 1.4 })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const v = veil.current
      if (calm() || !v) {
        navigate(to)
        return
      }
      if (pending.current) return
      pending.current = true
      const x = at?.x ?? window.innerWidth / 2
      const y = at?.y ?? window.innerHeight / 2
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      if (label.current) label.current.textContent = NAMES[url.pathname] ?? ''
      gsap
        .timeline()
        .set(v, { visibility: 'visible', yPercent: 0, clipPath: `circle(0px at ${x}px ${y}px)` })
        .to(v, { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.85, ease: 'expo.inOut' })
        .fromTo(label.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
        .add(() => navigate(to))
    },
    [navigate],
  )

  useLayoutEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(location.hash, true)))
    } else {
      scrollToTop()
    }
    const v = veil.current
    if (!pending.current || !v) return
    gsap
      .timeline({
        delay: 0.2,
        onComplete: () => {
          pending.current = false
          gsap.set(v, { visibility: 'hidden', yPercent: 0 })
        },
      })
      .to(label.current, { autoAlpha: 0, y: -18, duration: 0.35, ease: 'power2.in' })
      .to(v, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.1')
  }, [location.pathname, location.hash])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={veil} className="veil" aria-hidden="true">
        <div className="veil__glow" />
        <span ref={label} className="veil__label" />
      </div>
    </Ctx.Provider>
  )
}

type TLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

/** An anchor that travels through the veil instead of a hard navigation. */
export function TLink({ to, onClick, children, ...rest }: TLinkProps) {
  const go = useGo()
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        go(to, { x: e.clientX || window.innerWidth / 2, y: e.clientY || window.innerHeight / 2 })
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
