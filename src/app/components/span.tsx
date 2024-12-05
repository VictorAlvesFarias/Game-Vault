import { useSelector } from "../utils/hooks/selector-hooks"
import React from "react"

const spanVariations = {
  default: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span children={props.children} className='mb-1 font-semibold px-1' />,
  error: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span children={props.children} className='text-red-400' />,
}

const Span = useSelector<keyof typeof spanVariations, React.HTMLAttributes<HTMLSpanElement>>(spanVariations)

export default Span