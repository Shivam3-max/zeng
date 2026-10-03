import { useId, type ReactNode } from 'react'
import type { Tarot } from '../../lib/content'

const INK = '#2a2150'
const GOLD = '#b8873f'

const starPoints = (cx: number, cy: number, R: number, r: number, n = 8) =>
  Array.from({ length: n * 2 }, (_, k) => {
    const a = (k / (n * 2)) * Math.PI * 2 - Math.PI / 2
    const rr = k % 2 ? r : R
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`
  }).join(' ')

const sparkle = (x: number, y: number, s: number) => <polygon key={`${x}-${y}`} points={starPoints(x, y, s, s * 0.32, 4)} fill={GOLD} />

const SYMBOLS: Record<string, ReactNode> = {
  star: (
    <>
      <polygon points={starPoints(75, 112, 38, 13)} fill="none" stroke={INK} strokeWidth="1.2" />
      <polygon points={starPoints(75, 112, 20, 7)} fill={GOLD} opacity="0.85" />
      {sparkle(38, 72, 6)}
      {sparkle(112, 76, 5)}
      {sparkle(40, 150, 4.5)}
      {sparkle(110, 148, 6)}
      <path d="M30 172q11-6 22 0t22 0 22 0 22 0" fill="none" stroke={INK} strokeWidth="1" />
      <path d="M40 180q9-4 18 0t18 0 18 0 18 0" fill="none" stroke={GOLD} strokeWidth="1" />
    </>
  ),
  sun: (
    <>
      {Array.from({ length: 16 }, (_, k) => {
        const a = (k / 16) * Math.PI * 2
        const r2 = k % 2 ? 36 : 44
        return <line key={k} x1={75 + Math.cos(a) * 28} y1={112 + Math.sin(a) * 28} x2={75 + Math.cos(a) * r2} y2={112 + Math.sin(a) * r2} stroke={k % 2 ? GOLD : INK} strokeWidth="1.2" strokeLinecap="round" />
      })}
      <circle cx="75" cy="112" r="22" fill={GOLD} opacity="0.85" />
      <circle cx="75" cy="112" r="22" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M30 176h90" stroke={INK} strokeWidth="1" />
    </>
  ),
  moon: (
    <>
      <path d="M88 82a32 32 0 1 0 0 60 26 26 0 1 1 0-60z" fill={GOLD} opacity="0.85" stroke={INK} strokeWidth="1.2" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${62 + k * 13} ${152 + (k % 2) * 6}c0 0-4 5-4 8a4 4 0 008 0c0-3-4-8-4-8z`} fill="none" stroke={INK} strokeWidth="1" />
      ))}
      <path d="M30 180h90" stroke={INK} strokeWidth="1" />
      {sparkle(42, 78, 4)}
      {sparkle(112, 96, 3.5)}
    </>
  ),
  strength: (
    <>
      <path d="M75 70c-5-8-17-8-17 0s12 8 17 0 17-8 17 0-12 8-17 0z" fill="none" stroke={GOLD} strokeWidth="1.4" />
      <circle cx="75" cy="122" r="30" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M75 140c-12-8-18-14-18-21 0-5 4-8 8-8 4 0 7 2 10 6 3-4 6-6 10-6 4 0 8 3 8 8 0 7-6 13-18 21z" fill={GOLD} opacity="0.85" />
      <path d="M45 170c10-6 50-6 60 0" fill="none" stroke={INK} strokeWidth="1" />
    </>
  ),
  temperance: (
    <>
      <circle cx="75" cy="70" r="11" fill="none" stroke={INK} strokeWidth="1.1" />
      <polygon points="75,63 81,74 69,74" fill={GOLD} />
      <path d="M40 100h24l-4 18H44z" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M86 140h24l-4 18H90z" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M58 104c18 2 34 14 40 36" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <path d="M30 180h90" stroke={INK} strokeWidth="1" />
    </>
  ),
  hermit: (
    <>
      <path d="M75 62v22" stroke={INK} strokeWidth="1.1" />
      <polygon points="75,84 98,96 98,132 75,144 52,132 52,96" fill="none" stroke={INK} strokeWidth="1.2" />
      <polygon points={starPoints(75, 114, 16, 6, 6)} fill={GOLD} />
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k / 8) * Math.PI * 2
        return <line key={k} x1={75 + Math.cos(a) * 36} y1={114 + Math.sin(a) * 36} x2={75 + Math.cos(a) * 44} y2={114 + Math.sin(a) * 44} stroke={GOLD} strokeWidth="1" />
      })}
      <path d="M36 182c14-10 64-10 78 0" fill="none" stroke={INK} strokeWidth="1" />
    </>
  ),
  wheel: (
    <>
      <circle cx="75" cy="114" r="40" fill="none" stroke={INK} strokeWidth="1.2" />
      <circle cx="75" cy="114" r="31" fill="none" stroke={GOLD} strokeWidth="1" />
      <circle cx="75" cy="114" r="10" fill={GOLD} opacity="0.85" />
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k / 8) * Math.PI * 2
        return <line key={k} x1={75 + Math.cos(a) * 10} y1={114 + Math.sin(a) * 10} x2={75 + Math.cos(a) * 40} y2={114 + Math.sin(a) * 40} stroke={INK} strokeWidth="1" />
      })}
      {[0, 1, 2, 3].map((k) => {
        const a = (k / 4) * Math.PI * 2 - Math.PI / 2
        return <circle key={k} cx={75 + Math.cos(a) * 50} cy={114 + Math.sin(a) * 50} r="3" fill={GOLD} />
      })}
    </>
  ),
  world: (
    <>
      <ellipse cx="75" cy="116" rx="30" ry="44" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="2 3" />
      <ellipse cx="75" cy="116" rx="24" ry="38" fill="none" stroke={INK} strokeWidth="1" />
      <circle cx="75" cy="102" r="6" fill="none" stroke={INK} strokeWidth="1.1" />
      <path d="M75 108v22M66 116h18M75 130l-7 12M75 130l7 12" stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
      {[
        [30, 64],
        [120, 64],
        [30, 170],
        [120, 170],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="none" stroke={INK} strokeWidth="1" />
      ))}
    </>
  ),
}

export function CardFace({ card }: { card: Tarot }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg viewBox="0 0 150 250" className="tcard__svg" aria-hidden="true">
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf5ea" />
          <stop offset="1" stopColor="#f1dfcd" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="150" height="250" rx="10" fill={`url(#f${id})`} />
      <rect x="5" y="5" width="140" height="240" rx="7" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <rect x="10" y="10" width="130" height="230" rx="4" fill="none" stroke={GOLD} strokeWidth="0.6" />
      <text x="75" y="34" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="15" fill={INK}>
        {card.numeral}
      </text>
      <path d="M58 42h34" stroke={GOLD} strokeWidth="0.8" />
      {SYMBOLS[card.id]}
      <text x="75" y="214" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="17" fill={INK}>
        {card.name}
      </text>
      <text x="75" y="229" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="6.5" letterSpacing="2" fill={GOLD}>
        {card.keyword.toUpperCase()}
      </text>
    </svg>
  )
}

export function CardBack() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg viewBox="0 0 150 250" className="tcard__svg" aria-hidden="true">
      <defs>
        <radialGradient id={`b${id}`} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#2b2163" />
          <stop offset="1" stopColor="#0f0c26" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="150" height="250" rx="10" fill={`url(#b${id})`} />
      <rect x="6" y="6" width="138" height="238" rx="6" fill="none" stroke="#e6b873" strokeWidth="1" opacity="0.8" />
      <rect x="12" y="12" width="126" height="226" rx="3" fill="none" stroke="#e6b873" strokeWidth="0.5" opacity="0.5" />
      {Array.from({ length: 24 }, (_, k) => {
        const a = (k / 24) * Math.PI * 2
        return <line key={k} x1={75 + Math.cos(a) * 30} y1={125 + Math.sin(a) * 30} x2={75 + Math.cos(a) * (k % 2 ? 40 : 52)} y2={125 + Math.sin(a) * (k % 2 ? 40 : 52)} stroke="#e6b873" strokeWidth="0.7" opacity="0.75" />
      })}
      <circle cx="75" cy="125" r="24" fill="none" stroke="#e6b873" strokeWidth="1" />
      <path d="M82 108a18 18 0 1 0 0 34 14 14 0 1 1 0-34z" fill="#f2a9be" opacity="0.85" />
      {[
        [32, 40],
        [118, 46],
        [26, 210],
        [120, 204],
        [75, 30],
        [75, 222],
      ].map(([x, y]) => (
        <polygon key={`${x}${y}`} points={starPoints(x, y, 4, 1.3, 4)} fill="#e6b873" />
      ))}
    </svg>
  )
}
