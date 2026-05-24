import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import TechCarousel from '@/components/ui/TechCarousel'

const EASE = [0.16, 1, 0.3, 1] as const

/* ─── types ─────────────────────────────────────────────────── */
interface Tech     { name: string; abbr: string; desc: string; color: string }
interface Category { name: string; short: string; accent: string; glow: string; items: Tech[] }
interface Build    { name: string; stack: string[]; status: 'Active' | 'In Dev'; accent: string; desc: string }

/* ─── data ──────────────────────────────────────────────────── */
const CATS: Category[] = [
  {
    name: 'AI / Machine Learning', short: 'AI',
    accent: '#648cff', glow: 'rgba(100,140,255,0.10)',
    items: [
      { name: 'Python',             abbr: 'Py',  desc: 'Primary language for all ML/AI work',      color: '#3b82f6' },
      { name: 'PyTorch',            abbr: 'PT',  desc: 'Deep learning — training & inference',     color: '#ef4444' },
      { name: 'PyTorch Geometric',  abbr: 'PTG', desc: 'Graph neural networks at scale',           color: '#f97316' },
      { name: 'SHAP',               abbr: 'SH',  desc: 'Explainability for black-box models',      color: '#8b5cf6' },
      { name: 'TensorFlow',         abbr: 'TF',  desc: 'Production ML deployment pipelines',       color: '#f59e0b' },
    ],
  },
  {
    name: 'Frontend', short: 'FE',
    accent: '#38bdf8', glow: 'rgba(56,189,248,0.10)',
    items: [
      { name: 'React',          abbr: '⚛',  desc: 'Component architecture & reactive state', color: '#38bdf8' },
      { name: 'Tailwind CSS',   abbr: 'TW', desc: 'Utility-first design at speed',           color: '#14b8a6' },
      { name: 'Framer Motion',  abbr: 'FM', desc: 'Production-grade motion & animation',     color: '#a855f7' },
      { name: 'TypeScript',     abbr: 'TS', desc: 'Type-safe large-scale codebases',          color: '#60a5fa' },
    ],
  },
  {
    name: '3D & Visualization', short: '3D',
    accent: '#e879f9', glow: 'rgba(232,121,249,0.10)',
    items: [
      { name: 'Three.js',          abbr: '3js', desc: 'WebGL 3D rendering for the web',     color: '#e2e8f0' },
      { name: 'React Three Fiber', abbr: 'R3F', desc: '3D scenes in the React ecosystem',  color: '#e879f9' },
      { name: 'Spline',            abbr: 'Sp',  desc: 'Rapid interactive 3D experiences',  color: '#d946ef' },
      { name: 'NetworkX',          abbr: 'Nx',  desc: 'Graph analytics & topology viz',    color: '#7c3aed' },
    ],
  },
  {
    name: 'Backend & APIs', short: 'BE',
    accent: '#4ade80', glow: 'rgba(74,222,128,0.10)',
    items: [
      { name: 'FastAPI',     abbr: 'FA', desc: 'High-performance async Python APIs', color: '#009688' },
      { name: 'PostgreSQL',  abbr: 'PG', desc: 'Relational data at production scale', color: '#336791' },
      { name: 'WebSockets',  abbr: 'WS', desc: 'Real-time bidirectional data flows',  color: '#4ade80' },
    ],
  },
  {
    name: 'Data & Streaming', short: 'DS',
    accent: '#fb923c', glow: 'rgba(251,146,60,0.10)',
    items: [
      { name: 'Apache Kafka', abbr: 'Kf', desc: 'Distributed event streaming platform', color: '#fb923c' },
      { name: 'Apache Flink', abbr: 'Fl', desc: 'Stateful real-time stream processing', color: '#e6526f' },
    ],
  },
  {
    name: 'Tools & Platforms', short: 'OPS',
    accent: '#94a3b8', glow: 'rgba(148,163,184,0.10)',
    items: [
      { name: 'Docker',      abbr: 'Do', desc: 'Containerized deployment & scaling',   color: '#2496ED' },
      { name: 'Git & GitHub',abbr: 'Gt', desc: 'Version control & open-source collab', color: '#f05032' },
      { name: 'Linux',       abbr: 'Lx', desc: 'Primary development environment',       color: '#e2e8f0' },
    ],
  },
]

const BUILDS: Build[] = [
  {
    name: 'Transaction Graph Engine',
    stack: ['PyTorch Geometric', 'Kafka', 'FastAPI', 'PostgreSQL'],
    status: 'Active', accent: '#648cff',
    desc: 'Real-time GNN fraud & anomaly detection over financial transaction graphs.',
  },
  {
    name: 'AI Voice Interface',
    stack: ['ElevenLabs', 'WebSockets', 'React', 'Python'],
    status: 'In Dev', accent: '#3CC8DC',
    desc: 'Conversational voice layer for the TGIE intelligence engine.',
  },
  {
    name: '3D Portfolio Universe',
    stack: ['Three.js', 'React Three Fiber', 'Framer Motion'],
    status: 'Active', accent: '#e879f9',
    desc: 'Immersive digital experience replacing static portfolio conventions.',
  },
  {
    name: 'ML Data Pipeline',
    stack: ['Python', 'Docker', 'Flink', 'PostgreSQL'],
    status: 'Active', accent: '#4ade80',
    desc: 'Streaming data ingestion & feature engineering for model training.',
  },
]

/* ─── floating network background ───────────────────────────── */
function NetworkBg() {
  const nodes = [
    { cx: '12%',  cy: '18%', r: 2.5 }, { cx: '38%',  cy: '8%',  r: 1.8 },
    { cx: '62%',  cy: '14%', r: 2.2 }, { cx: '85%',  cy: '22%', r: 1.6 },
    { cx: '6%',   cy: '52%', r: 2.0 }, { cx: '28%',  cy: '64%', r: 1.5 },
    { cx: '72%',  cy: '58%', r: 2.4 }, { cx: '92%',  cy: '70%', r: 1.9 },
    { cx: '50%',  cy: '82%', r: 1.7 }, { cx: '18%',  cy: '88%', r: 2.1 },
  ]
  const edges = [
    ['12%,18%', '38%,8%'], ['38%,8%', '62%,14%'], ['62%,14%', '85%,22%'],
    ['6%,52%',  '28%,64%'],['72%,58%','92%,70%'],  ['50%,82%', '18%,88%'],
    ['12%,18%', '6%,52%'], ['85%,22%', '92%,70%'],
  ]
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.22 }}>
      <defs>
        <radialGradient id="nodeGrad">
          <stop offset="0%"   stopColor="rgba(100,140,255,0.9)" />
          <stop offset="100%" stopColor="rgba(100,140,255,0)"   />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const [x1, y1] = a.split(',')
        const [x2, y2] = b.split(',')
        return (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(100,140,255,0.18)" strokeWidth={0.6}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
          />
        )
      })}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.cx} cy={n.cy} r={n.r}
          fill="rgba(100,140,255,0.7)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 0.9, 0.7] }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: EASE }}
        />
      ))}
    </svg>
  )
}

/* ─── tech badge ─────────────────────────────────────────────── */
function Badge({ abbr, color }: { abbr: string; color: string }) {
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-medium"
      style={{ background: `${color}1a`, color, fontFamily: "'Nunito',sans-serif", letterSpacing: '0.02em' }}>
      {abbr}
    </div>
  )
}

/* ─── individual tech item ───────────────────────────────────── */
function TechItem({ tech }: { tech: Tech }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 cursor-default"
      style={{ background: hov ? 'rgba(0,0,0,0.04)' : 'transparent' }}>
      <Badge abbr={tech.abbr} color={tech.color} />
      <div className="min-w-0">
        <div className="text-[13px] leading-tight" style={{ color: '#1e293b', fontFamily: "'Nunito',sans-serif" }}>
          {tech.name}
        </div>
        <div className="text-[11px] mt-0.5 leading-snug" style={{ color: '#94a3b8', fontFamily: "'Nunito',sans-serif" }}>
          {tech.desc}
        </div>
      </div>
    </div>
  )
}

/* ─── category card ──────────────────────────────────────────── */
function CatCard({ cat, inView, index }: { cat: Category; inView: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const glowX = useTransform(mx, v => `${v * 100}%`)
  const glowY = useTransform(my, v => `${v * 100}%`)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + index * 0.07 }}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5) }}
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.07)',
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: useTransform([glowX, glowY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, ${cat.glow} 0%, transparent 55%)`) }}
      />

      {/* Top sheen */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9) 50%, transparent)' }} />

      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b relative" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="w-1 h-4 rounded-full shrink-0" style={{ background: cat.accent }} />
        <span className="text-[13px] flex-1 font-medium" style={{ color: '#1e293b', fontFamily: "'Nunito',sans-serif" }}>
          {cat.name}
        </span>
        <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: cat.accent, fontFamily: "'Nunito',sans-serif" }}>
          {cat.short}
        </span>
      </div>

      {/* Tech items */}
      <div className="flex-1 p-3 space-y-0.5 relative">
        {cat.items.map(t => <TechItem key={t.name} tech={t} />)}
      </div>
    </motion.div>
  )
}

/* ─── "currently building" card ─────────────────────────────── */
function BuildCard({ item, delay }: { item: Build; delay: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex-1 min-w-[260px] relative overflow-hidden transition-all duration-400"
      style={{
        borderRadius: 16,
        border: `1px solid ${hov ? item.accent + '30' : 'rgba(255,255,255,0.06)'}`,
        background: hov ? `${item.accent}08` : 'rgba(255,255,255,0.015)',
        padding: '20px 22px',
        backdropFilter: 'blur(16px)',
        transition: 'border-color 0.3s, background 0.3s',
      }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ background: item.accent, opacity: 0.7 }} />

      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="text-sm font-normal" style={{ color: 'rgba(220,232,255,0.88)', fontFamily: "'Instrument Serif',serif", fontSize: 15 }}>
          {item.name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: item.status === 'Active' ? '#4ade80' : '#facc15',
              boxShadow: item.status === 'Active' ? '0 0 6px rgba(74,222,128,0.8)' : '0 0 6px rgba(250,204,21,0.6)' }} />
          <span className="text-[9px] uppercase tracking-widest" style={{ color: item.status === 'Active' ? '#4ade80' : '#facc15', fontFamily: "'Nunito',sans-serif" }}>
            {item.status}
          </span>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed mb-4" style={{ color: 'rgba(130,155,200,0.55)', fontFamily: "'Nunito',sans-serif" }}>
        {item.desc}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {item.stack.map(s => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ color: item.accent, background: `${item.accent}14`, fontFamily: "'Nunito',sans-serif", letterSpacing: '0.02em' }}>
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── main section ───────────────────────────────────────────── */
export default function Skills() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section id="skills" ref={ref} className="relative py-36 lg:py-44 overflow-hidden">

      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: '10%', left: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,140,255,0.06) 0%, transparent 70%)' }} />
        <motion.div animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: '15%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 70%)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
        <NetworkBg />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12" style={{ zIndex: 2 }}>

        {/* ── Section header ── */}
        <div className="max-w-2xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="w-8 h-px" style={{ background: '#D4A853', opacity: 0.6 }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(212,168,83,0.8)', fontFamily: "'Nunito',sans-serif" }}>
              Tech Arsenal
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
            className="font-normal leading-[0.95] mb-6"
            style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(40px, 5.5vw, 80px)', letterSpacing: '-2.5px', color: 'rgba(230,238,252,0.95)' }}
          >
            Technologies<br />
            <em className="not-italic" style={{ color: 'rgba(170,195,240,0.5)' }}>I build with.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
            className="text-base leading-relaxed"
            style={{ color: 'rgba(130,155,200,0.65)', fontFamily: "'Nunito',sans-serif" }}
          >
            Tools, frameworks, and systems powering my ideas — from neural networks to real-time interfaces.
          </motion.p>
        </div>

        {/* ── Orbital carousel ── */}
        <div className="mb-12">
          <TechCarousel />
        </div>

        {/* ── Category grid ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-20">
          {CATS.map((cat, i) => (
            <CatCard key={cat.name} cat={cat} inView={inView} index={i} />
          ))}
        </div>

        {/* ── Currently building with ── */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
            className="flex items-center gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(74,222,128,0.9)' }} />
                <span className="text-xs uppercase tracking-[0.28em]" style={{ color: 'rgba(74,222,128,0.7)', fontFamily: "'Nunito',sans-serif" }}>
                  Live Systems
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-normal" style={{ fontFamily: "'Instrument Serif',serif", color: 'rgba(220,232,255,0.92)', letterSpacing: '-0.8px' }}>
                Currently building with
              </h3>
            </div>
          </motion.div>

          <div className="flex flex-wrap lg:flex-nowrap gap-4">
            {BUILDS.map((b, i) => <BuildCard key={b.name} item={b} delay={0.6 + i * 0.08} />)}
          </div>
        </div>

        {/* ── Cinematic quote ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center py-16 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-normal leading-[1.25] mb-4"
            style={{ fontFamily: "'Instrument Serif',serif", color: 'rgba(215,228,252,0.75)', letterSpacing: '-0.5px', maxWidth: 640, margin: '0 auto 16px' }}>
            "I don't just like coding.
            <br />
            <em className="not-italic" style={{ color: 'rgba(170,195,240,0.45)' }}>
              I like building systems that feel alive."
            </em>
          </p>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(150,170,210,0.3)', fontFamily: "'Nunito',sans-serif" }}>
            — Jay Pandey, BYTEJAY
          </p>
        </motion.div>

      </div>
    </section>
  )
}
