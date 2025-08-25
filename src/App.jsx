import { useEffect, useRef, useMemo } from 'react'
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

    // Function to generate rounded rectangle border points
    function generateRoundedRectBorder(width, height, radius, pointDensity = 2) {
      const points = []
      const halfWidth = width / 2
      const halfHeight = height / 2
      
      // Top edge (left to right)
      for (let x = -halfWidth + radius; x <= halfWidth - radius; x += pointDensity) {
        points.push([x, -halfHeight])
      }
      
      // Top-right corner
      for (let angle = -Math.PI/2; angle <= 0; angle += Math.PI/(radius * 2)) {
        points.push([
          halfWidth - radius + Math.cos(angle) * radius,
          -halfHeight + radius + Math.sin(angle) * radius
        ])
      }
      
      // Right edge (top to bottom)
      for (let y = -halfHeight + radius; y <= halfHeight - radius; y += pointDensity) {
        points.push([halfWidth, y])
      }
      
      // Bottom-right corner
      for (let angle = 0; angle <= Math.PI/2; angle += Math.PI/(radius * 2)) {
        points.push([
          halfWidth - radius + Math.cos(angle) * radius,
          halfHeight - radius + Math.sin(angle) * radius
        ])
      }
      
      // Bottom edge (right to left)
      for (let x = halfWidth - radius; x >= -halfWidth + radius; x -= pointDensity) {
        points.push([x, halfHeight])
      }
      
      // Bottom-left corner
      for (let angle = Math.PI/2; angle <= Math.PI; angle += Math.PI/(radius * 2)) {
        points.push([
          -halfWidth + radius + Math.cos(angle) * radius,
          halfHeight - radius + Math.sin(angle) * radius
        ])
      }
      
      // Left edge (bottom to top)
      for (let y = halfHeight - radius; y >= -halfHeight + radius; y -= pointDensity) {
        points.push([-halfWidth, y])
      }
      
      // Top-left corner
      for (let angle = Math.PI; angle <= 3*Math.PI/2; angle += Math.PI/(radius * 2)) {
        points.push([
          -halfWidth + radius + Math.cos(angle) * radius,
          -halfHeight + radius + Math.sin(angle) * radius
        ])
      }
      
      return points
    }

    return {
      letters: [
        { letter: 'V', shape: LETTER_SHAPES.V, position: -375, particles: [], targets: [] },
        { letter: 'E', shape: LETTER_SHAPES.E, position: -225, particles: [], targets: [] },
        { letter: 'E', shape: LETTER_SHAPES.E, position: -75, particles: [], targets: [] },
        { letter: 'J', shape: LETTER_SHAPES.J, position: 100, particles: [], targets: [] },
        { letter: 'A', shape: LETTER_SHAPES.A, position: 250, particles: [], targets: [] },
        { letter: 'Y', shape: LETTER_SHAPES.Y, position: 375, particles: [], targets: [] }
      ],
      navigationBorders: [
        { 
          name: 'about-border', 
          shape: generateRoundedRectBorder(200, 90, 45, 3), 
          particles: [], 
          targets: [], 
          buttonIndex: 0,
          color: 'hsla(120, 70%, 50%, 0.3)'
        },
        { 
          name: 'projects-border', 
          shape: generateRoundedRectBorder(200, 90, 45, 3), 
          particles: [], 
          targets: [], 
          buttonIndex: 1,
          color: 'hsla(0, 70%, 50%, 0.3)'
        },
        { 
          name: 'skills-border', 
          shape: generateRoundedRectBorder(200, 90, 45, 3), 
          particles: [], 
          targets: [], 
          buttonIndex: 2,
          color: 'hsla(240, 70%, 50%, 0.3)'
        },
        { 
          name: 'contact-border', 
          shape: generateRoundedRectBorder(200, 90, 45, 3), 
          particles: [], 
          targets: [], 
          buttonIndex: 3,
          color: 'hsla(300, 70%, 50%, 0.3)'
        }
      ],
      navigationButtons: [
        { 
          name: 'about',
          text: 'About me',
          color: 'hsl(120, 70%, 50%)', 
          position: 'bottom-horizontal',
          href: '#about'
        },
        { 
          name: 'projects',
          text: 'Projects',
          color: 'hsl(0, 70%, 50%)', 
          position: 'bottom-horizontal',
          href: '#projects'
        },
        { 
          name: 'skills',
          text: 'Skills',
          color: 'hsl(240, 70%, 50%)', 
          position: 'bottom-horizontal',
          href: '#skills'
        },
        { 
          name: 'contact',
          text: 'Contact',
          color: 'hsl(300, 70%, 50%)', 
          position: 'bottom-horizontal',
          href: '#contact'
        }
      ]
    }
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

    // Function to calculate navigation button positions in canvas coordinates
    function calculateNavButtonPositions() {
      const buttonCount = 4
      const buttonWidth = 200
      const buttonGap = 60
      const totalWidth = (buttonWidth * buttonCount) + (buttonGap * (buttonCount - 1))
      const startX = WIDTH / 2 - totalWidth / 2
      const navBottom = 50 // Distance from bottom edge
      const buttonY = HEIGHT - navBottom - 45 // Center Y of buttons (45 = half height of 90px)
      
      const positions = []
      for (let i = 0; i < buttonCount; i++) {
        const buttonX = startX + (buttonWidth / 2) + (i * (buttonWidth + buttonGap))
        positions.push({ x: buttonX, y: buttonY })
      }
      return positions
    }

    // Function to update canvas size and letter positions
    function resizeCanvas() {
      WIDTH = canvas.width = window.innerWidth
      HEIGHT = canvas.height = window.innerHeight
      
      // Calculate scaling factor based on screen size
      const baseWidth = 1920
      const baseHeight = 1080
      const scaleX = WIDTH / baseWidth
      const scaleY = HEIGHT / baseHeight
      const scale = Math.min(scaleX, scaleY, 1.0) * 1.5 // Increased size by 1.5x
      
      // Recalculate letter positions
      LETTERS.forEach(letterConfig => {
        letterConfig.targets = addLetterShape(letterConfig.shape, letterConfig.position, 0, scale)
      })
      
      // Recalculate navigation border positions
      const navPositions = calculateNavButtonPositions()
      NAV_BORDERS.forEach((borderConfig, index) => {
        const pos = navPositions[index]
        if (pos) {
          borderConfig.targets = borderConfig.shape.map(([x, y]) => [pos.x + x, pos.y + y])
        }
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
    function addLetterShape(points, offsetX, offsetY, scale = 1) {
      return points.map(([x, y]) => [WIDTH / 2 + (x * scale) + (offsetX * scale), HEIGHT / 2 + (y * scale) + (offsetY * scale)])
    }

    // Use memoized configurations
    const LETTERS = letterConfigs.letters
    const NAV_BORDERS = letterConfigs.navigationBorders

    // Function to initialize particles for any letter
    function initializeParticles(particleArray, targetPoints, particleCount, colorOverride) {
      for (let i = 0; i < particleCount; i++) {
        let x = R() * WIDTH
        let y = R() * HEIGHT
        let H = 80 * (i / particleCount) + Math.random() * 100
        let S = 40 * R() + 60
        let B = 60 * R() + 20
        let f = []
        for (let k = 0; k < v / 5; k++) f[k] = {
          x: x,
          y: y,
          X: 0,
          Y: 0,
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


    // Function to create rounded rectangle outline points for button
    function createButtonOutlineTargets(buttonCenter, width, height, radius) {
      const points = []
      const halfWidth = width / 2
      const halfHeight = height / 2
      const pointDensity = 4 // Distance between points
      
      // Top edge
      for (let x = -halfWidth + radius; x <= halfWidth - radius; x += pointDensity) {
        points.push([buttonCenter.x + x, buttonCenter.y - halfHeight])
      }
      
      // Top-right corner
      for (let angle = -Math.PI/2; angle <= 0; angle += Math.PI/(radius/2)) {
        points.push([
          buttonCenter.x + halfWidth - radius + Math.cos(angle) * radius,
          buttonCenter.y - halfHeight + radius + Math.sin(angle) * radius
        ])
      }
      
      // Right edge
      for (let y = -halfHeight + radius; y <= halfHeight - radius; y += pointDensity) {
        points.push([buttonCenter.x + halfWidth, buttonCenter.y + y])
      }
      
      // Bottom-right corner
      for (let angle = 0; angle <= Math.PI/2; angle += Math.PI/(radius/2)) {
        points.push([
          buttonCenter.x + halfWidth - radius + Math.cos(angle) * radius,
          buttonCenter.y + halfHeight - radius + Math.sin(angle) * radius
        ])
      }
      
      // Bottom edge
      for (let x = halfWidth - radius; x >= -halfWidth + radius; x -= pointDensity) {
        points.push([buttonCenter.x + x, buttonCenter.y + halfHeight])
      }
      
      // Bottom-left corner
      for (let angle = Math.PI/2; angle <= Math.PI; angle += Math.PI/(radius/2)) {
        points.push([
          buttonCenter.x - halfWidth + radius + Math.cos(angle) * radius,
          buttonCenter.y + halfHeight - radius + Math.sin(angle) * radius
        ])
      }
      
      // Left edge
      for (let y = halfHeight - radius; y >= -halfHeight + radius; y -= pointDensity) {
        points.push([buttonCenter.x - halfWidth, buttonCenter.y + y])
      }
      
      // Top-left corner
      for (let angle = Math.PI; angle <= 3*Math.PI/2; angle += Math.PI/(radius/2)) {
        points.push([
          buttonCenter.x - halfWidth + radius + Math.cos(angle) * radius,
          buttonCenter.y - halfHeight + radius + Math.sin(angle) * radius
        ])
      }
      
      return points
    }

    // Function to spawn particles for hovered button (simplified for canvas context)
    function spawnNavParticles(buttonIndex) {
      const borderConfig = NAV_BORDERS[buttonIndex]
      if (!borderConfig || borderConfig.particles.length > 0) return
      
      const navPositions = calculateNavButtonPositions()
      const buttonCenter = navPositions[buttonIndex]
      if (!buttonCenter) return
      
      const navParticleCount = v / 40
      const spawnRadius = 60 // Tighter spawn area around button outline
      
      // Create shared target points for this button (button outline)
      borderConfig.targets = createButtonOutlineTargets(buttonCenter, 200, 90, 45)
      
      for (let i = 0; i < navParticleCount; i++) {
        // Spawn particles closer to button outline
        let x = buttonCenter.x + (R() - 0.5) * spawnRadius * 2
        let y = buttonCenter.y + (R() - 0.5) * spawnRadius * 2
        let H = 80 * (i / navParticleCount) + Math.random() * 100
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
        
        // Use custom targets if available, otherwise use provided targets
        const currentTargets = u.targets || targets
        let q = currentTargets[u.q]
        let D = u.x - q[0]
        let E = u.y - q[1]
        let G = Math.sqrt(D * D + E * E)
        if (G < 10) {
          if (0.95 < R()) u.q = ~~(R() * currentTargets.length)
          else if (0.99 < R()) u.D *= -1
          u.q += u.D
          u.q %= currentTargets.length
          if (u.q < 0) u.q += currentTargets.length
        }
        u.X += -D / G * u.S
        u.Y += -E / G * u.S
        u.x += u.X
        u.y += u.Y
        path(u)
        u.X *= u.F
        u.Y *= u.F
        
        // Use fewer trail particles for nav buttons
        const maxTrail = u.targets ? v / 8 - 1 : v / 5 - 1
        for (let k = 0; k < maxTrail;) {
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

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,.2)"
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      
      // Always update letter particles
      LETTERS.forEach(letterConfig => {
        updateParticles(letterConfig.particles, letterConfig.targets)
      })
      
      // Manage navigation border particles based on current hover state
      NAV_BORDERS.forEach((borderConfig, index) => {
        const isHovered = hoveredButtonsRef.current.has(index)
        const hasParticles = borderConfig.particles.length > 0
        
        if (isHovered && !hasParticles) {
          // Spawn particles for newly hovered button
          spawnNavParticles(index)
        } else if (!isHovered && hasParticles) {
          // Remove particles for unhovered button
          borderConfig.particles.length = 0
        }
        
        // Update particles for buttons that have them (check again after potential spawning)
        if (borderConfig.particles.length > 0) {
          updateParticles(borderConfig.particles, borderConfig.targets)
        }
      })
      
      animationId = requestAnimationFrame(animate)
    }

    // Initialize everything
    resizeCanvas()

    // Initialize particles for all letters
    const particleCount = v / 12
    LETTERS.forEach(letterConfig => {
      initializeParticles(letterConfig.particles, letterConfig.targets, particleCount)
    })

    // Don't automatically initialize navigation border particles - they spawn on hover

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
      NAV_BORDERS.forEach(borderConfig => {
        borderConfig.particles.length = 0
        borderConfig.targets.length = 0
      })
    }
  }, [letterConfigs])

  // Hover state is now managed directly in the animation loop via hoveredButtonsRef

  return (
    <div className="App">
      <canvas ref={canvasRef} id="alx" />
      
      {/* Navigation Buttons */}
      <div className="navigation-container">
        {letterConfigs.navigationButtons.map((button, index) => (
          <NavigationButton
            key={button.name}
            position={button.position}
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
