import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import ChatPage from './pages/ChatPage.js';

function App() {

  return (
    <div>
      <Routes>
      < Route path='/' element={<HomePage />} exact/>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/chats' element={<ChatPage/>}/>
          </Routes>
    </div>
  );
}

export default App;
