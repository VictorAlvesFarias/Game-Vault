import React from "react"
import CheckboxContainer, { ICheckboxContainerProps } from '../base-components/checkbox'
import { useSelector } from "../utils/hooks/selector-hooks"


const checkboxVariations = {
    default: (props: ICheckboxContainerProps, ref) =>
        <CheckboxContainer
            {...props}
            ref={ref}
            className={'transition-all cursor-pointer bg-transparent aria-checked:border-transparent w-5 h-5 rounded border-2 border-zinc-600 flex items-center justify-center aria-checked:bg-violet-500 aria-checked:text-white'}
        />,
}

const Checkbox = useSelector<keyof typeof checkboxVariations, ICheckboxContainerProps>(checkboxVariations)

export default Checkbox
