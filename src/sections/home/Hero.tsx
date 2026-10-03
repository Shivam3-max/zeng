import { useLayoutEffect, useRef } from 'react'
import { TLink } from '../../components/Transition'
import { calm, gsap, introDelay, introReady, scrollToTarget, SplitText } from '../../lib/motion'
import { paths, serviceCount } from '../../lib/content'

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      const split = SplitText.create(ref.current!.querySelector<HTMLElement>('.hero__title')!, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' })
      const tl = gsap.timeline({ paused: true, delay: introDelay() })
      tl.from(split.chars, { yPercent: 115, duration: 1.5, ease: 'expo.out', stagger: 0.028 })
        .from('.hero__eyebrow', { autoAlpha: 0, y: 16, duration: 1, ease: 'power3.out' }, 0.15)
        .from('.hero__lede', { autoAlpha: 0, y: 24, duration: 1.1, ease: 'power3.out' }, 0.55)
        .from('.hero__ctas > *', { autoAlpha: 0, y: 24, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.7)
        .from('.hero__meta > *', { autoAlpha: 0, duration: 1.2, stagger: 0.1 }, 0.9)
        .from('.hero__fig', { autoAlpha: 0, x: 20, duration: 1.2 }, 1)
      introReady.then(() => tl.play())

      gsap.to('.hero__content', {
        yPercent: -14,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 20%', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="hero" data-tone="night">
      <div className="hero__content wrap">
        <p className="eyebrow hero__eyebrow">
          <span className="pulse-dot" aria-hidden="true" /> Psychotherapist · Clinical Hypnotherapist · Holistic Healer
        </p>
        <h1 className="hero__title display">
          Come home <br />
          <em>to yourself.</em>
        </h1>
        <p className="hero__lede">
          Counselling, deep subconscious therapy and soul-level healing with <strong>Hardeep Kaur</strong> — for the anxious mind, the
          tired heart, and the part of you that is still waiting to be heard.
        </p>
        <div className="hero__ctas">
          <TLink to="/contact" className="btn btn--solid" data-magnetic>
            Book a session
          </TLink>
          <a
            href="#finder"
            className="btn btn--ghost"
            data-magnetic
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#finder')
            }}
          >
            Find where to begin
          </a>
        </div>
      </div>

      <p className="hero__fig figcap" aria-hidden="true">
        fig. 01 — the soul, at rest
        <span className="hero__hint">move your cursor through it</span>
      </p>

      <div className="hero__meta wrap">
        <span>Online worldwide · In person · Distant healing</span>
        <span className="hero__scroll" aria-hidden="true">
          <i /> Scroll
        </span>
        <span>
          {serviceCount}+ ways to heal · {paths.length} paths
        </span>
      </div>
    </section>
  )
}
