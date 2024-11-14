import React, { useContext } from "react"
import { AccordionContextObject } from "./accordion-context"

interface IAccordionActivateIconProps {
    children: React.ReactNode
}

function AccordionActivateIcon(props: IAccordionActivateIconProps) {
    const {open} = useContext(AccordionContextObject)

    return (
        open &&
        <>
            {props.children}
        </>
    )
}

export default AccordionActivateIcon

export {
    IAccordionActivateIconProps
}