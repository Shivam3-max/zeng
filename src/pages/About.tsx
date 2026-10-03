import { useEffect, useLayoutEffect, useRef } from 'react'
import { Glyph } from '../lib/glyphs'
import { box, calm, gsap, introDelay, introReady, isMobile, SplitText, useMagnetic, useReveals, useSceneTrack } from '../lib/motion'
import { aboutKeys } from '../scene/choreo'
import { bridge, promises, sessionFlow, story, toolkit } from '../lib/content'
import { stackedSequences, stillBeat, useAutoCycle, useScrollSteps } from '../lib/interact'
import { sceneStore } from '../scene/store'
import { Finale } from '../sections/home/Finale'

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  useReveals(ref)
  useMagnetic(ref)

  useEffect(() => {
    document.title = 'About Hardeep Kaur — Psychotherapist & Holistic Healer'
  }, [])

  useSceneTrack(() => {
    const el = ref.current!
    const q = (s: string) => el.querySelector(s)
    return aboutKeys(
      { hero: box(q('.ahero')), story: box(q('.story')), bridge: box(q('.bridge')), cta: box(q('.finale')) },
      window.innerHeight,
      isMobile(),
    )
  })

  return (
    <div ref={ref} className="page page--about">
      <AboutHero />
      <Story />
      <Bridge />
      <Flow />
      <Toolkit />
      <Promises />
      <Finale
        title={
          <>
            Not broken. <em>Buried</em> — and ready for light.
          </>
        }
        lede="Whatever you are carrying, you do not have to carry it alone, or all at once. Let’s begin with one conversation."
      />
    </div>
  )
}

function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      const split = SplitText.create(ref.current!.querySelector<HTMLElement>('.ahero__name')!, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' })
      const tl = gsap.timeline({ paused: true, delay: introDelay() })
      tl.from(split.chars, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.04 })
        .from('.ahero__copy > :not(.ahero__name)', { autoAlpha: 0, y: 22, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.3)
        .from('.arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 0 0)', duration: 1.6, ease: 'expo.inOut' }, 0.1)
        .from('.arch__figure', { scale: 1.12, duration: 2, ease: 'expo.out' }, 0.4)
      introReady.then(() => tl.play())
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="ahero" data-tone="night">
      <div className="ahero__grid wrap">
        <div className="ahero__copy">
          <p className="eyebrow">About</p>
          <h1 className="ahero__name display">
            Hardeep <em>Kaur</em>
          </h1>
          <p className="ahero__role">Psychotherapist · Clinical Hypnotherapist · Holistic Healer · POSH Facilitator</p>
          <p className="lede">
            I work where psychology meets the soul — with the science of how minds change, and the older wisdom of how hearts heal.
          </p>
        </div>
        <figure className="ahero__portrait">
          <div className="arch">
            <div className="arch__aura" />
            <svg className="arch__figure" viewBox="0 0 200 260" aria-hidden="true">
              <ellipse cx="100" cy="96" rx="29" ry="37" />
              <path d="M71 96c-3-38 22-54 46-46 15 6 21 24 16 44" />
              <circle cx="134" cy="64" r="11" />
              <path d="M89 130l2 22M111 130l-2 22" />
              <path d="M34 260c4-56 30-86 58-104h16c28 18 54 48 58 104" />
              <path d="M56 214c22-34 74-40 112-4" className="arch__drape" />
              <circle cx="100" cy="186" r="3" className="arch__dot" />
            </svg>
            <span className="arch__note">Portrait · photo to come</span>
          </div>
          <figcaption className="figcap">fig. 01 — the healer, held in light</figcaption>
        </figure>
      </div>
    </section>
  )
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

/** The story as pinned chapters — one thought on screen at a time. */
function Story() {
  const ref = useRef<HTMLElement>(null)
  const { index, jump } = useScrollSteps(ref, story.length)
  const stat = stackedSequences()
  const state = (i: number) => (stat ? 'on' : i < index ? 'past' : i === index ? 'on' : 'next')
  return (
    <section ref={ref} className={`story${stat ? ' is-static' : ''}`} data-tone="night">
      <div className="story__sticky wrap">
        <p className="eyebrow">Why I do this work</p>
        <div className="story__stage">
          {story.map((c, i) => (
            <article key={c.lead} className="chapter" data-state={state(i)}>
              <span className="chapter__num">Chapter {ROMAN[i]}</span>
              <h2 className="chapter__lead">{c.lead}</h2>
              <p className="chapter__text">{c.text}</p>
              {i === story.length - 1 && <p className="chapter__sign">— Hardeep</p>}
            </article>
          ))}
        </div>
        {!stat && (
          <nav className="story__nav" aria-label="Chapters">
            {story.map((c, i) => (
              <button key={c.lead} type="button" data-on={i === index} onClick={() => jump(i)}>
                <span>{ROMAN[i]}</span>
                <i />
              </button>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}

/** Three doors — tap one to open it. They assemble into a Venn as you arrive. */
function Bridge() {
  const ref = useRef<HTMLElement>(null)
  const doors = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const { index, select, running, delay } = useAutoCycle(bridge.length, doors, () => 4200)
  const b = bridge[index]
  const first = useRef(true)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const venn = el.querySelector<HTMLElement>('.venn')!
    if (calm()) {
      venn.style.setProperty('--p', '1')
      return
    }
    const st = gsap.to(venn, {
      '--p': 1,
      ease: 'none',
      scrollTrigger: { trigger: venn, start: 'top 85%', end: 'center 55%', scrub: 0.8 },
    })
    return () => {
      st.scrollTrigger?.kill()
      st.kill()
    }
  }, [])

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !card.current) return
    gsap.fromTo(card.current.querySelectorAll('.door__head > *, .door__items li'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.05 })
  }, [index])

  return (
    <section ref={ref} className="bridge" data-tone="dusk">
      <header className="bridge__head wrap">
        <p className="eyebrow">The approach</p>
        <h2 className="h2" data-reveal="lines">
          Three doors. <em>One home.</em>
        </h2>
        <p className="lede" data-reveal>
          Most therapy works with one layer of you. I work with three. Open a door.
        </p>
      </header>
      <div ref={doors} className="bridge__grid wrap">
        <div className="bridge__stage">
          <div className="venn" style={{ ['--p' as string]: 0 }} data-active={index}>
            {bridge.map((d, i) => (
              <button
                key={d.id}
                type="button"
                className={`venn__c venn__c--${i}`}
                data-on={i === index}
                aria-pressed={i === index}
                onClick={() => {
                  select(i)
                  sceneStore.pulse(0.6)
                }}
              >
                <span className="venn__title">{d.title}</span>
                <span className="venn__line">{d.line}</span>
              </button>
            ))}
            <span className="venn__you">you</span>
          </div>
        </div>
        <div ref={card} className="door glass" aria-live="polite">
          <div className="door__head">
            <Glyph key={b.id} name={b.glyph} size={58} />
            <div>
              <p className="label">Door {ROMAN[index]}</p>
              <p className="door__title">{b.title}</p>
              <p className="door__line">{b.line}</p>
            </div>
            {running && <i className="xp__timer door__timer" style={{ animationDuration: `${delay}ms` }} key={index} aria-hidden="true" />}
          </div>
          <ul className="door__items">
            {b.items.map((it) => (
              <li key={it.name}>
                <Glyph name={it.glyph} size={30} />
                {it.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const NODES = [
  [60, 150],
  [280, 70],
  [500, 150],
  [720, 70],
  [940, 150],
] as const
const JOURNEY = NODES.map(([x, y], i) => {
  if (!i) return `M${x} ${y}`
  const [px, py] = NODES[i - 1]
  const mx = (px + x) / 2
  return `C${mx} ${py} ${mx} ${y} ${x} ${y}`
}).join(' ')

/** A session as a journey: a light travels the path as you scroll. */
function Flow() {
  const ref = useRef<HTMLElement>(null)
  const path = useRef<SVGPathElement>(null)
  const drawn = useRef<SVGPathElement>(null)
  const dot = useRef<SVGGElement>(null)
  const n = sessionFlow.length
  const stat = stackedSequences()

  const paint = (p: number) => {
    const pa = path.current
    if (!pa || !drawn.current || !dot.current) return
    const f = Math.min(1, Math.max(0, (p * n - 0.5) / (n - 1)))
    const len = pa.getTotalLength()
    const pt = pa.getPointAtLength(f * len)
    drawn.current.style.strokeDashoffset = String(1 - f)
    dot.current.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`)
  }
  const { index, jump } = useScrollSteps(ref, n, paint)

  useLayoutEffect(() => {
    const beat = stillBeat()
    paint(stat ? 1 : Number.isFinite(beat) ? (beat + 0.5) / n : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const s = sessionFlow[index]
  return (
    <section ref={ref} className={`flow${stat ? ' is-static' : ''}`} data-tone="dusk">
      <div className="flow__sticky">
        <header className="flow__head wrap">
          <div>
            <p className="eyebrow">A session with me</p>
            <h2 className="h2" data-reveal="lines">
              How healing <em>unfolds.</em>
            </h2>
          </div>
          <p className="lede" data-reveal>
            We listen, we understand, we release, we rewire — and then we make it last. Follow the light.
          </p>
        </header>

        <div className="journey wrap">
          <div className="journey__map">
            <svg viewBox="0 0 1000 220" aria-hidden="true">
              <path ref={path} d={JOURNEY} className="journey__base" />
              <path ref={drawn} d={JOURNEY} className="journey__drawn" pathLength={1} />
              <g ref={dot} className="journey__dot">
                <circle r="16" />
                <circle r="5" />
              </g>
            </svg>
            {sessionFlow.map((f, i) => (
              <button
                key={f.title}
                type="button"
                className="journey__node"
                data-on={stat || i <= index}
                aria-current={i === index}
                style={{ left: `${NODES[i][0] / 10}%`, top: `${(NODES[i][1] / 220) * 100}%` }}
                onClick={() => jump(i)}
              >
                <span className="journey__n">0{i + 1}</span>
                <span className="journey__t">{f.title}</span>
              </button>
            ))}
          </div>

          {stat ? (
            <ol className="journey__all">
              {sessionFlow.map((f, i) => (
                <li key={f.title} className="journey__card">
                  <Glyph name={f.glyph} size={52} />
                  <div>
                    <p className="journey__k">Step 0{i + 1}</p>
                    <h3>{f.title}</h3>
                    <p>{f.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="journey__card" key={s.title}>
              <Glyph name={s.glyph} size={60} />
              <div>
                <p className="journey__k">
                  Step 0{index + 1} of 0{n}
                </p>
                <h3>{s.title}</h3>
                <p>{s.line}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Toolkit() {
  return (
    <section className="toolkit" data-tone="dawn">
      <header className="toolkit__head wrap">
        <div>
          <p className="eyebrow">Trained in</p>
          <h2 className="h2" data-reveal="lines">
            The <em>toolkit.</em>
          </h2>
        </div>
        <p className="lede" data-reveal>
          Nine disciplines in one practice — so the method can fit the person, not the other way round. Hover or tap a seal to turn
          it over.
        </p>
      </header>
      <ul className="toolkit__grid wrap" data-reveal="stagger">
        {toolkit.map((t, i) => (
          <li key={t.name}>
            <button type="button" className="medal" aria-label={`${t.name}: ${t.line}`}>
              <span className="medal__inner">
                <span className="medal__front">
                  <svg viewBox="0 0 200 200" className="medal__ring" aria-hidden="true">
                    <defs>
                      <path id={`ring-${i}`} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
                    </defs>
                    <circle cx="100" cy="100" r="92" />
                    <circle cx="100" cy="100" r="64" />
                    <text style={{ fontSize: Math.min(13, 486 / (t.ring.length * 2 * 0.8)) }}>
                      <textPath href={`#ring-${i}`}>{t.ring.repeat(2)}</textPath>
                    </text>
                  </svg>
                  <Glyph name={t.glyph} size={64} />
                </span>
                <span className="medal__back">
                  <strong>{t.name}</strong>
                  <span>{t.line}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Six promises as an index — hover a promise to open it. */
function Promises() {
  const ref = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const { index, select, running, delay } = useAutoCycle(promises.length, ref, () => 4200)
  const p = promises[index]
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !card.current) return
    gsap.fromTo(card.current.children, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 })
    gsap.fromTo(
      card.current.querySelectorAll('.glyph [pathLength]:not([stroke-dasharray])'),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out', stagger: 0.05 },
    )
  }, [index])

  return (
    <section className="promises" data-tone="dawn">
      <div ref={ref} className="promises__grid wrap">
        <div>
          <p className="eyebrow">My promises to you</p>
          <ol className="promises__list" role="tablist" aria-label="Promises">
            {promises.map((x, i) => (
              <li key={x.t}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => select(i)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && i !== index && select(i)}
                >
                  <span className="promises__n">{String(i + 1).padStart(2, '0')}</span>
                  {x.t}
                  {i === index && running && <i className="xp__timer" style={{ animationDuration: `${delay}ms` }} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div ref={card} className="promise-card" role="tabpanel" aria-live="polite">
          <span className="promise-card__n">{String(index + 1).padStart(2, '0')}</span>
          <Glyph key={p.t} name={p.glyph} size={96} />
          <p className="promise-card__t">{p.t}</p>
          <p className="promise-card__d">{p.d}</p>
        </div>
      </div>
    </section>
  )
}
