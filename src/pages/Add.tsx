import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import saveService from '../service/save-service';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import Form from '../components/form';
import InputRoot from '../components/input-root';
import InputText from '../components/input-text';
import Span from '../components/span';
import Button from '../components/button';

function Add() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState({
    add: false
  })
  const formSchema = z.object({
    name: z.string().nonempty("Campo obrigatório")
  })
  const { handleSubmit, formState: { errors }, register } = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
    }
  );

  function handleAddSave(data: z.infer<typeof formSchema>) {
    setLoading({ ...loading, add: true })
    saveService.selectFolder().then(e => {
      saveService.add(e.filePaths[0], data.name).then(e => {
        navigate("/")
      })
    })
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      {
        loading.add ?
          <LoaderCircle className={"rotating-div"} ></LoaderCircle>
          :
          <Form onSubmit={handleSubmit(handleAddSave)}>
            <InputRoot>
                <InputText {...register("name")} variation='default-full' placeholder='Save name'/>
                <Span variation='error'>{errors.name?.message}</Span>
            </InputRoot>
            <Button>Select and add folder</Button>
          </Form>
      }
    </div>
  )
}

export default Add