import { Box } from '@mui/material';
import React, { useContext } from 'react'
import {ChatContext} from "../context/ChatProvider";
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const {selectedChat} = useContext(ChatContext);

  return (
    <Box display={{xs:selectedChat? "flex":"none",md:"flex"}} 
    width={{xs:"100%",md:"68%"}}
      padding={3}
      sx={{alignItems:"center",
      flexDirection:"column",
      background:"white",
      borderRadius:"5px",
      borderWidth:"1px",
      margin:'5px 10px 0 5px',
      }}
      >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox;