import { useEffect, useRef } from 'react'
import NavigationButton from './components/NavigationButton'
import './App.css'

function App() {
  const canvasRef = useRef(null)
  const hoveredButtonsRef = useRef(new Set())

  // Hover handlers for navigation buttons
  const handleButtonMouseEnter = (buttonIndex) => {
    hoveredButtonsRef.current = new Set([...hoveredButtonsRef.current, buttonIndex])
  }

  const handleButtonMouseLeave = (buttonIndex) => {
    const newSet = new Set(hoveredButtonsRef.current)
    newSet.delete(buttonIndex)
    hoveredButtonsRef.current = newSet
  }

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
    const Y = 6.3

    // Letter shapes
    const LETTER_SHAPES = {
      V: [[-60, -120], [-25, -120], [0, 20], [25, -120], [60, -120], [25, 75], [-25, 75]],
      E: [[-60, -120], [-60, 75], [60, 75], [60, 45], [-20, 45], [-20, 0], [40, 0], [40, -30], [-20, -30], [-20, -100], [60, -100], [60, -120]],
      J: [[60, -120], [60, 45], [40, 65], [0, 75], [-40, 65], [-60, 45], [-60, 25], [-20, 25], [-20, 55], [0, 60], [20, 55], [20, -120], [60, -120]],
      A: [[-60, 75], [-25, 75], [-10, 15], [10, 15], [25, 75], [60, 75], [15, -120], [-15, -120], [-60, 75]],
      Y: [[-60, -120], [-25, -120], [0, -15], [25, -120], [60, -120], [20, 0], [20, 75], [-20, 75], [-20, 0], [-60, -120]]
    }

    // Navigation buttons
    const NAV_BUTTONS = [
      { name: 'about', text: 'About me', color: 'hsla(120, 70%, 50%, 0.3)', href: '#about' },
      { name: 'projects', text: 'Projects', color: 'hsla(0, 70%, 50%, 0.3)', href: '#projects' },
      { name: 'skills', text: 'Skills', color: 'hsla(240, 70%, 50%, 0.3)', href: '#skills' },
      { name: 'contact', text: 'Contact', color: 'hsla(300, 70%, 50%, 0.3)', href: '#contact' }
    ]

    // Initialize particle systems
    const LETTERS = [
      { letter: 'V', shape: LETTER_SHAPES.V, position: -375, particles: [], targets: [] },
      { letter: 'E', shape: LETTER_SHAPES.E, position: -225, particles: [], targets: [] },
      { letter: 'E', shape: LETTER_SHAPES.E, position: -75, particles: [], targets: [] },
      { letter: 'J', shape: LETTER_SHAPES.J, position: 100, particles: [], targets: [] },
      { letter: 'A', shape: LETTER_SHAPES.A, position: 250, particles: [], targets: [] },
      { letter: 'Y', shape: LETTER_SHAPES.Y, position: 375, particles: [], targets: [] }
    ]

    const NAV_BORDERS = NAV_BUTTONS.map((button, index) => ({
      name: `${button.name}-border`,
      particles: [],
      targets: [],
      buttonIndex: index,
      color: button.color
    }))

    function addLetterShape(points, offsetX, offsetY, scale = 1) {
      return points.map(([x, y]) => [WIDTH / 2 + (x * scale) + (offsetX * scale), HEIGHT / 2 + (y * scale) + (offsetY * scale)])
    }

    function calculateNavButtonPositions() {
      const buttonCount = 4
      const buttonWidth = 200
      const buttonGap = 60
      const totalWidth = (buttonWidth * buttonCount) + (buttonGap * (buttonCount - 1))
      const startX = WIDTH / 2 - totalWidth / 2
      const navBottom = 50
      const buttonY = HEIGHT - navBottom - 45
      
      const positions = []
      for (let i = 0; i < buttonCount; i++) {
        const buttonX = startX + (buttonWidth / 2) + (i * (buttonWidth + buttonGap))
        positions.push({ x: buttonX, y: buttonY })
      }
      return positions
    }

    function createButtonOutlineTargets(buttonCenter, width, height, radius) {
      const points = []
      const halfWidth = width / 2
      const halfHeight = height / 2
      const pointDensity = 4
      
      // Create outline points (simplified)
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 20) {
        points.push([
          buttonCenter.x + Math.cos(angle) * (width / 2.5),
          buttonCenter.y + Math.sin(angle) * (height / 2.5)
        ])
      }
      
      return points
    }

    function initializeParticles(particleArray, targetPoints, particleCount, colorOverride) {
      for (let i = 0; i < particleCount; i++) {
        let x = R() * WIDTH
        let y = R() * HEIGHT
        let H = 80 * (i / particleCount) + Math.random() * 100
        let S = 40 * R() + 60
        let B = 60 * R() + 20
        let f = []
        for (let k = 0; k < v / 5; k++) f[k] = {
          x: x, y: y, X: 0, Y: 0,
          R: 1 - k / v + 1,
          S: R() + 1,
          q: ~~(R() * targetPoints.length),
          D: 2 * (i % 2) - 1,
          F: 0.2 * R() + 0.7,
          f: colorOverride || `hsla(${~~H},${~~S}%,${~~B}%,.1)`
        }
        particleArray.push(f)
      }
    }

    function spawnNavParticles(buttonIndex) {
      const borderConfig = NAV_BORDERS[buttonIndex]
      if (!borderConfig || borderConfig.particles.length > 0) return
      
      const navPositions = calculateNavButtonPositions()
      const buttonCenter = navPositions[buttonIndex]
      if (!buttonCenter) return
      
      borderConfig.targets = createButtonOutlineTargets(buttonCenter, 200, 90, 45)
      
      const navParticleCount = v / 40
      for (let i = 0; i < navParticleCount; i++) {
        let x = buttonCenter.x + (R() - 0.5) * 120
        let y = buttonCenter.y + (R() - 0.5) * 120
        let H = 80 * (i / navParticleCount) + Math.random() * 100
        let S = 40 * R() + 60
        let B = 60 * R() + 20
        let f = []
        
        for (let k = 0; k < v / 5; k++) {
          f[k] = {
            x: x, y: y, X: 0, Y: 0,
            R: 1 - k / v + 1,
            S: R() + 1,
            q: ~~(R() * borderConfig.targets.length),
            D: 2 * (i % 2) - 1,
            F: 0.2 * R() + 0.7,
            f: borderConfig.color || `hsla(${~~H},${~~S}%,${~~B}%,.1)`
          }
        }
        borderConfig.particles.push(f)
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
        
        for (let k = 0; k < v / 5 - 1;) {
          let T = f[k]
          let N = f[++k]
          if (N) {
            N.x -= 0.7 * (N.x - T.x)
            N.y -= 0.7 * (N.y - T.y)
            path(N)
          }
        }
      }
    }

    function resizeCanvas() {
      WIDTH = canvas.width = window.innerWidth
      HEIGHT = canvas.height = window.innerHeight
      
      const baseWidth = 1920
      const baseHeight = 1080
      const scaleX = WIDTH / baseWidth
      const scaleY = HEIGHT / baseHeight
      const scale = Math.min(scaleX, scaleY, 1.0) * 1.5
      
      LETTERS.forEach(letterConfig => {
        letterConfig.targets = addLetterShape(letterConfig.shape, letterConfig.position, 0, scale)
      })
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,.2)"
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      
      LETTERS.forEach(letterConfig => {
        updateParticles(letterConfig.particles, letterConfig.targets)
      })
      
      NAV_BORDERS.forEach((borderConfig, index) => {
        const isHovered = hoveredButtonsRef.current.has(index)
        const hasParticles = borderConfig.particles.length > 0
        
        if (isHovered && !hasParticles) {
          spawnNavParticles(index)
        } else if (!isHovered && hasParticles) {
          borderConfig.particles.length = 0
        }
        
        if (borderConfig.particles.length > 0) {
          updateParticles(borderConfig.particles, borderConfig.targets)
        }
      })
      
      animationId = requestAnimationFrame(animate)
    }

    let resizeTimeout
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }
    window.addEventListener('resize', handleResize)

    resizeCanvas()

    const particleCount = v / 12
    LETTERS.forEach(letterConfig => {
      initializeParticles(letterConfig.particles, letterConfig.targets, particleCount)
    })

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="App">
      <canvas ref={canvasRef} id="alx" />
      
      {/* Navigation Buttons */}
      <div className="navigation-container">
        {[
          { name: 'about', text: 'About me', color: 'hsla(120, 70%, 50%, 0.3)', href: '#about' },
          { name: 'projects', text: 'Projects', color: 'hsla(0, 70%, 50%, 0.3)', href: '#projects' },
          { name: 'skills', text: 'Skills', color: 'hsla(240, 70%, 50%, 0.3)', href: '#skills' },
          { name: 'contact', text: 'Contact', color: 'hsla(300, 70%, 50%, 0.3)', href: '#contact' }
        ].map((button, index) => (
          <NavigationButton
            key={button.name}
            position="bottom-horizontal"
            color={button.color}
            text={button.text}
            href={button.href}
            buttonIndex={index}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          />
        ))}
      </div>
    </div>
  )
}

export default App
