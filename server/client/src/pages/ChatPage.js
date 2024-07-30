import React, { useContext, useState } from 'react'
import { ChatContext,  } from '../context/ChatProvider'
import { Box } from '@mui/material';
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";


const ChatPage = () => {
  const {user} = useContext(ChatContext);
  const [fetchAgain,setFetchAgain] = useState();

  return (
    <Box sx={{width:"100vw",height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between',backgroundColor:'skyblue'
    }}>
      <Box sx={{display:'flex',width:'100%',justifyContent:'space-between',height:'8.5vh'}}> 
      {<SideDrawer/>}
      </Box>
      <Box sx={{display:"flex",justifyContent:'space-between',height:'91.5vh',width:"100%"}}>
        {<MyChats fetchAgain={fetchAgain}/>}
        {<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </Box>
  )
}

export default ChatPage