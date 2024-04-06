import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { Box, Button, Stack, Typography } from '@mui/material';
import ChatLoading from "./ChatLoading.js";
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getSender } from '../config/ChatLogics.js';
import GroupChatModal from './miscellaneous/GroupChatModal.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  flexDirection: 'column',
  alignItems: 'center',
  margin: '5px 5px 0 10px',
  padding: '5px',
  background: 'white',
  borderRadius: '5px',
  borderwidth: '1px'
}

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext);
  const [loggedUser, setLoggedUser] = useState({});
  const [open, setOpen] = useState(false);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      // console.log("Mychatuser",user)
      const { data } = await axios.get('/api/chats', config);
      // console.log("my",data)
      setChats(data);
    } catch (error) {
      toast.error("Failed to Load the chats", {
        autoClose: 5000,
        closeOnClick: true,
        position: 'top-center'
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  const handleDeleteChat = async (chatToDelete) => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const response = await axios.delete(`/api/chats/${chatToDelete._id}`, config)
      if (response.status === 200) {
        console.log('chat deletion done')
        fetchChats();
      }
    } catch (error) {
      console.log(error)
    }
    // setAnchorEl(null)
    setOpen(false);
  }

  // const handleMenu = () => {
  //   // open === true ? setOpen(false) : setOpen(true);
  //   setOpen(true);
  // }

  // const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    // setAnchorEl(null);
    setOpen(false);
  };

  // const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <ToastContainer />
      <Box display={{ xs: selectedChat ? "none" : 'flex', md: 'flex' }} width={{ xs: '100%', md: '31%' }} sx={style}>

        <Box fontSize={{ xs: '28px', md: '30px' }} style={{ padding: '0 3px 3px 3px', fontFamily: 'Work sans', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', overflowY: 'hidden' }}>

          My chats
          <GroupChatModal>
            <Button fontSize={{ xs: '17px', sm: '10px', md: '17px' }} style={{ display: 'flex', textTransform: 'none', textDecoration: 'none' }} >
              New Group Chat
              <AddIcon />
            </Button>
          </GroupChatModal>
        </Box>
        <Box style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#F8F8F8', width: '100%', height: '100%', borderRadius: '5px', overflowY: 'hidden' }}>
          {chats ? (
            <Stack style={{ overflowY: 'auto', overflowX: "hidden" }}>
              {chats.map((chat) => (
                <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box
                    backgroundColor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "black"} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderRadius: '5px', cursor: 'pointer', marginTop: '4px' }}
                    onClick={() => setSelectedChat(chat)}
                    paddingX={3}
                    paddingY={2}
                    // marginY={1}
                    key={chat._id}>

                    <Typography fontSize='large'>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</Typography>

                    {
                      chat.latestMessage && (
                        <Typography fontSize='small'>
                          <b>{chat.latestMessage.sender.name} :</b>
                          {
                            chat.latestMessage.content.length > 50
                              ? chat.latestMessage.content.substring(0, 51) + "..."
                              : chat.latestMessage.content
                          }
                        </Typography>
                      )
                    }
                  </Box>
                  {/* <PopupState variant="popper" popupId="demo-popup-popper">
                    {(popupState) => (
                      <div>
                        <Button  {...bindToggle(popupState)}>
                          <MoreVertIcon />
                        </Button>
                        <Popper {...bindPopper(popupState)} transition >
                          {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350} >
                              <Button variant='contained' size='small' color='error' onClick={() => handleDeleteChat(chat)} >
                                Delete chat
                              </Button>
                            </Fade>
                          )}
                        </Popper>
                      </div>
                    )}
                  </PopupState> */}
                  {/* <div>
                  <Button variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        // id={id}
        open={open}
        // anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      > */}
        <Button variant='contained' size='small' color='error' onClick={() => handleDeleteChat(chat)} >
                                Delete chat
                              </Button>
      {/* </Popover>
                  </div> */}
                </Box>
              ))}
            </Stack>
          ) : (<ChatLoading />)
          }
        </Box>
      </Box>
    </>
  )
}

export default MyChats;