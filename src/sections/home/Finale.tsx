import type { ReactNode } from 'react'
import { TLink } from '../../components/Transition'
import { site, waLink } from '../../lib/content'

export function Finale({ title, lede }: { title?: ReactNode; lede?: string }) {
  return (
    <section className="finale" data-tone="dawn">
      <div className="finale__inner wrap">
        <p className="eyebrow">Your first step</p>
        <h2 className="finale__title display" data-reveal="lines">
          {title ?? (
            <>
              Your dawn is closer <em>than you think.</em>
            </>
          )}
        </h2>
        <p className="lede" data-reveal>
          {lede ?? 'The first session is simply a conversation. Come as you are — I will meet you there.'}
        </p>
        <div className="finale__ctas" data-reveal>
          <TLink to="/contact" className="btn btn--solid" data-magnetic>
            Book a session
          </TLink>
          <a className="btn btn--ghost" href={waLink('Hello Hardeep, I would like to book a session.')} target="_blank" rel="noreferrer" data-magnetic>
            Message on WhatsApp
          </a>
        </div>
        <p className="finale__note">{site.reply}</p>
      </div>
      <div className="finale__horizon" aria-hidden="true" />
    </section>
  )
}
