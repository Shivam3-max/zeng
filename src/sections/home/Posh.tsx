import { useLayoutEffect, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph } from '../../lib/glyphs'
import { calm, gsap } from '../../lib/motion'
import { useAutoCycle } from '../../lib/interact'
import { poshAudiences, poshChecks } from '../../lib/content'
import { sceneStore } from '../../scene/store'

const VERDICT = [
  'Let’s build this properly — and make it feel human.',
  'Let’s build this properly — and make it feel human.',
  'A good start. A few important gaps to close.',
  'Nearly there — a few gaps worth closing this quarter.',
  'Nearly there — one gap worth closing this quarter.',
  'Beautifully covered. A refresher keeps it alive.',
]

export function Posh() {
  const tabs = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const { index, select, running, delay } = useAutoCycle(poshAudiences.length, tabs, () => 4600)
  const a = poshAudiences[index]
  const [checks, setChecks] = useState<boolean[]>(() => poshChecks.map(() => false))
  const score = checks.filter(Boolean).length
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !card.current) return
    gsap.fromTo(card.current.children, { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 })
  }, [index])

  return (
    <section className="posh" data-tone="wine" id="posh">
      <div className="posh__grid wrap">
        <div className="posh__copy">
          <p className="eyebrow">Women empowerment · POSH</p>
          <h2 className="h2" data-reveal="lines">
            Safe at work. <em>Strong in life.</em>
          </h2>
          <p className="lede" data-reveal>
            POSH — the Prevention of Sexual Harassment — done in a way people remember, and a confidential place for women to be
            heard.
          </p>

          <div ref={tabs} className="aud" data-reveal>
            <div className="aud__tabs" role="tablist" aria-label="Who it is for">
              {poshAudiences.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => {
                    select(i)
                    sceneStore.pulse(0.6)
                  }}
                >
                  {x.who}
                  {i === index && running && <i className="xp__timer" style={{ animationDuration: `${delay}ms` }} aria-hidden="true" />}
                </button>
              ))}
            </div>
            <div ref={card} className="aud__card" role="tabpanel">
              <Glyph key={a.id} name={a.glyph} size={64} />
              <div>
                <p className="aud__title">{a.title}</p>
                <p className="aud__desc">{a.desc}</p>
                <ul className="aud__covers">
                  {a.covers.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="posh__note">Built around the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.</p>
          <TLink to="/contact?path=women" className="btn btn--solid" data-magnetic>
            Plan a POSH session
          </TLink>
        </div>

        <div className="posh__side">
          <div className="posh__fig" aria-hidden="true">
            <p className="figcap">fig. 10 — the lotus rises from the mud</p>
          </div>
          <div className="ready glass" data-reveal>
            <div className="ready__head">
              <p className="ready__title">Is your workplace POSH-ready?</p>
              <div className="ready__meter" style={{ ['--s' as string]: score / poshChecks.length }} aria-label={`${score} of ${poshChecks.length}`}>
                <svg viewBox="0 0 44 44" aria-hidden="true">
                  <circle cx="22" cy="22" r="19" />
                  <circle cx="22" cy="22" r="19" pathLength={1} />
                </svg>
                <span>
                  {score}/{poshChecks.length}
                </span>
              </div>
            </div>
            <ul className="ready__list">
              {poshChecks.map((c, i) => (
                <li key={c}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checks[i]}
                    onClick={() => {
                      setChecks((v) => v.map((x, j) => (j === i ? !x : x)))
                      sceneStore.pulse(0.35)
                    }}
                  >
                    <span className="ready__box" aria-hidden="true" />
                    {c}
                  </button>
                </li>
              ))}
            </ul>
            <p className="ready__verdict" aria-live="polite">
              {VERDICT[score]}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
