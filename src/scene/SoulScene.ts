import * as THREE from 'three'
import { buildShapes, SHAPE_COUNT, SPIN, TILT } from './shapes'
import { soulFragment, soulVertex, starFragment, starVertex } from './shaders'
import { sceneStore } from './store'
import type { SceneState } from './choreo'

const FOV = 35
const CAM_Z = 10
const HALF_H = CAM_Z * Math.tan(((FOV / 2) * Math.PI) / 180)
const ZERO = new THREE.Vector2()

type Opts = { reduced: boolean; still: boolean }

/**
 * The persistent "soul" — one WebGL scene shared by every page.  It never
 * remounts on navigation; pages only move its target state.
 */
export class SoulScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120)
  private holder = new THREE.Group()
  private points: THREE.Points
  private mat: THREE.ShaderMaterial
  private stars: THREE.Points
  private starMat: THREE.ShaderMaterial
  private armillary = new THREE.Group()
  private glow: THREE.Sprite
  private glowMat: THREE.SpriteMaterial
  private ringMat = new THREE.LineBasicMaterial({ color: 0xe6b873, transparent: true, opacity: 0, depthWrite: false })
  private cur: SceneState = { ...sceneStore.target, w: [...sceneStore.target.w] }
  private light = sceneStore.light
  private mouse = new THREE.Vector2(9, 9)
  private mouseTarget = new THREE.Vector2(9, 9)
  private parallax = new THREE.Vector2()
  private spinAngle = 0
  private last = performance.now()
  private elapsed = 0
  private raf = 0
  private opts: Opts
  private blank = false
  private vh = 900

  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, opts: Opts) {
    this.canvas = canvas
    this.opts = opts
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)

    const small = Math.min(window.innerWidth, window.innerHeight) < 700 || (navigator.hardwareConcurrency ?? 8) <= 4
    const count = small ? 7000 : 14000
    const shapes = buildShapes(count)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(shapes[0], 3))
    for (let s = 1; s < SHAPE_COUNT; s++) geo.setAttribute(`aS${s}`, new THREE.BufferAttribute(shapes[s], 3))
    const rand = new Float32Array(count * 4)
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random()
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2)

    this.mat = new THREE.ShaderMaterial({
      vertexShader: soulVertex,
      fragmentShader: soulFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uW: { value: [...this.cur.w] },
        uSize: { value: 3 },
        uPR: { value: 1 },
        uTurb: { value: 0 },
        uBreath: { value: 0 },
        uLight: { value: this.light },
        uWarm: { value: 0 },
        uMouse: { value: this.mouse },
        uAspect: { value: 1 },
        uOpacity: { value: 1 },
        uC0: { value: new THREE.Color('#f2b56b') },
        uC1: { value: new THREE.Color('#f39ab8') },
        uC2: { value: new THREE.Color('#9f93ff') },
        uC3: { value: new THREE.Color('#a8f0e4') },
      },
    })
    this.points = new THREE.Points(geo, this.mat)

    // soft inner light behind the particles
    const gc = document.createElement('canvas')
    gc.width = gc.height = 256
    const g2 = gc.getContext('2d')!
    const grad = g2.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.18, 'rgba(255,255,255,0.55)')
    grad.addColorStop(0.45, 'rgba(255,255,255,0.14)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g2.fillStyle = grad
    g2.fillRect(0, 0, 256, 256)
    const tex = new THREE.CanvasTexture(gc)
    this.glowMat = new THREE.SpriteMaterial({ map: tex, color: 0xf0a9d0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })
    this.glow = new THREE.Sprite(this.glowMat)
    this.glow.scale.setScalar(3.4)
    this.holder.add(this.glow, this.points)

    this.buildArmillary()
    this.holder.add(this.armillary)
    this.scene.add(this.holder)

    // background stars
    const starCount = small ? 700 : 1400
    const sp = new Float32Array(starCount * 3)
    const seed = new Float32Array(starCount)
    for (let i = 0; i < starCount; i++) {
      const u = Math.random() * 2 - 1
      const th = Math.random() * Math.PI * 2
      const r = 30 + Math.random() * 40
      const s = Math.sqrt(1 - u * u)
      sp[i * 3] = s * Math.cos(th) * r
      sp[i * 3 + 1] = u * r
      sp[i * 3 + 2] = s * Math.sin(th) * r - 20
      seed[i] = Math.random()
    }
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    sg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    this.starMat = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uOpacity: { value: 1 } },
    })
    this.stars = new THREE.Points(sg, this.starMat)
    this.scene.add(this.stars)

    this.camera.position.set(0, 0, CAM_Z)
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
    this.loop()
  }

  private buildArmillary() {
    const circle = (r: number, seg = 220) => {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
      }
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), this.ringMat)
    }
    const ticks = (r: number, n: number, len: number) => {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        const c = Math.cos(a)
        const s = Math.sin(a)
        pts.push(new THREE.Vector3(c * r, 0, s * r), new THREE.Vector3(c * (r + len), 0, s * (r + len)))
      }
      return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), this.ringMat)
    }
    const equator = new THREE.Group()
    equator.add(circle(1.42), ticks(1.42, 12, 0.09), ticks(1.42, 72, 0.03))
    const ecliptic = new THREE.Group()
    ecliptic.add(circle(1.3), ticks(1.3, 9, 0.06))
    ecliptic.rotation.x = 0.41
    ecliptic.rotation.z = 0.2
    const meridian = circle(1.56)
    meridian.rotation.x = Math.PI / 2
    meridian.rotation.y = 0.5
    this.armillary.add(equator, ecliptic, meridian)
  }

  private resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const pr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 1.75)
    this.vh = h
    this.renderer.setPixelRatio(pr)
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.mat.uniforms.uPR.value = pr
    this.mat.uniforms.uAspect.value = w / h
    this.starMat.uniforms.uPR.value = pr
    this.blank = false
  }

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || this.opts.reduced) return
    this.mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }

  private onVisibility = () => {
    if (document.hidden) cancelAnimationFrame(this.raf)
    else {
      this.last = performance.now()
      this.loop()
    }
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const now = performance.now()
    const dt = Math.min((now - this.last) / 1000, 0.05)
    this.last = now
    this.elapsed += dt
    this.frame(dt)
  }

  private frame(dt: number) {
    const tgt = sceneStore.target
    const k = this.opts.still ? 1 : 1 - Math.exp(-dt * 4.2)
    const c = this.cur
    c.w = c.w.map((v, i) => v + (tgt.w[i] - v) * k)
    c.x += (tgt.x - c.x) * k
    c.y += (tgt.y - c.y) * k
    c.scale += (tgt.scale - c.scale) * k
    c.opacity += (tgt.opacity - c.opacity) * k
    c.rings += (tgt.rings - c.rings) * k
    c.warm += (tgt.warm - c.warm) * k
    this.light += (sceneStore.light - this.light) * (this.opts.still ? 1 : 1 - Math.exp(-dt * 3))

    const starOpacity = (1 - this.light) * 0.9
    if (c.opacity < 0.004 && starOpacity < 0.004) {
      if (!this.blank) {
        this.renderer.clear()
        this.blank = true
      }
      return
    }
    this.blank = false

    const elapsed = this.elapsed
    const motion = this.opts.reduced ? 0.25 : 1
    const maxW = Math.max(...c.w)
    let tilt = 0
    let spin = 0
    c.w.forEach((v, i) => {
      tilt += v * TILT[i]
      spin += v * SPIN[i]
    })
    this.spinAngle += spin * dt * motion

    // layout: viewport fractions → world units
    const aspect = this.camera.aspect
    const halfW = HALF_H * aspect
    const unit = Math.min(HALF_H, halfW * 1.2)
    this.holder.position.set(c.x * halfW, c.y * HALF_H, 0)
    this.holder.scale.setScalar(Math.max(0.0001, c.scale * unit))

    this.mouse.lerp(this.mouseTarget, 1 - Math.exp(-dt * 6))
    const m = this.mouseTarget.x > 5 ? ZERO : this.mouseTarget
    this.parallax.lerp(m, 1 - Math.exp(-dt * 2.5))
    this.holder.rotation.set(tilt + this.parallax.y * 0.12, this.parallax.x * 0.22, 0)
    this.points.rotation.y = this.spinAngle
    this.armillary.rotation.y = -this.spinAngle * 0.35 + elapsed * 0.02 * motion

    const u = this.mat.uniforms
    u.uTime.value = elapsed * motion
    u.uW.value = c.w
    u.uTurb.value = (1 - maxW) * 1.05
    u.uBreath.value = this.opts.reduced ? 0 : Math.sin((elapsed * Math.PI * 2) / 9) * 0.035
    u.uLight.value = this.light
    u.uWarm.value = c.warm
    u.uOpacity.value = c.opacity
    u.uSize.value = 3.7 * Math.sqrt(Math.max(c.scale, 0.15) / 0.6) * Math.sqrt(this.vh / 900)
    this.mat.blending = this.light > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending

    const dawn = this.light > 0.5
    this.glowMat.blending = dawn ? THREE.NormalBlending : THREE.AdditiveBlending
    this.glowMat.color.setRGB(1, 0.66 + 0.2 * c.warm, 0.82 - 0.4 * c.warm)
    this.glowMat.opacity = c.opacity * (0.16 + 0.26 * c.w[0] + 0.3 * c.warm) * (dawn ? 0.55 : 1)
    this.ringMat.opacity = c.rings * c.opacity * (this.light > 0.5 ? 0.5 : 0.32)
    this.ringMat.color.set(this.light > 0.5 ? 0xa8742f : 0xe6b873)

    this.starMat.uniforms.uTime.value = elapsed
    this.starMat.uniforms.uOpacity.value = starOpacity
    this.stars.rotation.y = elapsed * 0.004 * motion

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.onPointer)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.points.geometry.dispose()
    this.mat.dispose()
    this.stars.geometry.dispose()
    this.starMat.dispose()
    this.ringMat.dispose()
    this.glowMat.map?.dispose()
    this.glowMat.dispose()
    this.renderer.dispose()
  }

  get element() {
    return this.canvas
  }
}
