import { useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import React from 'react'

const LP  = { repeat: Infinity, ease: 'easeInOut' as const }
const LPL = { repeat: Infinity, ease: 'linear'    as const }

/* ═══════════════════════════════════════════════════════════════
   CHESS MODULE  — floating king above glowing 4×4 board
═══════════════════════════════════════════════════════════════ */
export function ChessIcon({ color }: { color: string }) {
  const TILE = 13
  const GAP  = 2
  const N    = 4
  const boardPx = N * TILE + (N - 1) * GAP   // 58px

  // tiles that pulse with accent colour
  const lit = new Set(['0-1', '1-2', '2-1', '3-0'])

  return (
    <div style={{ width: boardPx, height: boardPx + 32, position: 'relative', userSelect: 'none' }}>

      {/* ── Floating King ── */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.2, ...LP }}
        style={{
          position: 'absolute', top: 0, width: '100%',
          display: 'flex', justifyContent: 'center', zIndex: 2,
        }}
      >
        <svg viewBox="0 0 22 30" width={19} height={25} overflow="visible">
          {/* Cross */}
          <rect x="10"  y="0"   width="2"  height="7.5" rx="1"   fill={color} />
          <rect x="7.5" y="2.5" width="7"  height="2.5" rx="1"   fill={color} />
          {/* Crown */}
          <path d="M3,14 L4.5,9 L7.5,13 L11,7 L14.5,13 L17.5,9 L19,14 Z" fill={color} />
          <rect x="3" y="13"  width="16" height="2.5" rx="1.2" fill={color} />
          {/* Body */}
          <path d="M5.5,15.5 C3.2,19.5 3.2,23.5 4.5,25.5 L17.5,25.5 C18.8,23.5 18.8,19.5 16.5,15.5 Z"
            fill={color} opacity={0.85} />
          {/* Body highlight */}
          <path d="M5.5,15.5 C3.8,18 4,21.5 5.5,23.5 C6.5,21 6,18 5.5,15.5 Z"
            fill="rgba(255,255,255,0.13)" />
          {/* Platform */}
          <rect x="3.5" y="25.5" width="15" height="2.5" rx="1.2" fill={color} />
          {/* Base */}
          <rect x="1.5" y="28"   width="19" height="2.5" rx="1.3" fill={color} opacity={0.72} />
        </svg>

        {/* king drop-shadow glow */}
        <div style={{
          position: 'absolute', bottom: -5, left: '20%', right: '20%',
          height: 8, borderRadius: 4,
          background: `radial-gradient(ellipse, ${color}55 0%, transparent 70%)`,
          filter: 'blur(3px)',
        }} />
      </motion.div>

      {/* ── Board ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: boardPx, height: boardPx,
        display: 'grid',
        gridTemplateColumns: `repeat(${N}, ${TILE}px)`,
        gridTemplateRows:    `repeat(${N}, ${TILE}px)`,
        gap: GAP,
        borderRadius: 5,
        padding: 1,
        background: 'rgba(0,0,0,0.35)',
        boxShadow: `0 0 24px ${color}18, 0 6px 18px rgba(0,0,0,0.4)`,
        overflow: 'hidden',
      }}>
        {Array.from({ length: N * N }, (_, idx) => {
          const row = Math.floor(idx / N)
          const col = idx % N
          const isLight  = (row + col) % 2 === 0
          const isLit    = lit.has(`${row}-${col}`)
          return (
            <motion.div
              key={idx}
              animate={isLit ? { opacity: [0.35, 1, 0.35] } : undefined}
              transition={isLit ? { duration: 1.7, ...LP, delay: ((row * 0.3 + col * 0.15) % 1) } : undefined}
              style={{
                borderRadius: 2,
                background: isLit
                  ? color
                  : isLight
                    ? 'rgba(255,220,140,0.09)'
                    : 'rgba(8,18,42,0.7)',
                boxShadow: isLit ? `0 0 8px ${color}90` : undefined,
              }}
            />
          )
        })}
      </div>

      {/* board ambient glow */}
      <div style={{
        position: 'absolute', bottom: -4, left: '15%', right: '15%',
        height: 10, background: `radial-gradient(ellipse, ${color}22 0%, transparent 70%)`,
        filter: 'blur(5px)',
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   GUITAR MODULE  — acoustic guitar, vibrating strings, sound waves
═══════════════════════════════════════════════════════════════ */
export function GuitarIcon({ color }: { color: string }) {
  const strings = [
    { x: -1.3, a: 0.9, delay: 0    },
    { x:  0,   a: 1.1, delay: 0.08 },
    { x:  1.3, a: 0.9, delay: 0.16 },
  ]

  return (
    <motion.svg
      viewBox="-14 -21 28 49"
      width={42} height={74}
      overflow="visible"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.6, ...LP }}
    >
      {/* Headstock */}
      <rect x="-4.2" y="-21" width="8.4" height="6.5" rx="3" fill={color} opacity={0.82} />
      {/* Tuning pegs */}
      {([-3.4, 0, 3.4] as number[]).map(px => (
        <React.Fragment key={px}>
          <circle cx={px} cy={-19.5} r={1.6} fill={color} opacity={0.62} />
          <circle cx={px} cy={-19.5} r={0.6} fill="rgba(0,0,0,0.4)" />
        </React.Fragment>
      ))}
      {/* Nut */}
      <rect x="-4" y="-14.5" width="8" height="1.2" rx="0.6" fill={color} opacity={0.55} />
      {/* Neck */}
      <rect x="-2.4" y="-15" width="4.8" height="17" rx="2.4" fill={color} opacity={0.78} />
      {/* Frets */}
      {([-10, -6, -2, 2] as number[]).map(y => (
        <line key={y} x1="-2.4" y1={y} x2="2.4" y2={y}
          stroke="rgba(255,255,255,0.18)" strokeWidth={0.5} />
      ))}

      {/* Body */}
      <path d={[
        'M0,2',
        'C9.5,2 13.5,6 13.5,11',
        'C13.5,12.2 11.5,13 8.5,13.5',
        'C11.5,14.8 13.5,17.5 13.5,21',
        'C13.5,25.5 8,27.5 0,27.5',
        'C-8,27.5 -13.5,25.5 -13.5,21',
        'C-13.5,17.5 -11.5,14.8 -8.5,13.5',
        'C-11.5,13 -13.5,12.2 -13.5,11',
        'C-13.5,6 -9.5,2 0,2 Z',
      ].join(' ')}
        fill={color} opacity={0.78}
      />
      {/* Body highlight sheen */}
      <path d="M0,2 C9.5,2 13.5,6 13.5,11 C13.5,12.2 11.5,13 8.5,13.5 C6,12 4,9.5 3,6 C7.5,4.5 9.5,2.5 0,2 Z"
        fill="rgba(255,255,255,0.09)" />

      {/* Sound hole */}
      <circle cx="0" cy="16"  r="4.8" fill="rgba(0,0,0,0.5)" />
      <circle cx="0" cy="16"  r="4.8" fill="none" stroke={color} strokeWidth={0.7}  opacity={0.4} />
      <circle cx="0" cy="16"  r="3.2" fill="none" stroke={color} strokeWidth={0.35} opacity={0.22} />

      {/* Strings — vibration */}
      {strings.map((s, i) => (
        <motion.path
          key={i}
          animate={{
            d: [
              `M ${s.x},-14 C ${s.x},-2 ${s.x},10 ${s.x},26`,
              `M ${s.x},-14 C ${s.x + s.a},-2 ${s.x - s.a},10 ${s.x},26`,
              `M ${s.x},-14 C ${s.x - s.a},-2 ${s.x + s.a},10 ${s.x},26`,
              `M ${s.x},-14 C ${s.x},-2 ${s.x},10 ${s.x},26`,
            ],
          }}
          transition={{ duration: 0.32 + i * 0.06, ...LPL, delay: s.delay, ease: 'easeInOut' }}
          stroke={`rgba(255,255,255,${0.28 + i * 0.07})`}
          strokeWidth={0.6 + i * 0.12}
          fill="none"
        />
      ))}

      {/* Bridge */}
      <rect x="-6" y="24.5" width="12" height="2" rx="1" fill={color} opacity={0.58} />

      {/* Expanding soundwave rings */}
      {([0, 1, 2] as number[]).map(i => (
        <motion.circle
          key={i} cx="0" cy="16" r="4.8"
          fill="none" stroke={color} strokeWidth={0.65}
          animate={{ r: [4.8, 13.5], opacity: [0.55, 0] }}
          transition={{ duration: 1.9, ...LPL, delay: i * 0.63, ease: 'easeOut' }}
        />
      ))}

      {/* Musical pulse glow behind sound hole */}
      <motion.circle
        cx="0" cy="16" r="8"
        fill={color} opacity={0}
        animate={{ opacity: [0, 0.07, 0], r: [6, 14, 6] }}
        transition={{ duration: 1.9, ...LP }}
      />
    </motion.svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RUBIK'S CUBE MODULE  — CSS 3D cube with real facelets, smooth hover speed
═══════════════════════════════════════════════════════════════ */
export function CubeIcon({ color: _ }: { color: string }) {
  const cubeRef  = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const hovRef   = useRef(false)

  useAnimationFrame((__, delta) => {
    angleRef.current += (hovRef.current ? 88 : 40) * delta / 1000
    if (cubeRef.current) {
      cubeRef.current.style.transform =
        `rotateX(-26deg) rotateY(${angleRef.current}deg)`
    }
  })

  const S = 58
  const H = S / 2

  // Standard Rubik's face colours
  const O = '#F97316', R = '#EF4444', G = '#22C55E'
  const B = '#3B82F6', W = '#E8EEF7', Y = '#EAB308'

  // Scrambled patterns — each array = 9 facelets top→bottom, left→right
  const FACES = {
    front:  [O, B, O,  O, O, R,  G, O, O],
    back:   [R, R, W,  R, R, R,  R, Y, R],
    left:   [G, O, G,  G, G, G,  R, G, G],
    right:  [B, B, B,  W, B, B,  B, B, G],
    top:    [W, G, W,  W, W, B,  O, W, W],
    bottom: [Y, Y, Y,  Y, Y, B,  Y, O, Y],
  }

  function FaceGrid({ cells }: { cells: string[] }) {
    return (
      <div style={{
        position: 'absolute', inset: 3,
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gridTemplateRows:    'repeat(3,1fr)',
        gap: '2.5px',
        background: '#0d1016',
      }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            background: c,
            borderRadius: 1.5,
            boxShadow:
              'inset 0 -1.5px 3px rgba(0,0,0,0.4), inset 0 1px 2.5px rgba(255,255,255,0.28)',
          }} />
        ))}
      </div>
    )
  }

  const faceBase: React.CSSProperties = {
    position: 'absolute', width: S, height: S,
    background: '#0d1016',
    border: '2px solid rgba(0,0,0,0.9)',
    borderRadius: 2,
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
  }

  return (
    <div
      onMouseEnter={() => { hovRef.current = true }}
      onMouseLeave={() => { hovRef.current = false }}
      style={{ width: S, height: S, perspective: 190, perspectiveOrigin: '50% 28%', cursor: 'default' }}
    >
      <div
        ref={cubeRef}
        style={{ width: S, height: S, position: 'relative', transformStyle: 'preserve-3d' }}
      >
        <div style={{ ...faceBase, transform: `translateZ(${H}px)` }}>
          <FaceGrid cells={FACES.front} />
        </div>
        <div style={{ ...faceBase, transform: `translateZ(-${H}px) rotateY(180deg)` }}>
          <FaceGrid cells={FACES.back} />
        </div>
        <div style={{ ...faceBase, transform: `rotateY(-90deg) translateZ(${H}px)` }}>
          <FaceGrid cells={FACES.left} />
        </div>
        <div style={{ ...faceBase, transform: `rotateY(90deg) translateZ(${H}px)` }}>
          <FaceGrid cells={FACES.right} />
        </div>
        <div style={{ ...faceBase, transform: `rotateX(90deg) translateZ(${H}px)` }}>
          <FaceGrid cells={FACES.top} />
        </div>
        <div style={{ ...faceBase, transform: `rotateX(-90deg) translateZ(${H}px)` }}>
          <FaceGrid cells={FACES.bottom} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BOOKS MODULE  — tilted stack of 3 books, shimmer spines
═══════════════════════════════════════════════════════════════ */
export function BookIcon({ color }: { color: string }) {
  const stack = [
    { y: 14, w: 46, h: 9,  rot: -3,  shade: 0.65 },
    { y:  5, w: 42, h: 9,  rot:  2,  shade: 0.8  },
    { y: -4, w: 48, h: 10, rot: -1,  shade: 1.0  },
  ]

  return (
    <motion.svg
      viewBox="-26 -16 52 38"
      width={64} height={48}
      overflow="visible"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4.2, ...LP }}
    >
      {stack.map((b, i) => {
        const x = -b.w / 2
        return (
          <g key={i} transform={`rotate(${b.rot})`}>
            {/* Cover */}
            <rect x={x} y={b.y - b.h} width={b.w} height={b.h} rx="2.5"
              fill={color} opacity={b.shade * 0.18} />
            {/* Spine */}
            <rect x={x} y={b.y - b.h} width="5" height={b.h} rx="1.5"
              fill={color} opacity={b.shade * 0.52} />
            {/* Page block edge */}
            <rect x={x + b.w - 3.5} y={b.y - b.h + 1} width="3.5" height={b.h - 2} rx="1"
              fill="rgba(255,255,255,0.04)" />
            {/* Cover title bar */}
            <rect x={x + 8} y={b.y - b.h + 3} width={b.w - 16} height={1.5} rx="0.75"
              fill={color} opacity={b.shade * 0.2} />
            {/* Cover subtitle bar */}
            <rect x={x + 8} y={b.y - b.h + 6.5} width={(b.w - 16) * 0.55} height={1} rx="0.5"
              fill={color} opacity={b.shade * 0.12} />
            {/* Spine shimmer sweep */}
            <motion.rect
              x={x + 1} y={b.y - b.h} width={3} height={b.h}
              fill="rgba(255,255,255,0)"
              animate={{ fill: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.22)', 'rgba(255,255,255,0)'] }}
              transition={{ duration: 2.4, ...LP, delay: i * 0.8, ease: 'easeInOut' }}
            />
          </g>
        )
      })}
      {/* Ambient base shadow */}
      <motion.ellipse
        cx="0" cy="23" rx="22" ry="2.5" fill={color} opacity={0}
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 4.2, ...LP }}
      />
    </motion.svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   QUANTUM PHYSICS MODULE  — pulsing nucleus, 3 orbital rings,
   glowing electrons with trailing dots
═══════════════════════════════════════════════════════════════ */
interface OrbitProps {
  color: string
  speed: number
  tilt:  number
  rx:    number
  ry:    number
}

function OrbitRing({ color, speed, tilt, rx, ry }: OrbitProps) {
  const TRAIL = [20, 42, 68] // angular offset (degrees) behind electron

  return (
    <g transform={`rotate(${tilt})`}>
      {/* Orbit path — dashed */}
      <ellipse cx="0" cy="0" rx={rx} ry={ry}
        fill="none" stroke={color} strokeWidth={0.7} opacity={0.22}
        strokeDasharray="3 4"
      />

      {/* Rotating group: electron + trail */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: speed, ...LPL }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        {/* Trail dots (behind electron at positive angles = behind in rotation) */}
        {TRAIL.map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const tx  = rx * Math.cos(rad)
          const ty  = ry * Math.sin(rad)
          return (
            <circle key={i} cx={tx} cy={ty}
              r={2.0 - i * 0.45}
              fill={color}
              opacity={(0.38 - i * 0.1)}
            />
          )
        })}

        {/* Electron */}
        <circle cx={rx} cy="0" r={2.8} fill={color} />
        {/* Electron glow */}
        <circle cx={rx} cy="0" r={5.5} fill={color} opacity={0.18} />
        <circle cx={rx} cy="0" r={3.8} fill={color} opacity={0.12} />
      </motion.g>
    </g>
  )
}

export function AtomIcon({ color }: { color: string }) {
  return (
    <svg viewBox="-32 -32 64 64" width={72} height={72} overflow="visible">

      {/* Quantum field — pulsing concentric rings */}
      {([10, 20, 30] as number[]).map((r, i) => (
        <motion.circle key={r} cx="0" cy="0" r={r}
          fill="none" stroke={color} strokeWidth={0.25} opacity={0.07}
          animate={{ r: [r - 1.5, r + 1.5, r - 1.5], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 3.5 + i * 0.6, ...LP, delay: i * 0.4 }}
        />
      ))}

      {/* Nucleus outer glow */}
      <motion.circle cx="0" cy="0" r={10}
        fill={color} opacity={0.06}
        animate={{ r: [8, 15, 8], opacity: [0.04, 0.10, 0.04] }}
        transition={{ duration: 2.2, ...LP }}
      />

      {/* Nucleus core */}
      <motion.circle cx="0" cy="0" r={6}
        fill={color} opacity={0.9}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 2.2, ...LP }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      {/* Nucleus highlight */}
      <circle cx="-1.8" cy="-2.2" r={2.2} fill="rgba(255,255,255,0.22)" />
      {/* Nucleus proton dots */}
      {([[-2.2, -2], [2.2, -1.5], [0, 2.5]] as [number,number][]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.1} fill="rgba(255,255,255,0.28)" />
      ))}

      {/* 3 orbital planes */}
      <OrbitRing color={color} speed={2.4} tilt={0}   rx={24} ry={8} />
      <OrbitRing color={color} speed={3.6} tilt={60}  rx={22} ry={8} />
      <OrbitRing color={color} speed={2.9} tilt={-60} rx={22} ry={8} />

      {/* Quantum field energy burst (occasional flash) */}
      <motion.circle cx="0" cy="0" r={5}
        fill="none" stroke={color} strokeWidth={1}
        animate={{ r: [5, 30], opacity: [0.3, 0] }}
        transition={{ duration: 2.8, ...LPL, delay: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}
