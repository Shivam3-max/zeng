import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/motion'

const CYCLES = 4
const PHASES = [
  { word: 'Breathe in', secs: 4, scale: 1.5 },
  { word: 'Hold', secs: 4, scale: 1.54 },
  { word: 'Let go', secs: 6, scale: 1 },
]

/** One guided minute: 4 in · 4 hold · 6 out, four times. */
export function Breathe() {
  const [running, setRunning] = useState(false)
  const [word, setWord] = useState('Ready when you are')
  const [cycle, setCycle] = useState(0)
  const orb = useRef<HTMLDivElement>(null)
  const arc = useRef<SVGCircleElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => () => void tl.current?.kill(), [])

  const start = () => {
    tl.current?.kill()
    setRunning(true)
    const t = gsap.timeline({
      onComplete: () => {
        setRunning(false)
        setWord('Beautiful. Notice how you feel.')
        setCycle(0)
      },
    })
    for (let c = 0; c < CYCLES; c++) {
      PHASES.forEach((p) => {
        t.call(() => {
          setWord(p.word)
          setCycle(c + 1)
        })
          .to(orb.current, { scale: p.scale, duration: p.secs, ease: p.word === 'Hold' ? 'none' : 'sine.inOut' }, '<')
          .fromTo(arc.current, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: p.secs, ease: 'none' }, '<')
      })
    }
    tl.current = t
  }

  const stop = () => {
    tl.current?.kill()
    gsap.to(orb.current, { scale: 1, duration: 1.2, ease: 'power2.out' })
    gsap.set(arc.current, { strokeDashoffset: 1 })
    setRunning(false)
    setCycle(0)
    setWord('Ready when you are')
  }

  return (
    <div className="breathe">
      <div className="breathe__stage">
        <svg className="breathe__arc" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="96" className="breathe__track" />
          <circle ref={arc} cx="100" cy="100" r="96" className="breathe__progress" pathLength={1} />
        </svg>
        <div ref={orb} className="breathe__orb" aria-hidden="true" />
        <p className="breathe__word" aria-live="polite">
          {word}
        </p>
      </div>
      <div className="breathe__side">
        <p className="eyebrow">Breathwork</p>
        <h3 className="breathe__title">
          One minute. <em>Four breaths.</em>
        </h3>
        <p className="breathe__line">
          In for four, hold for four, out for six. A longer out-breath tells your nervous system it is safe to soften. Follow the
          light.
        </p>
        <div className="breathe__actions">
          {running ? (
            <button type="button" className="btn btn--ghost btn--sm" onClick={stop}>
              Stop · breath {cycle} of {CYCLES}
            </button>
          ) : (
            <button type="button" className="btn btn--solid btn--sm" onClick={start}>
              Begin the minute
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
