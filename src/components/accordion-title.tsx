import React from "react"
import AccordionTitleContainer, { IAccordionTitleContainerProps } from '../base-components/accordion-title'
import { useSelector } from "../utils/hooks/selector-hooks"

const AccordionTitleVariations = {
    default: (props: IAccordionTitleContainerProps, ref: any) => {
        return (
            <AccordionTitleContainer
                {...props}
                ref={ref}
                className='' />
        )
    }
}

const AccordionTitle = useSelector<keyof typeof AccordionTitleVariations, IAccordionTitleContainerProps>(AccordionTitleVariations)

export default AccordionTitle
