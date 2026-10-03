import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Glyph } from '../lib/glyphs'
import { box, calm, gsap, introDelay, introReady, isMobile, SplitText, useMagnetic, useReveals, useSceneTrack } from '../lib/motion'
import { contactKeys } from '../scene/choreo'
import { enquiryKinds, faqs, feelings, modes, paths, site, times, waLink } from '../lib/content'
import { TLink } from '../components/Transition'
import { sceneStore } from '../scene/store'

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  useReveals(ref)
  useMagnetic(ref)

  useEffect(() => {
    document.title = 'Book a session — Hardeep Kaur'
  }, [])

  useSceneTrack(() => {
    const el = ref.current!
    return contactKeys({ hero: box(el.querySelector('.chero')), form: box(el.querySelector('.enquiry')) }, window.innerHeight, isMobile())
  })

  return (
    <div ref={ref} className="page page--contact">
      <ContactHero />
      <Enquiry />
      <Faq />
    </div>
  )
}

function ContactHero() {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      const split = SplitText.create(ref.current!.querySelector<HTMLElement>('.chero__title')!, { type: 'lines,chars', mask: 'lines', linesClass: 'split-line' })
      const tl = gsap.timeline({ paused: true, delay: introDelay() })
      tl.from(split.chars, { yPercent: 115, duration: 1.4, ease: 'expo.out', stagger: 0.05 })
        .from('.chero__inner > :not(.chero__title)', { autoAlpha: 0, y: 22, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.25)
        .from('.chero__fig', { autoAlpha: 0, duration: 1.2 }, 0.8)
      introReady.then(() => tl.play())
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="chero" data-tone="night">
      <div className="chero__inner wrap">
        <p className="eyebrow">Contact · Book a session</p>
        <h1 className="chero__title display">
          Let’s <em>talk.</em>
        </h1>
        <p className="lede">The first step is the bravest one. Write to me — every message is read personally and held in confidence.</p>
        <div className="chero__channels">
          <a className="channel" href={waLink('Hello Hardeep, I would like to book a session.')} target="_blank" rel="noreferrer" data-magnetic>
            <Glyph name="speech" size={30} />
            <span>
              <small>WhatsApp</small>
              Message me
            </span>
          </a>
          <a className="channel" href={site.phoneHref} data-magnetic>
            <Glyph name="signal" size={30} />
            <span>
              <small>Call</small>
              {site.phone}
            </span>
          </a>
          <a className="channel" href={`mailto:${site.email}`} data-magnetic>
            <Glyph name="orb" size={30} />
            <span>
              <small>Email</small>
              {site.email}
            </span>
          </a>
        </div>
      </div>
      <p className="chero__fig figcap" aria-hidden="true">
        fig. 02 — two rings, one conversation
      </p>
    </section>
  )
}

type Form = {
  name: string
  phone: string
  email: string
  kind: string
  areas: string[]
  mode: string
  time: string
  message: string
  consent: boolean
}

const STEPS = ['What you’d like', 'Help with', 'How we’ll meet', 'About you']

/** A four-step conversation instead of one long form. */
function Enquiry() {
  const [params] = useSearchParams()
  const concern = feelings.find((f) => f.id === params.get('concern'))
  const prePath = params.get('path') ?? concern?.path ?? null
  const [form, setForm] = useState<Form>(() => ({
    name: '',
    phone: '',
    email: '',
    kind: prePath === 'women' || prePath === 'workshops' ? 'org' : prePath === 'guidance' ? 'reading' : '',
    areas: prePath && paths.some((p) => p.id === prePath) ? [prePath] : [],
    mode: '',
    time: '',
    message: concern ? `What I chose on the site: “${concern.label}”.\n\n` : '',
    consent: false,
  }))
  const [step, setStep] = useState(0)
  const [seen, setSeen] = useState(0)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [sent, setSent] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const done = useRef<HTMLDivElement>(null)
  const dir = useRef(1)
  const first = useRef(true)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const go = (i: number) => {
    dir.current = i > step ? 1 : -1
    setStep(i)
    setSeen((v) => Math.max(v, i))
  }
  const toggleArea = (id: string) => {
    set('areas', form.areas.includes(id) ? form.areas.filter((a) => a !== id) : [...form.areas, id])
    sceneStore.pulse(0.4)
  }
  const pickKind = (id: string) => {
    set('kind', id)
    sceneStore.pulse(0.6)
    window.setTimeout(() => go(1), calm() ? 0 : 380)
  }

  const kindLabel = enquiryKinds.find((k) => k.id === form.kind)?.label
  const areaLabels = form.areas.map((a) => paths.find((p) => p.id === a)?.short).filter(Boolean)
  const modeLabel = modes.find((m) => m.id === form.mode)?.label

  const summary = () =>
    [
      `Hello Hardeep, I’m ${form.name.trim()}.`,
      `I’d like: ${kindLabel ?? 'a first conversation'}${areaLabels.length ? ` — ${areaLabels.join(', ')}` : ''}.`,
      `Preferred: ${modeLabel ?? 'online video'}${form.time ? `, ${form.time.toLowerCase()}` : ''}.`,
      form.message.trim() && `\n${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n')

  const send = () => {
    const next: typeof errors = {}
    if (form.name.trim().length < 2) next.name = 'Please tell me your name.'
    if (form.phone.replace(/\D/g, '').length < 8) next.phone = 'Please add a phone or WhatsApp number.'
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = 'That email doesn’t look quite right.'
    if (!form.consent) next.consent = 'Please confirm you’ve read this note.'
    setErrors(next)
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    // No backend yet: keep a local copy so nothing is lost, then hand off to WhatsApp / email.
    try {
      const prev = JSON.parse(localStorage.getItem('hk-enquiries') ?? '[]')
      localStorage.setItem('hk-enquiries', JSON.stringify([...prev, { ...form, at: new Date().toISOString() }]))
    } catch {
      /* storage unavailable — the hand-off links below still work */
    }
    sceneStore.pulse(1)
    setSent(true)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (step < STEPS.length - 1) go(step + 1)
    else send()
  }

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (calm() || !panel.current) return
    gsap.fromTo(panel.current, { autoAlpha: 0, x: 36 * dir.current }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out' })
    panel.current.querySelector<HTMLElement>('input:not([type=radio]):not([type=checkbox]), textarea')?.focus({ preventScroll: true })
  }, [step])

  useLayoutEffect(() => {
    if (!sent || !done.current || calm()) return
    const el = done.current
    gsap.from(el.children, { autoAlpha: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.08 })
    gsap.fromTo(el.querySelectorAll('.glyph [pathLength]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
  }, [sent])

  return (
    <section className="enquiry" data-tone="dusk" id="book">
      <div className="enquiry__grid wrap">
        <div className="eform glass">
          {sent ? (
            <div ref={done} className="eform__done">
              <Glyph name="lotus" size={110} />
              <h2>
                Thank you, <em>{form.name.trim().split(' ')[0]}.</em>
              </h2>
              <p>
                Your note is with me. I’ll reply within 24 hours on {form.phone}
                {form.email ? ` or ${form.email}` : ''}. If you’d rather not wait, send it on WhatsApp now.
              </p>
              <div className="eform__done-actions">
                <a className="btn btn--solid" href={waLink(summary())} target="_blank" rel="noreferrer">
                  Send on WhatsApp
                </a>
                <a className="btn btn--ghost" href={`mailto:${site.email}?subject=${encodeURIComponent('Session enquiry')}&body=${encodeURIComponent(summary())}`}>
                  Send by email
                </a>
              </div>
              <TLink to="/" className="link-arrow">
                Back to home
              </TLink>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <ol className="steps" aria-label="Progress">
                {STEPS.map((label, i) => (
                  <li key={label} data-state={i === step ? 'on' : i <= seen ? 'done' : 'todo'}>
                    <button type="button" disabled={i > seen} onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                      <span className="steps__n">{i + 1}</span>
                      <span className="steps__l">{label}</span>
                    </button>
                  </li>
                ))}
              </ol>

              <div ref={panel} className="step-panel">
                {step === 0 && (
                  <fieldset className="eform__set">
                    <legend className="q">What would you like?</legend>
                    <div className="cards">
                      {enquiryKinds.map((k) => (
                        <label key={k.id} className="choice">
                          <input type="radio" name="kind" checked={form.kind === k.id} onChange={() => pickKind(k.id)} />
                          <span>
                            <Glyph name={k.glyph} size={40} />
                            <strong>{k.label}</strong>
                            <small>{k.sub}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset className="eform__set">
                    <legend className="q">
                      What would you like help with? <small>Choose any — or skip if you’re not sure</small>
                    </legend>
                    <div className="cards cards--areas">
                      {paths.map((p) => (
                        <label key={p.id} className="choice choice--sm">
                          <input type="checkbox" checked={form.areas.includes(p.id)} onChange={() => toggleArea(p.id)} />
                          <span>
                            <Glyph name={p.glyph} size={32} />
                            <strong>{p.short}</strong>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <>
                    <fieldset className="eform__set">
                      <legend className="q">How shall we meet?</legend>
                      <div className="cards cards--3">
                        {modes.map((m) => (
                          <label key={m.id} className="choice">
                            <input type="radio" name="mode" checked={form.mode === m.id} onChange={() => (set('mode', m.id), sceneStore.pulse(0.4))} />
                            <span>
                              <Glyph name={m.glyph} size={36} />
                              <strong>{m.label}</strong>
                              <small>{m.line}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset className="eform__set">
                      <legend className="q q--sm">Best time of day</legend>
                      <div className="pills">
                        {times.map((t) => (
                          <label key={t} className="pill">
                            <input type="radio" name="time" checked={form.time === t} onChange={() => set('time', t)} />
                            <span>{t}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </>
                )}

                {step === 3 && (
                  <div className="eform__fields">
                    <p className="q">And a little about you.</p>
                    <div className="eform__row">
                      <Field label="Your name" error={errors.name}>
                        <input name="name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="First name is fine" />
                      </Field>
                      <Field label="Phone / WhatsApp" error={errors.phone}>
                        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91" />
                      </Field>
                    </div>
                    <Field label="Email (optional)" error={errors.email}>
                      <input name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
                    </Field>
                    <Field label="Anything you’d like me to know (optional)">
                      <textarea
                        name="message"
                        rows={3}
                        value={form.message}
                        onChange={(e) => set('message', e.target.value)}
                        placeholder="Share as much or as little as feels right."
                      />
                    </Field>
                    <label className={`eform__consent${errors.consent ? ' has-error' : ''}`}>
                      <input name="consent" type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
                      <span>
                        I understand this form is not for emergencies. If I am in crisis I will call {site.crisis.line} ({site.crisis.number}) or{' '}
                        {site.crisis.emergency}.
                      </span>
                    </label>
                    {errors.consent && <p className="field-error">{errors.consent}</p>}
                  </div>
                )}
              </div>

              <div className="eform__nav">
                {step > 0 ? (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(step - 1)}>
                    ← Back
                  </button>
                ) : (
                  <span className="eform__hint">Choose one to continue</span>
                )}
                {step > 0 && (
                  <button className="btn btn--solid" type="submit" data-magnetic>
                    {step === STEPS.length - 1 ? 'Send my message' : step === 1 && !form.areas.length ? 'Skip for now →' : 'Continue →'}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        <aside className="enquiry__aside">
          <div className="note-card" data-reveal>
            <p className="label">Your note so far</p>
            <dl>
              <div data-filled={!!kindLabel}>
                <dt>I’d like</dt>
                <dd>{kindLabel ?? '—'}</dd>
              </div>
              <div data-filled={areaLabels.length > 0}>
                <dt>Help with</dt>
                <dd>{areaLabels.length ? areaLabels.join(', ') : '—'}</dd>
              </div>
              <div data-filled={!!modeLabel}>
                <dt>Meeting</dt>
                <dd>{modeLabel ? `${modeLabel}${form.time ? ` · ${form.time}` : ''}` : '—'}</dd>
              </div>
              <div data-filled={!!form.name.trim()}>
                <dt>From</dt>
                <dd>{form.name.trim() || '—'}</dd>
              </div>
            </dl>
            <p className="note-card__foot">Read only by me. {site.reply}</p>
          </div>
          <div className="aside-block" data-reveal>
            <p className="label">Hours</p>
            <p>{site.hours}</p>
            <p className="aside-soft">{site.studio}</p>
          </div>
          <div className="crisis" data-reveal>
            <strong>In crisis right now?</strong>
            <p>
              Please don’t wait for a reply. Call {site.crisis.line} on <a href={`tel:${site.crisis.number}`}>{site.crisis.number}</a> (free,
              24×7) or <a href={`tel:${site.crisis.emergency}`}>{site.crisis.emergency}</a> in an emergency.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className={`field${error ? ' has-error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="faq" data-tone="dawn">
      <div className="faq__grid wrap">
        <header className="faq__head">
          <p className="eyebrow">Questions</p>
          <h2 className="h2" data-reveal="lines">
            Before you <em>begin.</em>
          </h2>
          <p className="lede" data-reveal>
            The things people most often ask before their first session. Anything else — just write.
          </p>
        </header>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const first = useRef(true)
  useLayoutEffect(() => {
    const el = panel.current
    if (!el) return
    if (first.current || calm()) {
      first.current = false
      gsap.set(el, { height: open ? 'auto' : 0 })
      return
    }
    gsap.to(el, { height: open ? 'auto' : 0, duration: 0.6, ease: 'power3.inOut' })
  }, [open])
  const id = q.replace(/\W+/g, '-').toLowerCase()
  return (
    <div className="faq__item" data-open={open}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span>{q}</span>
        <i aria-hidden="true" />
      </button>
      <div ref={panel} id={id} className="faq__panel" role="region">
        <p>{a}</p>
      </div>
    </div>
  )
}
