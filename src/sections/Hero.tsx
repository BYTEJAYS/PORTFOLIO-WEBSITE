import { motion } from 'framer-motion'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Video background ─────────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ── Gradient overlays for depth ────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(to bottom, rgba(2,11,24,0.35) 0%, rgba(2,11,24,0.15) 40%, rgba(2,11,24,0.55) 80%, #020B18 100%)',
        }}
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(to right, rgba(2,11,24,0.5) 0%, transparent 20%, transparent 80%, rgba(2,11,24,0.5) 100%)',
        }}
      />

      {/* ── Hero content ─────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center flex-1 px-6 pt-28 pb-24" style={{ zIndex: 3 }}>

        {/* Eyebrow tag */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="w-8 h-px bg-gold-400 opacity-70" />
          <span
            className="text-xs uppercase tracking-[0.28em] text-gold-400 opacity-80"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            AI Engineer · Creator · Dreamer
          </span>
          <span className="w-8 h-px bg-gold-400 opacity-70" />
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.92] max-w-6xl"
          style={{
            fontFamily: "'Instrument Serif', serif",
            letterSpacing: '-3px',
            color: 'rgba(240, 242, 248, 0.96)',
          }}
        >
          Where{' '}
          <em
            className="not-italic"
            style={{ color: 'rgba(212, 168, 83, 0.85)' }}
          >
            dreams
          </em>
          {' '}rise through{' '}
          <em
            className="not-italic"
            style={{ color: 'rgba(170, 195, 240, 0.75)' }}
          >
            the silence.
          </em>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl max-w-2xl mt-9 leading-relaxed"
          style={{ color: 'rgba(160, 175, 200, 0.8)' }}
        >
          I'm BYTEJAY — a 19-year-old AI engineer navigating the frontier where intelligence, creativity, and imagination converge into something entirely new.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-12"
        >
          <button
            onClick={() => scrollTo('#projects')}
            className="liquid-glass rounded-full px-10 py-4 text-sm text-white hover:scale-[1.04] transition-all duration-300 cursor-pointer"
            style={{ letterSpacing: '0.04em' }}
          >
            Explore Work
          </button>
          <button
            onClick={() => scrollTo('#about')}
            className="rounded-full px-10 py-4 text-sm hover:scale-[1.04] transition-all duration-300 cursor-pointer border border-white/15 hover:border-white/30"
            style={{ color: 'rgba(200, 215, 235, 0.8)', letterSpacing: '0.04em' }}
          >
            About Me
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => scrollTo('#about')}
        >
          <span
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{ color: 'rgba(160,175,200,0.5)' }}
          >
            Scroll
          </span>
          <div className="w-px h-10 relative overflow-hidden">
            <motion.div
              className="absolute inset-x-0 top-0 h-full"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.8), transparent)' }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
