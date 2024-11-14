import React from "react"
import { createContext, useState } from "react"

interface IAccordionContext {
    setOpen: (e: boolean) => any
    open: boolean
}

interface IAccordionContextComponent {
    children: React.ReactNode[] | React.ReactNode
}

function AccordionContext(props: IAccordionContextComponent) {
    const [open, setOpen] = useState<boolean>(false)
    const context: IAccordionContext = {
        setOpen: (e) => { setOpen(e) },
        open: open
    }

    return <AccordionContextObject.Provider value={context} children={props.children} />
}

const AccordionContextObject = createContext<IAccordionContext>({
    open: false,
    setOpen: () => { }
});

export default AccordionContext

export {
    AccordionContextObject,
    IAccordionContextComponent
}