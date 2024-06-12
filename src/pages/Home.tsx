import React, { useEffect, useState } from 'react'
import Form from '../containers/Form'
import InputDefault from '../styled-components/InputDefault'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ButtonDefault from '../styled-components/ButtonDefault';
import SaveService, { SaveItem } from '../service/SaveService';
import { Trash } from 'lucide-react';

function Home() {
  const saveService = new SaveService()
  const [saves, setSaves] = useState<any[]>([])
  const formSchema = z.object({
    path: z.string()
  })

  const { handleSubmit, formState: { errors }, register } = useForm<z.infer<typeof formSchema>>(
    {
      resolver: zodResolver(formSchema),
    }
  );

  function handleAddSave(data) {
    saveService.add(data.path).then(e => {
      handleGetSaves()
    })
  }

  function handleDeleteSave(path) {
    saveService.delete(path).then(e => {
      setSaves(e)
    })
  }

  function handleGetSaves() {
    saveService.get().then((x: any) => {
      setSaves(x)
    })
  }

  function seelctFile() {
    window.showDirectoryPicker().then(e=>{
      console.log(e)
    })
  }

  useEffect(() => {
    handleGetSaves()
  }, [])

  return (
    <div className='flex flex-col '>
      <div className='flex flex-col gap-3'>
        <div onClick={handleGetSaves}>
          <ButtonDefault loading={false}>
            Verificar arquivos
          </ButtonDefault>
        </div>
        <Form submit={handleSubmit(handleAddSave)}>
          <InputDefault  register={register("path")} errors={errors.path} label={"Caminho"} />
          <div onClick={seelctFile}>
            selecioanr arquivo 
          </div>
          <ButtonDefault loading={false}>
            Adicionar
          </ButtonDefault>
        </Form>
        {saves?.map((x: any, i: any) =>
          <div key={i} className=' p-3 pt-6 rounded bg-zinc-100 flex flex-col relative gap-3'>
            <p>{x.saveLocal}</p>
            {x.sync ?
              <p className={`bg-green-300 w-fit rounded p-2`}>Status: Sincronizado</p>
              :
              <p className={`bg-red-300 w-fit rounded p-2`}>Status: Não Sincronizado</p>
            }
            <Trash onClick={() => handleDeleteSave(x.saveLocal)} size={20} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home