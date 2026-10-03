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

/**
 * On phones the service panels scroll inside a pinned window (1px of page
 * scroll = 1px of reel travel).  Express each panel as the page box that would
 * put its centre at the viewport centre at the same scroll position as it
 * reaches the window's centre, so the shared choreography works unchanged.
 */
function reelBoxes(el: HTMLElement) {
  const body = el.querySelector<HTMLElement>('.paths__body')!
  const win = el.querySelector<HTMLElement>('.paths__panels')!
  const top = box(body).top
  const shift = (window.innerHeight - win.clientHeight) / 2
  return [...el.querySelectorAll<HTMLElement>('.panel')].map((p) => ({ top: top + p.offsetTop + shift, height: p.offsetHeight }))
}

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
    const mobile = isMobile()
    return homeKeys(
      {
        hero: box(q('.hero')),
        manifesto: box(q('.manifesto')),
        finder: box(q('.finder')),
        panels: mobile ? reelBoxes(el) : [...el.querySelectorAll('.panel')].map(box),
        method: box(q('.method')),
        posh: box(q('.posh')),
        cta: box(q('.finale')),
      },
      window.innerHeight,
      mobile,
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
