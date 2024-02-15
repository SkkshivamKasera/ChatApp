import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Chats from './Pages/Chats';
import "./App.css"

function App() {
  return (
    <div className='App'>
        <Routes>
          <Route exact path='/' Component={Home} />
          <Route exact path='/chats' Component={Chats} />
        </Routes>
    </div>
  );
}

export default App;