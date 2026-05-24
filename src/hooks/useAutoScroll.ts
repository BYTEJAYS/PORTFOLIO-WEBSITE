import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

const MAX_SPEED    = 0.78   // px / frame at 60fps  (~47px/s — very gentle)
const RAMP_FRAMES  = 90     // frames to ease from 0 → MAX_SPEED (~1.5s at 60fps)
const START_DELAY  = 1800   // ms before auto-scroll begins

// Keys that indicate intentional scroll navigation
const SCROLL_KEYS = new Set([
  'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown',
  ' ', 'Home', 'End',
])

export function useAutoScroll(lenisRef: React.RefObject<Lenis | null>) {
  // Stable ref so the rAF closure always sees the latest stopped state
  const stoppedRef      = useRef(false)
  const lenisPausedRef  = useRef(false)
  const rafRef          = useRef<number>(0)

  useEffect(() => {
    stoppedRef.current     = false
    lenisPausedRef.current = false

    /* ── Stop function — called once on first user interaction ── */
    const stop = () => {
      if (stoppedRef.current) return
      stoppedRef.current = true
      cancelAnimationFrame(rafRef.current)
      if (lenisPausedRef.current) {
        lenisRef.current?.start()
        lenisPausedRef.current = false
      }
    }

    /* ── Interaction listeners (capture phase — fires before Lenis) ── */
    const onWheel      = () => stop()
    const onTouch      = () => stop()
    const onPointerDown = () => stop()
    const onKeyDown    = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key)) stop() }
    const onScroll     = () => {
      // Fires when scrollbar is dragged or any external scroll happens
      // Guard: only stop if we didn't cause this scroll ourselves
      if (!lenisPausedRef.current) stop()
    }

    const OPTS = { capture: true, passive: true } as const
    window.addEventListener('wheel',       onWheel,       OPTS)
    window.addEventListener('touchstart',  onTouch,       OPTS)
    window.addEventListener('touchmove',   onTouch,       OPTS)
    window.addEventListener('pointerdown', onPointerDown, OPTS)
    window.addEventListener('keydown',     onKeyDown,     OPTS)
    // scrollbar drag — listen in bubble phase (capture gives false positives)
    window.addEventListener('scroll',      onScroll,      { passive: true })

    /* ── Start auto-scroll after delay ──────────────────────── */
    const timer = setTimeout(() => {
      if (stoppedRef.current) return

      const lenis = lenisRef.current
      if (!lenis) return

      // Pause Lenis so it doesn't fight our direct scroll increments
      lenis.stop()
      lenisPausedRef.current = true

      let frame = 0

      const tick = () => {
        if (stoppedRef.current) return

        // Smooth-step ramp-up: 0 → MAX_SPEED over RAMP_FRAMES
        frame++
        const t      = Math.min(1, frame / RAMP_FRAMES)
        const eased  = t * t * (3 - 2 * t)       // smoothstep
        const speed  = MAX_SPEED * eased

        const max = document.documentElement.scrollHeight - window.innerHeight
        if (window.scrollY >= max - 1) {
          stop()
          return
        }

        window.scrollBy(0, speed)
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, START_DELAY)

    return () => {
      clearTimeout(timer)
      stop()
      window.removeEventListener('wheel',       onWheel,       OPTS)
      window.removeEventListener('touchstart',  onTouch,       OPTS)
      window.removeEventListener('touchmove',   onTouch,       OPTS)
      window.removeEventListener('pointerdown', onPointerDown, OPTS)
      window.removeEventListener('keydown',     onKeyDown,     OPTS)
      window.removeEventListener('scroll',      onScroll)
    }
  }, [lenisRef])
}
