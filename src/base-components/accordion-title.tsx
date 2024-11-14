import React, { LegacyRef, forwardRef, useContext } from 'react';
import { AccordionContextObject } from './accordion-context';

interface IAccordionTitleContainerProps {
    children: React.ReactNode
    className: string
    ref: any
    onClick?: (e: any) => any
}

const AccordionTitleContainer = forwardRef<LegacyRef<HTMLDivElement> | any, IAccordionTitleContainerProps>((_, ref) => {
    const { open, setOpen } = useContext(AccordionContextObject)

    function handleOpenAccordionTitle(e: any) {
        setOpen(!open)
        _.onClick ? _.onClick(e) : null
    }

    return (
        <div
            ref={ref}
            className={_.className}
            onClick={handleOpenAccordionTitle}
        >
            {_.children}
        </div>
    );
})

export default AccordionTitleContainer

export {
    IAccordionTitleContainerProps
}
