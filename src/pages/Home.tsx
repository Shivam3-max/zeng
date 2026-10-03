import { useEffect, useRef } from 'react'
import { box, isMobile, useMagnetic, useReveals, useSceneTrack } from '../lib/motion'
import { homeKeys } from '../scene/choreo'
import { Hero } from '../sections/home/Hero'
import { Manifesto } from '../sections/home/Manifesto'
import { PathFinder } from '../sections/home/PathFinder'
import { Paths } from '../sections/home/Paths'
import { Method } from '../sections/home/Method'
import { Rituals } from '../sections/home/Rituals'
import { ServiceIndex } from '../sections/home/ServiceIndex'
import { Workshops } from '../sections/home/Workshops'
import { Posh } from '../sections/home/Posh'
import { Voices } from '../sections/home/Voices'
import { Finale } from '../sections/home/Finale'

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  useReveals(ref)
  useMagnetic(ref)

  useEffect(() => {
    document.title = 'Hardeep Kaur — Psychotherapist, Clinical Hypnotherapist & Holistic Healer'
  }, [])

  useSceneTrack(() => {
    const el = ref.current!
    const q = (s: string) => el.querySelector(s)
    return homeKeys(
      {
        hero: box(q('.hero')),
        manifesto: box(q('.manifesto')),
        finder: box(q('.finder')),
        panels: [...el.querySelectorAll('.panel')].map(box),
        method: box(q('.method')),
        posh: box(q('.posh')),
        cta: box(q('.finale')),
      },
      window.innerHeight,
      isMobile(),
    )
  })

  return (
    <div ref={ref} className="page page--home">
      <Hero />
      <Manifesto />
      <PathFinder />
      <Paths />
      <Method />
      <Rituals />
      <ServiceIndex />
      <Workshops />
      <Posh />
      <Voices />
      <Finale />
    </div>
  )
}
