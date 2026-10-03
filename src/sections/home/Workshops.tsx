import { useLayoutEffect, useRef } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph } from '../../lib/glyphs'
import { calm, gsap, isFine, ScrollTrigger } from '../../lib/motion'
import { workshops } from '../../lib/content'

/** Twelve workshops on a rail that scrolls sideways as you scroll down (desktop), or swipes (touch). */
export function Workshops() {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const tr = track.current
    if (!el || !tr) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (min-height: 560px)', () => {
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth)
      const size = () => {
        el.style.height = `${distance() + window.innerHeight}px`
      }
      size()
      ScrollTrigger.addEventListener('refreshInit', size)
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: calm() ? true : 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', size)
        tween.kill()
        el.style.height = ''
        gsap.set(tr, { clearProps: 'x' })
      }
    })

    // gentle 3D tilt toward the cursor
    const cleanups: (() => void)[] = []
    if (isFine() && !calm()) {
      tr.querySelectorAll<HTMLElement>('.wcard').forEach((c) => {
        gsap.set(c, { transformPerspective: 900 })
        const rx = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3.out' })
        const ry = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3.out' })
        const move = (e: PointerEvent) => {
          const r = c.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 14)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 14)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        c.addEventListener('pointermove', move)
        c.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          c.removeEventListener('pointermove', move)
          c.removeEventListener('pointerleave', leave)
        })
      })
    }
    return () => {
      mm.revert()
      cleanups.forEach((c) => c())
    }
  }, [])

  return (
    <section ref={ref} className="ws" data-tone="dawn" id="workshops">
      <div className="ws__sticky">
        <header className="ws__head wrap">
          <div>
            <p className="eyebrow">Workshops & talks</p>
            <h2 className="h2">
              Twelve workshops. <em>One braver room.</em>
            </h2>
          </div>
          <div className="ws__aside">
            <p>For corporate teams, schools & colleges and community groups — on site, or live online.</p>
            <TLink to="/contact?path=workshops" className="link-arrow">
              Plan a workshop
            </TLink>
          </div>
        </header>
        <div className="ws__viewport">
          <div ref={track} className="ws__track">
            {workshops.map((w, i) => (
              <article key={w.title} className="wcard">
                <span className="wcard__num">W·{String(i + 1).padStart(2, '0')}</span>
                <Glyph name={w.glyph} size={104} />
                <h3>{w.title}</h3>
                <p>{w.line}</p>
                <span className="wcard__meta">60–120 min · on site or online</span>
              </article>
            ))}
          </div>
        </div>
        <div className="ws__bar wrap" aria-hidden="true">
          <span ref={bar} />
        </div>
      </div>
    </section>
  )
}
