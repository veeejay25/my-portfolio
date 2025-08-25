import { useRef } from 'react'
import NavigationButton from './components/NavigationButton'
import { useParticleSystem } from './hooks/useParticleSystem'
import { NAV_BUTTON_CONFIG } from './constants/index.js'
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

  // Initialize particle system
  useParticleSystem(canvasRef, hoveredButtonsRef)

  return (
    <div className="App">
      <canvas ref={canvasRef} id="alx" />
      
      {/* Navigation Buttons */}
      <div className="navigation-container">
        {NAV_BUTTON_CONFIG.map((button, index) => (
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
