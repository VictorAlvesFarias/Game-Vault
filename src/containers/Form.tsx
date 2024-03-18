import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function Form({children, submit}) {

    return (
        <form onSubmit={submit} className="space-y-4 md:space-y-6" action="#">
            {children}
        </form>
    )
}

export default Form