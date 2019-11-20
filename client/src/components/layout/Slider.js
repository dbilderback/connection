import React from 'react'
import propTypes from 'prop-types'

function Slider (props) {
  const className = `input ${props.type}`
  return (
    <div>
      <span style={{ fontSize: '16px', marginBottom: '6px' }} />
      <input
        type='range'
        value={props.value}
        min={props.min}
        max={props.max}
        className={className}
        step='1'
        readOnly
      />
    </div>
  )
}

Slider.propTypes = {
  type: propTypes.string.isRequired,
  value: propTypes.number.isRequired,
  min: propTypes.number.isRequired,
  max: propTypes.number.isRequired,
  className: propTypes.string.isRequired
}

export default Slider
