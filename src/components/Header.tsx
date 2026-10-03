import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TLink } from './Transition'
import { calm, getLenis, gsap } from '../lib/motion'
import { site, waLink } from '../lib/content'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#paths', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="20" cy="20" rx="18" ry="5.5" fill="none" stroke="var(--accent)" strokeWidth="1.1" transform="rotate(-24 20 20)" />
      <circle cx="20" cy="20" r="3.2" fill="var(--accent)" />
    </svg>
  )
}

export function Header() {
  const { pathname, hash } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 160 && y > last + 2 ? true : y < last - 2 ? false : (h) => h)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the menu whenever the route changes
  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    const el = menu.current
    if (!el) return
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
      gsap.set(el, { visibility: 'visible' })
      if (!calm()) {
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
        gsap.fromTo(el.querySelectorAll('.menu__link'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.3 })
      }
    } else {
      lenis?.start()
      document.body.style.overflow = ''
      if (calm()) gsap.set(el, { visibility: 'hidden' })
      else gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => gsap.set(el, { visibility: 'hidden' }) })
    }
  }, [open])

  const isActive = (to: string) => (to === '/#paths' ? false : to === pathname)

  return (
    <>
      <header className="hdr" data-hidden={hidden && !open} data-scrolled={scrolled} data-open={open}>
        <TLink to="/" className="hdr__brand" aria-label="Hardeep Kaur — home">
          <Mark />
          <span className="hdr__name">
            Hardeep <em>Kaur</em>
          </span>
        </TLink>
        <nav className="hdr__nav" aria-label="Main">
          {LINKS.map((l) => (
            <TLink key={l.to} to={l.to} className="hdr__link" aria-label={l.label} aria-current={isActive(l.to) ? 'page' : undefined}>
              <span data-text={l.label} aria-hidden="true">
                {l.label}
              </span>
            </TLink>
          ))}
        </nav>
        <TLink to="/contact" className="btn btn--solid btn--sm hdr__cta">
          Book a session
        </TLink>
        <button className="hdr__menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          <span className="hdr__menu-lines" aria-hidden="true" />
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </header>

      <div id="menu" ref={menu} className="menu" role="dialog" aria-modal="true" aria-label="Menu" style={{ visibility: 'hidden' }}>
        <div className="menu__glow" aria-hidden="true" />
        <nav className="menu__nav">
          {LINKS.map((l, i) => (
            <div className="menu__row" key={l.to}>
              <TLink to={l.to} className="menu__link" onClick={() => setOpen(false)}>
                <small>0{i + 1}</small>
                {l.label}
              </TLink>
            </div>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={waLink('Hello Hardeep, I would like to book a session.')} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
    </>
  )
}
