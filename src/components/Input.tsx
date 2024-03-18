import React from 'react'

function Input({ register, className }: any) {
  return (
    <input {...register} type='text' autoComplete='off' className={className} />
  )
}

export default Input