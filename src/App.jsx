import './App.css';
import { HashRouter, Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <div className='flex justify-end w-full'>
        <button onClick={() => application.minimized()} className='w-10 h-7 bg-black bg-opacity-15 text-white'>_</button>
        <button onClick={() => application.close()} className='w-10 h-7 bg-red-400 text-white'>X</button>
      </div>
      <HashRouter basename="/">
        <ToastContainer/>
          <div className="w-full h-full flex justify-center items-center">
            <Routes>
              <Route path="/" element={<Home/>} />
            </Routes>
          </div>
      </HashRouter>
    </>
    
  );
}

export default App;
