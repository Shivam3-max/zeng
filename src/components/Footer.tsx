import { TLink } from './Transition'
import { Mark } from './Header'
import { site, waLink } from '../lib/content'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="ftr">
      <div className="ftr__top wrap">
        <p className="ftr__big">
          Come home <em>to yourself.</em>
        </p>
        <div className="ftr__actions">
          <TLink to="/contact" className="btn btn--solid">
            Book a session
          </TLink>
          <a className="btn btn--ghost" href={waLink('Hello Hardeep, I would like to book a session.')} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="ftr__grid wrap">
        <div className="ftr__brand">
          <Mark size={40} />
          <p>
            <strong>Hardeep Kaur</strong>
            <br />
            {site.role}
          </p>
        </div>
        <div>
          <h3>Visit</h3>
          <TLink to="/">Home</TLink>
          <TLink to="/#paths">Services</TLink>
          <TLink to="/about">About</TLink>
          <TLink to="/contact">Contact</TLink>
        </div>
        <div>
          <h3>Reach</h3>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={waLink('Hello Hardeep')} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <span>{site.hours}</span>
        </div>
        <div>
          <h3>Sessions</h3>
          <span>Online, worldwide</span>
          <span>In person · {site.studio.split(' · ')[0]}</span>
          <span>Distant healing</span>
          <span>Workshops & POSH on site</span>
        </div>
      </div>

      <div className="ftr__crisis wrap" role="note">
        <span className="ftr__pulse" aria-hidden="true" />
        <p>
          <strong>In crisis right now?</strong> You deserve help immediately. Call {site.crisis.line} on{' '}
          <a href={`tel:${site.crisis.number}`}>{site.crisis.number}</a> or{' '}
          <a href={`tel:${site.crisis.alt.replace(/-/g, '')}`}>{site.crisis.alt}</a> (free, 24×7), or{' '}
          <a href={`tel:${site.crisis.emergency}`}>{site.crisis.emergency}</a> in an emergency.
        </p>
      </div>

      <div className="ftr__base wrap">
        <p>© {year} Hardeep Kaur. All sessions are confidential.</p>
        <p>Holistic and spiritual services complement — and never replace — medical or psychiatric care.</p>
      </div>
    </footer>
  )
}
