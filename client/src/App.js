import './App.css';
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.js';
import Login from './components/userAccount/Login.js';
import Signup from './components/userAccount/Signup.js';
import ChatPage from './pages/ChatPage.js';


function App() {

  return (
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
  );
}

export default App;
