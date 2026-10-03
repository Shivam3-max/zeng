/*
 * Point-cloud forms for the soul orb.  Pure maths, no three.js — every
 * generator fills `count` xyz triples that fit inside a radius-~1.1 sphere.
 *
 *   0 orb       the soul at rest (hero)
 *   1 ripples   counselling — calming the water
 *   2 rings     relationships — two interlinked rings
 *   3 neural    mind reprogramming — a network rewiring
 *   4 spiral    subconscious — the hypnotic descent
 *   5 chakra    energy healing — seven centres on one current
 *   6 card      intuitive guidance — a tarot card with a star
 *   7 circle    workshops — people around a shared light
 *   8 lotus     women empowerment — the lotus rising
 */

export const SHAPES = ['orb', 'ripples', 'rings', 'neural', 'spiral', 'chakra', 'card', 'circle', 'lotus'] as const
export const SHAPE_COUNT = SHAPES.length

/** How far each form is tipped toward the camera (radians) and how fast it turns. */
export const TILT = [0.32, 0.85, 0.22, 0.12, 0.95, 0.18, 0.04, 0.62, 0.5]
export const SPIN = [0.09, 0.1, 0.22, 0.1, 0.32, 0.16, 0.18, 0.1, 0.07]

type Rand = () => number

export function mulberry32(seed: number): Rand {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TAU = Math.PI * 2

function gauss(r: Rand) {
  let u = 0
  while (u === 0) u = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * r())
}

function onSphere(r: Rand): [number, number, number] {
  const u = r() * 2 - 1
  const th = r() * TAU
  const s = Math.sqrt(1 - u * u)
  return [s * Math.cos(th), u, s * Math.sin(th)]
}

type Put = (x: number, y: number, z: number) => void

function orb(n: number, r: Rand, put: Put) {
  for (let i = 0; i < n; i++) {
    const k = r()
    const [dx, dy, dz] = onSphere(r)
    const rad = k < 0.7 ? 1 + gauss(r) * 0.022 : k < 0.9 ? Math.cbrt(r()) * 0.8 : 1.06 + r() * r() * 0.42
    put(dx * rad, dy * rad, dz * rad)
  }
}

function ripples(n: number, r: Rand, put: Put) {
  const radii = [0.34, 0.52, 0.69, 0.85, 1.0]
  const total = radii.reduce((a, b) => a + b, 0)
  for (let i = 0; i < n; i++) {
    if (r() < 0.14) {
      const [dx, dy, dz] = onSphere(r)
      const rad = 0.17 * (r() < 0.7 ? 1 : Math.cbrt(r()))
      put(dx * rad, dy * rad + 0.06, dz * rad)
      continue
    }
    let pick = r() * total
    let j = 0
    while (j < radii.length - 1 && pick > radii[j]) pick -= radii[j++]
    const a = r() * TAU
    const rr = radii[j] + gauss(r) * 0.011
    const y = 0.045 * Math.sin(a * 3 + j * 1.3) + gauss(r) * 0.007
    put(Math.cos(a) * rr, y, Math.sin(a) * rr)
  }
}

function rings(n: number, r: Rand, put: Put) {
  const R = 0.62
  for (let i = 0; i < n; i++) {
    const k = r()
    const a = r() * TAU
    const rr = R + gauss(r) * 0.028
    const t = gauss(r) * 0.028
    if (k < 0.46) put(-0.4 + Math.cos(a) * rr, Math.sin(a) * rr, t)
    else if (k < 0.92) put(0.4 + Math.cos(a) * rr, t, Math.sin(a) * rr)
    else {
      const [dx, dy, dz] = onSphere(r)
      const rad = 0.3 + r() * 0.85
      put(dx * rad, dy * rad * 0.7, dz * rad)
    }
  }
}

function neural(n: number, r: Rand, put: Put) {
  // Nodes inside a brain-ish ellipsoid, each linked to its three nearest neighbours.
  const nodes: [number, number, number][] = []
  let guard = 0
  while (nodes.length < 18 && guard++ < 5000) {
    const p: [number, number, number] = [r() * 2 - 1, r() * 2 - 1, r() * 2 - 1]
    if (p[0] ** 2 + (p[1] / 0.72) ** 2 + (p[2] / 0.6) ** 2 > 1) continue
    const q: [number, number, number] = [p[0], p[1] * 0.72, p[2] * 0.6]
    if (nodes.some((m) => Math.hypot(m[0] - q[0], m[1] - q[1], m[2] - q[2]) < 0.3)) continue
    nodes.push(q)
  }
  const edges: [number, number, [number, number, number]][] = []
  const seen = new Set<string>()
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
      .filter((e) => e.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push([i, j, [gauss(r) * 0.08, gauss(r) * 0.08, gauss(r) * 0.08]])
      })
  })
  for (let i = 0; i < n; i++) {
    if (r() < 0.3) {
      const m = nodes[Math.floor(r() * nodes.length)]
      const s = 0.035 + (m[0] + 1) * 0.008
      put(m[0] + gauss(r) * s, m[1] + gauss(r) * s, m[2] + gauss(r) * s)
    } else {
      const [ia, ib, bow] = edges[Math.floor(r() * edges.length)]
      const a = nodes[ia]
      const b = nodes[ib]
      const t = r()
      const arc = Math.sin(Math.PI * t)
      put(
        a[0] + (b[0] - a[0]) * t + bow[0] * arc + gauss(r) * 0.009,
        a[1] + (b[1] - a[1]) * t + bow[1] * arc + gauss(r) * 0.009,
        a[2] + (b[2] - a[2]) * t + bow[2] * arc + gauss(r) * 0.009,
      )
    }
  }
}

function spiral(n: number, r: Rand, put: Put) {
  const arms = 4
  for (let i = 0; i < n; i++) {
    if (r() < 0.08) {
      put(gauss(r) * 0.018, -0.25 - r() * 0.75, gauss(r) * 0.018)
      continue
    }
    const arm = Math.floor(r() * arms)
    const t = Math.pow(r(), 0.85)
    const a = t * Math.PI * 3.4 + (arm * TAU) / arms + gauss(r) * 0.04
    const rad = 0.05 + t * 1.0 + gauss(r) * 0.018 * t
    const y = -0.6 * (1 - t) * (1 - t) + 0.2 + gauss(r) * 0.01
    put(Math.cos(a) * rad, y, Math.sin(a) * rad)
  }
}

export const CHAKRA_Y = Array.from({ length: 7 }, (_, k) => -0.95 + (k * 1.9) / 6)

function chakra(n: number, r: Rand, put: Put) {
  const spacing = 1.9 / 6
  for (let i = 0; i < n; i++) {
    const k = r()
    if (k < 0.42) {
      const y0 = CHAKRA_Y[Math.floor(r() * 7)]
      const a = r() * TAU
      if (r() < 0.3) {
        const rr = Math.sqrt(r()) * 0.1
        put(Math.cos(a) * rr, y0 + gauss(r) * 0.01, Math.sin(a) * rr)
      } else {
        const rr = 0.17 + gauss(r) * 0.01
        put(Math.cos(a) * rr, y0 + gauss(r) * 0.01, Math.sin(a) * rr)
      }
    } else if (k < 0.54) {
      put(gauss(r) * 0.01, -1.05 + r() * 2.15, gauss(r) * 0.01)
    } else if (k < 0.86) {
      // Ida & Pingala: two currents weaving across the column, crossing at every centre.
      const y = -0.95 + r() * 1.9
      const phi = ((y + 0.95) / spacing) * Math.PI
      const side = r() < 0.5 ? 1 : -1
      put(side * 0.32 * Math.sin(phi) + gauss(r) * 0.008, y, 0.08 * Math.cos(phi) + gauss(r) * 0.008)
    } else {
      const a = r() * TAU
      const rr = 0.2 + 0.08 * Math.abs(Math.sin(a * 6)) + gauss(r) * 0.008
      put(Math.cos(a) * rr, 1.12 + gauss(r) * 0.01 + 0.04 * Math.abs(Math.sin(a * 6)), Math.sin(a) * rr)
    }
  }
}

function card(n: number, r: Rand, put: Put) {
  const W = 0.62
  const H = 1.0
  const rect = (w: number, h: number): [number, number] => {
    const per = 2 * (w + h)
    let t = r() * per * 2
    if (t < 2 * w) return [-w + t, h]
    t -= 2 * w
    if (t < 2 * h) return [w, h - t]
    t -= 2 * h
    if (t < 2 * w) return [w - t, -h]
    t -= 2 * w
    return [-w, -h + t]
  }
  const star: [number, number][] = Array.from({ length: 16 }, (_, k) => {
    const a = (k / 16) * TAU - Math.PI / 2
    const rr = k % 2 ? 0.14 : 0.37
    return [Math.cos(a) * rr, Math.sin(a) * rr + 0.02]
  })
  for (let i = 0; i < n; i++) {
    const k = r()
    const z = gauss(r) * 0.01
    if (k < 0.28) {
      const [x, y] = rect(W, H)
      put(x + gauss(r) * 0.006, y + gauss(r) * 0.006, z)
    } else if (k < 0.42) {
      const [x, y] = rect(W - 0.07, H - 0.07)
      put(x + gauss(r) * 0.005, y + gauss(r) * 0.005, z)
    } else if (k < 0.72) {
      const s = Math.floor(r() * 16)
      const a = star[s]
      const b = star[(s + 1) % 16]
      const t = r()
      const f = r() < 0.75 ? 1 : Math.sqrt(r())
      put((a[0] + (b[0] - a[0]) * t) * f, ((a[1] - 0.02) + (b[1] - a[1]) * t) * f + 0.02, z)
    } else if (k < 0.8) {
      const a = r() * TAU
      put(Math.cos(a) * 0.09, 0.66 + Math.sin(a) * 0.09, z)
    } else if (k < 0.87) {
      put(-0.3 + r() * 0.6, -0.74 + gauss(r) * 0.006, z)
    } else {
      put((r() * 2 - 1) * (W - 0.1), (r() * 2 - 1) * (H - 0.1), z * 3)
    }
  }
}

function circle(n: number, r: Rand, put: Put) {
  const P = 9
  const R = 0.84
  for (let i = 0; i < n; i++) {
    const k = r()
    if (k < 0.72) {
      const p = Math.floor(r() * P)
      const ap = (p / P) * TAU
      const cx = Math.cos(ap) * R
      const cz = Math.sin(ap) * R
      if (r() < 0.34) {
        const [dx, dy, dz] = onSphere(r)
        const rad = 0.075 * (r() < 0.8 ? 1 : Math.cbrt(r()))
        put(cx + dx * rad, 0.3 + dy * rad, cz + dz * rad)
      } else {
        const v = r()
        const rb = 0.06 + 0.1 * Math.pow(1 - v, 0.7)
        const a = r() * TAU
        put(cx + Math.cos(a) * rb, -0.14 + v * 0.34, cz + Math.sin(a) * rb)
      }
    } else if (k < 0.86) {
      const [dx, dy, dz] = onSphere(r)
      const rad = 0.16 * (r() < 0.6 ? 1 : Math.cbrt(r()))
      put(dx * rad, 0.12 + dy * rad, dz * rad)
    } else {
      const a = r() * TAU
      const rr = R + gauss(r) * 0.012
      put(Math.cos(a) * rr, 0.06 + gauss(r) * 0.01, Math.sin(a) * rr)
    }
  }
}

function lotus(n: number, r: Rand, put: Put) {
  const layers = [
    { n: 8, len: 0.98, wid: 0.27, a0: 0.12, curl: 0.95, off: 0 },
    { n: 8, len: 0.82, wid: 0.25, a0: 0.55, curl: 0.8, off: Math.PI / 8 },
    { n: 5, len: 0.56, wid: 0.21, a0: 1.05, curl: 0.5, off: 0.3 },
  ]
  const weights = layers.map((l) => l.n * l.len)
  const total = weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < n; i++) {
    const k = r()
    if (k < 0.06) {
      const a = r() * TAU
      const rr = Math.sqrt(r()) * 0.12
      put(Math.cos(a) * rr, -0.22 + gauss(r) * 0.01, Math.sin(a) * rr)
      continue
    }
    if (k < 0.11) {
      const a = r() * TAU
      const rr = 1.0 + gauss(r) * 0.015
      put(Math.cos(a) * rr, -0.36 + gauss(r) * 0.006, Math.sin(a) * rr)
      continue
    }
    let pick = r() * total
    let L = 0
    while (L < layers.length - 1 && pick > weights[L]) pick -= weights[L++]
    const l = layers[L]
    const petal = Math.floor(r() * l.n)
    const phi = l.off + (petal / l.n) * TAU
    const u = Math.pow(r(), 0.85)
    const v = r() < 0.45 ? (r() < 0.5 ? -1 : 1) : r() * 2 - 1
    const ang = l.a0 + u * l.curl * 0.5
    const radial = 0.08 + l.len * u * Math.cos(ang)
    const height = l.len * u * Math.sin(ang)
    const w = l.wid * Math.sin(Math.PI * Math.pow(u, 0.75)) * (1 - u * 0.2)
    const lat = v * w
    const lift = v * v * w * 0.35
    put(
      Math.cos(phi) * radial - Math.sin(phi) * lat,
      height + lift - 0.3,
      Math.sin(phi) * radial + Math.cos(phi) * lat,
    )
  }
}

const GENERATORS = [orb, ripples, rings, neural, spiral, chakra, card, circle, lotus]

/** Build every form for `count` particles. Deterministic for a given seed. */
export function buildShapes(count: number, seed = 1408): Float32Array[] {
  return GENERATORS.map((gen, s) => {
    const out = new Float32Array(count * 3)
    let i = 0
    const put: Put = (x, y, z) => {
      out[i++] = x
      out[i++] = y
      out[i++] = z
    }
    gen(count, mulberry32(seed + s * 977), put)
    return out
  })
}
