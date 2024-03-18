import React from 'react'

function ErrorSpan({error}) {
  return (
    error && <span className='text-red-400'>{error.message}</span>
  )
}

export default ErrorSpan