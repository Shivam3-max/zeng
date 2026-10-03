import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph, type GlyphName } from '../../lib/glyphs'
import { gsap, isFine } from '../../lib/motion'
import { concerns, paths, serviceCount } from '../../lib/content'

/** Every service on one page — hover any line to see its illustration. */
export function ServiceIndex() {
  const [q, setQ] = useState('')
  const [hover, setHover] = useState<{ name: string; glyph: GlyphName; path: string } | null>(null)
  const ref = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)

  const needle = q.trim().toLowerCase()
  const matches = useMemo(
    () => paths.reduce((n, p) => n + p.services.filter((s) => !needle || s.name.toLowerCase().includes(needle) || p.name.toLowerCase().includes(needle)).length, 0),
    [needle],
  )

  useLayoutEffect(() => {
    const el = ref.current
    const pv = preview.current
    if (!el || !pv || !isFine()) return
    const xTo = gsap.quickTo(pv, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(pv, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      xTo(e.clientX + 28)
      yTo(e.clientY - 90)
    }
    el.addEventListener('pointermove', move)
    return () => el.removeEventListener('pointermove', move)
  }, [])

  useLayoutEffect(() => {
    const pv = preview.current
    if (!pv || !hover) return
    gsap.fromTo(
      pv.querySelectorAll('.glyph [pathLength]:not([stroke-dasharray])'),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', stagger: 0.04 },
    )
  }, [hover])

  return (
    <section ref={ref} className="sindex" data-tone="dawn" id="all-services">
      <header className="sindex__head wrap">
        <div>
          <p className="eyebrow">The complete index</p>
          <h2 className="h2" data-reveal="lines">
            Every way <em>I can help.</em>
          </h2>
        </div>
        <div className="sindex__tools" data-reveal>
          <label className="sr-only" htmlFor="svc-search">
            Search services
          </label>
          <input
            id="svc-search"
            type="search"
            placeholder={`Search ${serviceCount} services…`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
          <span className="sindex__count">
            {matches} / {serviceCount}
          </span>
        </div>
      </header>

      <div className="sindex__cols wrap">
        {paths.map((p) => (
          <div key={p.id} className="sindex__group" data-reveal>
            <h3>
              <span>{p.num}</span>
              {p.name}
            </h3>
            <ul>
              {p.services.map((s) => {
                const hit = !needle || s.name.toLowerCase().includes(needle) || p.name.toLowerCase().includes(needle)
                return (
                  <li
                    key={s.name}
                    className={hit ? undefined : 'is-dim'}
                    onPointerEnter={() => setHover({ name: s.name, glyph: s.glyph, path: p.short })}
                    onPointerLeave={() => setHover(null)}
                  >
                    <TLink to={`/contact?path=${p.id}`} tabIndex={hit ? 0 : -1}>
                      <Glyph name={s.glyph} size={22} className="sindex__mini" />
                      {s.name}
                    </TLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="sindex__concerns wrap" data-reveal>
        <p className="label">People come to me with</p>
        <p className="sindex__run">
          {concerns.map((c, i) => (
            <span key={c}>
              {c}
              {i < concerns.length - 1 && <i aria-hidden="true"> · </i>}
            </span>
          ))}
        </p>
      </div>

      <div ref={preview} className="sindex__preview" data-on={!!hover} aria-hidden="true">
        {hover && (
          <>
            <Glyph key={hover.name} name={hover.glyph} size={92} />
            <strong>{hover.name}</strong>
            <small>{hover.path}</small>
          </>
        )}
      </div>
    </section>
  )
}
