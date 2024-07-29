import React from 'react'
import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import chatBackground from './chatBackground.jpg'

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/chats');
  }

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundImage: `url(${chatBackground})`, backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    }}>

      <Button onClick={handleClick} variant='contained'>Get Started</Button>

    </Box>
  )
}

export default HomePage