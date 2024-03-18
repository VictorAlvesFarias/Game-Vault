import React from 'react'
import Button from '../components/Button'
import Loading from '../components/Loading'

function ButtonDefault({loading,children}) {

  return (
    <Button
        className="bg-blue-400 w-full p-2 rounded text-white  hover:shadow-md transition-all"
        loading={loading}
        loadingComponent={
        <Loading visible={true} className={"w-10 h-10"}/>}
    >
        {children}
    </Button>
  )
}

export default ButtonDefault