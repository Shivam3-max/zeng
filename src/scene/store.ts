import { BASE, type SceneState } from './choreo'

/*
 * The one place pages talk to the soul scene.  Pages publish a target state
 * (from their scroll choreography) and the tone system publishes `light`;
 * the renderer eases toward both every frame.
 */
type Listener = () => void

let target: SceneState = BASE
let light = 0
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
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}
