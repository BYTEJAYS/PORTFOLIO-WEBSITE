import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import AICompanion from '@/components/ui/AICompanion'
import { ChessIcon, GuitarIcon, CubeIcon, BookIcon, AtomIcon } from '@/components/ui/PersonalityIcons'
import type React from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

/* ─── personality data ───────────────────────────────────────── */
interface PersonalityItem {
  icon:  React.ComponentType<{ color: string }>
  hex:   string
  title: string
  color: string
  glow:  string
  desc:  string
}

const PERSONALITY: PersonalityItem[] = [
  {
    icon: ChessIcon,
    hex:  '#D4A853',
    title: 'Chess',
    color: 'rgba(212,168,83,0.9)',
    glow:  'rgba(212,168,83,0.08)',
    desc:  'Taught me patience and systems thinking. Every move is a cascade of consequences.',
  },
  {
    icon: GuitarIcon,
    hex:  '#e879f9',
    title: 'Guitar',
    color: 'rgba(232,121,249,0.9)',
    glow:  'rgba(232,121,249,0.08)',
    desc:  'Music is mathematics you can feel. Rhythm, harmony, and structure — sound like code.',
  },
  {
    icon: CubeIcon,
    hex:  '#38bdf8',
    title: "Rubik's Cube",
    color: 'rgba(56,189,248,0.9)',
    glow:  'rgba(56,189,248,0.08)',
    desc:  'Every scrambled state has an elegant solution waiting to be found.',
  },
  {
    icon: BookIcon,
    hex:  '#648cff',
    title: 'Books',
    color: 'rgba(100,140,255,0.9)',
    glow:  'rgba(100,140,255,0.08)',
    desc:  'The only investment that compounds infinitely. From physics to philosophy.',
  },
  {
    icon: AtomIcon,
    hex:  '#4ade80',
    title: 'Quantum Physics',
    color: 'rgba(74,222,128,0.9)',
    glow:  'rgba(74,222,128,0.08)',
    desc:  'Curiosity beyond certainty. Reality is stranger — and more beautiful — than it seems.',
  },
]

const STATS = [
  { value: '19', label: 'Years Old' },
  { value: '5+', label: 'Projects Built' },
  { value: '∞',  label: 'Curiosity' },
]

/* ─── personality card ───────────────────────────────────────── */
function PersonalCard({ item, delay }: { item: typeof PERSONALITY[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      whileHover={{ y: -4 }}
      className="relative flex flex-col gap-3 p-5 overflow-hidden group cursor-default"
      style={{
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.018)',
        backdropFilter: 'blur(16px)',
        minWidth: 180,
        flex: '1 1 180px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[18px]"
        style={{ background: item.glow }} />

      {/* Top sheen */}
      <div className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${item.color}30, transparent)` }} />

      {/* Animated icon */}
      <div className="leading-none">
        <item.icon color={item.hex} />
      </div>

      {/* Title */}
      <div className="text-sm font-normal" style={{ color: item.color, fontFamily: "'Nunito',sans-serif", letterSpacing: '0.02em' }}>
        {item.title}
      </div>

      {/* Description */}
      <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(130,155,200,0.55)', fontFamily: "'Nunito',sans-serif" }}>
        {item.desc}
      </p>
    </motion.div>
  )
}

/* ─── main section ───────────────────────────────────────────── */
export default function About() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1, delay, ease: EASE },
  })

  return (
    <section id="about" ref={ref} className="relative overflow-hidden">

      {/* Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', right: '6%', width: '48vw', height: '48vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '48%', left: '2%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(60,100,255,0.035) 0%, transparent 65%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12" style={{ zIndex: 2 }}>

        {/* ══════  CINEMATIC INTRO  ══════ */}
        <div className="pt-28 lg:pt-36 pb-20 lg:pb-24">

          <motion.div {...fade(0)} className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px" style={{ background: '#D4A853', opacity: 0.6 }} />
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(212,168,83,0.8)', fontFamily: "'Nunito',sans-serif" }}>
              The Story
            </span>
          </motion.div>

          <motion.h1 {...fade(0.08)}
            className="font-normal leading-[0.92] mb-6"
            style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(52px, 8vw, 120px)', letterSpacing: '-3.5px', color: 'rgba(235,242,255,0.97)' }}>
            Hi, I'm Jay.
          </motion.h1>

          <motion.p {...fade(0.18)}
            className="text-lg lg:text-xl leading-relaxed max-w-xl"
            style={{ color: 'rgba(140,165,215,0.72)', fontFamily: "'Nunito',sans-serif" }}>
            19-year-old AI engineer building intelligent systems,
            <br className="hidden sm:block" />
            futuristic interfaces, and ideas that feel alive.
          </motion.p>
        </div>

        {/* ══════  STORY + 3D PC  ══════ */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center pb-28 lg:pb-36">

          {/* Left — story */}
          <div className="flex flex-col gap-10">
            <motion.h2 {...fade(0.1)}
              className="font-normal leading-[0.95]"
              style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(36px, 5vw, 72px)', letterSpacing: '-2px', color: 'rgba(228,238,255,0.95)' }}>
              Curiosity<br />
              <em className="not-italic" style={{ color: 'rgba(212,168,83,0.82)' }}>beyond the code.</em>
            </motion.h2>

            <motion.div {...fade(0.2)} className="space-y-5">
              <p className="text-base lg:text-lg leading-[1.9]" style={{ color: 'rgba(138,162,210,0.82)', fontFamily: "'Nunito',sans-serif" }}>
                I'm Jay Pandey — BYTEJAY. A 19-year-old AI engineer building at the
                intersection of machine learning, creativity, and systems thinking.
              </p>
              <p className="text-base leading-[1.9]" style={{ color: 'rgba(115,140,188,0.7)', fontFamily: "'Nunito',sans-serif" }}>
                Every project I build carries one belief:{' '}
                <em style={{ color: 'rgba(185,210,248,0.82)', fontFamily: "'Instrument Serif',serif", fontSize: 17 }}>
                  intelligence should feel like art.
                </em>{' '}
                From graph neural networks to voice-driven interfaces, I chase the edges
                where logic dissolves into something entirely unexpected.
              </p>
              <p className="text-base leading-[1.9]" style={{ color: 'rgba(115,140,188,0.7)', fontFamily: "'Nunito',sans-serif" }}>
                I'm equally fascinated by quantum mechanics and writing clean APIs — because
                the same curiosity that asks <em style={{ color: 'rgba(185,210,248,0.7)', fontFamily: "'Instrument Serif',serif" }}>"how does the universe work?"</em> is what makes me
                a better engineer.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div {...fade(0.32)} className="flex gap-10 pt-2">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontFamily: "'Instrument Serif',serif", color: 'rgba(228,238,255,0.92)', lineHeight: 1 }}>
                    {value}
                  </div>
                  <div className="mt-1.5" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(120,148,198,0.5)', fontFamily: "'Nunito',sans-serif" }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 1.8, delay: 0.5, ease: EASE }}
              style={{ height: 1, transformOrigin: 'left', background: 'linear-gradient(to right, rgba(212,168,83,0.5), rgba(212,168,83,0.08), transparent)', maxWidth: 320 }}
            />
          </div>

          {/* Right — 3D doodle PC */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.90 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.18, ease: EASE }}
          >
            <div className="relative w-full max-w-[600px]">
              <AICompanion />
            </div>
          </motion.div>

        </div>

        {/* ══════  PERSONALITY SHOWCASE  ══════ */}
        <div className="pb-28 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px" style={{ background: '#D4A853', opacity: 0.45 }} />
              <span className="text-xs uppercase tracking-[0.28em]" style={{ color: 'rgba(212,168,83,0.6)', fontFamily: "'Nunito',sans-serif" }}>
                Beyond the keyboard
              </span>
            </div>
            <h3 className="text-3xl lg:text-4xl font-normal" style={{ fontFamily: "'Instrument Serif',serif", letterSpacing: '-1px', color: 'rgba(220,232,255,0.85)' }}>
              What shapes how I think.
            </h3>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            {PERSONALITY.map((item, i) => (
              <PersonalCard key={item.title} item={item} delay={i * 0.07} />
            ))}
          </div>
        </div>

        {/* ══════  FINAL STATEMENT  ══════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pb-24 lg:pb-32 border-t pt-20 lg:pt-24"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="max-w-3xl">
            <p className="font-normal leading-[1.15] mb-8"
              style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(28px, 4.5vw, 64px)', letterSpacing: '-1.5px', color: 'rgba(215,228,252,0.78)' }}>
              "I'm not just learning technology.
              <br />
              <em className="not-italic" style={{ color: 'rgba(170,195,240,0.42)' }}>
                I'm learning how to build the future."
              </em>
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: EASE, delay: 0.3 }}
              style={{ height: 1, transformOrigin: 'left', background: 'linear-gradient(to right, rgba(212,168,83,0.4), rgba(212,168,83,0.06), transparent)', maxWidth: 280 }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
