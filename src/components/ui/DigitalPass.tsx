import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────
   Canvas texture  (560 × 780 portrait)
   White glossy card — premium futuristic ID badge
───────────────────────────────────────────────────────── */
function buildCardTexture(): THREE.CanvasTexture {
  const W = 560, H = 780
  const cv  = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')!

  /* ── Card base: clean white ── */
  ctx.fillStyle = '#f4f7ff'
  ctx.fillRect(0, 0, W, H)

  /* ── Subtle radial glow center — gives "lit from within" feel ── */
  const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.75)
  glow.addColorStop(0,   'rgba(200,215,255,0.45)')
  glow.addColorStop(0.6, 'rgba(235,242,255,0.18)')
  glow.addColorStop(1,   'rgba(240,245,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  /* ── Top header bar ── */
  const header = ctx.createLinearGradient(0, 0, 0, 108)
  header.addColorStop(0, '#0e1628')
  header.addColorStop(1, '#162040')
  ctx.fillStyle = header
  roundRect(ctx, 0, 0, W, 108, { tl: 22, tr: 22, bl: 0, br: 0 })
  ctx.fill()

  /* "DIGITAL PASS" label */
  ctx.font = 'bold 30px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '0.12em'
  ctx.fillText('DIGITAL PASS', W / 2, 54)

  /* Subtle subtitle under title */
  ctx.font = '11px Inter, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(130,160,220,0.65)'
  ctx.letterSpacing = '0.3em'
  ctx.fillText('IDENTITY · ACCESS · 2025', W / 2, 83)
  ctx.letterSpacing = '0'

  /* ── Rainbow spectrum strip ── */
  const spectrum = [
    '#FF3B30','#FF6B35','#FFD60A','#34C759',
    '#007AFF','#5E5CE6','#BF5AF2',
  ]
  const sw = W / spectrum.length
  spectrum.forEach((c, i) => {
    ctx.fillStyle = c
    ctx.fillRect(i * sw, 108, sw + 1, 9)
  })

  /* ── Profile avatar circle ── */
  const ax = W / 2, ay = 268, ar = 88

  /* Outer glow ring */
  const haloGrad = ctx.createRadialGradient(ax, ay, ar - 4, ax, ay, ar + 22)
  haloGrad.addColorStop(0,   'rgba(100,140,255,0.22)')
  haloGrad.addColorStop(0.5, 'rgba(100,140,255,0.06)')
  haloGrad.addColorStop(1,   'rgba(100,140,255,0)')
  ctx.fillStyle = haloGrad
  ctx.beginPath(); ctx.arc(ax, ay, ar + 22, 0, Math.PI * 2); ctx.fill()

  /* Avatar fill — deep space gradient */
  ctx.save()
  ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.clip()
  const avGrad = ctx.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar)
  avGrad.addColorStop(0,   '#1e3a7e')
  avGrad.addColorStop(0.5, '#1a2f6a')
  avGrad.addColorStop(1,   '#0e1e4a')
  ctx.fillStyle = avGrad
  ctx.fillRect(ax - ar, ay - ar, ar * 2, ar * 2)

  /* Subtle inner vignette */
  const innerVig = ctx.createRadialGradient(ax, ay, ar * 0.3, ax, ay, ar)
  innerVig.addColorStop(0,   'rgba(255,255,255,0)')
  innerVig.addColorStop(1,   'rgba(0,0,30,0.35)')
  ctx.fillStyle = innerVig
  ctx.fillRect(ax - ar, ay - ar, ar * 2, ar * 2)

  /* BJ monogram */
  ctx.font = 'bold 52px Inter, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('BJ', ax, ay + 2)
  ctx.restore()

  /* Circle border — soft white */
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.stroke()

  /* Second ring — faint blue */
  ctx.strokeStyle = 'rgba(100,140,255,0.25)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(ax, ay, ar + 7, 0, Math.PI * 2); ctx.stroke()

  /* ── Name ── */
  ctx.font = 'bold 34px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#0d1422'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('Jay Pandey', W / 2, 384)

  /* ── Title ── */
  ctx.font = '15px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#4a6090'
  ctx.fillText('AI Engineer', W / 2, 427)

  /* ── Gold handle ── */
  ctx.font = '12px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#c09030'
  ctx.letterSpacing = '0.08em'
  ctx.fillText('@bytejay', W / 2, 452)
  ctx.letterSpacing = '0'

  /* ── Thin divider ── */
  const div1 = ctx.createLinearGradient(60, 0, W - 60, 0)
  div1.addColorStop(0,   'rgba(130,160,220,0)')
  div1.addColorStop(0.3, 'rgba(130,160,220,0.35)')
  div1.addColorStop(0.7, 'rgba(130,160,220,0.35)')
  div1.addColorStop(1,   'rgba(130,160,220,0)')
  ctx.strokeStyle = div1
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(60, 480); ctx.lineTo(W - 60, 480); ctx.stroke()

  /* ── Bio ── */
  ctx.font = '13px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#6080a8'
  ctx.textAlign = 'center'
  ctx.fillText('Building cinematic AI systems', W / 2, 500)
  ctx.fillText('and futuristic experiences.', W / 2, 520)

  /* ── Second divider ── */
  ctx.strokeStyle = div1
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(60, 547); ctx.lineTo(W - 60, 547); ctx.stroke()

  /* ── Contact links ── */
  const linkColor = '#2a4080'
  ctx.font = '12px Inter, system-ui, sans-serif'
  ctx.fillStyle = linkColor
  ctx.fillText('github.com/bytejay', W / 2, 566)
  ctx.fillText('codes404z@gmail.com', W / 2, 586)

  /* ── Status pill ── */
  ctx.fillStyle = 'rgba(52,199,89,0.1)'
  roundRect(ctx, W / 2 - 72, 613, 144, 28, 14)
  ctx.fill()
  ctx.strokeStyle = 'rgba(52,199,89,0.4)'
  ctx.lineWidth = 1
  roundRect(ctx, W / 2 - 72, 613, 144, 28, 14)
  ctx.stroke()

  /* Green dot */
  ctx.fillStyle = '#34c759'
  ctx.beginPath(); ctx.arc(W / 2 - 46, 627, 5, 0, Math.PI * 2); ctx.fill()

  ctx.font = '11px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#1a8030'
  ctx.letterSpacing = '0.12em'
  ctx.fillText('STATUS • ONLINE', W / 2 + 8, 627)
  ctx.letterSpacing = '0'

  /* ── Bottom barcode area ── */
  const bStart = 660
  for (let b = 0; b < 46; b++) {
    const bw = (b % 4 === 0) ? 3.5 : (b % 2 === 0 ? 2 : 1.2)
    ctx.fillStyle = `rgba(60,90,150,${0.08 + (b % 7) * 0.025})`
    ctx.fillRect(60 + b * 9.6, bStart, bw, 22)
  }

  ctx.font = '9px Inter, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(100,130,180,0.4)'
  ctx.letterSpacing = '0.15em'
  ctx.fillText('BJ-2025-∞-AI-ENG', W / 2, 698)
  ctx.letterSpacing = '0'

  /* ── Corner bracket marks ── */
  const cm = (ox: number, oy: number, sx: number, sy: number) => {
    ctx.strokeStyle = 'rgba(100,140,220,0.22)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(ox, oy + sy * 20)
    ctx.lineTo(ox, oy)
    ctx.lineTo(ox + sx * 20, oy)
    ctx.stroke()
  }
  cm(24, 130, 1, 1); cm(W - 24, 130, -1, 1)
  cm(24, H - 20, 1, -1); cm(W - 24, H - 20, -1, -1)

  return new THREE.CanvasTexture(cv)
}

/* ── helper ── */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number | { tl: number; tr: number; bl: number; br: number },
) {
  const rad = typeof r === 'number'
    ? { tl: r, tr: r, bl: r, br: r }
    : r
  ctx.beginPath()
  ctx.moveTo(x + rad.tl, y)
  ctx.lineTo(x + w - rad.tr, y)
  ctx.arcTo(x + w, y, x + w, y + rad.tr, rad.tr)
  ctx.lineTo(x + w, y + h - rad.br)
  ctx.arcTo(x + w, y + h, x + w - rad.br, y + h, rad.br)
  ctx.lineTo(x + rad.bl, y + h)
  ctx.arcTo(x, y + h, x, y + h - rad.bl, rad.bl)
  ctx.lineTo(x, y + rad.tl)
  ctx.arcTo(x, y, x + rad.tl, y, rad.tl)
  ctx.closePath()
}

/* ─────────────────────────────────────────────────────────
   Holographic shimmer shader  (very subtle on white)
───────────────────────────────────────────────────────── */
const holoVert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const holoFrag = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;

  vec3 hue2rgb(float h) {
    h = fract(h);
    float r = abs(h * 6.0 - 3.0) - 1.0;
    float g = 2.0 - abs(h * 6.0 - 2.0);
    float b = 2.0 - abs(h * 6.0 - 4.0);
    return clamp(vec3(r, g, b), 0.0, 1.0);
  }

  void main() {
    /* Slow diagonal rainbow sweep */
    float band  = fract((vUv.x - vUv.y * 0.6) * 2.8 + uTime * 0.10);
    vec3  color = hue2rgb(band);

    /* Vertical scan lines — very fine */
    float scan = sin(vUv.y * 180.0 + uTime * 0.8) * 0.5 + 0.5;
    scan = mix(0.7, 1.0, scan);

    /* Soft centre bloom */
    vec2 uvc = vUv - 0.5;
    float bloom = 1.0 - smoothstep(0.15, 0.5, length(uvc));

    /* Keep it whisper-thin so white card stays dominant */
    float alpha = 0.038 * scan * bloom;
    gl_FragColor = vec4(color, alpha);
  }
`

/* ── Moving light-streak shader (top gloss reflection) ── */
const streakVert = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const streakFrag = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    /* Diagonal gloss streak that drifts slowly */
    float d    = vUv.x + vUv.y * 0.5;
    float pos  = fract(uTime * 0.12);
    float str  = smoothstep(pos, pos + 0.04, d) * smoothstep(pos + 0.12, pos + 0.04, d);
    str *= (1.0 - vUv.y * 0.6);  /* fade toward bottom */
    gl_FragColor = vec4(1.0, 1.0, 1.0, str * 0.28);
  }
`

/* ─────────────────────────────────────────────────────────
   Card mesh
───────────────────────────────────────────────────────── */
function Card() {
  const meshRef    = useRef<THREE.Mesh>(null)
  const holoRef    = useRef<THREE.Mesh>(null)
  const streakRef  = useRef<THREE.Mesh>(null)
  const groupRef   = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const tiltX  = useRef(0)
  const tiltY  = useRef(0)

  const cardTex = useMemo(() => buildCardTexture(), [])

  const holoMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: holoVert,
    fragmentShader: holoFrag,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
  }), [])

  const streakMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: streakVert,
    fragmentShader: streakFrag,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])

  useEffect(() => () => {
    cardTex.dispose()
    holoMat.dispose()
    streakMat.dispose()
  }, [cardTex, holoMat, streakMat])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    holoMat.uniforms.uTime.value   = t
    streakMat.uniforms.uTime.value = t

    /* Smooth inertial tilt toward pointer */
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, -pointer.y * 0.22, 0.055)
    tiltY.current = THREE.MathUtils.lerp(tiltY.current,  pointer.x * 0.30, 0.055)

    /* Idle float */
    const floatY = Math.sin(t * 0.45) * 0.055
    const floatR = Math.sin(t * 0.28) * 0.008

    if (groupRef.current) {
      groupRef.current.rotation.x = tiltX.current
      groupRef.current.rotation.y = tiltY.current + floatR
      groupRef.current.position.y = floatY
    }
  })

  /* W × H → 1.56 × 2.17 (560/360 scale, portrait) */
  const CW = 1.56, CH = 2.17, CD = 0.045

  return (
    <group ref={groupRef}>

      {/* ── Card body — white glossy ── */}
      <RoundedBox ref={meshRef} args={[CW, CH, CD]} radius={0.07} smoothness={6}>
        <meshPhysicalMaterial
          map={cardTex}
          color={new THREE.Color('#ffffff')}
          roughness={0.04}
          metalness={0.0}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
          iridescence={0.28}
          iridescenceIOR={1.25}
          iridescenceThicknessRange={[60, 220]}
          reflectivity={0.55}
          envMapIntensity={1.6}
        />
      </RoundedBox>

      {/* ── Holographic shimmer ── */}
      <mesh ref={holoRef} position={[0, 0, CD / 2 + 0.001]}>
        <planeGeometry args={[CW, CH]} />
        <primitive object={holoMat} attach="material" />
      </mesh>

      {/* ── Gloss light streak ── */}
      <mesh ref={streakRef} position={[0, 0, CD / 2 + 0.002]}>
        <planeGeometry args={[CW, CH]} />
        <primitive object={streakMat} attach="material" />
      </mesh>

      {/* ── Clip body ── */}
      <mesh position={[0, CH / 2 + 0.04, 0.01]}>
        <boxGeometry args={[0.13, 0.07, 0.08]} />
        <meshPhysicalMaterial
          color="#2a2a35"
          roughness={0.25}
          metalness={0.8}
          clearcoat={1}
        />
      </mesh>

      {/* ── Clip ring ── */}
      <mesh position={[0, CH / 2 + 0.1, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.014, 10, 28]} />
        <meshPhysicalMaterial
          color="#606070"
          roughness={0.15}
          metalness={0.9}
          clearcoat={1}
        />
      </mesh>

      {/* ── Card edge glow plane (rim light simulation) ── */}
      <mesh position={[0, 0, -CD / 2 - 0.001]}>
        <planeGeometry args={[CW + 0.04, CH + 0.04]} />
        <meshBasicMaterial
          color={new THREE.Color('#3060ff')}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────
   Scene
───────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      {/* Ambient — soft warm white fills the card from all directions */}
      <ambientLight color="#c8d8f8" intensity={2.2} />

      {/* Main frontal key light — makes the white card POP */}
      <pointLight color="#ffffff" intensity={6} position={[0, 0.5, 3.5]} distance={8} decay={2} />

      {/* Warm gold rim — top-right */}
      <pointLight color="#ffe0a0" intensity={2.8} position={[3, 2.5, 1.5]} distance={8} decay={2} />

      {/* Cool blue rim — bottom-left */}
      <pointLight color="#5070ff" intensity={2} position={[-2.5, -1.5, 1.5]} distance={8} decay={2} />

      {/* Soft fill from below */}
      <pointLight color="#a0b8ff" intensity={1.2} position={[0, -2.5, 2]} distance={6} decay={2} />

      {/* Particles — restrained so they don't fight the card */}
      <Sparkles
        count={35}
        scale={[4, 5, 2]}
        size={1.2}
        speed={0.18}
        opacity={0.30}
        color="#d4a853"
        noise={0.5}
      />
      <Sparkles
        count={20}
        scale={[3.5, 4.5, 1.5]}
        size={0.9}
        speed={0.13}
        opacity={0.20}
        color="#6090ff"
        noise={0.7}
      />

      <Card />
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────────── */
export default function DigitalPass() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      dpr={[1, 2]}
      style={{ width: '100%', aspectRatio: '3/4' }}
    >
      <Scene />
    </Canvas>
  )
}
