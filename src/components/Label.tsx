import React from 'react'

function Label({children,className}:any) {
  return (
    <label className={!className?'mb-1 font-semibold px-1':className}>{children}</label>
  )
}

export default Label