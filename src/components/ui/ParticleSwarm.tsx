import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const COUNT      = 20000
const SPEED_MULT = 1

export default function ParticleSwarm() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Scene ──────────────────────────────────────────────────
    const BG = 0x020B18
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BG)   // must be set on scene, not renderer, for EffectComposer
    scene.fog = new THREE.FogExp2(BG, 0.01)

    const W = mount.clientWidth
    const H = mount.clientHeight

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000)
    camera.position.set(0, 0, 100)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping  = true
    controls.enablePan      = false
    controls.enableZoom     = false
    controls.autoRotate     = true
    controls.autoRotateSpeed = 1.4

    // ── Bloom ──────────────────────────────────────────────────
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 1.8, 0.4, 0)
    composer.addPass(bloom)

    // ── Instanced mesh ─────────────────────────────────────────
    const geometry = new THREE.TetrahedronGeometry(0.25)
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const mesh     = new THREE.InstancedMesh(geometry, material, COUNT)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(mesh)

    const dummy     = new THREE.Object3D()
    const color     = new THREE.Color()
    const target    = new THREE.Vector3()
    const positions = Array.from({ length: COUNT }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
      ),
    )
    for (let i = 0; i < COUNT; i++) mesh.setColorAt(i, color.setHex(0x00ff88))

    // ── Params ─────────────────────────────────────────────────
    const size    = 12
    const flapSpd = 2.5
    const drift   = 1.2
    const chaos   = 0.18

    // ── Animation ─────────────────────────────────────────────
    const clock = new THREE.Clock()
    let rafId: number

    function animate() {
      rafId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime() * SPEED_MULT

      controls.update()

      const bodyFrac  = 0.50
      const wingFrac  = 0.22
      const snoutFrac = 0.07
      const earFrac   = 0.07
      const legFrac   = 0.08

      const bodyEnd  = bodyFrac
      const wingEnd  = bodyEnd  + wingFrac
      const snoutEnd = wingEnd  + snoutFrac
      const earEnd   = snoutEnd + earFrac
      const legEnd   = earEnd   + legFrac
      const tailFrac = 1 - legEnd

      const flyX  = Math.sin(time * 0.31) * drift * 4
      const flyY  = Math.sin(time * 0.47) * drift * 1.5
      const flyZ  = Math.cos(time * 0.23) * drift * 3
      const roll  = Math.sin(time * 0.19) * 0.18
      const pitch = Math.sin(time * 0.27) * 0.12
      const cosR  = Math.cos(roll),  sinR = Math.sin(roll)
      const cosP  = Math.cos(pitch), sinP = Math.sin(pitch)

      for (let i = 0; i < COUNT; i++) {
        const pf    = i / COUNT
        const seed  = (i * 2654435761) % 1e9 / 1e9
        const seed2 = (i * 1013904223) % 1e9 / 1e9

        let px = 0, py = 0, pz = 0
        let hue = 0, sat = 1, lit = 0.65

        if (pf < bodyEnd) {
          const phi   = Math.acos(1 - 2 * seed)
          const theta = seed2 * Math.PI * 2
          const rn    = 1 + chaos * (Math.sin(seed * 37.1 + time) * 0.5)
          px  = Math.sin(phi) * Math.cos(theta) * size * 0.62 * rn
          py  = Math.sin(phi) * Math.sin(theta) * size * 0.55 * rn
          pz  = Math.cos(phi) * size * 0.8 * rn
          hue = 0.93 + seed * 0.06; sat = 0.75; lit = 0.68 + seed2 * 0.1

        } else if (pf < wingEnd) {
          const lp   = (pf - bodyEnd) / wingFrac
          const side = lp < 0.5 ? 1 : -1
          const wlp  = lp < 0.5 ? lp * 2 : (lp - 0.5) * 2
          const span = size * (0.4 + wlp * 1.4)
          const flap = Math.sin(time * flapSpd) * (0.5 + wlp * 0.5)
          const curl = Math.sin(wlp * Math.PI) * 0.45
          const ws   = seed2 * Math.PI * 0.65 - Math.PI * 0.325
          px  = side * (0.6 * size + Math.cos(ws) * span)
          py  = flap * size * 0.5 + curl * size * 0.3 + seed * chaos * 0.8
          pz  = Math.sin(ws) * span * 0.4
          hue = 0.58 + wlp * 0.08; sat = 0.9; lit = 0.55 + wlp * 0.2

        } else if (pf < snoutEnd) {
          const phi   = seed * Math.PI * 0.8
          const theta = seed2 * Math.PI * 2
          px  = Math.sin(phi) * Math.cos(theta) * size * 0.22
          py  = Math.sin(phi) * Math.sin(theta) * size * 0.15 - size * 0.05
          pz  = size * 0.78 + Math.cos(phi) * size * 0.18
          hue = 0.95; sat = 0.8; lit = 0.72

        } else if (pf < earEnd) {
          const lp   = (pf - snoutEnd) / earFrac
          const side = lp < 0.5 ? 1 : -1
          const elp  = lp < 0.5 ? lp * 2 : (lp - 0.5) * 2
          const earH = elp * size * 0.42
          const earW = (1 - elp) * size * 0.18 * (seed * 0.6 + 0.7)
          px  = side * (size * 0.32 + earW * Math.cos(seed2 * Math.PI * 2))
          py  = size * 0.45 + earH
          pz  = size * 0.35 + earW * Math.sin(seed2 * Math.PI * 2)
          hue = 0.92; sat = 0.7; lit = 0.64

        } else if (pf < legEnd) {
          const lp     = (pf - earEnd) / legFrac
          const legIdx = Math.floor(lp * 4)
          const llp    = (lp * 4) % 1
          const lx     = (legIdx % 2 === 0 ? 1 : -1) * size * 0.32
          const lz     = (legIdx < 2 ? 1 : -1) * size * 0.38
          const trot   = Math.sin(time * 2.5 + legIdx * Math.PI * 0.5) * 0.3
          px  = lx + seed  * size * 0.12
          py  = -size * 0.45 - llp * size * 0.32 + trot * size * 0.15
          pz  = lz + seed2 * size * 0.1
          hue = 0.94; sat = 0.65; lit = 0.6

        } else {
          const lp  = (pf - legEnd) / tailFrac
          const ang = lp * Math.PI * 5 + time * 0.8
          const r   = size * 0.12 * (1 - lp * 0.5)
          px  = Math.cos(ang) * r + seed * chaos
          py  = Math.sin(ang) * r - size * 0.05
          pz  = -size * (0.75 + lp * 0.28)
          hue = 0.91; sat = 0.85; lit = 0.7
        }

        // roll + pitch
        const rx = px * cosR - py * sinR
        const ry = px * sinR + py * cosR
        const fz = pz * cosP - ry * sinP
        const fy = pz * sinP + ry * cosP

        target.set(rx + flyX, fy + flyY, fz + flyZ)
        color.setHSL(hue % 1, sat, lit)

        positions[i].lerp(target, 0.1)
        dummy.position.copy(positions[i])
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        mesh.setColorAt(i, color)
      }

      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

      composer.render()
    }

    animate()

    // ── Resize ─────────────────────────────────────────────────
    function onResize() {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      controls.dispose()
      composer.dispose()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', borderRadius: 'inherit', overflow: 'hidden' }}
    />
  )
}
