import React, { useEffect, useState } from 'react'
import { Cpu, LoaderCircle, RefreshCcw, Trash } from 'lucide-react';
import { SaveItem } from '../service/save-service';
import saveService from '../service/save-service';
import InputText from '../components/input-text';
import Button from '../components/button';

function Home({ starter }) {
  const [saves, setSaves] = useState<SaveItem[]>([])
  const [updatingSaves, setUpdatingSaves] = useState<string[]>([])
  const [filter, setFilter] = useState<string>()
  const [loading, setLoading] = useState({
    files: true
  })

  function handleDeleteSave(path) {
    saveService.delete(path).then(e => {
      handleGetSaves()
    })
  }
  function handleSetSyncSave(item: SaveItem) {
    setSaves(saves=>saves.map(e => {
      if (e.id == item.id) {
        item.sync = true

        return item
      }
      else {
        return e
      }
    }))
  }
  function handleSetNotSyncSave(item: SaveItem) {
    setSaves(saves=>saves.map(e => {
      if (e.id == item.id) {
        item.sync = false

        return item
      }
      else {
        return e
      }
    }))
  }
  function handleSyncSave(item: SaveItem) {
    setUpdatingSaves([...updatingSaves, item.id])

    saveService.sync(item.id)
      .then(e => {
        setUpdatingSaves(updatingSaves.filter(e => e != item.id))
        handleSetSyncSave(item)
      })
  }
  function handleGetSaves() {
    setLoading({ ...loading, files: true })

    saveService.get().then((x: SaveItem[]) => {
      setSaves(
        x.map(e => {
          saveService.fileChanged(e, () => {
            handleSetNotSyncSave(e)
          })
          return e
        })
      )
    }).finally(() => {
      setLoading({ ...loading, files: false })
    })
  }
  function handleFilter(e) {
    setFilter(e.target.value)
  }

  useEffect(() => {
    handleGetSaves()
  }, [starter])

  return (
    <>
      <div className='w-full h-full flex'>
        <div className='p-3 flex-[1] bg-zinc-900 bg-opacity-50 h-full flex flex-col'>
          <div className='flex gap-3 items-center '>
            <h1 className='font-semibold'>Meus arquivos</h1>
            <InputText onChange={handleFilter} type="text" placeholder='Nome do save'/>    
            <div className='flex-1 justify-end flex'>
              <Button onClick={handleGetSaves} >Verificar</Button>
            </div>
          </div>
          {
            loading.files ?
              <div className='h-full w-full items-center justify-center flex'>
                <LoaderCircle className='rotating-div' ></LoaderCircle>
              </div>
              :
              saves?.filter(e => e.saveName.includes(filter ?? "")).length == 0 ?
                <div className='h-full w-full items-center justify-center flex'>
                  Nenhum resultado encontrado
                </div>
                :
                <div>
                  {
                    (
                      saves?.filter(e => e.saveName.includes(filter ?? "")).map((x, i: any) =>
                        <div key={i} className=' p-3 pt-6 rounded  flex flex-col relative gap-3'>
                          <div className='flex justify-between items-center'>
                            <p className={(x.sync ? '' : 'text-red-400 ') + 'text-sm'}>{x.name}</p>
                            <div className=' flex gap-3'>
                              <div onClick={() => handleSyncSave(x)} className='h-full p-2 hover:bg-zinc-100 hover:bg-opacity-10 cursor-pointer'>
                                {
                                  updatingSaves.includes(x.id) ?
                                    <RefreshCcw className='w-5 rotating-div' /> :
                                    <RefreshCcw className='w-5' />
                                }

                              </div>
                              <div onClick={() => handleDeleteSave(x.id)} className='h-full p-2 hover:bg-zinc-100 hover:bg-opacity-10 cursor-pointer'>
                                <Trash className='w-5 cursor-pointer ' />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  }
                </div>
          }
        </div>
      </div>
      <footer className='p-2 text-xs flex items-center border-t border-t-zinc-700 '>
        <div className='flex gap-3 text-nowrap'>
          <p>Status:</p>
          {
            saves.length > 0 ? (saves.some(e => e.sync === false) ?
              <p className=' text-red-500 bg-opacity-25'>Existem arquivos desincronizados</p>
              :
              <p className=' text-green-500 bg-opacity-25'>Todos arquivos sincronizados</p>)
              :
              <p className=''>Sem arquivos</p>
          }
        </div>
        <div className='titlebar w-full h-full'>
        </div>
      </footer>
    </>
  )
}

export default Home