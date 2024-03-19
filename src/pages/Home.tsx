import React, { useEffect, useState } from 'react'
import Form from '../containers/Form'
import InputDefault from '../styled-components/InputDefault'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ButtonDefault from '../styled-components/ButtonDefault';
import SaveService from '../service/SaveService';


function Home() {

  const saveService = new SaveService() 

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

  return (
    <Form  submit={handleSubmit(addSave)}>
      <InputDefault register={register("path")} errors={errors.path} label={"Caminho"}/>
      <ButtonDefault loading={false}>
        Adicionar
      </ButtonDefault>
    </Form>
  )
}

export default Home