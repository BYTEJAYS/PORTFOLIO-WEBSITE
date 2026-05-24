const navLinks = [
  { label: 'Home', active: true },
  { label: 'Studio' },
  { label: 'About' },
  { label: 'Journal' },
  { label: 'Reach Us' },
]

export default function Navbar() {
  return (
    <nav className="relative z-10 w-full">
      <div className="flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <span
          className="text-3xl tracking-tight text-foreground select-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          BYTEJAY<sup className="text-xs">®</sup>
        </span>

        {/* Nav links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, active }) => (
            <li key={label}>
              <a
                href="#"
                className={`text-sm transition-colors ${
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03] cursor-pointer">
          Begin Journey
        </button>
      </div>
    </nav>
  )
}
