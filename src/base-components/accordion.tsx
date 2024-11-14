import React, { ForwardedRef, LegacyRef, forwardRef, useContext } from 'react';
import { AccordionContextObject } from './accordion-context';

interface IAccordionContainerProps {
    children: React.ReactNode
    className: string
    ref: any
    onClick?: (e: any) => any
}

const AccordionContainer = forwardRef<LegacyRef<HTMLDivElement> | undefined | any, IAccordionContainerProps>((_, ref) => {
    const { open } = useContext(AccordionContextObject)

    return (
        <div
            ref={ref}
            className={_.className+' aria-hidden:max-h-96 gap-3 aria-hidden:py-3 flex max-h-0 overflow-hidden flex-col transition-all duration-300'}
            aria-hidden={open}
        >
            { _.children}
        </div>
    );
})

export default AccordionContainer

export {
    IAccordionContainerProps
}
