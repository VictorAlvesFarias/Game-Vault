import React, { FormEvent, forwardRef, LegacyRef, useRef } from 'react'
import { useSelector } from '../utils/hooks/selector-hooks'
import { RefCallBack } from 'react-hook-form'

interface IFormContainerProps {
    className: string
    onSubmit: (e: any) => any
    children: React.ReactNode
    id?: string
}

const FormContainer = forwardRef((props: IFormContainerProps, ref: RefCallBack | LegacyRef<HTMLFormElement>) => {
    const internalRef = useRef<HTMLFormElement | null>(null);

    function handleRef(element: HTMLFormElement | null) {
        internalRef.current = element;
        if (ref instanceof Function) {
            ref(element);
        }
    };

    function handleOnSubmit(event: FormEvent) {
        event.preventDefault()
        if (props.onSubmit) {
            props.onSubmit(event)
        }
    }

    return (
        <form ref={handleRef} id={props.id} className={props.className} onSubmit={handleOnSubmit} >
            {props.children}
        </form>
    )
})

export default FormContainer

export {
    IFormContainerProps
}