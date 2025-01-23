import logo from './logo.svg';
import './App.css';
import Home from './home';
import { BrowserRouter,Route,Routes } from 'react-router-dom';

// In your index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Oper from './oper';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/oper' element={<Oper></Oper>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
