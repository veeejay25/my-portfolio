import './NavigationButton.css'

const NavigationButton = ({ 
  position, 
  color, 
  text, 
  href, 
  onClick 
}) => {
  const handleClick = (e) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    } else if (href) {
      window.location.href = href
    }
  }

  return (
    <div className={`navigation-button ${position}`} onClick={handleClick}>
      {text && (
        <div className="button-label">
          {text}
        </div>
      )}
    </div>
  )
}

export default NavigationButton