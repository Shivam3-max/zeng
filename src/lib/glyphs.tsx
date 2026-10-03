import type { ReactNode, SVGProps } from 'react'

/*
 * Celestial line-art glyphs — one hand-built illustration per service.
 * 64×64 grid, stroke-only, `pathLength=1` on every stroke so any glyph can
 * "draw itself" by animating stroke-dashoffset 1 → 0.  `.ac` = accent stroke,
 * `.acf` = accent fill.
 */

type PP = SVGProps<SVGPathElement>
const P = (p: PP) => <path pathLength={1} {...p} />
const C = (p: SVGProps<SVGCircleElement>) => <circle pathLength={1} {...p} />
const E = (p: SVGProps<SVGEllipseElement>) => <ellipse pathLength={1} {...p} />
const Dot = ({ x, y, r = 2.4 }: { x: number; y: number; r?: number }) => (
  <circle className="acf" cx={x} cy={y} r={r} />
)

const spiralPath = (() => {
  let d = ''
  for (let i = 0; i <= 140; i++) {
    const t = (i / 140) * Math.PI * 6
    const r = 1.5 + (t / (Math.PI * 6)) * 21
    const x = 32 + Math.cos(t) * r
    const y = 32 + Math.sin(t) * r
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return d
})()

const ennea = (() => {
  const pt = (k: number) => {
    const a = ((-90 + k * 40) * Math.PI) / 180
    return [32 + Math.cos(a) * 21, 32 + Math.sin(a) * 21] as const
  }
  const seq = [1, 4, 2, 8, 5, 7, 1].map((k) => pt(k % 9))
  const tri = [3, 6, 9, 3].map((k) => pt(k % 9))
  const toD = (s: readonly (readonly [number, number])[]) =>
    s.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')
  return { hex: toD(seq), tri: toD(tri), pts: Array.from({ length: 9 }, (_, k) => pt(k)) }
})()

const ring = (n: number, r: number, cx = 32, cy = 32, start = -90) =>
  Array.from({ length: n }, (_, k) => {
    const a = ((start + (k * 360) / n) * Math.PI) / 180
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const
  })

const G = {
  orb: (
    <>
      <C cx={32} cy={32} r={17} />
      <E cx={32} cy={32} rx={27} ry={8} transform="rotate(-22 32 32)" />
      <C cx={32} cy={32} r={9} className="ac" />
      <Dot x={32} y={32} />
    </>
  ),
  loop: (
    <>
      <P d="M48 30a16 16 0 1 1-6.2-12.6" />
      <P d="M41 10.5l.8 7-7 .8" className="ac" />
      <P d="M16 34a16 16 0 0 0 4.7 9.3" className="ac" />
      <C cx={32} cy={32} r={6} />
      <Dot x={32} y={32} r={2} />
    </>
  ),
  mind: (
    <>
      <P d="M32 16c-5-5-15-2-15 6-5 2-5 10 0 12-2 6 4 11 9 9 2 4 6 5 6 5" />
      <P d="M32 16c5-5 15-2 15 6 5 2 5 10 0 12 2 6-4 11-9 9-2 4-6 5-6 5" />
      <P d="M32 16v32" className="ac" />
      <P d="M24 26c3 0 4 3 2 5M40 26c-3 0-4 3-2 5" />
      <Dot x={32} y={30} />
    </>
  ),
  heart: (
    <>
      <P d="M32 49C20 41 13 34 13 25c0-6 5-10 10-10 4 0 7 3 9 6 2-3 5-6 9-6 5 0 10 4 10 10 0 9-7 16-19 24z" />
      <P d="M32 41c-6-4-10-8-10-13 0-3 2-5 5-5 2 0 4 1 5 3" className="ac" />
      <Dot x={32} y={30} r={2} />
    </>
  ),
  waves: (
    <>
      <P d="M8 24q6-7 12 0t12 0 12 0 12 0" />
      <P d="M8 33q6-4 12 0t12 0 12 0 12 0" className="ac" />
      <P d="M8 42q6-1.5 12 0t12 0 12 0 12 0" />
      <Dot x={56} y={42} r={2} />
    </>
  ),
  tear: (
    <>
      <P d="M32 10s-12 16-12 25a12 12 0 0024 0c0-9-12-25-12-25z" />
      <P d="M27 36a5 5 0 005 5" className="ac" />
      <E cx={32} cy={55} rx={14} ry={3} />
      <E cx={32} cy={55} rx={7} ry={1.5} className="ac" />
    </>
  ),
  flame: (
    <>
      <P d="M32 53c-10 0-14-8-14-14 0-10 10-14 10-24 6 4 10 10 10 16 2-3 3-5 3-8 4 5 5 11 5 16 0 8-6 14-14 14z" />
      <P d="M32 53c-4 0-6-3-6-6 0-5 6-7 6-12 3 3 6 7 6 12 0 3-2 6-6 6z" className="ac" />
    </>
  ),
  eye: (
    <>
      <P d="M8 32c8-12 40-12 48 0-8 12-40 12-48 0z" />
      <C cx={32} cy={32} r={8} className="ac" />
      <Dot x={32} y={32} r={3} />
      <P d="M32 12v5M18 16l3 4M46 16l-3 4" />
    </>
  ),
  target: (
    <>
      <C cx={30} cy={34} r={20} />
      <C cx={30} cy={34} r={13} />
      <C cx={30} cy={34} r={6} className="ac" />
      <P d="M30 34L52 12M45 12h7v7" className="ac" />
      <Dot x={30} y={34} r={2} />
    </>
  ),
  leaf: (
    <>
      <P d="M12 52c0-22 14-38 40-40 0 24-16 40-40 40z" />
      <P d="M12 52L40 24" className="ac" />
      <P d="M22 42l-1-8M28 36l-1-9M34 30l-1-8M22 42l8 1M28 36l9 1" />
    </>
  ),
  veil: (
    <>
      <P d="M12 12h40" />
      <P d="M14 12c0 16 4 28 10 40M50 12c0 16-4 28-10 40" />
      <P d="M22 12c0 14 4 26 10 32 6-6 10-18 10-32" className="ac" />
      <Dot x={32} y={30} />
    </>
  ),
  rings: (
    <>
      <C cx={25} cy={34} r={13} />
      <C cx={39} cy={34} r={13} className="ac" />
      <Dot x={32} y={23} r={2.2} />
    </>
  ),
  knot: (
    <>
      <P d="M12 42c0-20 28-22 28-8s-18 12-16-2c2-12 28-12 28 6 0 10-12 14-20 10" />
      <P d="M12 42c2 6 8 8 14 6" className="ac" />
      <Dot x={52} y={38} r={2} />
    </>
  ),
  mask: (
    <>
      <P d="M16 16c8-4 24-4 32 0 0 22-6 34-16 34S16 38 16 16z" />
      <P d="M22 28q4-4 8 0M34 28q4-4 8 0" className="ac" />
      <P d="M25 41q7-5 14 0" />
      <P d="M48 20l6-4M16 20l-6-4" />
    </>
  ),
  peers: (
    <>
      <C cx={22} cy={22} r={6} />
      <C cx={42} cy={22} r={6} />
      <P d="M10 50c0-10 5-16 12-16s12 6 12 16" />
      <P d="M30 50c0-10 5-16 12-16s12 6 12 16" className="ac" />
      <Dot x={32} y={14} r={2} />
    </>
  ),
  circle: (
    <>
      {ring(8, 18).map(([x, y], i) => (
        <C key={i} cx={x} cy={y} r={4} className={i % 2 ? 'ac' : undefined} />
      ))}
      <C cx={32} cy={32} r={9} />
      <Dot x={32} y={32} />
    </>
  ),
  family: (
    <>
      <C cx={26} cy={28} r={15} />
      <C cx={42} cy={41} r={8} className="ac" />
      <Dot x={42} y={41} r={2.2} />
      <P d="M14 54h36" />
    </>
  ),
  split: (
    <>
      <C cx={19} cy={32} r={11} />
      <C cx={45} cy={32} r={11} />
      <P d="M30 32h4" className="ac" />
      <P d="M19 21v22M45 21v22" className="ac" />
      <Dot x={19} y={32} r={2} />
      <Dot x={45} y={32} r={2} />
    </>
  ),
  neural: (
    <>
      <P d="M14 20L32 13 49 22 36 34 20 40 28 52 46 46 36 34M32 13L36 34M14 20L20 40M49 22L46 46" />
      {[
        [14, 20],
        [32, 13],
        [49, 22],
        [20, 40],
        [28, 52],
        [46, 46],
      ].map(([x, y], i) => (
        <C key={i} cx={x} cy={y} r={3} />
      ))}
      <C cx={36} cy={34} r={5} className="ac" />
      <Dot x={36} y={34} r={2} />
    </>
  ),
  recode: (
    <>
      <P d="M12 44C18 20 28 20 32 30s14 10 20-12" />
      <C cx={12} cy={44} r={4} />
      <C cx={32} cy={30} r={5} className="ac" />
      <C cx={52} cy={18} r={4} />
      <Dot x={32} y={30} r={2} />
      <P d="M8 54h48" />
    </>
  ),
  speech: (
    <>
      <P d="M12 16h40v24H30l-9 9v-9h-9z" />
      <P d="M19 28q4-6 8 0t8 0 8 0" className="ac" />
      <Dot x={46} y={28} r={1.8} />
    </>
  ),
  spiral: (
    <>
      <P d={spiralPath} />
      <C cx={32} cy={32} r={26} className="ac" />
      <Dot x={32} y={32} r={2} />
    </>
  ),
  hourglass: (
    <>
      <P d="M18 10h28M18 54h28" />
      <P d="M21 10c0 14 11 16 11 22s-11 8-11 22M43 10c0 14-11 16-11 22s11 8 11 22" />
      <P d="M26 50l6-6 6 6z" className="acf" />
      <P d="M32 34v8" className="ac" />
    </>
  ),
  child: (
    <>
      <C cx={32} cy={30} r={21} />
      <C cx={32} cy={37} r={8} className="ac" />
      <Dot x={32} y={37} r={2.4} />
      <P d="M18 46c4 5 9 7 14 7s10-2 14-7" />
    </>
  ),
  chain: (
    <>
      <P d="M12 40l9-9a7 7 0 0110 10l-3 3" />
      <P d="M52 24l-9 9a7 7 0 01-10-10l3-3" />
      <P d="M28 18l-2-6M34 16l1-6M39 20l4-4" className="ac" />
      <P d="M25 47l-1 6M30 48l2 6" className="ac" />
    </>
  ),
  shield: (
    <>
      <P d="M32 9l19 7v14c0 12-8 20-19 25-11-5-19-13-19-25V16z" />
      <P d="M32 18l12 4v8c0 8-5 13-12 16-7-3-12-8-12-16v-8z" className="ac" />
      <Dot x={32} y={31} />
    </>
  ),
  tap: (
    <>
      <P d="M28 56V32a4 4 0 018 0v24" />
      <C cx={32} cy={20} r={6} className="ac" />
      <P d="M20 14a14 14 0 0124 0M16 9a20 20 0 0132 0" />
      <Dot x={32} y={20} r={2} />
    </>
  ),
  petals: (
    <>
      {[0, 90, 180, 270].map((a) => (
        <E key={a} cx={32} cy={19} rx={6} ry={11} transform={`rotate(${a} 32 32)`} className={a % 180 ? 'ac' : undefined} />
      ))}
      <Dot x={32} y={32} />
    </>
  ),
  chakra: (
    <>
      <P d="M32 6v52" />
      {[10, 17, 24, 31, 38, 45, 52].map((y, i) => (
        <C key={y} cx={32} cy={y} r={i === 3 ? 4 : 2.8} className={i === 3 ? 'ac' : undefined} />
      ))}
      <P d="M22 10c8 6 12 10 0 14s0 10 0 14 12 8 0 14M42 10c-8 6-12 10 0 14s0 10 0 14-12 8 0 14" />
    </>
  ),
  palm: (
    <>
      <P d="M14 16c8 6 8 26 0 32M50 16c-8 6-8 26 0 32" />
      <C cx={32} cy={32} r={6} className="ac" />
      <P d="M32 18v4M32 42v4M23 32h-3M44 32h-3M25 25l-2-2M39 39l2 2M39 25l2-2M25 39l-2 2" className="ac" />
      <Dot x={32} y={32} r={2} />
    </>
  ),
  signal: (
    <>
      <C cx={20} cy={44} r={10} />
      <E cx={20} cy={44} rx={4} ry={10} />
      <P d="M32 30a12 12 0 016 8M34 22a20 20 0 0111 14M37 14a28 28 0 0115 20" className="ac" />
      <Dot x={50} y={14} r={2.6} />
    </>
  ),
  infinity: (
    <>
      <P d="M32 32c-6-10-20-10-20 0s14 10 20 0 20-10 20 0-14 10-20 0z" />
      <P d="M32 32c-3-5-9-6-12-3" className="ac" />
      <Dot x={52} y={32} r={2.2} />
    </>
  ),
  roots: (
    <>
      <C cx={32} cy={14} r={7} className="ac" />
      <P d="M32 21v15M32 36c-4 6-10 8-16 18M32 36c4 6 10 8 16 18M32 36v20M32 42c-3 5-5 8-7 14M32 42c3 5 5 8 7 14" />
      <P d="M10 36h44" className="ac" />
      <Dot x={16} y={54} r={1.8} />
      <Dot x={48} y={54} r={1.8} />
    </>
  ),
  breath: (
    <>
      <C cx={32} cy={32} r={24} strokeDasharray="0.02 0.03" />
      <C cx={32} cy={32} r={17} />
      <C cx={32} cy={32} r={10} className="ac" />
      <Dot x={32} y={32} r={4} />
    </>
  ),
  meditate: (
    <>
      <C cx={32} cy={14} r={5} />
      <P d="M32 20c-5 3-6 10-4 17M32 20c5 3 6 10 4 17" />
      <P d="M27 25c-5 6-6 12-3 15h6M37 25c5 6 6 12 3 15h-6" />
      <P d="M12 46c6-6 34-6 40 0-6 4-34 4-40 0z" className="ac" />
      <Dot x={32} y={29} r={2} />
    </>
  ),
  card: (
    <>
      <P d="M19 9h26a3 3 0 013 3v40a3 3 0 01-3 3H19a3 3 0 01-3-3V12a3 3 0 013-3z" />
      <P d="M21 13h22v38H21z" />
      <P d="M32 22l2.5 7.5L42 32l-7.5 2.5L32 42l-2.5-7.5L22 32l7.5-2.5z" className="ac" />
      <Dot x={32} y={32} r={1.6} />
    </>
  ),
  numbers: (
    <>
      <C cx={32} cy={32} r={21} />
      <P d={ennea.hex} className="ac" />
      <P d={ennea.tri} />
      {ennea.pts.map(([x, y], i) => (
        <circle key={i} className={i === 0 ? 'acf' : 'dotf'} cx={x} cy={y} r={i === 0 ? 2.6 : 1.5} />
      ))}
    </>
  ),
  aura: (
    <>
      <C cx={32} cy={26} r={6} />
      <P d="M20 50c0-10 5-16 12-16s12 6 12 16" />
      <E cx={32} cy={34} rx={17} ry={22} className="ac" />
      <E cx={32} cy={34} rx={24} ry={28} strokeDasharray="0.015 0.025" />
    </>
  ),
  sun: (
    <>
      <P d="M8 46h48" />
      <P d="M20 46a12 12 0 0124 0" className="ac" />
      <P d="M32 26v-8M20 32l-5-5M44 32l5-5M14 42H8M50 42h6" />
      <Dot x={32} y={46} r={2} />
    </>
  ),
  mountain: (
    <>
      <P d="M6 52l17-26 8 11 11-19 16 34z" />
      <P d="M42 18V8l8 3-8 3" className="ac" />
      <P d="M18 44l5-6 4 4" />
    </>
  ),
  body: (
    <>
      <C cx={32} cy={13} r={5} />
      <P d="M32 19v20M17 22l15 6 15-6M32 39l-8 16M32 39l8 16" />
      <C cx={32} cy={29} r={3} className="ac" />
      <P d="M12 16l-3-3M52 16l3-3" className="ac" />
    </>
  ),
  mirror: (
    <>
      <E cx={32} cy={26} rx={14} ry={18} />
      <P d="M32 44v12M25 56h14" />
      <P d="M32 33c-5-3-8-6-8-9 0-2 2-4 4-4 2 0 3 1 4 3 1-2 2-3 4-3 2 0 4 2 4 4 0 3-3 6-8 9z" className="ac" />
    </>
  ),
  clock: (
    <>
      <C cx={32} cy={34} r={20} />
      <P d="M32 34V22M32 34l9 6" className="ac" />
      <P d="M26 9h12M32 9v5" />
      <Dot x={32} y={34} r={2} />
    </>
  ),
  crown: (
    <>
      <P d="M13 44l4-22 9 11 6-15 6 15 9-11 4 22z" />
      <P d="M13 51h38" className="ac" />
      <Dot x={17} y={22} r={2} />
      <Dot x={32} y={18} r={2} />
      <Dot x={47} y={22} r={2} />
    </>
  ),
  sprout: (
    <>
      <P d="M32 54V30" />
      <P d="M32 40c-8 0-14-6-14-14 8 0 14 6 14 14z" />
      <P d="M32 32c0-8 6-14 14-14 0 8-6 14-14 14z" className="ac" />
      <P d="M18 54h28" />
    </>
  ),
  scales: (
    <>
      <P d="M32 10v42M22 54h20M14 18h36" />
      <P d="M14 18L8 32h12zM50 18l-6 14h12z" className="ac" />
      <Dot x={32} y={10} r={2.4} />
    </>
  ),
  venus: (
    <>
      <C cx={32} cy={24} r={13} />
      <P d="M32 37v19M23 47h18" className="ac" />
      <Dot x={32} y={24} r={2.4} />
    </>
  ),
  lotus: (
    <>
      <P d="M32 46c-6-8-6-20 0-30 6 10 6 22 0 30z" className="ac" />
      <P d="M32 46c-10-2-16-12-16-20 8 2 14 10 16 20zM32 46c10-2 16-12 16-20-8 2-14 10-16 20z" />
      <P d="M32 46c-14 2-22-6-24-12 8 0 18 4 24 12zM32 46c14 2 22-6 24-12-8 0-18 4-24 12z" />
      <P d="M14 53h36" />
    </>
  ),
  compass: (
    <>
      <C cx={32} cy={32} r={21} />
      <P d="M32 15l4 17-4 17-4-17z" className="ac" />
      <P d="M32 7v4M32 53v4M7 32h4M53 32h4" />
      <Dot x={32} y={32} r={2} />
    </>
  ),
} satisfies Record<string, ReactNode>

export type GlyphName = keyof typeof G & string
export const glyphNames = Object.keys(G) as GlyphName[]

export function Glyph({
  name,
  size = 48,
  className = '',
  title,
}: {
  name: GlyphName
  size?: number
  className?: string
  title?: string
}) {
  return (
    <svg
      className={`glyph ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {G[name] ?? G.orb}
    </svg>
  )
}
