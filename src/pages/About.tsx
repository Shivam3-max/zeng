import { useEffect, useLayoutEffect, useRef } from 'react'
import { Glyph } from '../lib/glyphs'
import { box, calm, gsap, introDelay, introReady, isMobile, SplitText, useMagnetic, useReveals, useSceneTrack } from '../lib/motion'
import { aboutKeys } from '../scene/choreo'
import { bridge, promises, sessionFlow, story, toolkit } from '../lib/content'
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

function Story() {
  return (
    <section className="story" data-tone="night">
      <div className="story__grid wrap">
        <aside className="story__aside">
          <p className="eyebrow">Why I do this work</p>
          <p className="story__pull" data-reveal="lines">
            “Healing rarely arrives through <em>one door.</em>”
          </p>
        </aside>
        <div className="story__body">
          {story.map((p, i) => (
            <p key={i} data-reveal className={i === 0 ? 'story__first' : undefined}>
              {p}
            </p>
          ))}
          <p className="story__sign" data-reveal>
            — Hardeep
          </p>
        </div>
      </div>
    </section>
  )
}

function Bridge() {
  const ref = useRef<HTMLElement>(null)
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
      scrollTrigger: { trigger: venn, start: 'top 85%', end: 'center 50%', scrub: 0.8 },
    })
    return () => {
      st.scrollTrigger?.kill()
      st.kill()
    }
  }, [])

  return (
    <section ref={ref} className="bridge" data-tone="dusk">
      <header className="bridge__head wrap">
        <p className="eyebrow">The approach</p>
        <h2 className="h2" data-reveal="lines">
          Three doors. <em>One home.</em>
        </h2>
        <p className="lede" data-reveal>
          Most therapy works with one layer of you. I work with three — and with the place where they meet.
        </p>
      </header>
      <div className="bridge__stage">
        <div className="venn" style={{ ['--p' as string]: 0 }}>
          {bridge.map((b, i) => (
            <div key={b.id} className={`venn__c venn__c--${i}`}>
              <span className="venn__title">{b.title}</span>
              <span className="venn__line">{b.line}</span>
            </div>
          ))}
          <span className="venn__you">you</span>
        </div>
      </div>
      <div className="bridge__cols wrap" data-reveal="stagger">
        {bridge.map((b) => (
          <div key={b.id}>
            <h3>{b.title}</h3>
            <ul>
              {b.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Flow() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || calm()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.flow__line i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.flow__list', start: 'top 65%', end: 'bottom 65%', scrub: true } })
      el.querySelectorAll('.flow__item').forEach((it) =>
        gsap.from(it, { autoAlpha: 0, x: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: it, start: 'top 75%', once: true } }),
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="flow" data-tone="dusk">
      <div className="flow__grid wrap">
        <header className="flow__head">
          <p className="eyebrow">A session with me</p>
          <h2 className="h2" data-reveal="lines">
            How healing <em>unfolds.</em>
          </h2>
          <p className="lede" data-reveal>
            Every session is different, but the arc is familiar: we listen, we understand, we release, we rewire — and then we make it
            last.
          </p>
        </header>
        <ol className="flow__list">
          <span className="flow__line" aria-hidden="true">
            <i />
          </span>
          {sessionFlow.map((s, i) => (
            <li key={s.title} className="flow__item">
              <span className="flow__num">0{i + 1}</span>
              <div className="flow__card">
                <Glyph name={s.glyph} size={44} />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.line}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
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

function Promises() {
  return (
    <section className="promises" data-tone="dawn">
      <div className="wrap">
        <p className="eyebrow">My promises to you</p>
        <ol className="promises__grid" data-reveal="stagger">
          {promises.map((p, i) => (
            <li key={p.t}>
              <span className="promises__n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
