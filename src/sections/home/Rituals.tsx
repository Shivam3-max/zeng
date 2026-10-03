import { useLayoutEffect, useRef, useState } from 'react'
import { Glyph, type GlyphName } from '../../lib/glyphs'
import { calm, gsap } from '../../lib/motion'
import { TarotDraw } from '../rituals/Tarot'
import { Numerology } from '../rituals/Numerology'
import { Breathe } from '../rituals/Breathe'

const TABS: { id: string; label: string; glyph: GlyphName }[] = [
  { id: 'tarot', label: 'Draw a card', glyph: 'card' },
  { id: 'number', label: 'Find your number', glyph: 'numbers' },
  { id: 'breath', label: 'Breathe with me', glyph: 'breath' },
]

export function Rituals() {
  const [tab, setTab] = useState('tarot')
  const panel = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !panel.current) return
    gsap.fromTo(panel.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  }, [tab])

  return (
    <section className="rituals" data-tone="dusk" id="rituals">
      <header className="rituals__head wrap">
        <div>
          <p className="eyebrow">Try a moment of it</p>
          <h2 className="h2" data-reveal="lines">
            A small ritual, <em>right here.</em>
          </h2>
        </div>
        <p className="lede" data-reveal>
          Three small doors into the work — a card to reflect on, the number you were born with, and one minute of breath.
        </p>
      </header>

      <div className="wrap">
        <div className="rituals__tabs" role="tablist" aria-label="Rituals">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="ritual-panel"
              className="rituals__tab"
              onClick={() => setTab(t.id)}
            >
              <Glyph name={t.glyph} size={26} />
              {t.label}
            </button>
          ))}
        </div>
        <div ref={panel} id="ritual-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="rituals__panel glass">
          {tab === 'tarot' && <TarotDraw />}
          {tab === 'number' && <Numerology />}
          {tab === 'breath' && <Breathe />}
        </div>
      </div>
    </section>
  )
}
