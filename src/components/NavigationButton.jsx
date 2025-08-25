import './NavigationButton.css'

const NavigationButton = ({ 
  position, 
  color, 
  text, 
  href, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  buttonIndex
}) => {
  const handleClick = (e) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    } else if (href) {
      window.location.href = href
    }
  }

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter(buttonIndex)
    }
  }

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave(buttonIndex)
    }
  }

  return (
    <div 
      className={`navigation-button ${position}`} 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text && (
        <div className="button-label">
          {text}
        </div>
      )}
    </div>
  )
}

export default NavigationButton