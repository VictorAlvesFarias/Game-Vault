import loadingImg from '../assets/spiner.svg'

function Loading({className,visible}:any) {
  return (
    visible&&
    <div className={className+" animate-spin"}>
        <img src={loadingImg} alt=""/>
    </div>
  )
}

export default Loading