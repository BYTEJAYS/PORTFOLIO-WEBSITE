import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion'
import { Plus, ArrowUpRight, ExternalLink } from 'lucide-react'

/* ─── constants ─────────────────────────────────────────────── */
const EASE     = [0.16, 1, 0.3, 1] as const
const ROMAN    = ['I', 'II', 'III', 'IV', 'V']

/* ─── data ──────────────────────────────────────────────────── */
interface Project {
  title: string
  subtitle: string
  description: string
  tags: string[]
  gradient: [string, string, string]
  glow: string
  accent: string
  year: string
  category: string
  status: 'live' | 'in-dev' | 'archived'
  github?: string
  live?: string
}

const PROJECTS: Project[] = [
  {
    title: 'Transaction Graph Intelligence',
    subtitle: 'AI · Graph Neural Networks',
    description:
      'A real-time graph neural network system that maps financial transaction flows, detects anomalies, and surfaces hidden patterns across interconnected accounts. Built for intelligence at enterprise scale.',
    tags: ['Graph Neural Networks', 'PyTorch Geometric', 'FastAPI', 'PostgreSQL', 'Kafka'],
    gradient: ['#0A1628', '#0D2952', '#091B3A'],
    glow: 'rgba(80,140,255,0.28)',
    accent: '#648cff',
    year: '2025',
    category: 'AI Engineering',
    status: 'live',
    github: 'https://github.com/bytejay',
    live: '#',
  },
  {
    title: 'TGIE Voice Interface',
    subtitle: 'Voice AI · Conversational',
    description:
      'A real-time natural language voice layer powered by ElevenLabs TTS. Enables fluid conversational interaction with the Transaction Intelligence Engine — intelligence you can speak to.',
    tags: ['ElevenLabs', 'WebSockets', 'React', 'Python', 'NLP'],
    gradient: ['#061A20', '#093040', '#061828'],
    glow: 'rgba(60,200,220,0.24)',
    accent: '#3CC8DC',
    year: '2025',
    category: 'Voice AI',
    status: 'in-dev',
    github: 'https://github.com/bytejay',
    live: '#',
  },
  {
    title: 'Neural Vision System',
    subtitle: 'Computer Vision · Transformers',
    description:
      'An experimental suite exploring semantic segmentation, object detection, and visual reasoning using transformer architectures. Seeing the world through machine eyes.',
    tags: ['PyTorch', 'YOLO', 'Vision Transformers', 'OpenCV', 'CUDA'],
    gradient: ['#130A22', '#1F1240', '#120A2A'],
    glow: 'rgba(160,80,255,0.24)',
    accent: '#a050ff',
    year: '2024',
    category: 'Computer Vision',
    status: 'archived',
    github: 'https://github.com/bytejay',
  },
  {
    title: 'Bling Blue Team',
    subtitle: 'Cybersecurity · ML Threat Detection',
    description:
      'A defensive security toolkit combining ML-driven threat detection, network anomaly classification, and automated incident response — keeping infrastructure a step ahead of adversaries.',
    tags: ['Python', 'Scikit-learn', 'Network Analysis', 'Threat Intel', 'Docker'],
    gradient: ['#031020', '#041A38', '#031225'],
    glow: 'rgba(40,130,255,0.22)',
    accent: '#3a8cff',
    year: '2024',
    category: 'Security AI',
    status: 'live',
    github: 'https://github.com/bytejay',
    live: '#',
  },
  {
    title: 'AI Portfolio Universe',
    subtitle: 'Creative Engineering · 3D',
    description:
      'This very portfolio — designed as an immersive digital dreamscape. From the cosmic star field to the cinematic transitions, every detail crafted with the same obsession as the work it presents.',
    tags: ['React', 'Three.js', 'Framer Motion', 'GSAP', 'TypeScript'],
    gradient: ['#120D04', '#201808', '#0E0B04'],
    glow: 'rgba(212,168,83,0.28)',
    accent: '#D4A853',
    year: '2025',
    category: 'Creative Engineering',
    status: 'live',
    github: 'https://github.com/bytejay',
    live: '#',
  },
]

const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'Live',
  'in-dev': 'In Dev',
  archived: 'Archived',
}
const STATUS_COLOR: Record<Project['status'], string> = {
  live: '#4ade80',
  'in-dev': '#facc15',
  archived: '#6b7280',
}

/* ─── project preview art (gradient panel) ──────────────────── */
function PreviewArt({ project }: { project: Project }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 200, borderRadius: 12,
        background: `linear-gradient(135deg, ${project.gradient[0]} 0%, ${project.gradient[1]} 55%, ${project.gradient[2]} 100%)`,
      }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Glow orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: `radial-gradient(circle, ${project.glow} 0%, transparent 70%)`,
        }} />
      </div>

      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
          style={{ color: project.accent, borderColor: `${project.accent}30`, background: `${project.accent}0d`, fontFamily: "'Nunito',sans-serif" }}>
          {project.category}
        </span>
      </div>

      {/* Year */}
      <div className="absolute bottom-4 right-4 text-xs opacity-30"
        style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Nunito',sans-serif" }}>
        {project.year}
      </div>

      {/* Title faint watermark */}
      <div className="absolute bottom-4 left-4 right-16">
        <span className="text-sm font-normal opacity-25 leading-tight"
          style={{ fontFamily: "'Instrument Serif',serif", color: '#fff', letterSpacing: '-0.3px' }}>
          {project.title}
        </span>
      </div>
    </div>
  )
}

/* ─── single project row ─────────────────────────────────────── */
function ProjectRow({
  project, index, isOpen, onToggle, isLast,
}: {
  project: Project; index: number; isOpen: boolean; onToggle: () => void; isLast: boolean
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = rowRef.current?.getBoundingClientRect()
    if (!r) return
    setGlowPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div ref={rowRef}>
      {/* ── Row header ── */}
      <div
        className="relative cursor-pointer select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onToggle}
      >
        {/* Row hover glow */}
        <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse 60% 80% at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.028) 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }} />

        <div className="flex items-center gap-5 px-7 py-5 relative">

          {/* Roman numeral */}
          <span className="w-8 shrink-0 text-center text-[11px] font-normal transition-colors duration-300"
            style={{
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: '0.1em',
              color: isOpen ? project.accent : 'rgba(255,255,255,0.18)',
            }}>
            {ROMAN[index]}
          </span>

          {/* Title */}
          <span className="flex-1 text-base font-normal transition-colors duration-300"
            style={{
              fontFamily: "'Instrument Serif', serif",
              letterSpacing: '-0.2px',
              color: isOpen ? 'rgba(240,245,255,0.97)' : hovered ? 'rgba(230,238,252,0.85)' : 'rgba(200,215,240,0.65)',
              fontSize: 'clamp(15px, 1.4vw, 18px)',
            }}>
            {project.title}
          </span>

          {/* Right side: year + status + plus */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden sm:block text-[11px] transition-colors duration-300"
              style={{ fontFamily: "'Nunito',sans-serif", color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
              {project.year}
            </span>

            {/* Status badge */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: STATUS_COLOR[project.status],
                  boxShadow: project.status === 'live' ? `0 0 6px ${STATUS_COLOR[project.status]}` : 'none' }} />
              <span className="text-[10px] uppercase tracking-widest"
                style={{ color: STATUS_COLOR[project.status], opacity: 0.7, fontFamily: "'Nunito',sans-serif" }}>
                {STATUS_LABEL[project.status]}
              </span>
            </div>

            {/* Plus / minus icon */}
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="w-7 h-7 flex items-center justify-center rounded-full border transition-colors duration-300"
              style={{
                borderColor: isOpen ? `${project.accent}50` : 'rgba(255,255,255,0.10)',
                background: isOpen ? `${project.accent}10` : 'transparent',
              }}>
              <Plus size={13} style={{ color: isOpen ? project.accent : 'rgba(255,255,255,0.35)', strokeWidth: 1.5 }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Expanded content ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
              className="px-7 pb-7"
            >
              {/* Inner glass panel */}
              <div className="rounded-xl overflow-hidden" style={{
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.012)',
              }}>

                {/* Preview art */}
                <motion.div
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                >
                  <PreviewArt project={project} />
                </motion.div>

                {/* Content body */}
                <div className="p-5 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* Left — description + tags */}
                    <div className="flex-1">
                      <p className="text-sm leading-[1.85] mb-5"
                        style={{ color: 'rgba(160,180,215,0.8)', fontFamily: "'Nunito',sans-serif" }}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag}
                            className="text-[11px] px-3 py-1 rounded-full border"
                            style={{
                              color: 'rgba(180,200,235,0.65)',
                              borderColor: 'rgba(255,255,255,0.07)',
                              background: 'rgba(255,255,255,0.03)',
                              fontFamily: "'Nunito',sans-serif",
                              letterSpacing: '0.02em',
                            }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right — buttons */}
                    <div className="flex lg:flex-col gap-3 shrink-0">
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noreferrer"
                          className="magnetic-btn flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-normal transition-all duration-300 hover:scale-[1.04]"
                          style={{
                            fontFamily: "'Nunito',sans-serif",
                            letterSpacing: '0.04em',
                            color: '#fff',
                            background: project.accent,
                            boxShadow: `0 0 20px ${project.glow}`,
                          }}>
                          View Project <ArrowUpRight size={12} />
                        </a>
                      )}
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-normal border transition-all duration-300 hover:scale-[1.04]"
                          style={{
                            fontFamily: "'Nunito',sans-serif",
                            letterSpacing: '0.04em',
                            color: 'rgba(200,215,240,0.7)',
                            borderColor: 'rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.04)',
                          }}>
                          <ExternalLink size={11} /> GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      {!isLast && (
        <div className="mx-7" style={{ height: 1, background: 'rgba(255,255,255,0.045)' }} />
      )}
    </div>
  )
}

/* ─── floating glass card with mouse parallax ───────────────── */
function FloatingCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [2.5, -2.5]), { stiffness: 300, damping: 40 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-2.5, 2.5]), { stiffness: 300, damping: 40 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const handleMouseLeave = () => { mx.set(0); my.set(0) }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.018)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          boxShadow: [
            '0 0 0 1px rgba(255,255,255,0.04) inset',
            '0 40px 80px rgba(0,0,0,0.55)',
            '0 0 120px rgba(212,168,83,0.04)',
            '0 1px 0 rgba(255,255,255,0.08) inset',
          ].join(', '),
          overflow: 'hidden',
        }}
      >
        {/* Top glass sheen */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.06) 70%, transparent)' }} />

        {/* Ambient corner glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />

        {children}
      </motion.div>
    </div>
  )
}

/* ─── section ───────────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-100px 0px' })
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i))

  return (
    <section id="projects" ref={sectionRef} className="relative py-36 lg:py-44 overflow-hidden">

      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[600px] h-[200px]"
          style={{ background: 'radial-gradient(ellipse, rgba(100,150,255,0.035) 0%, transparent 70%)' }} />
        <div className="absolute right-0 bottom-0 w-96 h-96"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.03) 0%, transparent 65%)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8" style={{ zIndex: 2 }}>

        {/* Section header */}
        <div className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="w-8 h-px" style={{ background: '#D4A853', opacity: 0.6 }} />
            <span className="text-xs uppercase tracking-[0.3em]"
              style={{ color: 'rgba(212,168,83,0.8)', fontFamily: "'Nunito',sans-serif" }}>
              Selected Work
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="font-normal leading-[0.95]"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(40px, 5.5vw, 80px)',
              letterSpacing: '-2.5px',
              color: 'rgba(230,238,252,0.95)',
            }}
          >
            Projects from<br />
            <em className="not-italic" style={{ color: 'rgba(170,195,240,0.55)' }}>
              the frontier.
            </em>
          </motion.h2>
        </div>

        {/* Floating card */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        >
          <FloatingCard>
            {/* Card header bar */}
            <div className="flex items-center gap-2.5 px-7 py-4 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <span className="ml-auto text-[10px] uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.15)', fontFamily: "'Nunito',sans-serif" }}>
                projects.index
              </span>
            </div>

            {/* Column labels */}
            <div className="flex items-center gap-5 px-7 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <span className="w-8 text-center text-[9px] uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.15)', fontFamily: "'Nunito',sans-serif" }}>#</span>
              <span className="flex-1 text-[9px] uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.15)', fontFamily: "'Nunito',sans-serif" }}>Project</span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest mr-1"
                style={{ color: 'rgba(255,255,255,0.15)', fontFamily: "'Nunito',sans-serif" }}>Year</span>
              <span className="hidden md:block text-[9px] uppercase tracking-widest w-20 text-center"
                style={{ color: 'rgba(255,255,255,0.15)', fontFamily: "'Nunito',sans-serif" }}>Status</span>
              <span className="w-7" />
            </div>

            {/* Project rows */}
            <div className="py-2">
              {PROJECTS.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.07 }}
                >
                  <ProjectRow
                    project={project}
                    index={i}
                    isOpen={open === i}
                    onToggle={() => toggle(i)}
                    isLast={i === PROJECTS.length - 1}
                  />
                </motion.div>
              ))}
            </div>

            {/* Card footer */}
            <div className="px-7 py-3.5 border-t flex items-center justify-between"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <span className="text-[10px]"
                style={{ color: 'rgba(255,255,255,0.12)', fontFamily: "'Nunito',sans-serif", letterSpacing: '0.06em' }}>
                {PROJECTS.length} projects
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70"
                  style={{ boxShadow: '0 0 5px rgba(74,222,128,0.8)' }} />
                <span className="text-[10px]"
                  style={{ color: 'rgba(255,255,255,0.12)', fontFamily: "'Nunito',sans-serif", letterSpacing: '0.06em' }}>
                  updated 2025
                </span>
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </div>
    </section>
  )
}
