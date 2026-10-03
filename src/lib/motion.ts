import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import type Lenis from 'lenis'
import { useLayoutEffect, type RefObject } from 'react'
import { sceneStore } from '../scene/store'
import { S, sample, type Key } from '../scene/choreo'

gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.config({ nullTargetWarn: false })

export { gsap, ScrollTrigger, SplitText }

const root = () => document.documentElement
/** `?still=1` — every animation renders in its final state (screenshots, audits). */
export const isStill = () => root().dataset.still === '1'
export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
/** True when we should skip entrance choreography entirely. */
export const calm = () => isStill() || prefersReduced()
export const isFine = () => root().dataset.fine === '1'
export const isMobile = () => window.matchMedia('(max-width: 899px)').matches

/* ---------------------------------------------------------------- */
/*  Smooth scroll                                                    */
/* ---------------------------------------------------------------- */
let lenis: Lenis | null = null
export const setLenis = (l: Lenis | null) => {
  lenis = l
}
export const getLenis = () => lenis

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToTarget(target: string | HTMLElement, immediate = false) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -20, immediate, duration: 1.6 })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}

/* ---------------------------------------------------------------- */
/*  First-load intro gate (preloader → hero)                         */
/* ---------------------------------------------------------------- */
let introResolve: () => void = () => {}
export const introReady = new Promise<void>((r) => (introResolve = r))
let introDone = false
export const markIntroReady = () => {
  introDone = true
  introResolve()
}
/** Delay a page intro should wait for (0 on first load once the preloader lifts). */
export const introDelay = () => (introDone ? 0.55 : 0)

/* ---------------------------------------------------------------- */
/*  Tones — the page's journey from night to dawn                    */
/* ---------------------------------------------------------------- */
export type Tone = 'night' | 'dusk' | 'dawn' | 'wine'
const TONES: Record<Tone, Record<string, string> & { light: string }> = {
  night: { '--bg': '#070818', '--fg': '#efe9f6', '--fg-soft': 'rgba(239,233,246,0.7)', '--fg-faint': 'rgba(239,233,246,0.42)', '--line': 'rgba(239,233,246,0.14)', '--card': 'rgba(255,255,255,0.035)', '--accent': '#e6b873', light: '0' },
  dusk: { '--bg': '#150f2c', '--fg': '#f3ecf6', '--fg-soft': 'rgba(243,236,246,0.72)', '--fg-faint': 'rgba(243,236,246,0.44)', '--line': 'rgba(243,236,246,0.15)', '--card': 'rgba(255,255,255,0.045)', '--accent': '#ebbd7b', light: '0' },
  wine: { '--bg': '#200c1f', '--fg': '#f9eaf0', '--fg-soft': 'rgba(249,234,240,0.74)', '--fg-faint': 'rgba(249,234,240,0.45)', '--line': 'rgba(249,234,240,0.16)', '--card': 'rgba(255,255,255,0.045)', '--accent': '#f2a9be', light: '0' },
  dawn: { '--bg': '#f4ece2', '--fg': '#1a1530', '--fg-soft': 'rgba(26,21,48,0.72)', '--fg-faint': 'rgba(26,21,48,0.48)', '--line': 'rgba(26,21,48,0.14)', '--card': 'rgba(255,255,255,0.55)', '--accent': '#a8742f', light: '1' },
}

let currentTone: Tone | null = null
export function applyTone(tone: Tone, instant = false) {
  if (tone === currentTone) return
  currentTone = tone
  const { light, ...vars } = TONES[tone]
  root().dataset.tone = tone
  sceneStore.setLight(+light)
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', vars['--bg'])
  if (instant || calm()) gsap.set(root(), vars)
  else gsap.to(root(), { ...vars, duration: 0.9, ease: 'power2.out', overwrite: 'auto' })
}

/** Watch every `[data-tone]` section inside `scope` and shift the palette as it crosses mid-screen. */
export function useTones(scope: RefObject<HTMLElement | null>, routeKey: string) {
  useLayoutEffect(() => {
    const el = scope.current
    if (!el) return
    const sections = [...el.querySelectorAll<HTMLElement>('[data-tone]')]
    if (sections[0]) {
      currentTone = null
      applyTone(sections[0].dataset.tone as Tone, true)
    }
    const triggers = sections.map((s) =>
      ScrollTrigger.create({
        trigger: s,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && applyTone(s.dataset.tone as Tone),
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [scope, routeKey])
}

/* ---------------------------------------------------------------- */
/*  Scroll → scene                                                   */
/* ---------------------------------------------------------------- */
/** Measure the page, build a keyframe track, and feed the scene on every scroll. */
export function useSceneTrack(build: () => Key[]) {
  useLayoutEffect(() => {
    const pinned = debugScene()
    if (pinned) {
      sceneStore.setTarget(pinned)
      return
    }
    let keys: Key[] = []
    const update = () => sceneStore.setTarget(sample(keys, window.scrollY))
    const measure = () => {
      keys = build()
      update()
    }
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(() => measure())
    ro.observe(document.body)
    return () => {
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('scroll', update)
      ro.disconnect()
    }
    // build is recreated each render; measure only on mount and refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/**
 * Verification harness, active only with ?still: `&shape=3&sx=-0.5&sy=0&ss=0.58&so=1&warm=0`
 * pins the soul to a given state so any section can be captured in isolation.
 */
function debugScene() {
  if (!isStill()) return null
  const q = new URLSearchParams(location.search)
  if (!q.has('shape')) return null
  const n = (k: string, d: number) => (q.has(k) ? +q.get(k)! : d)
  return S({ shape: n('shape', 0), x: n('sx', 0), y: n('sy', 0), scale: n('ss', 0.6), opacity: n('so', 1), rings: n('rings', 0), warm: n('warm', 0), stir: n('stir', 0) })
}

/** Absolute document box of an element. */
export function box(el: Element | null) {
  if (!el) return { top: 0, height: 0 }
  const r = el.getBoundingClientRect()
  return { top: r.top + window.scrollY, height: r.height }
}

/* ---------------------------------------------------------------- */
/*  Scroll reveals                                                   */
/* ---------------------------------------------------------------- */
/**
 * Declarative reveals inside `scope`:
 *   data-reveal            fade + rise
 *   data-reveal="lines"    masked line-by-line headline
 *   data-reveal="stagger"  children rise in sequence
 *   data-reveal="draw"     glyph strokes draw themselves
 */
export function useReveals(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scope.current
    if (!el || calm()) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => {
        const kind = node.dataset.reveal
        const st = { trigger: node, start: 'top 88%', once: true }
        if (kind === 'lines') {
          SplitText.create(node, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, { yPercent: 108, duration: 1.15, ease: 'expo.out', stagger: 0.09, scrollTrigger: st }),
          })
        } else if (kind === 'stagger') {
          gsap.from(node.children, { y: 34, autoAlpha: 0, duration: 0.95, ease: 'power3.out', stagger: 0.07, scrollTrigger: st })
        } else if (kind === 'draw') {
          const strokes = node.querySelectorAll('.glyph [pathLength]:not([stroke-dasharray])')
          gsap.fromTo(strokes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.06, scrollTrigger: st })
        } else {
          gsap.from(node, { y: 40, autoAlpha: 0, duration: 1.05, ease: 'power3.out', scrollTrigger: st })
        }
      })
    }, el)
    return () => ctx.revert()
  }, [scope])
}

/** Small magnetic pull toward the cursor for buttons with `[data-magnetic]`. */
export function useMagnetic(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = scope.current
    if (!el || !isFine() || calm()) return
    const cleanups: (() => void)[] = []
    el.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((node) => {
      const xTo = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3.out' })
      const yTo = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3.out' })
      const move = (e: PointerEvent) => {
        const r = node.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      node.addEventListener('pointermove', move)
      node.addEventListener('pointerleave', leave)
      cleanups.push(() => {
        node.removeEventListener('pointermove', move)
        node.removeEventListener('pointerleave', leave)
      })
    })
    return () => cleanups.forEach((c) => c())
  }, [scope])
}
