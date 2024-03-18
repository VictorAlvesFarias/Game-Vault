import React from 'react'
import InputRoot from '../components/InputRoot'
import Input from '../components/Input'
import ErrorSpan from '../components/ErrorSpan'
import Label from '../components/Label'

function InputDefault({register,errors,label}) {
  return (
    <InputRoot error={errors}>
        <Label className="text-black" >{label}</Label>
        <Input className="rounded border border-black text-black indent-1 p-1" register={register} />
        <ErrorSpan error={errors}/>
    </InputRoot>
  )
}

export default InputDefault