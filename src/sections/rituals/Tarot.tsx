import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { TLink } from '../../components/Transition'
import { calm, gsap } from '../../lib/motion'
import { tarot, type Tarot } from '../../lib/content'
import { CardBack, CardFace } from './TarotArt'

const shuffle = <T,>(a: T[]) => {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
const HAND = 7

/** Seven cards fanned face-down; pick one and it rises, turns and speaks. */
export function TarotDraw() {
  const [deck, setDeck] = useState<Tarot[]>(() => shuffle(tarot).slice(0, HAND))
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const reading = useRef<HTMLDivElement>(null)
  const pickedRef = useRef<number | null>(null)

  const fan = useCallback((animate: boolean) => {
    const el = stage.current
    if (!el) return
    const cards = [...el.querySelectorAll<HTMLElement>('.tcard')]
    const cw = cards[0]?.offsetWidth ?? 140
    const spread = Math.min(cw * 0.46, (el.clientWidth - cw) / (HAND - 1))
    cards.forEach((c, i) => {
      const k = i - (HAND - 1) / 2
      const to = { x: k * spread, y: Math.abs(k) * 9, rotation: k * 6, scale: 1, autoAlpha: 1 }
      if (animate && !calm()) gsap.to(c, { ...to, duration: 0.9, ease: 'expo.out', delay: i * 0.035 })
      else gsap.set(c, to)
      gsap.set(c.querySelector('.tcard__inner'), { rotationY: 0 })
    })
  }, [])

  // fan out on mount and on resize — never in response to a pick
  useLayoutEffect(() => {
    fan(false)
    const onResize = () => pickedRef.current === null && fan(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fan])

  const pick = (i: number) => {
    if (pickedRef.current !== null) return
    pickedRef.current = i
    setPicked(i)
    const el = stage.current!
    const cards = [...el.querySelectorAll<HTMLElement>('.tcard')]
    const chosen = cards[i]
    const tl = gsap.timeline({ onComplete: () => setRevealed(true) })
    if (calm()) {
      cards.forEach((c, k) => k !== i && gsap.set(c, { autoAlpha: 0 }))
      gsap.set(chosen, { x: 0, y: -6, rotation: 0, scale: 1.12, zIndex: 5 })
      gsap.set(chosen.querySelector('.tcard__inner'), { rotationY: 180 })
      setRevealed(true)
      return
    }
    tl.to(cards.filter((_, k) => k !== i), { y: '+=50', autoAlpha: 0, duration: 0.55, ease: 'power2.in', stagger: 0.03 }, 0)
      .to(chosen, { x: 0, y: -6, rotation: 0, scale: 1.12, zIndex: 5, duration: 0.9, ease: 'expo.out' }, 0.1)
      .to(chosen.querySelector('.tcard__inner'), { rotationY: 180, duration: 1.1, ease: 'power3.inOut' }, 0.55)
  }

  useLayoutEffect(() => {
    if (!revealed || !reading.current || calm()) return
    gsap.from(reading.current.children, { autoAlpha: 0, y: 20, duration: 0.8, ease: 'power3.out', stagger: 0.08 })
  }, [revealed])

  const again = () => {
    const el = stage.current!
    const cards = [...el.querySelectorAll<HTMLElement>('.tcard')]
    setRevealed(false)
    const reset = () => {
      setDeck(shuffle(tarot).slice(0, HAND))
      pickedRef.current = null
      setPicked(null)
      cards.forEach((c) => gsap.set(c, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, zIndex: 'auto' }))
      requestAnimationFrame(() => fan(true))
    }
    if (calm()) return reset()
    gsap
      .timeline({ onComplete: reset })
      .to(el.querySelectorAll('.tcard__inner'), { rotationY: 0, duration: 0.6, ease: 'power2.inOut' })
      .to(cards, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.2')
  }

  const card = picked !== null ? deck[picked] : null

  return (
    <div className="tarot">
      <div className="tarot__stage" ref={stage}>
        {deck.map((c, i) => (
          <button
            key={i}
            type="button"
            className="tcard"
            onClick={() => pick(i)}
            disabled={picked !== null}
            aria-label={picked === null ? `Draw card ${i + 1} of ${HAND}` : i === picked ? `You drew ${c.name}` : undefined}
            data-cursor={picked === null ? 'Draw' : undefined}
          >
            <span className="tcard__inner">
              <span className="tcard__back">
                <CardBack />
              </span>
              <span className="tcard__face">
                <CardFace card={c} />
              </span>
            </span>
          </button>
        ))}
        {picked === null && <p className="tarot__hint">Take a breath, hold a question in mind, and choose the card you’re drawn to.</p>}
      </div>

      <div className="tarot__reading" ref={reading} aria-live="polite">
        {revealed && card ? (
          <>
            <p className="tarot__drew">
              You drew <span>{card.numeral}</span>
            </p>
            <h3 className="tarot__name">{card.name}</h3>
            <p className="tarot__msg">{card.msg}</p>
            <p className="tarot__ask">{card.ask}</p>
            <div className="tarot__actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={again}>
                Draw again
              </button>
              <TLink to="/contact?path=guidance" className="btn btn--solid btn--sm">
                Book a full reading
              </TLink>
            </div>
            <p className="tarot__note">A moment of reflection, not a prediction. A full reading is personal — and far deeper.</p>
          </>
        ) : (
          <>
            <p className="tarot__drew">Tarot · a reflective tool</p>
            <h3 className="tarot__name">What does today want you to know?</h3>
            <p className="tarot__msg tarot__msg--muted">
              Eight cards of hope, balance and change are in this deck. Whichever finds you, read it as a gentle question — not a
              verdict.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
