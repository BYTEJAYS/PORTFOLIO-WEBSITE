import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
  parallax: number
  vx: number
  vy: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef<number>(0)
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const buildStars = (w: number, h: number) => {
      const density = Math.floor((w * h) / 5500)
      starsRef.current = Array.from({ length: Math.max(density, 80) }, () => {
        const tier = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size:  tier > 0.94 ? Math.random() * 1.8 + 1.2
               : tier > 0.75 ? Math.random() * 0.8 + 0.6
               :                Math.random() * 0.5 + 0.2,
          opacity: tier > 0.94 ? Math.random() * 0.5 + 0.5
                 : tier > 0.75 ? Math.random() * 0.4 + 0.25
                 :                Math.random() * 0.3 + 0.1,
          twinkleSpeed: Math.random() * 0.018 + 0.004,
          twinklePhase: Math.random() * Math.PI * 2,
          parallax: Math.random() * 0.04 + 0.005,
          vx: (Math.random() - 0.5) * 0.018,
          vy: (Math.random() - 0.5) * 0.018,
        }
      })
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      buildStars(canvas.width, canvas.height)
    }

    const draw = () => {
      tRef.current += 1
      const t = tRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const s of starsRef.current) {
        s.x += s.vx
        s.y += s.vy
        if (s.x < 0) s.x = canvas.width
        if (s.x > canvas.width) s.x = 0
        if (s.y < 0) s.y = canvas.height
        if (s.y > canvas.height) s.y = 0

        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.25 + 0.75
        const px = (mx / canvas.width  - 0.5) * s.parallax * 120
        const py = (my / canvas.height - 0.5) * s.parallax * 120
        const dx = s.x + px
        const dy = s.y + py
        const alpha = s.opacity * twinkle

        // Core dot
        ctx.beginPath()
        ctx.arc(dx, dy, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,235,255,${alpha})`
        ctx.fill()

        // Soft glow for bright stars
        if (s.size > 1.1) {
          const r = s.size * 5
          const g = ctx.createRadialGradient(dx, dy, 0, dx, dy, r)
          g.addColorStop(0, `rgba(180,210,255,${alpha * 0.35})`)
          g.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(dx, dy, r, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse, { passive: true })
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.75 }}
    />
  )
}
