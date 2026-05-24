import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

/* ─── Vertex shader ──────────────────────────────────────────── */
const VERT = /* glsl */`
attribute float aRnd;
attribute float aTip;

uniform float uTime;
uniform vec2  uMouse;
uniform float uDpr;

varying float vTip;
varying float vAlpha;

void main() {
  vec3 pos = position;

  // Multi-frequency organic noise
  float t = uTime * 0.52 + aRnd * 6.2832;
  pos.x += sin(t * 1.31 + position.y * 2.55 + position.z * 1.3) * 0.030;
  pos.y += cos(t * 0.87 + position.x * 1.95 + position.z * 1.8) * 0.025;
  pos.z += sin(t * 1.58 + position.y * 2.10 + position.x * 2.0) * 0.016;

  // Mouse repulsion — compute NDC from base position
  vec4 baseView = modelViewMatrix * vec4(position, 1.0);
  vec4 baseClip = projectionMatrix * baseView;
  vec2 baseNdc  = baseClip.xy / baseClip.w;
  vec2  dir   = baseNdc - uMouse;
  float mDist = length(dir);
  float rr    = 0.32;
  if (mDist < rr && mDist > 0.001) {
    float f = pow(1.0 - mDist / rr, 2.0) * 0.18;
    pos.xy += normalize(dir) * f * (-baseView.z * 0.072);
  }

  vTip   = aTip;
  vAlpha = clamp(0.40 + aTip * 0.38 + position.z * 0.20, 0.08, 1.0);

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float depth = max(-mvPos.z, 0.1);
  gl_PointSize = uDpr * (2.6 + aTip * 2.0) * (5.2 / depth);
}
`

/* ─── Fragment shader ────────────────────────────────────────── */
const FRAG = /* glsl */`
uniform vec3 uColorCore;
uniform vec3 uColorGlow;
uniform vec3 uColorTip;

varying float vTip;
varying float vAlpha;

void main() {
  vec2  uv = gl_PointCoord - 0.5;
  float d  = length(uv);
  if (d > 0.5) discard;

  float core = smoothstep(0.50, 0.07, d);
  float halo = smoothstep(0.50, 0.00, d) * 0.58;

  vec3 coreC = mix(uColorCore, uColorTip,  vTip * 0.65);
  vec3 glowC = mix(uColorGlow, uColorTip,  vTip * 0.40);
  vec3 color = mix(glowC, coreC, core);

  float alpha = (core * 0.88 + halo * 0.30) * vAlpha;
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`

/* ─── Bone data ──────────────────────────────────────────────── */
type Bone = {
  a: [number, number, number]
  b: [number, number, number]
  scatter: number
  n: number
}

const BONES: Bone[] = [
  // Palm — central column
  { a: [0,     -1.62, 0    ], b: [0,     -0.36, 0.02], scatter: 0.20, n: 195 },
  // Palm — lower horizontal bar
  { a: [-0.55, -1.02, 0    ], b: [0.55,  -1.02, 0    ], scatter: 0.12, n:  92 },
  // Palm — mid horizontal bar
  { a: [-0.58, -0.36, 0.03 ], b: [0.58,  -0.36, 0.03 ], scatter: 0.14, n: 105 },
  // Palm — left diagonal
  { a: [-0.55, -1.02, 0    ], b: [-0.58, -0.36, 0.03 ], scatter: 0.12, n:  58 },
  // Palm — right diagonal
  { a: [0.55,  -1.02, 0    ], b: [0.58,  -0.36, 0.03 ], scatter: 0.12, n:  58 },

  // Thumb
  { a: [-0.38, -1.12, 0.05 ], b: [-0.84, -0.60, 0.12 ], scatter: 0.12, n:  68 },
  { a: [-0.84, -0.60, 0.12 ], b: [-1.12, -0.04, 0.18 ], scatter: 0.10, n:  68 },
  { a: [-1.12, -0.04, 0.18 ], b: [-1.32,  0.56, 0.22 ], scatter: 0.09, n:  54 },

  // Index finger
  { a: [-0.52, -0.36, 0.03 ], b: [-0.52,  0.28, 0.08 ], scatter: 0.09, n:  65 },
  { a: [-0.52,  0.28, 0.08 ], b: [-0.52,  0.98, 0.10 ], scatter: 0.08, n:  76 },
  { a: [-0.52,  0.98, 0.10 ], b: [-0.52,  1.58, 0.10 ], scatter: 0.065,n:  64 },

  // Middle finger (tallest)
  { a: [-0.16, -0.36, 0.03 ], b: [-0.16,  0.30, 0.09 ], scatter: 0.09, n:  65 },
  { a: [-0.16,  0.30, 0.09 ], b: [-0.16,  1.06, 0.11 ], scatter: 0.08, n:  82 },
  { a: [-0.16,  1.06, 0.11 ], b: [-0.16,  1.80, 0.11 ], scatter: 0.065,n:  70 },

  // Ring finger
  { a: [0.18,  -0.36, 0.03 ], b: [0.18,   0.26, 0.09 ], scatter: 0.09, n:  65 },
  { a: [0.18,   0.26, 0.09 ], b: [0.18,   0.96, 0.11 ], scatter: 0.08, n:  76 },
  { a: [0.18,   0.96, 0.11 ], b: [0.18,   1.62, 0.10 ], scatter: 0.065,n:  64 },

  // Pinky finger
  { a: [0.50,  -0.42, 0.03 ], b: [0.50,   0.10, 0.08 ], scatter: 0.08, n:  48 },
  { a: [0.50,   0.10, 0.08 ], b: [0.50,   0.68, 0.10 ], scatter: 0.07, n:  55 },
  { a: [0.50,   0.68, 0.10 ], b: [0.50,   1.22, 0.08 ], scatter: 0.06, n:  46 },
]

/* ─── Particle geometry ──────────────────────────────────────── */
function randn(): number {
  const u = Math.max(1 - Math.random(), 1e-6)
  const v = 1 - Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function buildGeo(): THREE.BufferGeometry {
  const pos: number[] = []
  const rnd: number[] = []
  const tip: number[] = []

  // Hand particles — distributed along bones
  for (const bone of BONES) {
    for (let k = 0; k < bone.n; k++) {
      const t  = Math.random()
      const bx = bone.a[0] + (bone.b[0] - bone.a[0]) * t
      const by = bone.a[1] + (bone.b[1] - bone.a[1]) * t
      const bz = bone.a[2] + (bone.b[2] - bone.a[2]) * t
      pos.push(
        bx + randn() * bone.scatter,
        by + randn() * bone.scatter * 0.82,
        bz + randn() * bone.scatter * 0.45,
      )
      rnd.push(Math.random() * Math.PI * 2)
      tip.push(Math.max(0, Math.min(1, (by - 0.5) / 1.35)))
    }
  }

  // Ambient scattered particles
  for (let k = 0; k < 320; k++) {
    pos.push(
      (Math.random() - 0.5) * 5.2,
      (Math.random() - 0.5) * 4.8 + 0.1,
      (Math.random() - 0.5) * 3.0 - 0.9,
    )
    rnd.push(Math.random() * Math.PI * 2)
    tip.push(0)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('aRnd',     new THREE.Float32BufferAttribute(rnd, 1))
  geo.setAttribute('aTip',     new THREE.Float32BufferAttribute(tip, 1))
  return geo
}

/* ─── R3F scene component ────────────────────────────────────── */
function HandScene({ mouse }: { mouse: { current: THREE.Vector2 } }) {
  const groupRef = useRef<THREE.Group>(null)

  const geo = useMemo(() => buildGeo(), [])

  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime:      { value: 0 },
        uMouse:     { value: new THREE.Vector2() },
        uDpr:       { value: Math.min(window.devicePixelRatio, 2) },
        uColorCore: { value: new THREE.Color(0.90, 0.94, 1.00) },
        uColorGlow: { value: new THREE.Color(0.20, 0.44, 0.96) },
        uColorTip:  { value: new THREE.Color(0.42, 0.82, 1.00) },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    return m
  }, [])

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.getElapsedTime()
    mat.uniforms.uMouse.value.lerp(mouse.current, 0.10)
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.26) * 0.10
    groupRef.current.rotation.z = Math.sin(t * 0.17 + 0.9) * 0.033
    groupRef.current.position.y = Math.sin(t * 0.42) * 0.068
  })

  return (
    <group ref={groupRef}>
      <points geometry={geo} material={mat} />
    </group>
  )
}

/* ─── Exported canvas wrapper ────────────────────────────────── */
export default function ParticleHand() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const mouseRef = useRef(new THREE.Vector2(0, 0))

  return (
    <div
      ref={wrapRef}
      style={{ width: '100%', height: '100%' }}
      onMouseMove={(e) => {
        if (!wrapRef.current) return
        const r = wrapRef.current.getBoundingClientRect()
        mouseRef.current.set(
          ((e.clientX - r.left) / r.width)  * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1,
        )
      }}
      onMouseLeave={() => mouseRef.current.set(0, 0)}
    >
      <Canvas
        camera={{ position: [0, 0.18, 4.9], fov: 44, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ background: '#020B18' }}
        onCreated={({ gl }) => gl.setClearColor(0x020B18, 1)}
      >
        <HandScene mouse={mouseRef} />
        <EffectComposer>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.92}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
