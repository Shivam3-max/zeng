import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { calm, gsap } from '../../lib/motion'
import { lifePath, numerology } from '../../lib/content'

const BASE: Record<number, number> = { 11: 2, 22: 4, 33: 6 }
const angleOf = (n: number) => ((BASE[n] ?? n) - 1) * 40

/** Life-path number on an enneagram wheel. */
export function Numerology() {
  const [dob, setDob] = useState('')
  const [err, setErr] = useState('')
  const [res, setRes] = useState<ReturnType<typeof lifePath>>(null)
  const pointer = useRef<SVGGElement>(null)
  const big = useRef<SVGTextElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const today = new Date().toISOString().slice(0, 10)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const r = lifePath(dob)
    if (!r) {
      setErr('Please choose your full date of birth.')
      return
    }
    setErr('')
    setRes(r)
  }

  useLayoutEffect(() => {
    if (!res) return
    const target = angleOf(res.number)
    if (calm()) {
      gsap.set(pointer.current, { rotation: target, svgOrigin: '130 130' })
      if (big.current) big.current.textContent = String(res.number)
      return
    }
    gsap.to(pointer.current, { rotation: target + 720, svgOrigin: '130 130', duration: 2.2, ease: 'expo.out' })
    const c = { v: 0 }
    gsap.to(c, {
      v: res.number,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => {
        if (big.current) big.current.textContent = String(Math.round(c.v))
      },
    })
    if (panel.current) gsap.from(panel.current.children, { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.07, delay: 0.5 })
  }, [res])

  const meaning = res ? numerology[res.number] : null
  const pts = Array.from({ length: 9 }, (_, k) => {
    const a = ((-90 + k * 40) * Math.PI) / 180
    return { n: k + 1, x: 130 + Math.cos(a) * 104, y: 130 + Math.sin(a) * 104, lx: 130 + Math.cos(a) * 84, ly: 130 + Math.sin(a) * 84 }
  })
  const active = res ? (BASE[res.number] ?? res.number) : 0

  return (
    <div className="numero">
      <div className="numero__wheel">
        <svg viewBox="0 0 260 260" aria-hidden="true">
          <circle cx="130" cy="130" r="104" className="numero__ring" />
          <circle cx="130" cy="130" r="118" className="numero__ring numero__ring--faint" />
          <path
            className="numero__ennea"
            d={[1, 4, 2, 8, 5, 7, 1]
              .map((n, i) => `${i ? 'L' : 'M'}${pts[n - 1].x.toFixed(1)} ${pts[n - 1].y.toFixed(1)}`)
              .join(' ')}
          />
          <path
            className="numero__ennea numero__ennea--tri"
            d={[3, 6, 9, 3].map((n, i) => `${i ? 'L' : 'M'}${pts[n - 1].x.toFixed(1)} ${pts[n - 1].y.toFixed(1)}`).join(' ')}
          />
          {pts.map((p) => (
            <g key={p.n} className={p.n === active ? 'is-on' : undefined}>
              <circle cx={p.x} cy={p.y} r="4" className="numero__node" />
              <text x={p.lx} y={p.ly + 5} textAnchor="middle" className="numero__label">
                {p.n}
              </text>
            </g>
          ))}
          <g ref={pointer}>
            <circle cx="130" cy="26" r="9" className="numero__pointer" />
          </g>
          <text ref={big} x="130" y="152" textAnchor="middle" className="numero__big">
            {res ? res.number : '?'}
          </text>
        </svg>
      </div>

      <div className="numero__side">
        <form className="numero__form" onSubmit={submit}>
          <label htmlFor="dob" className="label">
            Your date of birth
          </label>
          <div className="numero__row">
            <input id="dob" type="date" max={today} min="1900-01-01" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <button className="btn btn--solid btn--sm" type="submit">
              Reveal my number
            </button>
          </div>
          {err && <p className="field-error">{err}</p>}
          <p className="numero__privacy">Calculated on your device. Nothing is stored or sent.</p>
        </form>

        <div ref={panel} className="numero__result" aria-live="polite">
          {res && meaning ? (
            <>
              <p className="numero__kicker">Life path {res.number}</p>
              <h3 className="numero__title">{meaning.title}</h3>
              <p className="numero__line">{meaning.line}</p>
              <p className="numero__steps">
                {res.parts.map((p) => (
                  <span key={p.label}>
                    {p.label} {p.digits} → {p.reduced}
                  </span>
                ))}
                <span>
                  {res.parts.map((p) => p.reduced).join(' + ')} = {res.total}
                  {res.number !== res.total ? ` → ${res.number}` : ''}
                </span>
              </p>
            </>
          ) : (
            <>
              <p className="numero__kicker">Numerology</p>
              <h3 className="numero__title">The number you were born with.</h3>
              <p className="numero__line">
                Your life-path number describes your natural way of moving through the world. A full numerology session reads your
                name, timing and cycles too.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
