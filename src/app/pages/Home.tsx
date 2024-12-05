import React, { useEffect, useRef, useState } from 'react'
import { Check, LoaderCircle, RefreshCcw, Trash } from 'lucide-react';
import InputText from '../components/input-text';
import AccordionRoot from '../components/accordion-root';
import Accordion from '../components/accordion';
import AccordionTitle from '../base-components/accordion-title';
import AccordionContext from '../base-components/accordion-context';
import Button from '../components/button';
import InputRoot from '../components/input-root';
import Checkbox from '../components/checkbox';
import Label from '../components/label';
import saveService, { ISaveItem } from '../service/save-service';

function Home({ starter }) {
  const [saves, setSaves] = useState<ISaveItem[]>([])
  const [updatingSaves, setUpdatingSaves] = useState<string[]>([])
  const [filter, setFilter] = useState<string>("")
  const ws = useRef<WebSocket | null>(null);
  const [loading, setLoading] = useState({
    files: true
  })

  function handleDeleteSave(path) {
    saveService.deleteSave(path)
      .then(e => {
        handleGetSaves()
      })
  }
  function handleFilter(e) {
    setFilter(e.target.value)
  }
  function handleUpdate(partial: Partial<ISaveItem>, id: string) {
    saveService.updateSave(id, partial)

    setSaves(saves =>
      saves.map(save => (save.id === id) ?
        { ...save, ...partial }
        :
        save
      )
    );
  }
  function handleGetSaves() {
    setLoading({ ...loading, files: true })

    saveService.getSaves()
      .then(({ res: context }) => {
        setSaves(context)
      })
      .finally(() => {
        setLoading({ ...loading, files: false })
      })
  }
  function setSyncSave(item: ISaveItem) {
    setSaves(saves => saves.map(e => {
      if (e.id == item.id) {
        item.sync = true

        return item
      }
      else {
        return e
      }
    }))
  }
  function setNotSyncSave(item: ISaveItem) {
    setSaves(saves => saves.map(e => {
      if (e.id == item.id) {
        item.sync = false

        return item
      }
      else {
        return e
      }
    }))
  }
  function syncSave(item: ISaveItem) {
    setUpdatingSaves([...updatingSaves, item.id])

    saveService.syncSave(item.id)
      .then(e => {
        setUpdatingSaves(updatingSaves.filter(e => e != item.id))
        setSyncSave(item)
      })
  }
  function watcherEvents(IsaveItem) {
    console.log(IsaveItem)
    setNotSyncSave(IsaveItem.saveItem)
  }

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:2526');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      watcherEvents(data)
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    handleGetSaves()
  }, [starter])

  return (
    <>
      <div className='w-full h-full flex'>
        <div className='p-3 flex-[1] bg-zinc-900 bg-opacity-50 h-full flex flex-col'>
          <div className='flex gap-3 items-center '>
            <h1 className='font-semibold'>My files</h1>
            <InputText onChange={handleFilter} type="text" placeholder='Save name' />
            <div className='flex-1 justify-end flex'>
              <Button onClick={handleGetSaves} >Verify</Button>
            </div>
          </div>
          {
            loading.files ?
              <div className='h-full w-full items-center justify-center flex'>
                <LoaderCircle className='rotating-div' ></LoaderCircle>
              </div>
              :
              saves?.filter(e => e.saveName.includes(filter)).length == 0 ?
                <div className='h-full w-full items-center justify-center flex'>
                  Results not found
                </div>
                :
                <div>
                  {
                    (
                      saves?.filter(e => e.saveName.includes(filter)).map((x, i: any) =>
                        <div key={i} className='pt-6 rounded  flex flex-col relative gap-3'>
                          <AccordionContext>
                            <AccordionRoot>
                              <div className='p-3 rounded flex justify-between items-center hover:bg-zinc-800 h-16'>
                                <AccordionTitle className={"w-full h-full flex items-center "+(x.sync ? '' : 'text-red-400 ') + 'text-sm'}>
                                  <p className='h-fit'>{x.name}</p>
                                </AccordionTitle>
                                <div className='flex gap-3'>
                                  <div onClick={() => syncSave(x)} className='h-full p-2 hover:bg-zinc-100 hover:bg-opacity-10 cursor-pointer z-50'>
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
                              <Accordion>
                                <div className='p-3 flex flex-col gap-3'>
                                  <InputRoot variation='checkbox'>
                                    <Checkbox
                                      onChange={() => handleUpdate({ saveWithRachChange: !x.saveWithRachChange }, x.id)}
                                      checked={x.saveWithRachChange}
                                      value={x.saveWithRachChange ?? "false"}
                                      data="true"
                                    >
                                      <Check />
                                    </Checkbox>
                                    <Label>Save with each change</Label>
                                  </InputRoot>
                                  <InputRoot variation='checkbox'>
                                    <Checkbox
                                      onChange={() => handleUpdate({ versions: !x.versions }, x.id)}
                                      checked={x.versions}
                                      value={x.versions ?? "false"}
                                      data="true"
                                    >
                                      <Check />
                                    </Checkbox><Label>Versions</Label>
                                  </InputRoot>
                                </div>
                              </Accordion>
                            </AccordionRoot>
                          </AccordionContext>
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
          <p>Stats:</p>
          {
            saves.length > 0 ? (saves.some(e => e.sync === false) ?
              <p className=' text-red-500 bg-opacity-25'>There are outdated files</p>
              :
              <p className=' text-green-500 bg-opacity-25'>All files updated</p>)
              :
              <p className=''>No files</p>
          }
        </div>
        <div className='titlebar w-full h-full'>
        </div>
      </footer>
    </>
  )
}

export default Home