import { BASE, type SceneState } from './choreo'

/*
 * The one place pages talk to the soul scene.  Pages publish a target state
 * (from their scroll choreography) and the tone system publishes `light`;
 * the renderer eases toward both every frame.
 */
type Listener = () => void

let target: SceneState = BASE
let light = 0
let pulseAt = -1e9
let pulseStrength = 0
const listeners = new Set<Listener>()

export const sceneStore = {
  get target() {
    return target
  },
  get light() {
    return light
  },
  setTarget(next: SceneState) {
    target = next
    listeners.forEach((l) => l())
  },
  setLight(next: number) {
    light = next
    listeners.forEach((l) => l())
  },
  /** A ripple of light through the soul — called on meaningful clicks. */
  pulse(strength = 1) {
    pulseAt = performance.now()
    pulseStrength = strength
  },
  /** Current pulse envelope, 0..1, decaying over ~1.4s. */
  pulseLevel(now = performance.now()) {
    const t = (now - pulseAt) / 1000
    return t < 0 || t > 1.6 ? 0 : pulseStrength * Math.exp(-t * 3) * Math.min(1, t * 12)
  },
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}
