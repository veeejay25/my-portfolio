import { LETTER_POSITIONS, LAYOUT_CONSTANTS } from '../constants/index'

const { OUTLINE_POINT_DENSITY } = LAYOUT_CONSTANTS

// Letter shape definitions
export const LETTER_SHAPES = {
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

/**
 * Transform shape points to canvas coordinates
 * @param {Array} points - Array of [x, y] coordinate pairs
 * @param {number} offsetX - X offset for positioning
 * @param {number} offsetY - Y offset for positioning  
 * @param {number} scale - Scale multiplier
 * @param {number} canvasWidth - Canvas width for centering
 * @param {number} canvasHeight - Canvas height for centering
 * @returns {Array} Transformed coordinate pairs
 */
export const transformShapeToCanvas = (points, offsetX, offsetY, scale, canvasWidth, canvasHeight) => {
  return points.map(([x, y]) => [
    canvasWidth / 2 + (x * scale) + (offsetX * scale), 
    canvasHeight / 2 + (y * scale) + (offsetY * scale)
  ])
}

/**
 * Create letter configurations for the name "VEEJAY"
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @param {number} scale - Scale factor
 * @returns {Array} Array of letter configurations
 */
export const createLetterConfigurations = (canvasWidth, canvasHeight, scale) => {
  return [
    { 
      letter: 'V', 
      shape: LETTER_SHAPES.V, 
      position: LETTER_POSITIONS.V, 
      particles: [], 
      targets: transformShapeToCanvas(LETTER_SHAPES.V, LETTER_POSITIONS.V, 0, scale, canvasWidth, canvasHeight)
    },
    { 
      letter: 'E', 
      shape: LETTER_SHAPES.E, 
      position: LETTER_POSITIONS.E1, 
      particles: [], 
      targets: transformShapeToCanvas(LETTER_SHAPES.E, LETTER_POSITIONS.E1, 0, scale, canvasWidth, canvasHeight)
    },
    { 
      letter: 'E', 
      shape: LETTER_SHAPES.E, 
      position: LETTER_POSITIONS.E2, 
      particles: [], 
      targets: transformShapeToCanvas(LETTER_SHAPES.E, LETTER_POSITIONS.E2, 0, scale, canvasWidth, canvasHeight)
    },
    { 
      letter: 'J', 
      shape: LETTER_SHAPES.J, 
      position: LETTER_POSITIONS.J, 
      particles: [], 
      targets: transformShapeToCanvas(LETTER_SHAPES.J, LETTER_POSITIONS.J, 0, scale, canvasWidth, canvasHeight)
    },
    { 
      letter: 'A', 
      shape: LETTER_SHAPES.A, 
      position: LETTER_POSITIONS.A, 
      particles: [], 
      targets: transformShapeToCanvas(LETTER_SHAPES.A, LETTER_POSITIONS.A, 0, scale, canvasWidth, canvasHeight)
    },
    { 
      letter: 'Y', 
      shape: LETTER_SHAPES.Y, 
      position: LETTER_POSITIONS.Y, 
      particles: [], 
      targets: transformShapeToCanvas(LETTER_SHAPES.Y, LETTER_POSITIONS.Y, 0, scale, canvasWidth, canvasHeight)
    }
  ]
}

/**
 * Create rounded rectangle outline points for navigation buttons
 * @param {Object} buttonCenter - {x, y} center coordinates
 * @param {number} width - Button width
 * @param {number} height - Button height  
 * @param {number} radius - Border radius
 * @returns {Array} Array of outline points
 */
export const createButtonOutlineTargets = (buttonCenter, width, height, radius) => {
  const points = []
  const halfWidth = width / 2
  const halfHeight = height / 2
  
  // Top edge
  for (let x = -halfWidth + radius; x <= halfWidth - radius; x += OUTLINE_POINT_DENSITY) {
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
  for (let y = -halfHeight + radius; y <= halfHeight - radius; y += OUTLINE_POINT_DENSITY) {
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
  for (let x = halfWidth - radius; x >= -halfWidth + radius; x -= OUTLINE_POINT_DENSITY) {
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
  for (let y = halfHeight - radius; y >= -halfHeight + radius; y -= OUTLINE_POINT_DENSITY) {
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

/**
 * Calculate navigation button positions in canvas coordinates
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @returns {Array} Array of button center positions
 */
export const calculateNavButtonPositions = (canvasWidth, canvasHeight) => {
  const { NAV_BUTTON } = LAYOUT_CONSTANTS
  const buttonCount = 4
  const totalWidth = (NAV_BUTTON.WIDTH * buttonCount) + (NAV_BUTTON.GAP * (buttonCount - 1))
  const startX = canvasWidth / 2 - totalWidth / 2
  const buttonY = canvasHeight - NAV_BUTTON.BOTTOM_DISTANCE - NAV_BUTTON.HEIGHT / 2
  
  const positions = []
  for (let i = 0; i < buttonCount; i++) {
    const buttonX = startX + (NAV_BUTTON.WIDTH / 2) + (i * (NAV_BUTTON.WIDTH + NAV_BUTTON.GAP))
    positions.push({ x: buttonX, y: buttonY })
  }
  return positions
}