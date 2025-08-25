import { useEffect, useRef } from 'react'
import { 
  createParticle, 
  updateParticles, 
  calculateParticleCount, 
  calculateTrailLength,
  generateParticleColor 
} from '../utils/particlePhysics'
import { 
  createLetterConfigurations, 
  createButtonOutlineTargets, 
  calculateNavButtonPositions 
} from '../utils/shapeGeneration'
import { 
  PARTICLE_CONSTANTS, 
  LAYOUT_CONSTANTS, 
  NAV_BUTTON_CONFIG 
} from '../constants/index'

const { BASE_PARTICLE_VALUE, CIRCLE_RADIANS } = PARTICLE_CONSTANTS
const { BASE_WIDTH, BASE_HEIGHT, SCALE_MULTIPLIER, NAV_SPAWN_RADIUS, ANIMATION_FADE_OPACITY } = LAYOUT_CONSTANTS

/**
 * Custom hook for managing particle system and canvas animation
 * @param {React.RefObject} canvasRef - Reference to canvas element
 * @param {React.RefObject} hoveredButtonsRef - Reference to Set of currently hovered button indices
 * @returns {Object} Particle system controls and state
 */
export const useParticleSystem = (canvasRef, hoveredButtonsRef) => {
  const animationIdRef = useRef(null)
  const particleSystemRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Animation variables
    let WIDTH, HEIGHT
    const R = Math.random
    
    // Initialize particle system state
    const particleSystem = {
      letters: [],
      navigationBorders: NAV_BUTTON_CONFIG.map((config, index) => ({
        name: `${config.name}-border`,
        particles: [],
        targets: [],
        buttonIndex: index,
        color: config.color
      }))
    }
    
    particleSystemRef.current = particleSystem
    
    // Function to draw a particle
    function drawParticle(particle) {
      ctx.fillStyle = particle.f
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.R, 0, CIRCLE_RADIANS, 1)
      ctx.closePath()
      ctx.fill()
    }
    
    // Function to initialize particles for letters
    function initializeLetterParticles(particleArray, targetPoints, particleCount) {
      for (let i = 0; i < particleCount; i++) {
        const x = R() * WIDTH
        const y = R() * HEIGHT
        const color = generateParticleColor(i, particleCount)
        const trailLength = calculateTrailLength(PARTICLE_CONSTANTS.LETTER_TRAIL_LENGTH_DIVISOR)
        
        const particle = createParticle(x, y, trailLength, targetPoints.length, color)
        particleArray.push(particle)
      }
    }
    
    // Function to spawn navigation particles
    function spawnNavParticles(buttonIndex) {
      const borderConfig = particleSystem.navigationBorders[buttonIndex]
      if (!borderConfig || borderConfig.particles.length > 0) return
      
      const navPositions = calculateNavButtonPositions(WIDTH, HEIGHT)
      const buttonCenter = navPositions[buttonIndex]
      if (!buttonCenter) return
      
      const navParticleCount = calculateParticleCount(PARTICLE_CONSTANTS.NAV_PARTICLE_COUNT_DIVISOR)
      
      // Create shared target points for this button (button outline)
      borderConfig.targets = createButtonOutlineTargets(
        buttonCenter, 
        LAYOUT_CONSTANTS.NAV_BUTTON.WIDTH, 
        LAYOUT_CONSTANTS.NAV_BUTTON.HEIGHT, 
        LAYOUT_CONSTANTS.NAV_BUTTON.BORDER_RADIUS
      )
      
      for (let i = 0; i < navParticleCount; i++) {
        // Spawn particles closer to button outline
        const x = buttonCenter.x + (R() - 0.5) * NAV_SPAWN_RADIUS * 2
        const y = buttonCenter.y + (R() - 0.5) * NAV_SPAWN_RADIUS * 2
        const color = generateParticleColor(i, navParticleCount)
        const trailLength = calculateTrailLength(PARTICLE_CONSTANTS.NAV_TRAIL_LENGTH_DIVISOR)
        
        const particle = createParticle(x, y, trailLength, borderConfig.targets.length, color)
        borderConfig.particles.push(particle)
      }
    }
    
    // Function to update canvas size and recalculate positions
    function resizeCanvas() {
      WIDTH = canvas.width = window.innerWidth
      HEIGHT = canvas.height = window.innerHeight
      
      // Calculate scaling factor
      const scaleX = WIDTH / BASE_WIDTH
      const scaleY = HEIGHT / BASE_HEIGHT
      const scale = Math.min(scaleX, scaleY, 1.0) * SCALE_MULTIPLIER
      
      // Store existing particles before recreating configurations
      const existingParticles = particleSystem.letters.map(letterConfig => letterConfig.particles)
      
      // Recreate letter configurations with new dimensions
      particleSystem.letters = createLetterConfigurations(WIDTH, HEIGHT, scale)
      
      // Restore particles to new configurations
      particleSystem.letters.forEach((letterConfig, index) => {
        if (existingParticles[index]) {
          letterConfig.particles = existingParticles[index]
        }
      })
      
      // If no existing particles (first run), initialize them
      if (existingParticles.length === 0 || existingParticles.every(p => p.length === 0)) {
        const letterParticleCount = calculateParticleCount(PARTICLE_CONSTANTS.LETTER_PARTICLE_COUNT_DIVISOR)
        particleSystem.letters.forEach(letterConfig => {
          initializeLetterParticles(letterConfig.particles, letterConfig.targets, letterParticleCount)
        })
      }
    }
    
    // Animation loop
    function animate() {
      ctx.fillStyle = `rgba(0,0,0,${ANIMATION_FADE_OPACITY})`
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
      
      // Always update letter particles
      particleSystem.letters.forEach(letterConfig => {
        updateParticles(letterConfig.particles, letterConfig.targets, drawParticle)
      })
      
      // Manage navigation border particles based on current hover state
      particleSystem.navigationBorders.forEach((borderConfig, index) => {
        const isHovered = hoveredButtonsRef.current.has(index)
        const hasParticles = borderConfig.particles.length > 0
        
        if (isHovered && !hasParticles) {
          // Spawn particles for newly hovered button
          spawnNavParticles(index)
        } else if (!isHovered && hasParticles) {
          // Remove particles for unhovered button
          borderConfig.particles.length = 0
        }
        
        // Update particles for buttons that have them
        if (borderConfig.particles.length > 0) {
          updateParticles(borderConfig.particles, borderConfig.targets, drawParticle)
        }
      })
      
      animationIdRef.current = requestAnimationFrame(animate)
    }
    
    // Add resize event listener with throttling
    let resizeTimeout
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }
    window.addEventListener('resize', handleResize)
    
    // Initialize everything
    resizeCanvas()
    
    // Start animation
    animate()
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      // Clear particles arrays
      if (particleSystemRef.current) {
        particleSystemRef.current.letters.forEach(letterConfig => {
          letterConfig.particles.length = 0
          letterConfig.targets.length = 0
        })
        particleSystemRef.current.navigationBorders.forEach(borderConfig => {
          borderConfig.particles.length = 0
          borderConfig.targets.length = 0
        })
      }
    }
  }, [canvasRef, hoveredButtonsRef])
  
  return {
    particleSystem: particleSystemRef.current
  }
}