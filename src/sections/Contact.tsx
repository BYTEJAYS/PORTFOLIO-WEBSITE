import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Social data ────────────────────────────────────────────── */
interface Social { label: string; handle: string; href: string; gradient: string; glow: string; iconKey: string }

const SOCIALS: Social[] = [
  {
    label: 'GitHub', handle: '@BYTEJAYS',
    href: 'https://github.com/BYTEJAYS',
    gradient: 'linear-gradient(145deg,#1c2030 0%,#2d333b 100%)',
    glow: 'rgba(110,118,129,0.45)', iconKey: 'github',
  },
  {
    label: 'Instagram', handle: '@_bytejay_',
    href: 'https://www.instagram.com/_bytejay_/?hl=en',
    gradient: 'linear-gradient(145deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
    glow: 'rgba(220,39,67,0.45)', iconKey: 'instagram',
  },
  {
    label: 'LinkedIn', handle: 'Jay Pandey',
    href: '#',
    gradient: 'linear-gradient(145deg,#0a66c2 0%,#004182 100%)',
    glow: 'rgba(10,102,194,0.45)', iconKey: 'linkedin',
  },
  {
    label: 'Email', handle: 'codes404z@gmail.com',
    href: 'mailto:codes404z@gmail.com',
    gradient: 'linear-gradient(145deg,#4f46e5 0%,#7c3aed 100%)',
    glow: 'rgba(79,70,229,0.45)', iconKey: 'mail',
  },
]

/* ── SVG icons ──────────────────────────────────────────────── */
function SocialIcon({ iconKey }: { iconKey: string }) {
  const p: Record<string, string> = {
    github:    'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    linkedin:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    mail:      'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  }
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="white">
      <path d={p[iconKey]} />
    </svg>
  )
}

/* ── 3D social card ─────────────────────────────────────────── */
function SocialCard3D({ item, delay }: { item: Social; delay: number }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 300, damping: 28 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 300, damping: 28 })

  const isExternal = item.href.startsWith('http')

  return (
    <a
      href={item.href}
      target={isExternal ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
    >
      <div
        ref={cardRef}
        style={{ perspective: '420px' }}
        onMouseMove={e => {
          const r = cardRef.current?.getBoundingClientRect()
          if (!r) return
          mx.set((e.clientX - r.left) / r.width  - 0.5)
          my.set((e.clientY - r.top)  / r.height - 0.5)
        }}
        onMouseLeave={() => { mx.set(0); my.set(0) }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.2 + delay * 0.5, repeat: Infinity, ease: 'easeInOut', delay }}
          whileHover={{ scale: 1.1 }}
          style={{
            rotateX: rotX, rotateY: rotY,
            width: 72, height: 72,
            borderRadius: 20,
            background: item.gradient,
            position: 'relative',
            cursor: 'pointer',
            boxShadow: `0 16px 40px ${item.glow}, 0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18)`,
          }}
        >
          {/* Top sheen */}
          <div style={{
            position: 'absolute', top: 0, left: '18%', right: '18%', height: 1,
            background: 'rgba(255,255,255,0.4)', borderRadius: 1,
          }} />
          {/* Icon */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SocialIcon iconKey={item.iconKey} />
          </div>
          {/* Bottom glow bleed */}
          <div style={{
            position: 'absolute', bottom: -12, left: '15%', right: '15%',
            height: 16, borderRadius: '50%',
            background: item.glow, filter: 'blur(8px)', opacity: 0.7,
          }} />
        </motion.div>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(120,145,190,0.45)', fontFamily: "'Nunito',sans-serif" }}>
          {item.label}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(185,205,235,0.65)', fontFamily: "'Nunito',sans-serif", marginTop: 2, letterSpacing: '-0.1px' }}>
          {item.handle}
        </div>
      </div>
    </a>
  )
}

/* ── Floating label field ───────────────────────────────────── */
function Field({
  label, name, type = 'text', value, onChange, rows,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0
  const Tag    = rows ? 'textarea' : 'input'

  return (
    <div style={{ position: 'relative', paddingTop: 20 }}>
      {/* Floating label */}
      <label
        style={{
          position: 'absolute',
          left: 0,
          top: lifted ? 2 : 26,
          fontSize: lifted ? 9.5 : 13,
          letterSpacing: lifted ? '0.22em' : '0.04em',
          textTransform: 'uppercase',
          color: focused
            ? 'rgba(212,168,83,0.80)'
            : lifted
              ? 'rgba(140,165,210,0.55)'
              : 'rgba(120,145,195,0.45)',
          fontFamily: "'Nunito', sans-serif",
          transition: 'top 0.22s ease, font-size 0.22s ease, letter-spacing 0.22s ease, color 0.22s ease',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {label}
      </label>

      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${focused ? 'rgba(212,168,83,0.30)' : 'rgba(255,255,255,0.08)'}`,
          padding: rows ? '10px 0 12px' : '8px 0 10px',
          color: 'rgba(220,232,252,0.90)',
          fontSize: 13.5,
          fontFamily: "'Nunito', sans-serif",
          outline: 'none',
          resize: 'none',
          transition: 'border-color 0.25s ease',
          lineHeight: 1.65,
        }}
      />

      {/* Animated focus underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.55), transparent)',
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}

/* ── Main section ───────────────────────────────────────────── */
export default function Contact() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px 0px' })

  const [form, setForm]   = useState({ name: '', email: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1400)
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', paddingBottom: 80 }}
    >

      {/* ── Atmospheric background ─────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Bottom warm gold sweep */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', height: 500,
          background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(212,168,83,0.055), transparent)',
        }} />
        {/* Left blue glow (behind hand) */}
        <div style={{
          position: 'absolute', top: '10%', left: '-5%',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(40,90,220,0.07) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />
        {/* Right subtle glow */}
        <div style={{
          position: 'absolute', top: '30%', right: '-5%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(100,150,255,0.04) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12" style={{ zIndex: 2 }}>

        {/* ── Section label ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 pt-28 lg:pt-36 mb-10"
        >
          <span style={{ width: 32, height: 1, background: '#D4A853', opacity: 0.6, display: 'block' }} />
          <span style={{
            fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.32em',
            color: 'rgba(212,168,83,0.80)', fontFamily: "'Nunito',sans-serif",
          }}>
            Let&rsquo;s Connect
          </span>
        </motion.div>

        {/* ── Cinematic heading ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: EASE, delay: 0.08 }}
          className="mb-4"
        >
          <h2
            className="font-normal leading-[0.92]"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(42px, 6vw, 90px)',
              letterSpacing: '-3px',
              color: 'rgba(232,240,255,0.96)',
              maxWidth: 900,
            }}
          >
            Let&rsquo;s Build Something
            <br />
            <em className="not-italic" style={{ color: 'rgba(212,168,83,0.78)' }}>Intelligent.</em>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: EASE, delay: 0.18 }}
          style={{
            fontSize: 15, lineHeight: 1.75, maxWidth: 540,
            color: 'rgba(135,158,205,0.72)', fontFamily: "'Nunito',sans-serif",
            marginBottom: 64,
          }}
        >
          Whether it&rsquo;s AI systems, interfaces, or futuristic ideas —
          I&rsquo;m always open to creating something meaningful.
        </motion.p>

        {/* ── Form + socials ────────────────────────────────── */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: EASE, delay: 0.28 }}
            className="flex flex-col gap-8"
          >
            {/* Form panel */}
            <div
              style={{
                background: 'rgba(8, 16, 34, 0.72)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: '36px 32px 32px',
              }}
            >
              {/* Form header */}
              <div className="flex items-center gap-3 mb-8">
                <div style={{ width: 20, height: 1, background: 'rgba(212,168,83,0.5)' }} />
                <span style={{
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.26em',
                  color: 'rgba(212,168,83,0.65)', fontFamily: "'Nunito',sans-serif",
                }}>
                  Send a Message
                </span>
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  /* ── Confirmation ── */
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex flex-col items-center text-center py-8 gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'rgba(74,222,128,0.08)',
                        border: '1px solid rgba(74,222,128,0.22)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <CheckCircle size={28} style={{ color: '#4ade80', opacity: 0.85 }} />
                    </motion.div>
                    <div>
                      <p style={{
                        fontSize: 22, fontFamily: "'Instrument Serif',serif",
                        color: 'rgba(228,238,252,0.92)', letterSpacing: '-0.5px', marginBottom: 8,
                      }}>
                        Message received.
                      </p>
                      <p style={{ fontSize: 12.5, color: 'rgba(130,155,200,0.65)', fontFamily: "'Nunito',sans-serif" }}>
                        I&rsquo;ll get back to you as soon as possible.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-7"
                  >
                    <Field
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Field
                      label="Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                    />

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        marginTop: 4,
                        padding: '14px 24px',
                        borderRadius: 12,
                        background: sending
                          ? 'rgba(212,168,83,0.06)'
                          : 'linear-gradient(135deg, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.04) 100%)',
                        border: '1px solid rgba(212,168,83,0.22)',
                        color: 'rgba(212,168,83,0.90)',
                        fontSize: 13,
                        fontFamily: "'Nunito',sans-serif",
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: sending ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        transition: 'background 0.25s, border-color 0.25s',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {sending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{
                              width: 14, height: 14,
                              border: '1.5px solid rgba(212,168,83,0.3)',
                              borderTopColor: 'rgba(212,168,83,0.8)',
                              borderRadius: '50%',
                            }}
                          />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit</span>
                          <Send size={13} style={{ opacity: 0.7 }} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* 3D social cards */}
            <motion.div
              className="flex gap-5 flex-wrap pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            >
              {SOCIALS.map((item, i) => (
                <SocialCard3D key={item.label} item={item} delay={i * 0.55} />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-24 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.045)' }}
        >
          <span style={{
            fontSize: 11, color: 'rgba(110,130,165,0.45)', fontFamily: "'Nunito',sans-serif",
          }}>
            © 2025 BYTEJAY · Jay Pandey · All rights reserved.
          </span>
          <span style={{
            fontSize: 12, fontFamily: "'Instrument Serif',serif",
            color: 'rgba(130,155,200,0.35)', fontStyle: 'italic',
          }}>
            &ldquo;Built at the edge of what&rsquo;s possible.&rdquo;
          </span>
        </motion.div>

      </div>
    </section>
  )
}
