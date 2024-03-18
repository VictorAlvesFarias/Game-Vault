import React from 'react'

function Limiter(props:any) {
  return (
    <div className="max-w-7xl w-11/12 h-full lg:px-0 px-5 ">
        {props.children}
    </div>  
  )
}

export default Limiter