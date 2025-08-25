import { PARTICLE_CONSTANTS } from '../constants/index'

const { 
  BASE_PARTICLE_VALUE,
  SPEED_RANGE,
  FRICTION_RANGE,
  COLOR_HUE_MULTIPLIER,
  COLOR_HUE_RANDOM,
  COLOR_SATURATION,
  COLOR_BRIGHTNESS,
  COLOR_OPACITY,
  MOVEMENT_THRESHOLD,
  DIRECTION_CHANGE_PROBABILITY,
  REVERSE_PROBABILITY,
  TRAIL_FOLLOW_FACTOR
} = PARTICLE_CONSTANTS

// Optimized random function
const R = Math.random

/**
 * Generate particle color based on index and count
 * @param {number} particleIndex - Index of the particle
 * @param {number} totalParticles - Total number of particles
 * @param {number} opacity - Color opacity (default from constants)
 * @returns {string} HSLA color string
 */
export const generateParticleColor = (particleIndex, totalParticles, opacity = COLOR_OPACITY) => {
  const H = COLOR_HUE_MULTIPLIER * (particleIndex / totalParticles) + Math.random() * COLOR_HUE_RANDOM
  const S = COLOR_SATURATION.RANDOM_MULTIPLIER * R() + COLOR_SATURATION.BASE
  const B = COLOR_BRIGHTNESS.RANDOM_MULTIPLIER * R() + COLOR_BRIGHTNESS.BASE
  return `hsla(${~~H},${~~S}%,${~~B}%,${opacity})`
}

/**
 * Initialize a single particle with physics properties
 * @param {number} x - Initial x position
 * @param {number} y - Initial y position
 * @param {number} trailLength - Length of particle trail
 * @param {number} targetCount - Number of target points
 * @param {string} color - Particle color
 * @returns {Array} Particle array with trail elements
 */
export const createParticle = (x, y, trailLength, targetCount, color) => {
  const particle = []
  
  for (let k = 0; k < trailLength; k++) {
    particle[k] = {
      x: x,
      y: y,
      X: 0, // X velocity
      Y: 0, // Y velocity
      R: 1 - k / BASE_PARTICLE_VALUE + 1, // Radius
      S: R() * SPEED_RANGE.RANDOM_MULTIPLIER + SPEED_RANGE.MIN, // Speed
      q: ~~(R() * targetCount), // Target index
      D: 2 * (Math.random() > 0.5 ? 1 : 0) - 1, // Direction (-1 or 1)
      F: FRICTION_RANGE.RANDOM_MULTIPLIER * R() + FRICTION_RANGE.BASE, // Friction
      f: color // Color
    }
  }
  
  return particle
}

/**
 * Update particle physics and movement
 * @param {Array} particles - Array of particle systems
 * @param {Array} targets - Target points for particles to move toward
 * @param {Function} drawCallback - Function to draw particle
 */
export const updateParticles = (particles, targets, drawCallback) => {
  for (let i = particles.length; i--;) {
    const particleSystem = particles[i]
    const leadParticle = particleSystem[0]
    
    // Use custom targets if available, otherwise use provided targets
    const currentTargets = leadParticle.targets || targets
    const targetPoint = currentTargets[leadParticle.q]
    
    // Calculate distance to target
    const deltaX = leadParticle.x - targetPoint[0]
    const deltaY = leadParticle.y - targetPoint[1]
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Handle target switching when close
    if (distance < MOVEMENT_THRESHOLD) {
      if (DIRECTION_CHANGE_PROBABILITY < R()) {
        leadParticle.q = ~~(R() * currentTargets.length)
      } else if (REVERSE_PROBABILITY < R()) {
        leadParticle.D *= -1
      }
      
      leadParticle.q += leadParticle.D
      leadParticle.q %= currentTargets.length
      if (leadParticle.q < 0) leadParticle.q += currentTargets.length
    }
    
    // Apply forces and update position
    leadParticle.X += -deltaX / distance * leadParticle.S
    leadParticle.Y += -deltaY / distance * leadParticle.S
    leadParticle.x += leadParticle.X
    leadParticle.y += leadParticle.Y
    
    // Draw lead particle
    drawCallback(leadParticle)
    
    // Apply friction
    leadParticle.X *= leadParticle.F
    leadParticle.Y *= leadParticle.F
    
    // Update trail particles
    const maxTrail = leadParticle.targets ? 
      BASE_PARTICLE_VALUE / 8 - 1 : // Navigation particles
      BASE_PARTICLE_VALUE / 5 - 1   // Letter particles
    
    for (let k = 0; k < maxTrail;) {
      const current = particleSystem[k]
      const next = particleSystem[++k]
      
      if (next) {
        next.x -= TRAIL_FOLLOW_FACTOR * (next.x - current.x)
        next.y -= TRAIL_FOLLOW_FACTOR * (next.y - current.y)
        drawCallback(next)
      }
    }
  }
}

/**
 * Calculate particle count for a given type
 * @param {number} divisor - Divisor for particle count calculation
 * @returns {number} Number of particles to create
 */
export const calculateParticleCount = (divisor) => {
  return BASE_PARTICLE_VALUE / divisor
}

/**
 * Calculate trail length for particle type
 * @param {number} divisor - Divisor for trail length calculation
 * @returns {number} Trail length
 */
export const calculateTrailLength = (divisor) => {
  return BASE_PARTICLE_VALUE / divisor
}