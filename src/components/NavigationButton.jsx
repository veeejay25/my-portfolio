import { useEffect, useRef } from 'react'
import './NavigationButton.css'

const NavigationButton = ({ 
  shape, 
  position, 
  color, 
  text, 
  href, 
  onClick 
}) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const targetsRef = useRef([])
  const animationIdRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const size = 400
    canvas.width = size
    canvas.height = size

    // Use same particle configuration as main app
    const v = (32 + 16 + 8) * 2.5 // Same as original
    const R = Math.random
    const Y = 6.3

    // Center the shape in the canvas
    const centerX = size / 2
    const centerY = size / 2
    const scale = 1.0

    // Convert shape points to canvas coordinates
    targetsRef.current = shape.map(([x, y]) => [
      centerX + (x * scale), 
      centerY + (y * scale)
    ])

    // Initialize particles using same config as original
    function initializeParticles() {
      particlesRef.current = []
      const particleCount = v / 25 // Reduced for individual buttons but keeping ratio
      
      for (let i = 0; i < particleCount; i++) {
        let x = R() * size
        let y = R() * size
        let H = 80 * (i / particleCount) + Math.random() * 100
        let S = 40 * R() + 60
        let B = 60 * R() + 20
        let f = []
        
        for (let k = 0; k < v / 5; k++) {
          f[k] = {
            x: x,
            y: y,
            X: 0,
            Y: 0,
            R: 1 - k / v + 1,
            S: R() + 1,
            q: ~~(R() * targetsRef.current.length),
            D: 2 * (i % 2) - 1,
            F: 0.2 * R() + 0.7,
            f: color.replace('hsl', 'hsla').replace(')', ',.1)')
          }
        }
        particlesRef.current.push(f)
      }
    }

    function drawParticle(d) {
      ctx.fillStyle = d.f
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.R, 0, Y, 1)
      ctx.closePath()
      ctx.fill()
    }

    function updateParticles() {
      for (let i = particlesRef.current.length; i--;) {
        let f = particlesRef.current[i]
        let u = f[0]
        let q = targetsRef.current[u.q]
        let D = u.x - q[0]
        let E = u.y - q[1]
        let G = Math.sqrt(D * D + E * E)
        
        if (G < 10) {
          if (0.95 < R()) u.q = ~~(R() * targetsRef.current.length)
          else if (0.99 < R()) u.D *= -1
          u.q += u.D
          u.q %= targetsRef.current.length
          if (u.q < 0) u.q += targetsRef.current.length
        }
        
        u.X += -D / G * u.S
        u.Y += -E / G * u.S
        u.x += u.X
        u.y += u.Y
        drawParticle(u)
        u.X *= u.F
        u.Y *= u.F
        
        for (let k = 0; k < v / 5 - 1;) {
          let T = f[k]
          let N = f[++k]
          N.x -= 0.7 * (N.x - T.x)
          N.y -= 0.7 * (N.y - T.y)
          drawParticle(N)
        }
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,.2)"
      ctx.fillRect(0, 0, size, size)
      updateParticles()
      animationIdRef.current = requestAnimationFrame(animate)
    }

    initializeParticles()
    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      particlesRef.current = []
      targetsRef.current = []
    }
  }, [shape, color])

  const handleClick = (e) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    } else if (href) {
      window.location.href = href
    }
  }

  return (
    <div className={`navigation-button ${position}`} onClick={handleClick}>
      <canvas 
        ref={canvasRef} 
        className="button-canvas"
      />
      {text && (
        <div className="button-label">
          {text}
        </div>
      )}
    </div>
  )
}

export default NavigationButton