import { useLayoutEffect, useRef } from 'react'
import { calm, gsap } from '../../lib/motion'
import { useAutoCycle } from '../../lib/interact'
import { testimonials } from '../../lib/content'

export function Voices() {
  const ref = useRef<HTMLElement>(null)
  const quote = useRef<HTMLDivElement>(null)
  const { index, select, running, delay } = useAutoCycle(testimonials.length, ref, () => 7000)
  const first = useRef(true)
  const t = testimonials[index]

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !quote.current) return
    gsap.fromTo(quote.current.children, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 })
  }, [index])

  const step = (d: number) => select((index + d + testimonials.length) % testimonials.length)

  return (
    <section ref={ref} className="voices" data-tone="dawn">
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
            <button type="button" onClick={() => step(1)} aria-label="Next story">
              →
            </button>
          </div>
        </div>
        <div>
          <figure ref={quote} className="voices__quote" aria-live="polite">
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <strong>{t.who}</strong> · {t.path}
            </figcaption>
          </figure>
          <ol className="voices__dots" aria-label="Stories">
            {testimonials.map((x, i) => (
              <li key={x.who}>
                <button type="button" aria-label={`Story ${i + 1}: ${x.path}`} aria-current={i === index} onClick={() => select(i)}>
                  <span>{x.path}</span>
                  <i style={i === index && running ? { animationDuration: `${delay}ms` } : undefined} data-run={i === index && running} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
