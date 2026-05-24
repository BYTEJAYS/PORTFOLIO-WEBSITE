import { useRef, useEffect } from 'react'
import { useAnimationFrame } from 'framer-motion'
import {
  SiPython, SiPytorch, SiFastapi, SiReact, SiThreedotjs,
  SiFramer, SiApachekafka, SiApacheflink, SiGithub, SiDocker,
  SiTailwindcss, SiTypescript, SiScikitlearn, SiTensorflow,
} from 'react-icons/si'
import type { IconType } from 'react-icons'

const CARD_W = 190
const CARD_H = 224
const N      = 14
const SPEED  = 0.00030   // rad/ms
const SLOW   = 0.00005   // rad/ms on hover

interface Tech {
  name:  string
  icon:  IconType
  color: string
  desc:  string
}

const TECHS: Tech[] = [
  { name: 'Python',        icon: SiPython,       color: '#3776AB', desc: 'ML & AI core'           },
  { name: 'PyTorch',       icon: SiPytorch,      color: '#EE4C2C', desc: 'Deep learning'           },
  { name: 'FastAPI',       icon: SiFastapi,      color: '#009688', desc: 'Async Python APIs'       },
  { name: 'React',         icon: SiReact,        color: '#61DAFB', desc: 'Component architecture'  },
  { name: 'Three.js',      icon: SiThreedotjs,   color: '#FFFFFF', desc: 'WebGL 3D rendering'      },
  { name: 'Framer Motion', icon: SiFramer,       color: '#0A6BF0', desc: 'Motion & animation'      },
  { name: 'TypeScript',    icon: SiTypescript,   color: '#3178C6', desc: 'Type-safe codebases'     },
  { name: 'Apache Kafka',  icon: SiApachekafka,  color: '#7B61FF', desc: 'Event streaming'         },
  { name: 'Apache Flink',  icon: SiApacheflink,  color: '#E6526F', desc: 'Stream processing'       },
  { name: 'Scikit-learn',  icon: SiScikitlearn,  color: '#F7931E', desc: 'ML pipelines'            },
  { name: 'TensorFlow',    icon: SiTensorflow,   color: '#FF6F00', desc: 'Production ML'           },
  { name: 'GitHub',        icon: SiGithub,       color: '#64748B', desc: 'Version control'         },
  { name: 'Docker',        icon: SiDocker,       color: '#2496ED', desc: 'Containerization'        },
  { name: 'Tailwind CSS',  icon: SiTailwindcss,  color: '#06B6D4', desc: 'Utility-first CSS'       },
]

function getR(): number {
  const w = window.innerWidth
  if (w < 480)  return 140
  if (w < 768)  return 215
  if (w < 1100) return 310
  return 420
}

export default function TechCarousel() {
  const refs   = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null))
  const angle  = useRef(0)
  const hovRef = useRef<number | null>(null)
  const radRef = useRef(420)

  useEffect(() => {
    radRef.current = getR()
    const onResize = () => { radRef.current = getR() }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useAnimationFrame((_, delta) => {
    angle.current += (hovRef.current !== null ? SLOW : SPEED) * delta
    const R = radRef.current

    refs.current.forEach((el, i) => {
      if (!el) return
      const θ     = (2 * Math.PI / N) * i + angle.current
      const x     = R * Math.sin(θ)
      const z     = R * Math.cos(θ)
      const depth = (z + R) / (2 * R)          // 0 = back, 1 = front
      const isHov = hovRef.current === i

      const scale  = isHov ? (0.54 + 0.46 * depth) * 1.12 : 0.54 + 0.46 * depth
      const opac   = isHov ? 1 : 0.16 + 0.84 * depth
      const blur   = isHov ? 0 : (1 - depth) * 3.0
      const bright = isHov ? 1 : 0.42 + 0.58 * depth
      const rotZ   = isHov ? 0 : -Math.sin(θ) * 3.0

      el.style.transform = `translate(${(x - CARD_W / 2).toFixed(1)}px,${(-CARD_H / 2).toFixed(1)}px) scale(${scale.toFixed(4)}) rotateZ(${rotZ.toFixed(2)}deg)`
      el.style.opacity   = opac.toFixed(4)
      el.style.filter    = `blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`
      el.style.zIndex    = isHov ? '999' : String(Math.round(depth * 100))
    })
  })

  return (
    <div
      className="relative w-full select-none"
      style={{ height: 380 }}
      aria-label="Tech stack orbit"
    >
      {/* Ambient center glow */}
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: 800, height: 340,
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(ellipse, rgba(120,160,255,0.045) 0%, transparent 68%)',
        }}
      />

      {/* Orbit guide line */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '5%', right: '5%',
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05) 25%, rgba(212,168,83,0.08) 50%, rgba(255,255,255,0.05) 75%, transparent)',
        }}
      />

      {/* Card layer — zero-size origin at container center */}
      <div className="absolute left-1/2 top-1/2" style={{ width: 0, height: 0 }}>
        {TECHS.map((t, i) => {
          const Icon = t.icon
          return (
            <div
              key={t.name}
              ref={el => { refs.current[i] = el }}
              onMouseEnter={() => { hovRef.current = i }}
              onMouseLeave={() => { hovRef.current = null }}
              style={{
                position: 'absolute',
                width: CARD_W,
                height: CARD_H,
                willChange: 'transform, opacity, filter',
                cursor: 'default',
                borderRadius: 20,
                background: 'rgba(248, 250, 255, 0.93)',
                border: '1px solid rgba(255,255,255,0.82)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.95)',
                overflow: 'hidden',
              }}
            >
              {/* Inner top sheen */}
              <div
                className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)' }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 py-5">

                {/* Logo area with brand glow */}
                <div
                  className="relative flex items-center justify-center"
                  style={{ width: 72, height: 72, flexShrink: 0 }}
                >
                  {/* Brand color glow behind icon */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 60%, ${t.color}28 0%, transparent 72%)`,
                    }}
                  />
                  <Icon size={40} color={t.color} style={{ position: 'relative', zIndex: 1, filter: `drop-shadow(0 2px 8px ${t.color}55)` }} />
                </div>

                {/* Tech name */}
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    fontFamily: "'Nunito', sans-serif",
                    color: '#0f172a',
                    letterSpacing: '-0.2px',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {t.name}
                </div>

                {/* Description */}
                <div
                  style={{
                    fontSize: 10.5,
                    fontFamily: "'Nunito', sans-serif",
                    color: 'rgba(71, 85, 105, 0.75)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  {t.desc}
                </div>

                {/* Colored bottom accent */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    width: 28,
                    height: 2.5,
                    borderRadius: 2,
                    background: t.color,
                    opacity: 0.45,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-32 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #020B18 20%, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-32 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #020B18 20%, transparent)' }} />
      <div className="absolute inset-x-0 top-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #020B18, transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #020B18, transparent)' }} />
    </div>
  )
}
