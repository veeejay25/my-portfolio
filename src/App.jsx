import { useEffect, useRef, useMemo } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)

  // Memoize letter configurations to prevent recreation on each render
  const letterConfigs = useMemo(() => {
    const LETTER_SHAPES = {
      V: [
        [-60, -120], [-25, -120], [0, 20], [25, -120], 
        [60, -120], [25, 75], [-25, 75]
      ],
      E: [
        [-60, -120], [-60, 75], [60, 75], [60, 45], [-20, 45], 
        [-20, 0], [40, 0], [40, -30], [-20, -30], [-20, -100], 
        [60, -100], [60, -120]
      ],
      J: [
        [60, -120], [60, 45], [40, 65], [0, 75], [-40, 65], 
        [-60, 45], [-60, 25], [-20, 25], [-20, 55], [0, 60], 
        [20, 55], [20, -120], [60, -120]
      ],
      A: [
        [-60, 75], [-25, 75], [-10, 15], [10, 15], [25, 75], 
        [60, 75], [15, -120], [-15, -120], [-60, 75]
      ],
      Y: [
        [-60, -120], [-25, -120], [0, -15], [25, -120], [60, -120], 
        [20, 0], [20, 75], [-20, 75], [-20, 0], [-60, -120]
      ]
    }

    return [
      { letter: 'V', shape: LETTER_SHAPES.V, position: -375, particles: [], targets: [] },
      { letter: 'E', shape: LETTER_SHAPES.E, position: -225, particles: [], targets: [] },
      { letter: 'E', shape: LETTER_SHAPES.E, position: -75, particles: [], targets: [] },
      { letter: 'J', shape: LETTER_SHAPES.J, position: 100, particles: [], targets: [] },
      { letter: 'A', shape: LETTER_SHAPES.A, position: 250, particles: [], targets: [] },
      { letter: 'Y', shape: LETTER_SHAPES.Y, position: 375, particles: [], targets: [] }
    ]
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Animation variables
    let WIDTH, HEIGHT
    let animationId

    const v = (32 + 16 + 8) * 4
    const R = Math.random
    const C = Math.cos
    const Y = 6.3

    // Function to update canvas size and letter positions
    function resizeCanvas() {
      WIDTH = canvas.width = window.innerWidth
      HEIGHT = canvas.height = window.innerHeight
      
      // Recalculate letter positions
      LETTERS.forEach(letterConfig => {
        letterConfig.targets = addLetterShape(letterConfig.shape, letterConfig.position, 0)
      })
    }

    // Add resize event listener with throttling
    let resizeTimeout
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }
    window.addEventListener('resize', handleResize)

    // Function to add letter shapes
    function addLetterShape(points, offsetX, offsetY) {
      return points.map(([x, y]) => [WIDTH / 2 + x + offsetX, HEIGHT / 2 + y + offsetY])
    }

    // Use memoized letter configurations
    const LETTERS = letterConfigs

    // Function to initialize particles for any letter
    function initializeParticles(particleArray, targetPoints, particleCount) {
      for (let i = 0; i < particleCount; i++) {
        let x = R() * WIDTH
        let y = R() * HEIGHT
        let H = 80 * (i / particleCount) + Math.random() * 100
        let S = 40 * R() + 60
        let B = 60 * R() + 20
        let f = []
        for (let k = 0; k < v / 6; k++) f[k] = {
          x: x,
          y: y,
          X: 0,
          Y: 0,
          R: 1 - k / v + 1,
          S: R() + 1,
          q: ~~(R() * targetPoints.length),
          D: 2 * (i % 2) - 1,
          F: 0.2 * R() + 0.7,
          f: `hsla(${~~H},${~~S}%,${~~B}%,.1)`
        }
        particleArray.push(f)
      }
    }

    function path(d) {
      ctx.fillStyle = d.f
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.R, 0, Y, 1)
      ctx.closePath()
      ctx.fill()
    }

    function updateParticles(particles, targets) {
      for (let i = particles.length; i--;) {
        let f = particles[i]
        let u = f[0]
        let q = targets[u.q]
        let D = u.x - q[0]
        let E = u.y - q[1]
        let G = Math.sqrt(D * D + E * E)
        if (G < 10) {
          if (0.95 < R()) u.q = ~~(R() * targets.length)
          else if (0.99 < R()) u.D *= -1
          u.q += u.D
          u.q %= targets.length
          if (u.q < 0) u.q += targets.length
        }
        u.X += -D / G * u.S
        u.Y += -E / G * u.S
        u.x += u.X
        u.y += u.Y
        path(u)
        u.X *= u.F
        u.Y *= u.F
        for (let k = 0; k < v / 6 - 1;) {
          let T = f[k]
          let N = f[++k]
          N.x -= 0.7 * (N.x - T.x)
          N.y -= 0.7 * (N.y - T.y)
          path(N)
        }
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,.2)"
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      LETTERS.forEach(letterConfig => {
        updateParticles(letterConfig.particles, letterConfig.targets)
      })
      animationId = requestAnimationFrame(animate)
    }

    // Initialize everything
    resizeCanvas()

    // Initialize particles for all letters
    const particleCount = v / 6
    LETTERS.forEach(letterConfig => {
      initializeParticles(letterConfig.particles, letterConfig.targets, particleCount)
    })

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      // Clear particles arrays
      LETTERS.forEach(letterConfig => {
        letterConfig.particles.length = 0
        letterConfig.targets.length = 0
      })
    }
  }, [letterConfigs])

  return (
    <div className="App">
      <canvas ref={canvasRef} id="alx" />
    </div>
  )
}

export default App
