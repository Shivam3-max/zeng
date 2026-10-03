import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph } from '../../lib/glyphs'
import { calm, gsap } from '../../lib/motion'
import { concerns, paths, serviceCount, type Path, type Service } from '../../lib/content'
import { mulberry32 } from '../../scene/shapes'
import { sceneStore } from '../../scene/store'

const C = 400
const R_IN = 118
const R_OUT = 372
const deg = (d: number) => (d * Math.PI) / 180
const polar = (r: number, a: number) => [C + Math.cos(deg(a)) * r, C + Math.sin(deg(a)) * r] as const
const houseAngle = (k: number) => -90 + k * 45

type Star = { x: number; y: number; house: number; i: number; s: Service; p: Path }

/** Deterministic star positions: each path is a constellation inside its 45° house. */
function buildSky() {
  const stars: Star[] = []
  const lines: { house: number; d: string }[] = []
  paths.forEach((p, k) => {
    const rnd = mulberry32(31 + k * 7)
    const pts: [number, number][] = []
    let guard = 0
    let minD = 40
    while (pts.length < p.services.length && guard++ < 4000) {
      if (guard % 600 === 0) minD -= 4
      const a = houseAngle(k) + (rnd() * 2 - 1) * 16
      const r = 150 + rnd() * 185
      const [x, y] = polar(r, a)
      if (pts.every(([px, py]) => Math.hypot(px - x, py - y) > minD)) pts.push([x, y])
    }
    // greedy nearest-neighbour chain from the innermost star = the constellation line
    const order: number[] = []
    const left = pts.map((_, i) => i)
    left.sort((a, b) => Math.hypot(pts[a][0] - C, pts[a][1] - C) - Math.hypot(pts[b][0] - C, pts[b][1] - C))
    order.push(left.shift()!)
    while (left.length) {
      const last = pts[order[order.length - 1]]
      left.sort((a, b) => Math.hypot(pts[a][0] - last[0], pts[a][1] - last[1]) - Math.hypot(pts[b][0] - last[0], pts[b][1] - last[1]))
      order.push(left.shift()!)
    }
    lines.push({ house: k, d: order.map((o, j) => `${j ? 'L' : 'M'}${pts[o][0].toFixed(1)} ${pts[o][1].toFixed(1)}`).join(' ') })
    pts.forEach(([x, y], i) => stars.push({ x, y, house: k, i, s: p.services[i], p }))
  })
  return { stars, lines }
}

const wedge = (k: number) => {
  const a0 = houseAngle(k) - 22.5
  const a1 = houseAngle(k) + 22.5
  const [x0, y0] = polar(R_IN, a0)
  const [x1, y1] = polar(R_OUT, a0)
  const [x2, y2] = polar(R_OUT, a1)
  const [x3, y3] = polar(R_IN, a1)
  return `M${x0} ${y0} L${x1} ${y1} A${R_OUT} ${R_OUT} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${R_IN} ${R_IN} 0 0 0 ${x0} ${y0} Z`
}

/** Every service as a star chart: houses = paths, stars = services. */
export function ServiceIndex() {
  const sky = useMemo(buildSky, [])
  const svg = useRef<SVGSVGElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [house, setHouse] = useState<number | null>(null)
  const [focus, setFocus] = useState<Star | null>(null)
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const hits = useMemo(
    () => (needle ? sky.stars.filter((st) => st.s.name.toLowerCase().includes(needle) || st.p.name.toLowerCase().includes(needle) || st.s.desc.toLowerCase().includes(needle)) : []),
    [needle, sky],
  )

  // zoom the chart into the chosen constellation
  useLayoutEffect(() => {
    const el = svg.current
    if (!el) return
    let vb = '0 0 800 800'
    if (house !== null) {
      const [cx, cy] = polar(250, houseAngle(house))
      vb = `${(cx - 230).toFixed(1)} ${(cy - 230).toFixed(1)} 460 460`
    }
    if (calm()) el.setAttribute('viewBox', vb)
    else gsap.to(el, { attr: { viewBox: vb }, duration: 1.2, ease: 'expo.inOut' })
  }, [house])

  useLayoutEffect(() => {
    if (calm() || !panel.current) return
    gsap.fromTo(panel.current.children, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.04 })
    gsap.fromTo(
      panel.current.querySelectorAll('.sky-detail .glyph [pathLength]:not([stroke-dasharray])'),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.04 },
    )
  }, [house, focus, needle])

  const openHouse = (k: number | null) => {
    setHouse(k)
    setFocus(null)
    if (k !== null) sceneStore.pulse(0.6)
  }
  const starState = (st: Star) => {
    if (needle) return hits.includes(st) ? 'hit' : 'dim'
    if (focus === st) return 'focus'
    if (house !== null && st.house !== house) return 'dim'
    return 'idle'
  }

  return (
    <section className="sindex" data-tone="dawn" id="all-services">
      <header className="sindex__head wrap">
        <div>
          <p className="eyebrow">The complete index</p>
          <h2 className="h2" data-reveal="lines">
            Every way <em>I can help.</em>
          </h2>
        </div>
        <p className="lede" data-reveal>
          {serviceCount} services, charted like the sky. Choose a constellation, or touch a star.
        </p>
      </header>

      <div className="sky wrap">
        <div className="sky__chart">
          <svg ref={svg} viewBox="0 0 800 800" className="sky__svg" role="img" aria-label={`Star chart of ${serviceCount} services in eight constellations`}>
            <circle cx={C} cy={C} r={390} className="sky__ring" />
            <circle cx={C} cy={C} r={R_OUT} className="sky__ring" />
            <circle cx={C} cy={C} r={R_IN} className="sky__ring" />
            {Array.from({ length: 72 }, (_, t) => {
              const [x0, y0] = polar(R_OUT, t * 5)
              const [x1, y1] = polar(t % 9 === 0 ? 390 : 380, t * 5)
              return <line key={t} x1={x0} y1={y0} x2={x1} y2={y1} className="sky__tick" />
            })}
            {paths.map((p, k) => {
              const [lx, ly] = polar(R_IN - 2, houseAngle(k) - 22.5)
              const [ox, oy] = polar(R_OUT, houseAngle(k) - 22.5)
              return <line key={p.id} x1={lx} y1={ly} x2={ox} y2={oy} className="sky__divider" />
            })}
            {paths.map((p, k) => (
              <path
                key={p.id}
                d={wedge(k)}
                className="sky__house"
                data-on={house === k}
                onClick={() => openHouse(house === k ? null : k)}
                aria-hidden="true"
              />
            ))}
            {sky.lines.map((l) => (
              <path key={l.house} d={l.d} className="sky__line" data-dim={(house !== null && house !== l.house) || !!needle} />
            ))}
            {sky.stars.map((st) => (
              <g
                key={`${st.house}-${st.i}`}
                className="sky__star"
                data-state={starState(st)}
                transform={`translate(${st.x.toFixed(1)} ${st.y.toFixed(1)})`}
                onPointerEnter={() => setFocus(st)}
                onClick={() => {
                  setFocus(st)
                  setHouse(st.house)
                  sceneStore.pulse(0.7)
                }}
              >
                <circle r={16} className="sky__hit" />
                <circle r={9} className="sky__halo" />
                <circle r={3.4} className="sky__core" />
              </g>
            ))}
            {paths.map((p, k) => {
              const [x, y] = polar(352 - 0, houseAngle(k))
              return (
                <text key={p.id} x={x} y={y + 5} className="sky__label" data-on={house === k} textAnchor="middle" onClick={() => openHouse(house === k ? null : k)}>
                  {p.num} {p.short}
                </text>
              )
            })}
            <text x={C} y={C - 6} textAnchor="middle" className="sky__center-n">
              {house === null ? serviceCount : paths[house].num}
            </text>
            <text x={C} y={C + 22} textAnchor="middle" className="sky__center-l">
              {house === null ? 'ways to heal' : paths[house].short.toLowerCase()}
            </text>
          </svg>
          {house !== null && (
            <button type="button" className="sky__back" onClick={() => openHouse(null)}>
              ← Whole sky
            </button>
          )}
        </div>

        <aside className="sky__panel glass">
          <label className="sr-only" htmlFor="svc-search">
            Search services
          </label>
          <input
            id="svc-search"
            type="search"
            className="sky__search"
            placeholder={`Search ${serviceCount} services…`}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setFocus(null)
            }}
            autoComplete="off"
          />
          <div ref={panel} className="sky__body">
            {needle ? (
              <>
                <p className="label">
                  {hits.length} {hits.length === 1 ? 'star' : 'stars'} lit
                </p>
                <ul className="sky__list">
                  {hits.slice(0, 9).map((st) => (
                    <li key={`${st.house}-${st.i}`}>
                      <button type="button" onPointerEnter={() => setFocus(st)} onClick={() => {
                          setQ('')
                          setHouse(st.house)
                          setFocus(st)
                        }}>
                        <Glyph name={st.s.glyph} size={22} />
                        {st.s.name}
                      </button>
                    </li>
                  ))}
                </ul>
                {hits.length === 0 && <p className="sky__empty">No star by that name — try “anxiety”, “marriage” or “energy”.</p>}
              </>
            ) : focus ? (
              <div className="sky-detail">
                <Glyph key={focus.s.name} name={focus.s.glyph} size={84} />
                <p className="label">
                  {focus.p.num} · {focus.p.short}
                </p>
                <p className="sky-detail__name">{focus.s.name}</p>
                <p className="sky-detail__desc">{focus.s.desc}</p>
                <TLink to={`/contact?path=${focus.p.id}`} className="link-arrow">
                  Book this
                </TLink>
              </div>
            ) : house !== null ? (
              <>
                <p className="label">Constellation {paths[house].num}</p>
                <p className="sky__house-name">{paths[house].name}</p>
                <ul className="sky__list">
                  {sky.stars
                    .filter((st) => st.house === house)
                    .map((st) => (
                      <li key={st.i}>
                        <button type="button" onPointerEnter={() => setFocus(st)} onFocus={() => setFocus(st)} onClick={() => setFocus(st)}>
                          <Glyph name={st.s.glyph} size={22} />
                          {st.s.short ?? st.s.name}
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <>
                <p className="sky__intro">Eight constellations. Pick one to fly in.</p>
                <div className="sky__houses">
                  {paths.map((p, k) => (
                    <button key={p.id} type="button" onClick={() => openHouse(k)}>
                      <Glyph name={p.glyph} size={22} />
                      {p.short}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <div className="drift" aria-label="People come to me with">
        <p className="label wrap">People come to me with</p>
        {[0, 1].map((row) => {
          const items = concerns.filter((_, i) => i % 2 === row)
          return (
            <div key={row} className={`drift__row drift__row--${row}`} aria-hidden={row === 1}>
              <div className="drift__track">
                {[...items, ...items].map((c, i) => (
                  <span key={i}>
                    {c}
                    <i aria-hidden="true">✦</i>
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
