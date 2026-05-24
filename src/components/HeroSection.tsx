export default function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40">
      {/* H1 */}
      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] max-w-7xl text-foreground"
        style={{
          fontFamily: "'Instrument Serif', serif",
          letterSpacing: '-2.46px',
        }}
      >
        Where{' '}
        <em className="not-italic text-muted-foreground">dreams</em> rise{' '}
        <em className="not-italic text-muted-foreground">through the silence.</em>
      </h1>

      {/* Subtext */}
      <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        Building at the intersection of AI and creativity — one quiet, focused
        experiment at a time. This is where the work begins.
      </p>

      {/* CTA */}
      <button className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 transition-transform hover:scale-[1.03] cursor-pointer">
        Begin Journey
      </button>
    </section>
  )
}
