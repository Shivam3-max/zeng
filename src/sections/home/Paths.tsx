import { useLayoutEffect, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph } from '../../lib/glyphs'
import { calm, gsap, ScrollTrigger, scrollToTarget } from '../../lib/motion'
import { paths } from '../../lib/content'

/**
 * The eight service paths.  A sticky stage on the left holds the numeral and
 * figure caption while the WebGL soul (behind the page) takes each path's
 * form; the panels scroll past on the right.
 */
export function Paths() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const panels = [...el.querySelectorAll<HTMLElement>('.panel')]
    const triggers = panels.map((p, i) =>
      ScrollTrigger.create({
        trigger: p,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && setActive(i),
      }),
    )
    const ctx = gsap.context(() => {
      if (calm()) return
      panels.forEach((p) => {
        gsap.from(p.querySelectorAll('.panel__kicker, .panel__title, .panel__line, .panel__body'), {
          autoAlpha: 0,
          y: 34,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: p, start: 'top 70%', once: true },
        })
        gsap.from(p.querySelectorAll('.panel__list li'), {
          autoAlpha: 0,
          x: 18,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.045,
          scrollTrigger: { trigger: p, start: 'top 55%', once: true },
        })
        gsap.fromTo(
          p.querySelectorAll('.panel__list .glyph [pathLength]:not([stroke-dasharray])'),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.012, scrollTrigger: { trigger: p, start: 'top 55%', once: true } },
        )
      })
    }, el)
    return () => {
      triggers.forEach((t) => t.kill())
      ctx.revert()
    }
  }, [])

  const cur = paths[active]

  return (
    <section ref={ref} id="paths" className="paths" data-tone="dusk">
      <header className="paths__head wrap">
        <p className="eyebrow">Services · {paths.length} paths</p>
        <h2 className="h2" data-reveal="lines">
          Eight paths. <em>One way home.</em>
        </h2>
        <p className="lede" data-reveal>
          Everyone arrives differently, so I work through many doors — from talk therapy, to the subconscious, to subtle energy.
          Here is each one, illustrated.
        </p>
        <nav className="paths__toc" aria-label="Jump to a path" data-reveal="stagger">
          {paths.map((p) => (
            <a
              key={p.id}
              href={`#path-${p.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(`#path-${p.id}`)
              }}
            >
              <span>{p.num}</span>
              {p.short}
            </a>
          ))}
        </nav>
      </header>

      <div className="paths__body">
        <div className="paths__stage" aria-hidden="true">
          <div className="paths__stage-inner wrap-l">
            <ol className="paths__ticks">
              {paths.map((p, i) => (
                <li key={p.id} data-on={i === active}>
                  {p.num}
                </li>
              ))}
            </ol>
            <div className="paths__numeral" key={cur.id}>
              {cur.num}
            </div>
            <p className="paths__figcap figcap" key={`f-${cur.id}`}>
              fig. {String(active + 2).padStart(2, '0')} — {cur.figure}
            </p>
          </div>
        </div>

        <div className="paths__panels">
          {paths.map((p) => (
            <article key={p.id} id={`path-${p.id}`} className="panel" aria-labelledby={`t-${p.id}`}>
              <div className="panel__inner">
                <p className="panel__kicker">
                  <span>{p.num}</span> {p.kicker}
                </p>
                <h3 id={`t-${p.id}`} className="panel__title">
                  {p.name}
                </h3>
                <p className="panel__line">{p.line}</p>
                <p className="panel__body">{p.body}</p>
                <ul className={`panel__list${p.services.length > 10 ? ' panel__list--dense' : ''}`}>
                  {p.services.map((s) => (
                    <li key={s.name}>
                      <Glyph name={s.glyph} size={34} />
                      <span>{s.name}</span>
                    </li>
                  ))}
                </ul>
                <div className="panel__helps">
                  <span className="label">{p.id === 'workshops' ? 'For' : 'Helps with'}</span>
                  {p.helps.map((h) => (
                    <span key={h} className="tag">
                      {h}
                    </span>
                  ))}
                </div>
                <TLink to={`/contact?path=${p.id}`} className="link-arrow">
                  {p.cta}
                </TLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
