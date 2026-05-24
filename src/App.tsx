import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import './index.css'
import StarField from './components/ui/StarField'
import Navbar from './components/layout/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'
import { useAutoScroll } from './hooks/useAutoScroll'

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)

  /* Smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let raf: number
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      cancelAnimationFrame(raf)
    }
  }, [])

  /* Cinematic auto-scroll — stops permanently on first user interaction */
  useAutoScroll(lenisRef)

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#020B18' }}
    >
      {/* Fixed starfield — persists across all sections */}
      <StarField />

      {/* Floating navbar */}
      <Navbar />

      {/* One connected cinematic universe */}
      <main>
        <Hero />

        {/* Section divider — hero → about */}
        <SectionDivider />

        <About />

        {/* Section divider — about → projects */}
        <SectionDivider />

        <Projects />

        {/* Section divider — projects → skills */}
        <SectionDivider />

        <Skills />

        {/* Section divider — skills → contact */}
        <SectionDivider />

        <Contact />
      </main>
    </div>
  )
}

function SectionDivider() {
  return (
    <div
      className="w-full pointer-events-none"
      style={{
        height: '1px',
        background:
          'linear-gradient(to right, transparent, rgba(255,255,255,0.06) 30%, rgba(212,168,83,0.12) 50%, rgba(255,255,255,0.06) 70%, transparent)',
        margin: '0 auto',
        maxWidth: '960px',
      }}
    />
  )
}
