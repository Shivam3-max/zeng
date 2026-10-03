import { useEffect } from 'react'
import { TLink } from '../components/Transition'
import { useSceneTrack } from '../lib/motion'
import { S } from '../scene/choreo'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Lost, gently — Hardeep Kaur'
  }, [])
  useSceneTrack(() => [{ at: 0, s: S({ shape: 4, x: 0, y: 0.1, scale: 0.5, opacity: 0.8 }) }])
  return (
    <section className="nf" data-tone="night">
      <div className="wrap nf__inner">
        <p className="eyebrow">404</p>
        <h1 className="display">
          A little <em>lost?</em>
        </h1>
        <p className="lede">That’s allowed. This page doesn’t exist — but the way home does.</p>
        <TLink to="/" className="btn btn--solid">
          Take me home
        </TLink>
      </div>
    </section>
  )
}
