import React from 'react'

function Section(props:any) {
  return (
    <section className="items-center w-full justify-center flex flex-col mb-40  "> 
        {props.children}
    </section>
  )
}

export default Section