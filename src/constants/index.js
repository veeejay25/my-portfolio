// Particle Physics Constants
export const PARTICLE_CONSTANTS = {
  // Base particle calculation (32 + 16 + 8) * 4
  BASE_PARTICLE_VALUE: (32 + 16 + 8) * 4,
  
  // Particle counts
  LETTER_PARTICLE_COUNT_DIVISOR: 12,
  NAV_PARTICLE_COUNT_DIVISOR: 40,
  
  // Trail lengths
  LETTER_TRAIL_LENGTH_DIVISOR: 5,
  NAV_TRAIL_LENGTH_DIVISOR: 5,
  
  // Animation constants
  CIRCLE_RADIANS: 6.3,
  
  // Particle physics ranges
  SPEED_RANGE: {
    MIN: 1,
    RANDOM_MULTIPLIER: 1
  },
  
  FRICTION_RANGE: {
    BASE: 0.7,
    RANDOM_MULTIPLIER: 0.2
  },
  
  // Color generation
  COLOR_HUE_MULTIPLIER: 80,
  COLOR_HUE_RANDOM: 100,
  COLOR_SATURATION: {
    BASE: 60,
    RANDOM_MULTIPLIER: 40
  },
  COLOR_BRIGHTNESS: {
    BASE: 20,
    RANDOM_MULTIPLIER: 60
  },
  COLOR_OPACITY: 0.1,
  
  // Movement detection
  MOVEMENT_THRESHOLD: 10,
  DIRECTION_CHANGE_PROBABILITY: 0.95,
  REVERSE_PROBABILITY: 0.99,
  
  // Trail following
  TRAIL_FOLLOW_FACTOR: 0.7
}

// Canvas and Layout Constants
export const LAYOUT_CONSTANTS = {
  // Base screen dimensions for scaling
  BASE_WIDTH: 1920,
  BASE_HEIGHT: 1080,
  SCALE_MULTIPLIER: 1.5,
  
  // Navigation button dimensions
  NAV_BUTTON: {
    WIDTH: 200,
    HEIGHT: 90,
    BORDER_RADIUS: 45,
    GAP: 60,
    BOTTOM_DISTANCE: 50
  },
  
  // Navigation particle spawning
  NAV_SPAWN_RADIUS: 60,
  
  // Button outline generation
  OUTLINE_POINT_DENSITY: 4,
  
  // Animation
  ANIMATION_FADE_OPACITY: 0.2
}

// Letter positioning
export const LETTER_POSITIONS = {
  V: -375,
  E1: -225,
  E2: -75,
  J: 100,
  A: 250,
  Y: 375
}

// Navigation button colors
export const NAV_COLORS = {
  ABOUT: 'hsla(120, 70%, 50%, 0.3)',
  PROJECTS: 'hsla(0, 70%, 50%, 0.3)',
  SKILLS: 'hsla(240, 70%, 50%, 0.3)',
  CONTACT: 'hsla(300, 70%, 50%, 0.3)'
}

// Navigation button configuration
export const NAV_BUTTON_CONFIG = [
  { name: 'about', text: 'About me', href: '#about', color: NAV_COLORS.ABOUT },
  { name: 'projects', text: 'Projects', href: '#projects', color: NAV_COLORS.PROJECTS },
  { name: 'skills', text: 'Skills', href: '#skills', color: NAV_COLORS.SKILLS },
  { name: 'contact', text: 'Contact', href: '#contact', color: NAV_COLORS.CONTACT }
]