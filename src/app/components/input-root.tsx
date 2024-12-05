import React from "react"
import { useSelector } from "../utils/hooks/selector-hooks"

const rootVariations = {
    default: (props: React.HTMLAttributes<HTMLDivElement>) =>
        <div {...props} className="flex-col flex relative w-full" />,
    "default-full": (props: React.HTMLAttributes<HTMLDivElement>) =>
        <div {...props} className="flex-col flex relative w-full h-full" />,
    checkbox: (props: React.HTMLAttributes<HTMLDivElement>) =>
        <div {...props} className="flex relative gap-3" />
}

const InputRoot = useSelector<keyof typeof rootVariations, React.HTMLAttributes<HTMLDivElement>>(rootVariations)

export default InputRoot