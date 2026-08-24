import { useEffect, useRef } from 'react'
import { REVEAL_MS } from './Board'

/**
 * A one-shot confetti burst for a winning guess.
 *
 * Hand-rolled rather than pulled from npm: it's a hundred lines of canvas and
 * the alternative is a runtime dependency for a single animation. Particles are
 * drawn as rotating rectangles whose horizontal scale oscillates, which reads as
 * a piece of paper tumbling without needing any real 3D.
 */

const PARTICLE_COUNT = 180
/** Pixels per frame², at 60fps. Tuned by eye — higher feels like hail. */
const GRAVITY = 0.32
/** Air resistance per frame. Bleeds off the launch impulse so the arc settles. */
const DRAG = 0.994
const LIFETIME_MS = 3800
/** Particles start fading here, so the burst thins out instead of vanishing. */
const FADE_FROM_MS = 2200

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  /** Radians, current rotation of the paper. */
  rot: number
  vrot: number
  w: number
  h: number
  color: string
  /** Phase offset so the tumble isn't synchronised across particles. */
  phase: number
}

/** Palette pulled from the stylesheet so the burst tracks light/dark mode. */
function confettiColors(): string[] {
  const style = getComputedStyle(document.documentElement)
  const token = (name: string) => style.getPropertyValue(name).trim()
  return [token('--correct'), token('--present'), token('--correct'), '#e8577d', '#4b8bf5']
}

function makeParticles(width: number, height: number): Particle[] {
  const colors = confettiColors()

  // Two cannons angled inward from the bottom corners. A single overhead
  // sprinkle covers the board itself, which is the part you want to look at.
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const fromLeft = i % 2 === 0
    const spread = Math.random() * 0.9 - 0.45
    const angle = (fromLeft ? -Math.PI / 3 : (-Math.PI * 2) / 3) + spread
    const speed = 14 + Math.random() * 12

    return {
      x: fromLeft ? 0 : width,
      y: height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.3,
      w: 6 + Math.random() * 5,
      h: 10 + Math.random() * 6,
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2,
    }
  })
}

export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    // Someone who asked for less motion gets the win banner and nothing else.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let frame = 0
    let start = 0
    let particles: Particle[] = []

    // Match the backing store to the device pixel ratio, or the paper edges
    // come out soft on a retina display.
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (now: number) => {
      if (!start) {
        start = now
        particles = makeParticles(window.innerWidth, window.innerHeight)
      }
      const elapsed = now - start
      const width = window.innerWidth
      const height = window.innerHeight

      context.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.vy += GRAVITY
        p.vx *= DRAG
        p.vy *= DRAG
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot

        context.save()
        context.globalAlpha =
          elapsed < FADE_FROM_MS
            ? 1
            : Math.max(0, 1 - (elapsed - FADE_FROM_MS) / (LIFETIME_MS - FADE_FROM_MS))
        context.translate(p.x, p.y)
        context.rotate(p.rot)
        // Squashing width on a sine is the whole tumble effect.
        context.scale(Math.cos(elapsed / 180 + p.phase), 1)
        context.fillStyle = p.color
        context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        context.restore()
      }

      if (elapsed < LIFETIME_MS) {
        frame = requestAnimationFrame(draw)
      } else {
        context.clearRect(0, 0, width, height)
      }
    }

    // Hold off until the winning row has finished flipping — firing during the
    // reveal buries the thing the player is waiting to see.
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(draw)
    }, REVEAL_MS)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
}
