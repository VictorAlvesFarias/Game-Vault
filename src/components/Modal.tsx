import React, { useEffect, useState } from 'react'

function Modal({ isOpen, children, timer, setClose }:any) {

    const [style, setStyle] = useState("opacity-0")

    const [opened, setOpened] = useState(false)

    function handleOpen() {
        setOpened(true)
        setTimeout(() => {
            setStyle("opacity-100")
        }, timer);
    }

    function handleClose() {
        setStyle("opacity-0")
        setTimeout(() => {
            setClose()
            setOpened(false)
        }, timer);
    }

    useEffect(() => {
        isOpen ? handleOpen() : handleClose() 
    }, [isOpen])

    return (
        opened &&
        <div className={'p-5 z-50 w-full top-0 flex items-center justify-center left-0 bg-opacity-55 h-screen fixed bg-black transition-all '+style + ` duration-[${timer}]`}>
            {children}
        </div>
    )
}

export default Modal