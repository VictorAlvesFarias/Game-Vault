import React from "react";
import { forwardRef } from "react";

function useSelector<T, K>(components) {
    type Selector = K & {
        variation?: T;
        ref: any,
        locked?: boolean
    };
    const Data = forwardRef<any, Omit<Selector, "className">>((e, ref) => {


        return (
            components[e.variation ?? "default"](e, ref)
        )
    })

    return Data
}

export {
    useSelector
}