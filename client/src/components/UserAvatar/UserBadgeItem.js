import { Box } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box paddingX={2} paddingY={1} borderRadius="10px" margin={1} marginBottom={2} variant="contained"  style={{cursor:'pointer',background:"purple",color:'white',fontSize:'18px',display:'flex',justifyContent:'space-between',alignItems:'center' }} onClick={handleFunction}>
        {user.name.toUpperCase()}
        <CloseIcon fontSize="18px" paddingLeft={1}/>
    </Box>
  )
}

export default UserBadgeItem