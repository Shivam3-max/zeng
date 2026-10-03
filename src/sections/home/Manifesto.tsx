import { useRef } from 'react'
import { stackedSequences, useScrollSteps } from '../../lib/interact'
import { wounds } from '../../lib/content'

/** Split a line into word spans, italicising the phrase `em`. */
function Words({ text, em }: { text: string; em?: string }) {
  const at = em ? text.indexOf(em) : -1
  const parts = at < 0 ? [{ t: text, em: false }] : [
    { t: text.slice(0, at), em: false },
    { t: em!, em: true },
    { t: text.slice(at + em!.length), em: false },
  ]
  let w = 0
  return (
    <>
      {parts.map((p, i) =>
        p.t
          .split(/(\s+)/)
          .filter(Boolean)
          .map((word, j) =>
            /^\s+$/.test(word) ? (
              ' '
            ) : (
              <span key={`${i}-${j}`} className={`w${p.em ? ' w--em' : ''}`} style={{ ['--w' as string]: w++ }}>
                {word}
              </span>
            ),
          ),
      )}
    </>
  )
}

/**
 * "Why people come" — a pinned sequence.  Each wound arrives on its own,
 * the soul behind it grows restless, and the last beat calms everything.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const beats = wounds.length + 1
  const { index, jump } = useScrollSteps(ref, beats)
  const stat = stackedSequences()
  const state = (i: number) => (stat ? 'on' : i < index ? 'past' : i === index ? 'on' : 'next')

  return (
    <section ref={ref} className={`manifesto${stat ? ' is-static' : ''}`} data-tone="night">
      <div className="manifesto__sticky">
        <p className="eyebrow">Why people come</p>
        <div className="manifesto__stage" aria-live="polite">
          {wounds.map((w, i) => (
            <p key={w.text} className="mbeat" data-state={state(i)}>
              <Words text={w.text} em={w.em} />
            </p>
          ))}
          <div className="mbeat mbeat--hold" data-state={state(wounds.length)}>
            <p className="mbeat__line">
              <Words text="I hold space for all of it." em="all of it." />
            </p>
            <p className="mbeat__sub">With the science of the mind and the wisdom of the soul.</p>
            <p className="manifesto__sign">— Hardeep Kaur</p>
          </div>
        </div>
        {!stat && (
          <nav className="manifesto__nav" aria-label="Manifesto">
            <span className="manifesto__count">
              {String(index + 1).padStart(2, '0')} <i>/</i> {String(beats).padStart(2, '0')}
            </span>
            <ol>
              {Array.from({ length: beats }, (_, i) => (
                <li key={i}>
                  <button type="button" data-on={i === index} aria-label={`Show line ${i + 1}`} onClick={() => jump(i)} />
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  )
}
