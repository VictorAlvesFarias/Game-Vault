import React from 'react'
import InputMask from 'react-input-mask'

function Mask({ register, mask, className }) {
  {/* deprecread */ }
  return (
    <InputMask  {...register} mask={mask} maskChar="_" className={className} />
  )
}

export default Mask