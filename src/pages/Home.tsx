import React, { useEffect, useState } from 'react'
import Form from '../containers/Form'
import InputDefault from '../styled-components/InputDefault'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ButtonDefault from '../styled-components/ButtonDefault';
import SaveService, { SaveItem } from '../service/SaveService';


function Home() {

  const saveService = new SaveService() 
  const [saves, setSaves] = useState<string[]>([])
  const formSchema = z.object({
    path: z.string().nonempty("Campo Obrigatório")
  })

  const { handleSubmit, formState: { errors }, register } = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
    }
  );
  
  function addSave(data) {
    saveService.addSave(data.path)
  }

  useEffect( ()=>{
    saveService.getSaves().then((x:any)=>{
      setSaves(x)
    })
  })

  return (
    <div className='flex flex-col '>
      <div className='flex flex-col gap-3'>
        {saves.map((x:any)=>
          <div className=' p-3 pt-6 rounded bg-zinc-100 flex flex-col relative gap-3'>
            <div className='cursor-pointer flex justify-end gap-1 top-0 right-0 p-3 absolute'>
              <div className='w-1 h-1 rounded-full bg-zinc-400'></div>
              <div className='w-1 h-1 rounded-full bg-zinc-400'></div>
              <div className='w-1 h-1 rounded-full bg-zinc-400'></div>
            </div>
            <p>{x.saveLocal}</p>
            <p className={`bg-green-300 w-fit rounded p-2`}>Status: Sincronizado</p>
          </div>  
        )}
      </div>
      <Form submit={handleSubmit(addSave)}>
        <InputDefault register={register("path")} errors={errors.path} label={"Caminho"}/>
        <ButtonDefault loading={false}>
          Adicionar
        </ButtonDefault>
      </Form>      
    </div>
  )
}

export default Home