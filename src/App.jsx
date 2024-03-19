import './App.css';
import { HashRouter, Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
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
