import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import { Maximize2, Minus, X } from 'lucide-react';
import electronService from './service/electron-service';
import Add from './pages/Add';
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <HashRouter basename="/">
        <ToastContainer />
        <div className="w-full h-full flex justify-center items-center">
          <div className='text-sm text-zinc-200 w-screen h-screen bg-zinc-800 flex flex-col'>
            <nav className=' flex items-center border-b border-b-zinc-700 '>
              <div className='p-3 text-nowrap flex gap-3'>
                <Link to={"/"}>Home</Link>
                <Link to={"/add"}>Adicioar</Link>
              </div>
              <div className='titlebar w-full'>
                <div className='h-5 m-2'></div>
              </div>
              <div className='flex'>
                <div onClick={electronService.minimize} className='h-full p-2 hover:bg-zinc-100 hover:bg-opacity-10 cursor-pointer'>
                  <Minus strokeWidth={1.3} className='w-5' />
                </div>
                <div onClick={electronService.maximize} className='h-full p-2 hover:bg-zinc-100 hover:bg-opacity-10 cursor-pointer'>
                  <Maximize2 strokeWidth={1.3} className='w-5'></Maximize2>
                </div>
                <div onClick={electronService.close} className='h-full p-2 hover:bg-red-500 cursor-pointer'>
                  <X strokeWidth={1.3} className='w-5'></X>
                </div>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<Add />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </>

  );
}

export default App;
