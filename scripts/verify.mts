// Node-only checks for the pure parts of the site: particle forms, scroll
// choreography and numerology.  Run: node scripts/verify.mts
import { buildShapes, SHAPE_COUNT } from '../src/scene/shapes.ts'
import { homeKeys, aboutKeys, contactKeys, sample, N_SHAPES, type Box } from '../src/scene/choreo.ts'
import { lifePath, paths, feelings, serviceCount } from '../src/lib/content.ts'

let pass = 0
let fail = 0
const ok = (cond: boolean, msg: string) => {
  if (cond) pass++
  else {
    fail++
    console.log('  ✗', msg)
  }
}
const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps

// ---------- shapes ----------
const N = 3000
const shapes = buildShapes(N)
ok(shapes.length === SHAPE_COUNT && SHAPE_COUNT === N_SHAPES, `9 forms (got ${shapes.length})`)
shapes.forEach((arr, s) => {
  ok(arr.length === N * 3, `form ${s} has ${N} points`)
  let maxR = 0
  let finite = true
  const ext = [Infinity, -Infinity, Infinity, -Infinity, Infinity, -Infinity]
  for (let i = 0; i < N; i++) {
    const x = arr[i * 3], y = arr[i * 3 + 1], z = arr[i * 3 + 2]
    if (!Number.isFinite(x + y + z)) finite = false
    maxR = Math.max(maxR, Math.hypot(x, y, z))
    ext[0] = Math.min(ext[0], x); ext[1] = Math.max(ext[1], x)
    ext[2] = Math.min(ext[2], y); ext[3] = Math.max(ext[3], y)
    ext[4] = Math.min(ext[4], z); ext[5] = Math.max(ext[5], z)
  }
  ok(finite, `form ${s} all finite`)
  ok(maxR < 1.75, `form ${s} fits the frame (max radius ${maxR.toFixed(2)})`)
  const span = Math.max(ext[1] - ext[0], ext[3] - ext[2], ext[5] - ext[4])
  ok(span > 0.8, `form ${s} is not degenerate (span ${span.toFixed(2)})`)
})
ok(JSON.stringify(buildShapes(50)) === JSON.stringify(buildShapes(50)), 'forms are deterministic')

// ---------- choreography ----------
const vh = 800
const b = (top: number, height: number): Box => ({ top, height })
// manifesto is now a pinned 420vh sequence
const panels = Array.from({ length: 8 }, (_, i) => b(5900 + i * 820, 820))
const m = {
  hero: b(0, 800),
  manifesto: b(800, 3360),
  finder: b(4160, 1100),
  panels,
  method: b(12500, 2560),
  posh: b(19500, 1100),
  cta: b(21800, 960),
}
for (const mobile of [false, true]) {
  const tag = mobile ? 'mobile' : 'desktop'
  const keys = homeKeys(m, vh, mobile)
  ok(keys.every((k, i) => i === 0 || k.at >= keys[i - 1].at), `${tag}: keys sorted`)
  // every panel centre shows exactly its own form, fully opaque
  panels.forEach((p, i) => {
    const s = sample(keys, p.top + p.height / 2 - vh / 2)
    ok(near(s.w[i + 1], 1, 1e-6) && near(s.opacity, 1), `${tag}: panel ${i + 1} shows form ${i + 1} (w=${s.w[i + 1].toFixed(3)})`)
  })
  ok(near(sample(keys, 0).w[0], 1) && sample(keys, 0).rings === 1, `${tag}: hero is the orb with rings`)
  // weights always sum to 1 and values stay in range
  let sumOk = true, rangeOk = true, maxJump = 0
  let prev = sample(keys, 0)
  for (let y = 0; y <= 23500; y += 4) {
    const s = sample(keys, y)
    const sum = s.w.reduce((a, v) => a + v, 0)
    if (!near(sum, 1, 1e-6)) sumOk = false
    if (s.opacity < -1e-9 || s.opacity > 1 + 1e-9 || s.warm < -1e-9 || s.warm > 1 + 1e-9) rangeOk = false
    maxJump = Math.max(maxJump, Math.abs(s.x - prev.x), Math.abs(s.y - prev.y), Math.abs(s.opacity - prev.opacity), ...s.w.map((v, k) => Math.abs(v - prev.w[k])))
    prev = s
  }
  ok(sumOk, `${tag}: blend weights always sum to 1`)
  ok(rangeOk, `${tag}: opacity & warmth stay in [0,1]`)
  ok(maxJump < 0.05, `${tag}: no visual jumps per 4px of scroll (max ${maxJump.toFixed(4)})`)
  // the soul is hidden while the method / rituals / index sections play
  ok(sample(keys, m.method.top + 600).opacity < 0.01, `${tag}: hidden during the method section`)
  ok(sample(keys, 17500).opacity < 0.01, `${tag}: hidden during index & workshops`)
  const run = m.manifesto.height - vh
  ok(near(sample(keys, m.manifesto.top + run * 0.76).stir, 1), `${tag}: the wounds stir the soul`)
  ok(near(sample(keys, m.manifesto.top + run).stir, 0) && sample(keys, m.manifesto.top + run).opacity > 0.6, `${tag}: "I hold space" settles and brightens it`)
  ok(sample(keys, m.manifesto.top + run * 0.3).stir > 0 && sample(keys, m.manifesto.top + run * 0.3).stir < 1, `${tag}: stir rises gradually`)
  const poshC = sample(keys, m.posh.top + m.posh.height / 2 - vh / 2)
  ok(near(poshC.w[8], 1) && near(poshC.opacity, 1), `${tag}: lotus returns for POSH`)
  const sun = sample(keys, m.cta.top + m.cta.height - vh)
  ok(near(sun.warm, 1) && near(sun.w[0], 1) && near(sun.opacity, 1), `${tag}: finale is the warm dawn sun`)
  // desktop paths sit in the left column; mobile paths sit up top
  const p1 = sample(keys, panels[0].top + panels[0].height / 2 - vh / 2)
  ok(mobile ? p1.y > 0.3 && near(p1.x, 0) : p1.x < -0.3, `${tag}: paths stage position`)

  const a = aboutKeys({ hero: b(0, 800), story: b(800, 1400), bridge: b(2200, 1500), cta: b(6000, 960) }, vh, mobile)
  ok(near(sample(a, 0).opacity, 1) && sample(a, 2600).opacity < 0.01, `${tag}: about halo then hidden over the venn`)
  ok(near(sample(a, 6160).warm, 1), `${tag}: about ends at dawn`)
  const c = contactKeys({ hero: b(0, 740), form: b(740, 1600) }, vh, mobile)
  ok(near(sample(c, 0).w[2], 1), `${tag}: contact opens on the two rings`)
  ok(sample(c, 2400).opacity < 0.01, `${tag}: contact scene fades before the FAQ`)
}

// ---------- numerology ----------
const lp = lifePath('1990-07-14')!
ok(lp.parts.map((p) => p.reduced).join(',') === '5,7,1' && lp.total === 13 && lp.number === 4, `1990-07-14 → 4 (got ${lp.number})`)
ok(lifePath('2006-01-02')!.number === 11, '2006-01-02 keeps master 11')
ok(lifePath('1975-11-29')!.parts[0].reduced === 11 && lifePath('1975-11-29')!.parts[1].reduced === 11, 'day 29 and month 11 stay master 11')
ok(lifePath('not a date') === null, 'bad input → null')

// ---------- content integrity ----------
ok(paths.length === 8 && paths.every((p, i) => p.shape === i + 1), 'eight paths mapped to forms 1–8')
const missing = paths.flatMap((p) => p.services.filter((sv) => !sv.desc || sv.desc.length < 20).map((sv) => sv.name))
ok(missing.length === 0, `every service has a one-line explanation (${missing.join(', ') || 'all present'})`)
ok(paths.every((p) => p.services.every((sv) => (sv.short ?? sv.name).length <= 30)), 'tile labels fit in two lines')
ok(serviceCount >= 59, `service count ${serviceCount}`)
ok(feelings.every((f) => paths.some((p) => p.id === f.path)), 'every feeling links to a real path')
ok(feelings.some((f) => f.crisis), 'a crisis-aware feeling exists')
const required = ['Reiki', 'Numerology', 'Tarot', 'Aura', 'Past life', 'hypnotherapy', 'EFT', 'Ho’oponopono', 'NLP', 'Inner child', 'Karmic', 'Ancestral', 'Distant', 'Breathwork', 'Grief', 'Anger', 'Pre-marriage', 'Conscious uncoupling', 'POSH', 'Incest', 'NPD', 'Parent–child', 'Peer', 'Sibling', 'Neural plasticity', 'Conditioning', 'Recall', 'Neuro chakra', 'Soul healing', 'Motivation', 'Taboo', 'Pain', 'Fear & phobia', 'women in distress', 'Sexual harassment', 'Leadership', 'Procrastination', 'Office toxicity', 'Body language', 'Growth mindset']
const all = paths.flatMap((p) => p.services.map((s) => s.name)).join(' | ')
required.forEach((r) => ok(all.toLowerCase().includes(r.toLowerCase()), `service listed: ${r}`))

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
