import React from "react"
import ButtonContainer, { IButtonContainerProps } from '../base-components/button'
import { useSelector } from "../utils/hooks/selector-hooks"
import { LucideLoaderCircle } from "lucide-react"

const buttonVariations = {
  default: (props: IButtonContainerProps, ref: any) => {
    return (
      <ButtonContainer
        {...props}
        ref={ref}
        loadingComponent={
          <LucideLoaderCircle className='w-6 h-6 rotating-div' />
        }
        className='bg-white p-2 px-2 rounded text-zinc-800' />
    )
  }
}

const Button = useSelector<keyof typeof buttonVariations, IButtonContainerProps>(buttonVariations)

export default Button
