import React from 'react'

function Main(props:any) {
  return (
    <main className="items-center w-full justify-center flex flex-col mb-40 "> 
        {props.children}
    </main>
  )
}

export default Main