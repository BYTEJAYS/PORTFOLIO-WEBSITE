/**
 * AICompanion — doodled isometric retro desk scene
 * Toon shading + Outlines for a hand-drawn look.
 */

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Outlines } from '@react-three/drei'
import * as THREE from 'three'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* ── 3-band toon gradient ───────────────────────────────────── */
function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array(3 * 4)
    data.set([32,  34,  44,  255], 0)   // shadow
    data.set([148, 152, 168, 255], 4)   // mid
    data.set([252, 252, 255, 255], 8)   // highlight
    const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat)
    tex.minFilter = tex.magFilter = THREE.NearestFilter
    tex.needsUpdate = true
    return tex
  }, [])
}

/* ── Palette ────────────────────────────────────────────────── */
const C = {
  cream:  '#edeae0',
  orange: '#e07828',
  teal:   '#7ed8d0',
  dark:   '#12181e',
  green:  '#38941e',
  white:  '#f8f5ed',
  yellow: '#f0c830',
  pink:   '#f06070',
  soil:   '#2a1408',
  gray:   '#d0ccc4',
}
const INK   = '#0d1117'
const OL    = { thickness: 0.020, color: INK } as const   // major outlines
const OL_SM = { thickness: 0.011, color: INK } as const   // fine details

/* ── Toon material shorthand ────────────────────────────────── */
function TM({ c, gm, em, ei = 0, side }: {
  c: string; gm: THREE.DataTexture
  em?: string; ei?: number; side?: THREE.Side
}) {
  return (
    <meshToonMaterial
      color={c}
      gradientMap={gm}
      emissive={em ? new THREE.Color(em) : undefined}
      emissiveIntensity={ei}
      side={side}
    />
  )
}

/* ── Wire tube ──────────────────────────────────────────────── */
function Wire({ pts, gm }: { pts: [number,number,number][], gm: THREE.DataTexture }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x,y,z]) => new THREE.Vector3(x,y,z)))
    return new THREE.TubeGeometry(curve, 32, 0.009, 5, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <mesh geometry={geo}><TM c={C.cream} gm={gm} /><Outlines {...OL_SM} /></mesh>
}

/* ══════════════════════════════════════════════════════════════
   KEYBOARD  — full 5-row layout with proper keycaps
══════════════════════════════════════════════════════════════ */
function Keyboard({ gm }: { gm: THREE.DataTexture }) {
  /* Row z-positions (front of keyboard = positive Z toward camera) */
  const Z = { fn: -0.145, num: -0.096, qwe: -0.047, asd: 0.002, zxc: 0.051, spc: 0.098 }
  const KY = 0.036     // key top Y (above keyboard base top at 0.026)
  const KH = 0.020     // key body height
  const KD = 0.038     // key depth
  const P  = 0.046     // key pitch

  /* Orange accent positions per row */
  const accentFn  = new Set([0, 4, 8, 11])
  const accentNum = new Set([0, 12])

  return (
    <group position={[-0.04, 0.020, 0.40]} rotation={[0, 0.05, 0]}>

      {/* ── Base body ── */}
      <RoundedBox args={[0.88, 0.052, 0.34]} radius={0.018} smoothness={4}>
        <TM c={C.cream} gm={gm} />
        <Outlines {...OL} />
      </RoundedBox>

      {/* ── Top deck (slightly darker inset surface) ── */}
      <mesh position={[0, 0.027, 0]}>
        <boxGeometry args={[0.84, 0.002, 0.30]} />
        <TM c={C.gray} gm={gm} />
      </mesh>

      {/* ── Row 1 – Function keys (12 small) ── */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`fn${i}`} position={[-0.252 + i * P, KY, Z.fn]}>
          <boxGeometry args={[0.038, KH - 0.002, 0.033]} />
          <TM c={accentFn.has(i) ? C.orange : C.cream} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}

      {/* ── Row 2 – Number row (13 keys) ── */}
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={`n${i}`} position={[-0.276 + i * P, KY, Z.num]}>
          <boxGeometry args={[0.040, KH, KD]} />
          <TM c={accentNum.has(i) ? C.orange : C.white} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}
      {/* Backspace (wide, orange) */}
      <mesh position={[0.326, KY, Z.num]}>
        <boxGeometry args={[0.072, KH, KD]} />
        <TM c={C.orange} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>

      {/* ── Row 3 – QWERTY (14 keys) ── */}
      {/* Tab key */}
      <mesh position={[-0.368, KY, Z.qwe]}>
        <boxGeometry args={[0.056, KH, KD]} />
        <TM c={C.cream} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>
      {Array.from({ length: 13 }, (_, i) => (
        <mesh key={`q${i}`} position={[-0.302 + i * P, KY, Z.qwe]}>
          <boxGeometry args={[0.040, KH, KD]} />
          <TM c={C.white} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}

      {/* ── Row 4 – ASDF (11 keys + CapsLock + Enter tall) ── */}
      {/* Caps Lock */}
      <mesh position={[-0.362, KY, Z.asd]}>
        <boxGeometry args={[0.066, KH, KD]} />
        <TM c={C.cream} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={`a${i}`} position={[-0.282 + i * P, KY, Z.asd]}>
          <boxGeometry args={[0.040, KH, KD]} />
          <TM c={C.white} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}
      {/* Enter (tall — spans across rows 4 & 3 visually) */}
      <mesh position={[0.344, KY, Z.asd]}>
        <boxGeometry args={[0.068, KH + 0.004, KD]} />
        <TM c={C.orange} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>

      {/* ── Row 5 – ZXCV (10 keys + wide Shift both sides) ── */}
      {/* Left Shift */}
      <mesh position={[-0.352, KY, Z.zxc]}>
        <boxGeometry args={[0.084, KH, KD]} />
        <TM c={C.orange} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={`z${i}`} position={[-0.270 + i * P, KY, Z.zxc]}>
          <boxGeometry args={[0.040, KH, KD]} />
          <TM c={C.white} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}
      {/* Right Shift */}
      <mesh position={[0.338, KY, Z.zxc]}>
        <boxGeometry args={[0.090, KH, KD]} />
        <TM c={C.orange} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>

      {/* ── Row 6 – Space row ── */}
      {/* Left modifiers: Ctrl, Alt, Cmd */}
      {[-0.368, -0.322, -0.276].map((x, i) => (
        <mesh key={`ml${i}`} position={[x, KY, Z.spc]}>
          <boxGeometry args={i === 0 ? [0.050, KH, KD] : [0.042, KH, KD]} />
          <TM c={C.cream} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}
      {/* Space bar */}
      <mesh position={[0, KY, Z.spc]}>
        <boxGeometry args={[0.318, KH + 0.002, KD]} />
        <TM c={C.orange} gm={gm} />
        <Outlines {...OL} />
      </mesh>
      {/* Right modifiers: Cmd, Alt */}
      {[0.276, 0.322].map((x, i) => (
        <mesh key={`mr${i}`} position={[x, KY, Z.spc]}>
          <boxGeometry args={[0.042, KH, KD]} />
          <TM c={C.cream} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}
      {/* Arrow keys — inverted-T cluster */}
      {/* Up arrow (one row back) */}
      <mesh position={[0.388, KY, Z.zxc]}>
        <boxGeometry args={[0.038, KH, 0.036]} />
        <TM c={C.teal} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>
      {/* Left / Down / Right (space row) */}
      {[0.342, 0.388, 0.434].map((x, i) => (
        <mesh key={`arr${i}`} position={[x, KY, Z.spc]}>
          <boxGeometry args={[0.038, KH, 0.036]} />
          <TM c={C.teal} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      ))}

    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   MOUSE  — ergonomic two-button design
══════════════════════════════════════════════════════════════ */
function Mouse({ gm }: { gm: THREE.DataTexture }) {
  return (
    <group position={[0.66, 0, 0.26]}>

      {/* Flat base platform */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.052, 0.060, 0.010, 22]} />
        <TM c={C.gray} gm={gm} />
        <Outlines {...OL} />
      </mesh>

      {/* Body — back hump (wide ellipsoid dome) */}
      <mesh position={[0, 0.042, -0.014]} scale={[1.05, 0.88, 1.30]}>
        <sphereGeometry args={[0.055, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        <TM c={C.cream} gm={gm} />
        <Outlines {...OL} />
      </mesh>

      {/* Left button (top-left panel) */}
      <mesh position={[-0.026, 0.064, 0.018]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.044, 0.010, 0.082]} />
        <TM c={C.white} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>

      {/* Right button */}
      <mesh position={[0.026, 0.064, 0.018]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.044, 0.010, 0.082]} />
        <TM c={C.cream} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>

      {/* Center seam / ridge between buttons */}
      <mesh position={[0, 0.066, 0.016]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.006, 0.013, 0.086]} />
        <TM c={C.dark} gm={gm} />
      </mesh>

      {/* Scroll wheel */}
      <mesh position={[0, 0.075, 0.028]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.030, 12]} />
        <TM c={C.dark} gm={gm} />
        <Outlines {...OL_SM} />
      </mesh>
      {/* Scroll wheel ridges (5 evenly spaced rings) */}
      {[-0.010, -0.005, 0, 0.005, 0.010].map((offset, i) => (
        <mesh key={i} position={[offset, 0.075, 0.028]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.013, 0.002, 4, 12]} />
          <TM c={C.gray} gm={gm} />
        </mesh>
      ))}

      {/* DPI indicator LED */}
      <mesh position={[0, 0.014, 0.040]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshToonMaterial color="#50ffaa" gradientMap={gm} emissive={new THREE.Color('#20ff80')} emissiveIntensity={2.0} />
      </mesh>

    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   FULL DESK SCENE
══════════════════════════════════════════════════════════════ */
function DeskScene() {
  const setupRef   = useRef<THREE.Group>(null)
  const monitorGrp = useRef<THREE.Group>(null)
  const leftBlink  = useRef<THREE.Group>(null)
  const rightBlink = useRef<THREE.Group>(null)

  const mx = useRef(0), my = useRef(0)
  const eyeY      = useRef(1)
  const nextBlink = useRef(2.5 + Math.random() * 3)

  const { pointer, camera } = useThree()
  camera.lookAt(0, 0.30, 0)

  const gm = useToonGradient()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    mx.current = lerp(mx.current, -pointer.y * 0.14, 0.055)
    my.current = lerp(my.current,  pointer.x * 0.22, 0.055)
    if (monitorGrp.current) {
      monitorGrp.current.rotation.x = mx.current
      monitorGrp.current.rotation.y = my.current
    }
    if (setupRef.current) setupRef.current.position.y = Math.sin(t * 0.40) * 0.022

    if (t > nextBlink.current) {
      const p = (t - nextBlink.current) * 10
      if (p < 1)      eyeY.current = Math.max(0.06, 1 - p)
      else if (p < 2) eyeY.current = Math.min(1.0, p - 1)
      else            eyeY.current = 1
      if (p > 2.6) nextBlink.current = t + 2.5 + Math.random() * 5
    }
    if (leftBlink.current)  leftBlink.current.scale.y  = eyeY.current
    if (rightBlink.current) rightBlink.current.scale.y = eyeY.current
  })

  const TZ = -0.08

  return (
    <group ref={setupRef}>


      {/* ══════  TOWER  ══════ */}
      <group position={[0, 0.13, TZ]}>
        {/* Main case */}
        <RoundedBox args={[0.96, 0.28, 0.74]} radius={0.044} smoothness={4}>
          <TM c={C.cream} gm={gm} />
          <Outlines {...OL} />
        </RoundedBox>
        {/* Orange top strip */}
        <mesh position={[0, 0.062, 0.372]}>
          <boxGeometry args={[0.54, 0.022, 0.009]} />
          <TM c={C.orange} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        {/* Floppy drive recess */}
        <mesh position={[0.02, 0.006, 0.372]}>
          <boxGeometry args={[0.32, 0.015, 0.009]} />
          <TM c="#d0cbc2" gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        {/* Vent ribs */}
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[0.36, 0.060 - i * 0.036, 0.322]}>
            <boxGeometry args={[0.022, 0.010, 0.038]} />
            <TM c={C.orange} gm={gm} />
          </mesh>
        ))}
        {/* CD drive slot */}
        <mesh position={[0, -0.040, 0.372]}>
          <boxGeometry args={[0.26, 0.010, 0.008]} />
          <TM c={C.gray} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        {/* Power button */}
        <mesh position={[-0.34, 0.062, 0.372]}>
          <cylinderGeometry args={[0.014, 0.014, 0.010, 12]} />
          <TM c={C.orange} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        {/* Power LED */}
        <mesh position={[-0.26, 0.062, 0.372]}>
          <sphereGeometry args={[0.010, 8, 8]} />
          <meshToonMaterial color="#40ff80" gradientMap={gm} emissive={new THREE.Color('#40ff80')} emissiveIntensity={2.2} />
          <Outlines {...OL_SM} />
        </mesh>
        {/* HDD LED */}
        <mesh position={[-0.22, 0.062, 0.372]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshToonMaterial color="#ff6040" gradientMap={gm} emissive={new THREE.Color('#ff4020')} emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* ══════  MONITOR STAND  ══════ */}
      <mesh position={[0, 0.310, TZ]}>
        <cylinderGeometry args={[0.080, 0.100, 0.082, 28]} />
        <TM c="#d4d0c8" gm={gm} />
        <Outlines {...OL} />
      </mesh>
      {/* Stand base disc */}
      <mesh position={[0, 0.274, TZ]}>
        <cylinderGeometry args={[0.140, 0.150, 0.010, 28]} />
        <TM c="#c8c4bc" gm={gm} />
        <Outlines {...OL} />
      </mesh>

      {/* ══════  MONITOR  ══════ */}
      <group ref={monitorGrp} position={[0, 0.72, TZ - 0.02]}>
        {/* Teal bezel */}
        <RoundedBox args={[0.90, 0.76, 0.10]} radius={0.084} smoothness={5}>
          <meshToonMaterial color={C.teal} gradientMap={gm} emissive={new THREE.Color('#1a8880')} emissiveIntensity={0.22} />
          <Outlines {...OL} />
        </RoundedBox>
        {/* Inner bezel ring */}
        <mesh position={[0, 0.01, 0.051]}>
          <planeGeometry args={[0.72, 0.60]} />
          <TM c="#080c0a" gm={gm} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.01, 0.054]}>
          <planeGeometry args={[0.66, 0.54]} />
          <meshToonMaterial color="#060f0a" gradientMap={gm} emissive={new THREE.Color('#081c10')} emissiveIntensity={0.60} />
          <Outlines {...OL_SM} />
        </mesh>
        {/* Screen scanline effect (3 subtle horizontal bands) */}
        {[-0.12, 0, 0.12].map((y, i) => (
          <mesh key={i} position={[0, y, 0.055]}>
            <planeGeometry args={[0.64, 0.002]} />
            <meshBasicMaterial color="#20ff60" transparent opacity={0.05} />
          </mesh>
        ))}
        {/* Left eye */}
        <group ref={leftBlink} position={[-0.120, 0.048, 0.060]}>
          <mesh>
            <capsuleGeometry args={[0.046, 0.165, 8, 16]} />
            <meshToonMaterial color="#50ffaa" gradientMap={gm} emissive={new THREE.Color('#20ff80')} emissiveIntensity={3.5} />
            <Outlines {...OL_SM} />
          </mesh>
          {/* Pupil highlight */}
          <mesh position={[0.014, 0.04, 0.047]}>
            <sphereGeometry args={[0.010, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>
        {/* Right eye */}
        <group ref={rightBlink} position={[0.120, 0.048, 0.060]}>
          <mesh>
            <capsuleGeometry args={[0.046, 0.165, 8, 16]} />
            <meshToonMaterial color="#50ffaa" gradientMap={gm} emissive={new THREE.Color('#20ff80')} emissiveIntensity={3.5} />
            <Outlines {...OL_SM} />
          </mesh>
          <mesh position={[0.014, 0.04, 0.047]}>
            <sphereGeometry args={[0.010, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>
        {/* Smile */}
        <mesh position={[0, -0.106, 0.060]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.066, 0.016, 8, 24, Math.PI * 0.78]} />
          <meshToonMaterial color="#20ff80" gradientMap={gm} emissive={new THREE.Color('#20ff80')} emissiveIntensity={2.5} />
        </mesh>
        {/* Screen glow */}
        <pointLight color="#20ff80" intensity={2.0} position={[0, 0.01, 0.32]} distance={1.6} decay={2} />
        {/* Bezel power dot */}
        <mesh position={[0, -0.340, 0.052]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshToonMaterial color="#40ff80" gradientMap={gm} emissive={new THREE.Color('#40ff80')} emissiveIntensity={1.8} />
        </mesh>
      </group>

      {/* Monitor cable */}
      <Wire pts={[[0, 0.40, TZ - 0.07], [0, 0.24, TZ - 0.22], [0, 0.14, TZ - 0.32]]} gm={gm} />

      {/* ══════  KEYBOARD  ══════ */}
      <Keyboard gm={gm} />

      {/* Keyboard cable */}
      <Wire pts={[[0.14, 0.025, 0.28], [0.18, 0.025, 0.15], [0.12, 0.06, 0.02], [0.05, 0.11, TZ + 0.24]]} gm={gm} />

      {/* ══════  MOUSE  ══════ */}
      <Mouse gm={gm} />

      {/* Mouse cable */}
      <Wire pts={[[0.66, 0.018, 0.18], [0.54, 0.018, 0.08], [0.28, 0.04, -0.02], [0.07, 0.11, TZ + 0.24]]} gm={gm} />

      {/* ══════  DESK LAMP  ══════ */}
      <group position={[-0.88, 0, -0.44]}>
        <mesh position={[0, 0.026, 0]}>
          <cylinderGeometry args={[0.070, 0.094, 0.052, 28]} />
          <TM c={C.orange} gm={gm} />
          <Outlines {...OL} />
        </mesh>
        <mesh position={[0, 0.320, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.534, 8]} />
          <TM c={C.dark} gm={gm} />
          <Outlines {...OL} />
        </mesh>
        <mesh position={[0, 0.590, 0]}>
          <sphereGeometry args={[0.020, 12, 12]} />
          <TM c={C.dark} gm={gm} />
        </mesh>
        <mesh position={[0.132, 0.590, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.272, 8]} />
          <TM c={C.dark} gm={gm} />
          <Outlines {...OL} />
        </mesh>
        <mesh position={[0.268, 0.590, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <TM c={C.dark} gm={gm} />
        </mesh>
        <mesh position={[0.268, 0.494, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.138, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshToonMaterial color={C.orange} gradientMap={gm} side={THREE.DoubleSide} />
          <Outlines {...OL} />
        </mesh>
        <pointLight color="#ffd090" intensity={5.0} position={[0.268, 0.40, 0]} distance={3.2} decay={2} />
      </group>

      {/* ══════  PLANT  ══════ */}
      <group position={[-0.30, 0, -0.32]}>
        <mesh>
          <cylinderGeometry args={[0.054, 0.044, 0.090, 22]} />
          <TM c="#f0ece2" gm={gm} />
          <Outlines {...OL} />
        </mesh>
        <mesh position={[0, 0.044, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 0.006, 22]} />
          <TM c={C.soil} gm={gm} />
        </mesh>
        {[0, 1, 2, 3, 4].map(i => {
          const a = (i / 5) * Math.PI * 2
          const r = 0.030 + (i % 2) * 0.018
          return (
            <mesh key={i}
              position={[Math.sin(a)*r, 0.118 + (i%3)*0.026, Math.cos(a)*r]}
              rotation={[0.28+(i%2)*0.14, a, 0.20]} scale={[0.76, 1.30, 0.52]}
            >
              <sphereGeometry args={[0.062, 14, 10]} />
              <TM c={C.green} gm={gm} />
              <Outlines {...OL} />
            </mesh>
          )
        })}
      </group>

      {/* ══════  BOOKS  ══════ */}
      <group position={[-0.84, 0, 0.16]} rotation={[0, 0.12, 0]}>
        <RoundedBox args={[0.250, 0.046, 0.308]} radius={0.008} smoothness={3} position={[0, 0.023, 0]}>
          <TM c={C.orange} gm={gm} />
          <Outlines {...OL} />
        </RoundedBox>
        <mesh position={[0.123, 0.023, 0]}>
          <boxGeometry args={[0.008, 0.042, 0.300]} />
          <TM c="#f8f4ec" gm={gm} />
        </mesh>
        <RoundedBox args={[0.230, 0.042, 0.286]} radius={0.008} smoothness={3} position={[0.006, 0.067, 0]}>
          <TM c={C.dark} gm={gm} />
          <Outlines {...OL} />
        </RoundedBox>
        <mesh position={[-0.096, 0.088, 0]}>
          <boxGeometry args={[0.032, 0.001, 0.282]} />
          <TM c={C.teal} gm={gm} />
        </mesh>
        <mesh position={[0.120, 0.067, 0]}>
          <boxGeometry args={[0.008, 0.038, 0.278]} />
          <TM c="#f8f4ec" gm={gm} />
        </mesh>
      </group>

      {/* ══════  NOTEPAD  ══════ */}
      <group position={[-0.32, 0.006, 0.58]} rotation={[0, 0.28, 0]}>
        <RoundedBox args={[0.240, 0.014, 0.305]} radius={0.008} smoothness={3}>
          <TM c="#f8f5ef" gm={gm} />
          <Outlines {...OL} />
        </RoundedBox>
        {[0,1,2,3,4].map(i => (
          <mesh key={i} position={[0.010, 0.009, -0.104 + i*0.044]}>
            <boxGeometry args={[0.200, 0.002, 0.0015]} />
            <TM c="#c8d8e8" gm={gm} />
          </mesh>
        ))}
        <mesh position={[-0.108, 0.010, 0]}>
          <boxGeometry args={[0.014, 0.009, 0.288]} />
          <TM c={C.orange} gm={gm} />
        </mesh>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[-0.108, 0.013, -0.130 + i*0.029]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.010, 0.004, 5, 12]} />
            <TM c={C.orange} gm={gm} />
            <Outlines {...OL_SM} />
          </mesh>
        ))}
        {/* Pencil */}
        <group position={[0.04, 0.016, 0.06]} rotation={[0, 0.42, 0]}>
          <mesh>
            <cylinderGeometry args={[0.007, 0.007, 0.226, 6]} />
            <TM c={C.yellow} gm={gm} />
            <Outlines {...OL_SM} />
          </mesh>
          <mesh position={[0, -0.121, 0]}>
            <coneGeometry args={[0.007, 0.024, 6]} />
            <TM c={C.soil} gm={gm} />
            <Outlines {...OL_SM} />
          </mesh>
          <mesh position={[0, 0.121, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.018, 6]} />
            <TM c={C.pink} gm={gm} />
          </mesh>
        </group>
        {/* Eraser */}
        <mesh position={[-0.04, 0.015, 0.108]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.036, 0.015, 0.022]} />
          <TM c={C.pink} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      </group>

      {/* ══════  COFFEE CUP  ══════ */}
      <group position={[0.88, 0, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.046, 0.038, 0.150, 24]} />
          <TM c="#f0ece2" gm={gm} />
          <Outlines {...OL} />
        </mesh>
        <mesh position={[0, 0.082, 0]}>
          <cylinderGeometry args={[0.048, 0.046, 0.028, 24]} />
          <TM c={C.orange} gm={gm} />
          <Outlines {...OL} />
        </mesh>
        <mesh position={[0, 0.098, 0]}>
          <sphereGeometry args={[0.048, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <TM c={C.orange} gm={gm} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.060, 0.040, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.030, 0.008, 6, 14, Math.PI]} />
          <TM c="#f0ece2" gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        <mesh position={[0, -0.022, 0]}>
          <cylinderGeometry args={[0.048, 0.043, 0.060, 24]} />
          <TM c="#d8d0c4" gm={gm} />
          <Outlines {...OL} />
        </mesh>
      </group>

      {/* ══════  MINI CACTUS (on tower)  ══════ */}
      <group position={[0.30, 0.280, TZ + 0.10]}>
        <mesh>
          <cylinderGeometry args={[0.028, 0.022, 0.050, 18]} />
          <TM c={C.orange} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        <mesh position={[0, 0.026, 0]}>
          <cylinderGeometry args={[0.027, 0.027, 0.005, 18]} />
          <TM c={C.soil} gm={gm} />
        </mesh>
        <mesh position={[0, 0.072, 0]}>
          <cylinderGeometry args={[0.018, 0.017, 0.086, 8]} />
          <TM c={C.green} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
        <mesh position={[0, 0.120, 0]}>
          <sphereGeometry args={[0.020, 10, 10]} />
          <TM c={C.green} gm={gm} />
        </mesh>
        <mesh position={[0, 0.134, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <TM c={C.pink} gm={gm} />
          <Outlines {...OL_SM} />
        </mesh>
      </group>

    </group>
  )
}

/* ── Lights ─────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <ambientLight color="#ffffff" intensity={4.0} />
      <pointLight color="#ffe8cc" intensity={6.5} position={[2.5, 2.5, 2.5]} distance={8} decay={2} />
      <pointLight color="#b0c8e8" intensity={3.0} position={[-2.5, 2.0, -1.0]} distance={7} decay={2} />
      <pointLight color="#30d0c0" intensity={1.8} position={[0, 1.0, 0.8]} distance={2.5} decay={2} />
      <pointLight color="#d8e8f8" intensity={1.6} position={[0.5, 1.0, 3.0]} distance={6} decay={2} />
      <DeskScene />
    </>
  )
}

/* ── Export ─────────────────────────────────────────────────── */
export default function AICompanion() {
  return (
    <Canvas
      camera={{ position: [2.35, 1.85, 2.35], fov: 32 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
      }}
      dpr={[1, 2]}
      style={{ width: '100%', aspectRatio: '4 / 3' }}
    >
      <Scene />
    </Canvas>
  )
}
