import React, { LegacyRef, forwardRef } from "react"
import { useRef } from "react"
import { RefCallBack } from "react-hook-form"

interface ITextContainerProps {
    readonly?: boolean
    disabled?: boolean
    name?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any
    onBlur?: (e: any) => any
    ref?: any,
    value?: any
    className: string
    placeholder?: string
    mask?: [RegExp, string]
    type?: string
    loading?: boolean
}

const TextContainer = forwardRef((props: ITextContainerProps, ref: RefCallBack | LegacyRef<HTMLInputElement>) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    function handleRef(element: HTMLInputElement | null) {
        if (props.mask && element) {
            const [regex, replacement] = props.mask;
            element.value = element.value.replace(/\D/g, '')
            element.value = element.value.replace(regex, replacement)
        }

        internalRef.current = element;
        if (ref instanceof Function) {
            ref(element);
        }
    };

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (props.mask) {
            const [regex, replacement] = props.mask;
            e.target.value = e.target.value.replace(/\D/g, '')
            e.target.value = e.target.value.replace(regex, replacement)
        }
        else {
            e.target.value = e.target.value
        }

        props?.onChange ? props.onChange(e) : null
    }

    return (
        <div
            onClick={() => internalRef.current?.focus()}
            className={props.className}
            aria-disabled={props.disabled}
            aria-atomic={props.loading}
        >
            <input
                {...props}
                className="bg-transparent outline-none w-full h-full flex "
                placeholder={props.placeholder}
                ref={handleRef}
                onChange={handleOnChange}
            />
        </div>
    )
})

export default TextContainer

export {
    ITextContainerProps
}