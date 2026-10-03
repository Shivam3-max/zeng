import { useLayoutEffect, useRef, useState } from 'react'
import { calm, gsap } from '../../lib/motion'
import { testimonials } from '../../lib/content'

export function Voices() {
  const [i, setI] = useState(0)
  const quote = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  const t = testimonials[i]

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !quote.current) return
    gsap.fromTo(quote.current.children, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 })
  }, [i])

  const step = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length)

  return (
    <section className="voices" data-tone="dawn">
      <div className="voices__grid wrap">
        <div className="voices__side">
          <p className="eyebrow">In their words</p>
          <span className="voices__mark" aria-hidden="true">
            “
          </span>
          <div className="voices__nav">
            <button type="button" onClick={() => step(-1)} aria-label="Previous story">
              ←
            </button>
            <span>
              {String(i + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Next story">
              →
            </button>
          </div>
        </div>
        <figure ref={quote} className="voices__quote" aria-live="polite">
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <strong>{t.who}</strong> · {t.path}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
