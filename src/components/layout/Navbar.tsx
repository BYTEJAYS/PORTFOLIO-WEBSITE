import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, label: string, href: string) => {
    e.preventDefault()
    setActive(label)
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(2, 11, 24, 0.75)'
          : 'rgba(2, 11, 24, 0.0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* Logo removed */}
        <div className="flex-shrink-0" />

        {/* Desktop Nav — centered */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleNav(e, label, href)}
              className="relative text-sm text-white/60 hover:text-white/95 transition-colors duration-300 py-1 group"
            >
              {label}
              {/* Underline indicator */}
              <span
                className={`absolute bottom-0 left-0 h-px bg-gold-400 transition-all duration-300 ${
                  active === label ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Right: CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            onClick={(e) => handleNav(e, 'Contact', '#contact')}
            className="hidden md:inline-flex liquid-glass rounded-full px-6 py-2.5 text-sm text-white hover:scale-[1.04] transition-transform duration-200 cursor-pointer"
          >
            Begin Journey
          </a>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-px bg-white/70 block origin-center transition-colors"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
              className="w-5 h-px bg-white/70 block"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-px bg-white/70 block origin-center"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(2, 11, 24, 0.95)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col px-6 py-6 gap-4 border-t border-white/5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => handleNav(e, label, href)}
                  className="text-base text-white/70 hover:text-white transition-colors py-2"
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNav(e, 'Contact', '#contact')}
                className="liquid-glass rounded-full px-6 py-3 text-sm text-white text-center mt-2 cursor-pointer"
              >
                Begin Journey
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
