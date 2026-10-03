import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { applyTone, calm, gsap, isStill, ScrollTrigger, setLenis, useTones, type Tone } from '../lib/motion'
import { SceneCanvas } from './SceneCanvas'
import { TransitionProvider } from './Transition'
import { Header } from './Header'
import { Footer } from './Footer'
import { Cursor } from './Cursor'
import { Preloader } from './Preloader'
import { SkyMeter } from './SkyMeter'

export function Layout() {
  const location = useLocation()
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    if (calm()) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  useTones(main, location.pathname)

  // ?still&solo=.selector — show one section alone at the top (screenshot harness)
  useLayoutEffect(() => {
    const solo = new URLSearchParams(location.search).get('solo')
    if (!isStill() || !solo || !main.current) return
    const target = main.current.querySelector<HTMLElement>(solo)
    if (!target) return
    document.documentElement.dataset.solo = '1'
    target.classList.add('is-solo')
    new URLSearchParams(location.search)
      .get('hide')
      ?.split(',')
      .forEach((sel) => main.current!.querySelectorAll<HTMLElement>(sel).forEach((n) => (n.style.display = 'none')))
    applyTone((target.dataset.tone as Tone) ?? 'night', true)
  }, [location.pathname, location.search])

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <TransitionProvider>
      <SceneCanvas />
      <div className="grain" aria-hidden="true" />
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" ref={main} key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <SkyMeter />
      <Cursor />
      <Preloader />
    </TransitionProvider>
  )
}
