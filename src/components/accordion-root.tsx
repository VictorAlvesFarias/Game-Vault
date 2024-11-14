import React from "react"
import { useSelector } from "../utils/hooks/selector-hooks"

const AccordionRootVariations = {
    default: (props: React.HTMLAttributes<HTMLDivElement>) =>
        <div {...props} className='flex-col flex ' />
}

const AccordionRoot = useSelector<keyof typeof AccordionRootVariations, React.HTMLAttributes<HTMLDivElement>>(AccordionRootVariations)

export default AccordionRoot