import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import saveService from '../service/SaveService';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';


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

  async function handleAddSave(data: z.infer<typeof formSchema>) {
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
          <LoaderCircle className='rotating-div' ></LoaderCircle>
          :
          <form className='flex flex-col gap-3 items-center' onSubmit={handleSubmit(handleAddSave)}>
            <input {...register("name")} type="text" placeholder='Nome do save' className=' w-full bg-transparent flex items-center border border-zinc-700 outline-none p-1 px-3 rounded' />
            <button className='bg-white p-1 px-2 rounded text-zinc-800'>Selecionar arquivo e adicionar</button>
            <span className='text-red-400'>{errors.name?.message}</span>
          </form>
      }
    </div>
  )
}

export default Add