import { TLink } from '../../components/Transition'
import { Glyph, type GlyphName } from '../../lib/glyphs'

const OFFERS: { t: string; d: string; g: GlyphName }[] = [
  { t: 'POSH awareness sessions', d: 'For every employee: what harassment is, what it isn’t, and how to speak up safely.', g: 'shield' },
  { t: 'Internal Committee training', d: 'For IC members: inquiry procedure, timelines, documentation and sensitivity.', g: 'scales' },
  { t: 'Leadership & HR orientation', d: 'For managers: policy, prevention and a culture people can actually trust.', g: 'crown' },
  { t: 'Confidential support for women', d: 'Counselling for women in distress and for survivors of harassment.', g: 'venus' },
]

export function Posh() {
  return (
    <section className="posh" data-tone="wine" id="posh">
      <div className="posh__grid wrap">
        <div className="posh__fig" aria-hidden="true">
          <p className="figcap">fig. 10 — the lotus rises from the mud</p>
        </div>
        <div className="posh__copy">
          <p className="eyebrow">Women empowerment · POSH</p>
          <h2 className="h2" data-reveal="lines">
            Safe at work. <em>Strong in life.</em>
          </h2>
          <p className="lede" data-reveal>
            POSH — the Prevention of Sexual Harassment — done in a way people remember, and a confidential place for women to be
            heard, believed and strengthened.
          </p>
          <ul className="posh__list" data-reveal="stagger">
            {OFFERS.map((o) => (
              <li key={o.t}>
                <Glyph name={o.g} size={40} />
                <div>
                  <strong>{o.t}</strong>
                  <span>{o.d}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="posh__note">
            Programmes are built around India’s Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act,
            2013.
          </p>
          <TLink to="/contact?path=women" className="btn btn--solid" data-magnetic>
            Plan a POSH session
          </TLink>
        </div>
      </div>
    </section>
  )
}
