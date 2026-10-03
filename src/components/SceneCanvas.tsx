import { useEffect, useRef, useState } from 'react'
import type { SoulScene } from '../scene/SoulScene'
import { sceneStore } from '../scene/store'
import { isStill, prefersReduced } from '../lib/motion'

/** The one persistent WebGL canvas behind every page, with a CSS orb if WebGL is unavailable. */
export function SceneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(() => document.documentElement.dataset.nogl === '1')

  useEffect(() => {
    const canvas = ref.current
    if (failed || !canvas) return
    let scene: SoulScene | null = null
    let cancelled = false
    const fail = (err?: unknown) => {
      if (err) console.warn('[soul] WebGL unavailable — using the CSS orb.', err)
      if (!cancelled) setFailed(true)
    }
    // three.js is split into its own chunk so the page paints before the scene loads
    import('../scene/SoulScene')
      .then(({ SoulScene }) => {
        if (cancelled) return
        try {
          scene = new SoulScene(canvas, { reduced: prefersReduced(), still: isStill() })
          canvas.classList.add('is-ready')
        } catch (err) {
          fail(err)
        }
      })
      .catch(fail)
    const lost = (e: Event) => {
      e.preventDefault()
      fail()
    }
    canvas.addEventListener('webglcontextlost', lost)
    return () => {
      cancelled = true
      canvas.removeEventListener('webglcontextlost', lost)
      scene?.dispose()
    }
  }, [failed])

  if (failed) return <FallbackOrb />
  return <canvas ref={ref} className="soul-canvas" aria-hidden="true" />
}

function FallbackOrb() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const apply = () => {
      const el = ref.current
      if (!el) return
      const t = sceneStore.target
      const size = t.scale * window.innerHeight * 1.05
      el.style.width = el.style.height = `${size}px`
      el.style.left = `${(0.5 + t.x / 2) * 100}%`
      el.style.top = `${(0.5 - t.y / 2) * 100}%`
      el.style.opacity = String(t.opacity * 0.9)
      el.dataset.warm = t.warm > 0.5 ? '1' : '0'
    }
    apply()
    return sceneStore.subscribe(apply)
  }, [])
  return (
    <div className="soul-fallback" aria-hidden="true">
      <div ref={ref} className="soul-fallback__orb" />
    </div>
  )
}
