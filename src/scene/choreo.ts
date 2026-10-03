/*
 * Scene choreography — pure functions of scroll position, so the whole
 * camera/morph script can be verified in Node without a browser.
 *
 * Positions are in viewport fractions: x ∈ [-1, 1] (left → right edge),
 * y ∈ [-1, 1] (bottom → top), scale = radius as a fraction of the half-height.
 */

export const N_SHAPES = 9

export type SceneState = {
  /** blend weights for each particle form (sum = 1) */
  w: number[]
  x: number
  y: number
  scale: number
  opacity: number
  /** armillary rings around the orb */
  rings: number
  /** 0 = aura palette, 1 = dawn-sun gold */
  warm: number
  /** 0 = settled, 1 = agitated (the manifesto's wounds) */
  stir: number
}

export type Key = { at: number; s: SceneState }

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function oneHot(i: number): number[] {
  return Array.from({ length: N_SHAPES }, (_, k) => (k === i ? 1 : 0))
}

export const BASE: SceneState = { w: oneHot(0), x: 0, y: 0, scale: 0.6, opacity: 1, rings: 0, warm: 0, stir: 0 }

/** Build a full state: `S({ shape: 3, x: -0.5 })`. */
export function S(p: Partial<SceneState> & { shape?: number }): SceneState {
  const { shape, ...rest } = p
  return { ...BASE, ...(shape !== undefined ? { w: oneHot(shape) } : {}), ...rest }
}

export function mixState(a: SceneState, b: SceneState, t: number): SceneState {
  return {
    w: a.w.map((v, i) => lerp(v, b.w[i], t)),
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    scale: lerp(a.scale, b.scale, t),
    opacity: lerp(a.opacity, b.opacity, t),
    rings: lerp(a.rings, b.rings, t),
    warm: lerp(a.warm, b.warm, t),
    stir: lerp(a.stir, b.stir, t),
  }
}

/** Sample a keyframe track at scroll position `y` (keys must be sorted by `at`). */
export function sample(keys: Key[], y: number): SceneState {
  if (!keys.length) return BASE
  if (y <= keys[0].at) return keys[0].s
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]
    const b = keys[i + 1]
    if (y < b.at) {
      const span = b.at - a.at
      return mixState(a.s, b.s, smooth(clamp(span > 0 ? (y - a.at) / span : 1)))
    }
  }
  return keys[keys.length - 1].s
}

export const sortKeys = (keys: Key[]) => [...keys].sort((a, b) => a.at - b.at)

/* ------------------------------------------------------------------ */
/*  Per-page tracks                                                    */
/* ------------------------------------------------------------------ */

export type Box = { top: number; height: number }
const center = (b: Box, vh: number) => b.top + b.height / 2 - vh / 2

export type HomeMeasures = {
  hero: Box
  manifesto: Box
  finder: Box
  panels: Box[]
  method: Box
  posh: Box
  cta: Box
}

export function homeKeys(m: HomeMeasures, vh: number, mobile: boolean): Key[] {
  const hero = mobile ? S({ shape: 0, x: 0, y: 0.52, scale: 0.62, rings: 1 }) : S({ shape: 0, x: 0.42, y: 0.02, scale: 0.6, rings: 1 })
  const manifesto = S({ shape: 0, x: 0, y: 0, scale: mobile ? 0.9 : 0.78, opacity: 0.38, rings: 0.35 })
  const wounded = { ...manifesto, stir: 1, opacity: 0.46, scale: manifesto.scale * 0.92 }
  const held = { ...manifesto, stir: 0, opacity: 0.72, scale: manifesto.scale * 1.08, rings: 0.7 }
  const run = Math.max(1, m.manifesto.height - vh)
  const finder = S({ shape: 0, x: mobile ? 0.7 : 0.78, y: 0.55, scale: mobile ? 0.42 : 0.3, opacity: 0.18 })
  const path = (shape: number) =>
    mobile ? S({ shape, x: 0, y: 0.585, scale: 0.46 }) : S({ shape, x: -0.5, y: -0.02, scale: 0.58 })

  const keys: Key[] = [
    { at: 0, s: hero },
    { at: m.hero.top + m.hero.height * 0.35, s: hero },
    { at: m.manifesto.top, s: manifesto },
    { at: m.manifesto.top + run * 0.76, s: wounded },
    { at: m.manifesto.top + run * 0.86, s: held },
    { at: m.manifesto.top + run, s: held },
    { at: m.finder.top, s: finder },
    { at: m.finder.top + m.finder.height - vh, s: finder },
  ]

  // Each service panel holds its form around its centre, then morphs to the next.
  const hold = vh * 0.2
  m.panels.forEach((p, i) => {
    const c = center(p, vh)
    keys.push({ at: c - hold, s: path(i + 1) }, { at: c + hold, s: path(i + 1) })
  })

  const last = m.panels[m.panels.length - 1]
  const lotusGone = { ...path(8), opacity: 0 }
  keys.push({ at: last.top + last.height - vh * 0.25, s: lotusGone })

  // The lotus returns for the women-empowerment / POSH band.
  const poshLotus = mobile ? S({ shape: 8, x: 0, y: 0.55, scale: 0.6 }) : S({ shape: 8, x: 0.5, y: 0.46, scale: 0.42 })
  keys.push(
    { at: m.posh.top - vh, s: { ...poshLotus, opacity: 0 } },
    { at: center(m.posh, vh) - hold, s: poshLotus },
    { at: center(m.posh, vh) + hold, s: poshLotus },
    { at: m.posh.top + m.posh.height, s: { ...poshLotus, opacity: 0 } },
  )

  // Finale: the soul rises as the dawn sun behind the closing call to action.
  const sun = S({ shape: 0, x: 0, y: mobile ? -0.95 : -1.0, scale: mobile ? 0.95 : 0.8, warm: 1, rings: 0.25 })
  keys.push({ at: m.cta.top - vh * 0.6, s: { ...sun, opacity: 0, y: sun.y - 0.4 } }, { at: m.cta.top + m.cta.height - vh, s: sun })

  return sortKeys(keys)
}

export type AboutMeasures = { hero: Box; story: Box; bridge: Box; cta: Box }

export function aboutKeys(m: AboutMeasures, vh: number, mobile: boolean): Key[] {
  const halo = mobile ? S({ shape: 0, x: 0, y: 0.34, scale: 0.7, rings: 1 }) : S({ shape: 0, x: 0.52, y: 0, scale: 0.56, rings: 1 })
  const drift = S({ shape: 4, x: mobile ? 0 : -0.55, y: 0, scale: mobile ? 0.8 : 0.5, opacity: 0.3 })
  const sun = S({ shape: 8, x: 0, y: mobile ? -0.62 : -0.66, scale: mobile ? 0.85 : 0.62, warm: 1 })
  return sortKeys([
    { at: 0, s: halo },
    { at: m.hero.top + m.hero.height * 0.3, s: halo },
    { at: center(m.story, vh), s: drift },
    { at: m.bridge.top - vh * 0.2, s: { ...drift, opacity: 0 } },
    { at: m.cta.top - vh * 0.6, s: { ...sun, opacity: 0 } },
    { at: m.cta.top + m.cta.height - vh, s: sun },
  ])
}

export type ContactMeasures = { hero: Box; form: Box }

export function contactKeys(m: ContactMeasures, vh: number, mobile: boolean): Key[] {
  const talk = mobile ? S({ shape: 2, x: 0, y: 0.62, scale: 0.48 }) : S({ shape: 2, x: 0.5, y: 0.02, scale: 0.56, rings: 0.4 })
  const quiet = S({ shape: 0, x: mobile ? 0.6 : 0.82, y: 0.6, scale: mobile ? 0.4 : 0.26, opacity: 0.22 })
  return sortKeys([
    { at: 0, s: talk },
    { at: m.hero.top + m.hero.height * 0.35, s: talk },
    { at: m.form.top, s: quiet },
    { at: m.form.top + m.form.height - vh * 0.5, s: { ...quiet, opacity: 0 } },
  ])
}
