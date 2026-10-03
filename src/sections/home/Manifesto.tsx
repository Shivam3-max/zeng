import { useLayoutEffect, useRef } from 'react'
import { calm, gsap, SplitText } from '../../lib/motion'

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      SplitText.create(ref.current!.querySelector<HTMLElement>('.manifesto__text')!, {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.06,
              scrollTrigger: { trigger: '.manifesto__text', start: 'top 78%', end: 'bottom 52%', scrub: true },
            },
          ),
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="manifesto" data-tone="night">
      <div className="wrap manifesto__inner">
        <p className="eyebrow">Why people come</p>
        <p className="manifesto__text">
          Some wounds don’t show. <em>Anxiety</em> that hums all day. A love that <em>empties</em> you. Grief with nowhere to go. A
          fear with no name. <span className="manifesto__turn">I hold space for all of it</span> — with the science of the mind and
          the <em>wisdom of the soul.</em>
        </p>
        <p className="manifesto__sign">— Hardeep Kaur</p>
      </div>
    </section>
  )
}
