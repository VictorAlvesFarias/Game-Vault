import React, { useContext } from "react"
import { AccordionContextObject } from "./accordion-context"

interface IAccordionDesactivateIconProps {
    children: React.ReactNode
}

function AccordionDesactivateIcon(props: IAccordionDesactivateIconProps) {
    const {open} = useContext(AccordionContextObject)

    return (
        !open &&
        <>
            {props.children}
        </>
    )
}

export default AccordionDesactivateIcon

export {
    IAccordionDesactivateIconProps
}