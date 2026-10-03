import { useLayoutEffect, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph } from '../../lib/glyphs'
import { calm, gsap, scrollToTarget } from '../../lib/motion'
import { feelings, paths, site, type Feeling } from '../../lib/content'

export function PathFinder() {
  const [sel, setSel] = useState<string | null>(null)
  const feeling = feelings.find((f) => f.id === sel) ?? null

  return (
    <section id="finder" className="finder" data-tone="dusk">
      <div className="wrap finder__grid">
        <div className="finder__intro">
          <p className="eyebrow">Begin here</p>
          <h2 className="h2" data-reveal="lines">
            What brings you <em>here</em> today?
          </h2>
          <p className="lede">Choose what feels closest. There are no wrong answers — only a place to start.</p>
          <div className="finder__chips" role="group" aria-label="How are you feeling?" data-reveal="stagger">
            {feelings.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`chip${f.crisis ? ' chip--soft' : ''}`}
                aria-pressed={sel === f.id}
                onClick={() => setSel(sel === f.id ? null : f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="finder__card glass" aria-live="polite">
          {feeling ? <Result key={feeling.id} f={feeling} /> : <Empty />}
        </div>
      </div>
    </section>
  )
}

function Empty() {
  return (
    <div className="finder__empty">
      <Glyph name="compass" size={120} />
      <p className="finder__empty-title">Choose a feeling and I’ll show you where we might begin.</p>
      <p className="finder__empty-note">Nothing you select here is stored or sent anywhere.</p>
    </div>
  )
}

function Result({ f }: { f: Feeling }) {
  const ref = useRef<HTMLDivElement>(null)
  const path = paths.find((p) => p.id === f.path)!

  useLayoutEffect(() => {
    if (calm() || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.from('.finder__res > *', { autoAlpha: 0, y: 18, duration: 0.7, ease: 'power3.out', stagger: 0.06 })
      gsap.fromTo(
        '.glyph [pathLength]:not([stroke-dasharray])',
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.03, delay: 0.15 },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="finder__res">
      {f.crisis && (
        <div className="crisis" role="alert">
          <strong>Please reach out right now.</strong>
          <p>
            You don’t have to carry this alone. Call {site.crisis.line} on <a href={`tel:${site.crisis.number}`}>{site.crisis.number}</a>{' '}
            (free, 24×7) or <a href={`tel:${site.crisis.emergency}`}>{site.crisis.emergency}</a> in an emergency. When you feel safe, I
            am here for steady, ongoing support.
          </p>
        </div>
      )}
      <p className="finder__res-kicker">A gentle place to begin</p>
      <p className="finder__res-quote">“{f.label}”</p>
      <ul className="finder__recs">
        {f.recs.map((r) => (
          <li key={r.name}>
            <Glyph name={r.glyph} size={46} />
            <div>
              <strong>{r.name}</strong>
              <span>{r.why}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="finder__res-actions">
        <TLink to={`/contact?concern=${f.id}`} className="btn btn--solid btn--sm">
          Book a session for this
        </TLink>
        <a
          href={`#path-${path.id}`}
          className="link-arrow"
          onClick={(e) => {
            e.preventDefault()
            scrollToTarget(`#path-${path.id}`)
          }}
        >
          See the {path.short.toLowerCase()} path
        </a>
      </div>
    </div>
  )
}
