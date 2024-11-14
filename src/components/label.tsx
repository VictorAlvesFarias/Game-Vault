import React from "react"
import { useSelector } from "../utils/hooks/selector-hooks"

const labelVariations = {
    default: (props: React.HTMLAttributes<HTMLLabelElement>) =>
        <label {...props} className='mb-1 font-semibold px-1 text-zinc-800 text-sm' />,
    row: (props: React.HTMLAttributes<HTMLLabelElement>) =>
        <label {...props} className='font-semibold px-1 text-zinc-800 text-sm' />,
}

const Label = useSelector<keyof typeof labelVariations, React.HTMLAttributes<HTMLLabelElement>>(labelVariations)

export default Label