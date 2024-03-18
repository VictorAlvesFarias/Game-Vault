import React from 'react'

function Gradientline({from,to}) {
  return (
    <div className={['w-full h-[3px] mt-2 bg-gradient-to-',from,to].join(" ")}></div>
  )
}

export default Gradientline