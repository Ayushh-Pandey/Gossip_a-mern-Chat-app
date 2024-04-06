import React from 'react'
import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = (e)=>{
    e.preventDefault();
    navigate('/login');
  }
  
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundColor:'grey'}}>
      
      <Button onClick={handleClick} variant='contained'>Get Started</Button>
      
    </Box>
  )
}

export default HomePage