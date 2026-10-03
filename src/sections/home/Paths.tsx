import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { Glyph } from '../../lib/glyphs'
import { calm, gsap, ScrollTrigger, scrollToTarget } from '../../lib/motion'
import { useAutoCycle } from '../../lib/interact'
import { paths, type Path } from '../../lib/content'
import { sceneStore } from '../../scene/store'

/**
 * The eight service paths.  A sticky stage on the left holds the numeral and
 * figure caption while the WebGL soul (behind the page) takes each path's
 * form; on the right, each path is an explorer of illustrated tiles.
 */
export function Paths() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const panels = [...el.querySelectorAll<HTMLElement>('.panel')]
    const mm = gsap.matchMedia()

    // Laptop & desktop: panels scroll past a sticky stage in the left column.
    mm.add('(min-width: 900px)', () => {
      const triggers = panels.map((p, i) =>
        ScrollTrigger.create({
          trigger: p,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
      return () => triggers.forEach((t) => t.kill())
    })

    // Phones & tablets: the stage pins on top and the text scrolls through a
    // window beneath it, 1:1 with the finger — the same flow, stacked.
    mm.add('(max-width: 899px)', () => {
      const body = el.querySelector<HTMLElement>('.paths__body')!
      const win = el.querySelector<HTMLElement>('.paths__panels')!
      const reel = el.querySelector<HTMLElement>('.paths__reel')!
      const pin = el.querySelector<HTMLElement>('.paths__pin')!
      const travel = () => Math.max(0, reel.scrollHeight - win.clientHeight)
      // size from the pinned element (100svh), not innerHeight — they differ
      // whenever a phone's address bar is showing
      const size = () => {
        body.style.height = `${pin.offsetHeight + travel()}px`
      }
      size()
      ScrollTrigger.addEventListener('refreshInit', size)

      let current = -1
      const focus = (T: number) => {
        const mid = T + win.clientHeight / 2
        let best = 0
        let bestD = Infinity
        panels.forEach((p, i) => {
          const c = p.offsetTop + p.offsetHeight / 2
          const d = Math.abs(c - mid)
          if (d < bestD) {
            bestD = d
            best = i
          }
          // the panel nearest the window's centre is in focus; the rest recede
          const near = Math.min(1, Math.abs(c - mid) / (win.clientHeight * 0.9))
          p.style.opacity = String(1 - near * 0.62)
        })
        if (best !== current) {
          current = best
          setActive(best)
        }
      }
      const st = ScrollTrigger.create({
        trigger: body,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // 1px of page scroll = 1px of text travel, exactly
          const T = Math.min(travel(), Math.max(0, self.scroll() - self.start))
          gsap.set(reel, { y: -T })
          focus(T)
        },
      })
      focus(0)

      // explorer cards can change height as they play; keep the pin honest
      let t = 0
      const ro = new ResizeObserver(() => {
        window.clearTimeout(t)
        t = window.setTimeout(() => ScrollTrigger.refresh(), 160)
      })
      ro.observe(reel)
      return () => {
        ro.disconnect()
        window.clearTimeout(t)
        st.kill()
        ScrollTrigger.removeEventListener('refreshInit', size)
        body.style.height = ''
        gsap.set(reel, { clearProps: 'transform' })
        panels.forEach((p) => (p.style.opacity = ''))
      }
    })

    const ctx = gsap.context(() => {
      if (calm() || window.matchMedia('(max-width: 899px)').matches) return
      panels.forEach((p) => {
        gsap.from(p.querySelectorAll('.panel__kicker, .panel__title, .panel__line'), {
          autoAlpha: 0,
          y: 34,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: p, start: 'top 70%', once: true },
        })
        gsap.from(p.querySelectorAll('.xp__tile'), {
          autoAlpha: 0,
          y: 18,
          scale: 0.94,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.035,
          scrollTrigger: { trigger: p, start: 'top 60%', once: true },
        })
      })
    }, el)
    return () => {
      mm.revert()
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
          Everyone arrives differently, so I work through many doors. Tap any service to see what it is.
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
              <Glyph name={p.glyph} size={20} />
              {p.short}
            </a>
          ))}
        </nav>
      </header>

      <div className="paths__body">
        <div className="paths__pin">
          <div className="paths__stage" aria-hidden="true">
            <div className="paths__stage-inner">
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
              <p className="paths__name" key={`n-${cur.id}`}>
                {cur.short}
              </p>
            </div>
          </div>

          <div className="paths__panels">
            <div className="paths__reel">
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
                    <Explorer path={p} />
                    <TLink to={`/contact?path=${p.id}`} className="link-arrow">
                      {p.cta}
                    </TLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Illustrated tiles + one detail card. Plays itself until the visitor takes over. */
function Explorer({ path }: { path: Path }) {
  const ref = useRef<HTMLDivElement>(null)
  const detail = useRef<HTMLDivElement>(null)
  const { index, select, running, delay } = useAutoCycle(path.services.length + 1, ref, (i) => (i === 0 ? 6500 : 3600))
  const s = index > 0 ? path.services[index - 1] : null
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const el = detail.current
    if (calm() || !el) return
    gsap.fromTo(
      el.querySelectorAll('.xp__copy > *'),
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 },
    )
    gsap.fromTo(
      el.querySelectorAll('.xp__art [pathLength]:not([stroke-dasharray])'),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.04 },
    )
  }, [index])

  // on phones the tiles are a swipe strip — glide the active one into view
  // (scroll the strip itself, never the page)
  useEffect(() => {
    const strip = ref.current?.querySelector<HTMLElement>('.xp__tiles')
    const tile = strip?.children[index] as HTMLElement | undefined
    if (!strip || !tile || strip.scrollWidth <= strip.clientWidth + 2) return
    const left = tile.offsetLeft - (strip.clientWidth - tile.offsetWidth) / 2
    strip.scrollTo({ left: Math.max(0, left), behavior: calm() ? 'auto' : 'smooth' })
  }, [index])

  const pick = (i: number) => {
    select(i)
    sceneStore.pulse(0.9)
  }

  return (
    <div ref={ref} className="xp" data-running={running}>
      <div
        className="xp__tiles"
        role="tablist"
        aria-label={`${path.short} — services`}
        style={{ ['--cols' as string]: path.services.length + 1 > 12 ? 7 : 6 }}
      >
        <Tile active={index === 0} running={running} delay={delay} glyph={path.glyph} label="Overview" onPick={() => pick(0)} />
        {path.services.map((sv, i) => (
          <Tile
            key={sv.name}
            active={index === i + 1}
            running={running}
            delay={delay}
            glyph={sv.glyph}
            label={sv.short ?? sv.name}
            title={sv.name}
            onPick={() => pick(i + 1)}
          />
        ))}
      </div>

      <div ref={detail} className="xp__detail" role="tabpanel" aria-live="polite">
        <Glyph key={s ? s.name : 'overview'} name={s ? s.glyph : path.glyph} size={88} className="xp__art" />
        {s ? (
          <div className="xp__copy">
            <p className="xp__name">{s.name}</p>
            <p className="xp__desc">{s.desc}</p>
          </div>
        ) : (
          <div className="xp__copy">
            <p className="xp__desc xp__desc--body">{path.body}</p>
            <div className="xp__helps">
              <span className="label">{path.id === 'workshops' ? 'For' : 'Helps with'}</span>
              {path.helps.map((h) => (
                <span key={h} className="tag">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Tile({
  active,
  running,
  delay,
  glyph,
  label,
  title,
  onPick,
}: {
  active: boolean
  running: boolean
  delay: number
  glyph: Path['glyph']
  label: string
  title?: string
  onPick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className="xp__tile"
      onClick={onPick}
      title={title}
      data-cursor={active ? undefined : 'Open'}
    >
      <Glyph name={glyph} size={26} />
      <span>{label}</span>
      {active && running && <i className="xp__timer" style={{ animationDuration: `${delay}ms` }} aria-hidden="true" />}
    </button>
  )
}
