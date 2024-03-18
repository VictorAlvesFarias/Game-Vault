import React from 'react'

function InputRoot({children,error}) {
  return (
    <div className={'flex-col flex relative text-zinc-200'}>
        {children}
    </div>
  )
}

export default InputRoot