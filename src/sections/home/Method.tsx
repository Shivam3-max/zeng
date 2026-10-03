import { useLayoutEffect, useRef } from 'react'
import { calm, gsap } from '../../lib/motion'
import { method } from '../../lib/content'
import { clamp, smooth } from '../../scene/choreo'

const LAYERS = ['today', 'last year', 'school days', 'childhood', 'the root']
const W = 320
const H = 220

/** Six tangled threads that comb out into parallel calm as `p` goes 0 → 1. */
export function recodePaths(p: number) {
  const e = smooth(clamp(p))
  return Array.from({ length: 6 }, (_, j) => {
    let d = ''
    for (let x = 0; x <= W; x += 8) {
      const tangled = H / 2 + 74 * Math.sin(x * 0.029 * (j * 0.45 + 1) + j * 2.1) * Math.cos(x * 0.017 + j * 1.3)
      const calmY = 38 + j * 29 + 7 * Math.sin(x * 0.024 + j * 0.5)
      d += `${x ? 'L' : 'M'}${x} ${(tangled + (calmY - tangled) * e).toFixed(1)} `
    }
    return d
  })
}

/** A restless blob that settles into a perfect circle. */
export function resetPath(p: number) {
  const amp = 1 - smooth(clamp(p))
  let d = ''
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2
    const r = 66 + amp * 24 * (0.5 * Math.sin(3 * a + 1) + 0.3 * Math.sin(5 * a + 2) + 0.2 * Math.sin(7 * a + 0.5))
    d += `${i ? 'L' : 'M'}${(110 + Math.cos(a) * r).toFixed(1)} ${(110 + Math.sin(a) * r).toFixed(1)} `
  }
  return d + 'Z'
}

export function Method() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const steps = [...el.querySelectorAll<HTMLElement>('.step')]
    const recall = el.querySelector<HTMLElement>('.recall')!
    const recode = [...el.querySelectorAll<SVGPathElement>('.recode__line')]
    const reset = el.querySelector<SVGPathElement>('.reset__blob')!
    const rings = [...el.querySelectorAll<SVGCircleElement>('.reset__ring')]

    const paint = (i: number, p: number) => {
      steps[i].style.setProperty('--p', p.toFixed(3))
      steps[i].dataset.on = String(p > 0.02 && p < 0.999 ? 'active' : p >= 0.999 ? 'done' : 'idle')
      if (i === 0) recall.style.setProperty('--p', p.toFixed(3))
      if (i === 1) recodePaths(p).forEach((d, j) => recode[j].setAttribute('d', d))
      if (i === 2) {
        reset.setAttribute('d', resetPath(p))
        rings.forEach((r, k) => {
          r.setAttribute('r', String(78 + k * 14 + p * k * 6))
          r.style.opacity = String(clamp(p * 1.4 - k * 0.25) * 0.8)
        })
      }
    }

    if (calm()) {
      el.style.setProperty('--mp', '1')
      steps.forEach((_, i) => paint(i, 1))
      return
    }
    steps.forEach((_, i) => paint(i, 0))

    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (min-height: 560px)', () => {
      gsap.to({}, {
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = clamp((self.progress - 0.04) / 0.9)
            el.style.setProperty('--mp', p.toFixed(3))
            steps.forEach((_, i) => paint(i, clamp(p * 3 - i)))
          },
        },
      })
    })
    mm.add('(max-width: 899px), (max-height: 559px)', () => {
      steps.forEach((s, i) =>
        gsap.to({}, {
          scrollTrigger: { trigger: s, start: 'top 85%', end: 'bottom 45%', scrub: 0.6, onUpdate: (self) => paint(i, self.progress) },
        }),
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={ref} className="method" data-tone="dusk">
      <div className="method__sticky">
        <header className="method__head wrap">
          <div>
            <p className="eyebrow">The signature method</p>
            <h2 className="h2" data-reveal="lines">
              Recall. Recode. <em>Reset.</em>
            </h2>
          </div>
          <p className="lede" data-reveal>
            A three-stage mind-reprogramming process built on the brain’s own plasticity: find where the pattern was learned,
            rewrite the response, then settle into a new normal.
          </p>
        </header>

        <div className="method__steps wrap">
          <div className="step">
            <div className="step__art">
              <div className="recall">
                <div className="recall__stack">
                  {LAYERS.map((l, i) => (
                    <div key={l} className="recall__layer" style={{ ['--i' as string]: i }}>
                      <span>{l}</span>
                    </div>
                  ))}
                  <div className="recall__light" />
                </div>
              </div>
            </div>
            <StepText i={0} />
          </div>

          <div className="step">
            <div className="step__art">
              <svg className="recode" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
                {recodePaths(0).map((d, j) => (
                  <path key={j} className="recode__line" d={d} style={{ ['--j' as string]: j }} />
                ))}
              </svg>
            </div>
            <StepText i={1} />
          </div>

          <div className="step">
            <div className="step__art">
              <svg className="reset" viewBox="0 0 220 220" aria-hidden="true">
                {[0, 1, 2].map((k) => (
                  <circle key={k} className="reset__ring" cx="110" cy="110" r={78 + k * 14} />
                ))}
                <path className="reset__blob" d={resetPath(0)} />
                <circle className="reset__core" cx="110" cy="110" r="5" />
              </svg>
            </div>
            <StepText i={2} />
          </div>
        </div>

        <div className="method__bar wrap" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}

function StepText({ i }: { i: number }) {
  const m = method[i]
  return (
    <div className="step__text">
      <p className="step__num">{m.num}</p>
      <h3 className="step__word">{m.word}</h3>
      <p className="step__line">{m.line}</p>
    </div>
  )
}
