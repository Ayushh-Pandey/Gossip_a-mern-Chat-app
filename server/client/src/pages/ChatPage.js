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
    <Box style={{width:"100vw",height:'100vh',backgroundColor:'grey',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-between'}}>
      <Box style={{display:'flex',width:'100%',justifyContent:'space-between',height:'8.5vh'}}> 
      {user && <SideDrawer/>}
      </Box>
      <Box style={{display:"flex",justifyContent:'space-between',height:'91.5vh',width:"100%"}}>
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </Box>
  )
}

export default ChatPage