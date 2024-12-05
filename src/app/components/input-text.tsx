import React from "react"
import TextContainer, { ITextContainerProps } from '../base-components/input-text'
import { useSelector } from "../utils/hooks/selector-hooks"

const inputTextVariations = {
    default: (props: ITextContainerProps, ref) =>
        <TextContainer {...props} ref={ref} className="bg-transparent flex items-center border border-zinc-700 w-fit p-2 px-3 rounded outline-1 focus-within:outline focus-within:border-transparent outline-white pl-2 cursor-text aria-disabled:bg-black aria-disabled:border-none aria-disabled:bg-opacity-30 aria-disabled:shadow-sm aria-[atomic]:animate-pulse" />,
    "default-full": (props: ITextContainerProps, ref) =>
        <TextContainer {...props} ref={ref} className="bg-transparent flex items-center border border-zinc-700 w-full p-2 px-3 rounded outline-1 focus-within:outline focus-within:border-transparent outline-white pl-2 cursor-text aria-disabled:bg-black aria-disabled:border-none aria-disabled:bg-opacity-30 aria-disabled:shadow-sm aria-[atomic]:animate-pulse" />,

}

const Text = useSelector<keyof typeof inputTextVariations, ITextContainerProps>(inputTextVariations)

export default Text