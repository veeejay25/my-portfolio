import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Animation variables
    let eV = [], ee1 = [], ee2 = [], eJ = [], ea = [], ey = []
    let hV = [], he1 = [], he2 = [], hJ = [], ha = [], hy = []
    let WIDTH, HEIGHT
    let animationId

    const v = (32 + 16 + 8) * 3
    const R = Math.random
    const C = Math.cos
    const Y = 6.3

    // Function to update canvas size and letter positions
    function resizeCanvas() {
      WIDTH = canvas.width = window.innerWidth
      HEIGHT = canvas.height = window.innerHeight
      
      // Recalculate letter positions
      hV = addLetterShape(vShape, -300, 0)
      he1 = addLetterShape(e1Shape, -150, 0)
      he2 = addLetterShape(e2Shape, -40, 0)
      hJ = addLetterShape(jShape, 130, 0)
      ha = addLetterShape(aShape, 270, 0)
      hy = addLetterShape(yShape, 380, 0)
    }

    // Add resize event listener
    window.addEventListener('resize', resizeCanvas)

    // Function to add letter shapes
    function addLetterShape(points, offsetX, offsetY) {
      return points.map(([x, y]) => [WIDTH / 2 + x + offsetX, HEIGHT / 2 + y + offsetY])
    }

    // Letter shapes (scaled up by 1.5x)
    let vShape = [
      [-75, -120],
      [-30, -120],
      [0, 27],
      [30, -120],
      [75, -120],
      [30, 75],
      [-30, 75]
    ]

    let e1Shape = [
      [-45, -120],
      [-45, 75],
      [45, 75],
      [45, 45],
      [-15, 45],
      [-15, 0],
      [30, 0],
      [30, -30],
      [-15, -30],
      [-15, -100],
      [45, -100],
      [45, -120]
    ]

    let e2Shape = [
      [-30, -120],
      [-30, 75],
      [60, 75],
      [60, 45],
      [0, 45],
      [0, 0],
      [45, 0],
      [45, -30],
      [0, -30],
      [0, -100],
      [60, -100],
      [60, -120]
    ]

    let jShape = [
      [-67, -15],
      [-30, -15],
      [-15, 27],
      [15, 27],
      [30, -120],
      [67, -120],
      [52, 75],
      [-52, 75]
    ]

    let aShape = [
      [-60, 75],
      [-30, 75],
      [-15, -120],
      [15, -120],
      [30, 75],
      [60, 75],
      [45, 30],
      [-45, 30]
    ]

    let yShape = [
      [-60, -120],
      [-30, -120],
      [0, 0],
      [30, -120],
      [60, -120],
      [30, 45],
      [15, 75],
      [-15, 75],
      [-30, 45]
    ]

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
      updateParticles(eV, hV)
      updateParticles(ee1, he1)
      updateParticles(ee2, he2)
      updateParticles(eJ, hJ)
      updateParticles(ea, ha)
      updateParticles(ey, hy)
      animationId = requestAnimationFrame(animate)
    }

    // Initialize everything
    resizeCanvas()

    // Assign target points to each shape with proper spacing
    hV = addLetterShape(vShape, -300, 0)
    he1 = addLetterShape(e1Shape, -150, 0)
    he2 = addLetterShape(e2Shape, -40, 0)
    hJ = addLetterShape(jShape, 130, 0)
    ha = addLetterShape(aShape, 270, 0)
    hy = addLetterShape(yShape, 380, 0)

    // Initialize particles for all letters
    let particleCount = v / 6
    initializeParticles(eV, hV, particleCount)
    initializeParticles(ee1, he1, particleCount)
    initializeParticles(ee2, he2, particleCount)
    initializeParticles(eJ, hJ, particleCount)
    initializeParticles(ea, ha, particleCount)
    initializeParticles(ey, hy, particleCount)

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <div className="App">
      <canvas ref={canvasRef} id="alx" />
    </div>
  )
}

export default App
