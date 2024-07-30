import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box onClick={handleFunction}  sx={{width:'100%',display:'flex',alignItems:'center',color:'black',padding:'0px 3px 0px 3px',marginBottom:'2px',borderRadius:'5px',cursor:'pointer',
    backgroundColor:'#E8E8E8','&:hover':{backgroundColor:'#38B2AC',color:'white' } }}  >
        <Avatar alt={user.name} src={user.pic===""?'/':user.pic} sx={{margin:"8px"}}/>
    
        <Box>
            <Typography>{user.name}</Typography>
            <Typography fontSize='small'>{user.email}</Typography>
        </Box>
    </Box>
  )
}

export default UserListItem