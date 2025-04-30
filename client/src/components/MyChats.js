import React, { useContext, useEffect, useState } from 'react'
import { ChatContext, DOMAIN } from '../context/ChatProvider'
import { Avatar, Box, Button, CircularProgress, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import ChatLoading from "./ChatLoading.js";
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getSender, getSenderFull } from '../config/ChatLogics.js';
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
  const { selectedChat, setSelectedChat, user, setUser, chats, setChats, isAuthenticated, isUserAuthenticated } = useContext(ChatContext);
  const [loggedUser, setLoggedUser] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const open = Boolean(anchorEl);

  const fetchChats = async () => {
    if (isAuthenticated) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        setChatLoading(true);
        const { data } = await axios.get(`${DOMAIN}/api/chats`, config);
        setChats(data);
        setChatLoading(false);
      } catch (error) {
        toast.error("Failed to Load the chats", {
          autoClose: 5000,
          closeOnClick: true,
          position: 'top-center',
          containerId: 'myChats'
        })
      }
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

      const response = await axios.delete(`${DOMAIN}/api/chats/${chatToDelete._id}`, config)
      if (response.status === 200) {
        console.log('chat deletion done')
        fetchChats();
      }
    } catch (error) {
      console.log(error)
    }
    setAnchorEl(null)
  }

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setGuestLoading(true);
      const response = await axios.post(`${DOMAIN}/api/user/login`, { email: 'guestuser@gmail.com', password: '12345' }, config);
      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setGuestLoading(false);
      isUserAuthenticated(true);
      window.location.reload();
    } catch (error) {
      toast.error(`${error?.response?.data?.msg}`, {
        position: 'top-center',
        autoClose: 5000,
        closeOnClick: true,
        containerId: 'myChats'
      });
    }
  }
  return (
    <>
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

        {isAuthenticated ?
          <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#F8F8F8', width: '100%', height: '100%', borderRadius: '5px', overflowY: 'hidden' }}>

            {chatLoading ? <ChatLoading />
              : chats?.length > 0 ? (
                <Stack style={{ overflowY: 'auto', overflowX: "hidden", marginTop: '5px' }}>
                  {chats.map((chat) => (
                    <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Avatar src={
                        !chat.isGroupChat ? getSenderFull(loggedUser, chat.users).pic : '/'
                      } alt={!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName} />
                      <Box
                        backgroundColor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "black"} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderRadius: '50px', cursor: 'pointer', marginTop: '4px' }}
                        onClick={() => setSelectedChat(chat)}
                        paddingX={3}
                        paddingY={1}
                        marginY={1}
                        marginX={1}
                        key={chat._id}>

                        <Typography fontSize='large' sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                        </Typography>
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

                      <IconButton
                        id="delete-chat-button"
                        aria-controls={open ? 'delete-chat-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpenMenu}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="delete-chat-menu"
                        aria-labelledby="delete-chat-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }} >
                        <MenuItem sx={{ backgroundColor: 'red', color: 'white', "&:hover": { backgroundColor: 'lightcoral' } }} onClick={() => { handleDeleteChat(chat) }}>
                          Delete Chat
                        </MenuItem>
                      </Menu>

                    </Box>
                  ))}
                </Stack>
              ) : (<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px' }}>
                <Typography variant='h5' sx={{ fontSize: { xs: '28px', md: '30px' }, padding: '0 3px 3px 3px', fontFamily: 'Work sans' }}>
                  Create a one on one chat by searching a user from search bar, or create a group chat
                </Typography>
              </Box>)
            }
          </Box>
          : guestLoading ?
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <CircularProgress size={50} />
            </Box>
            : <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px' }}>
              <Typography variant='h5' sx={{ fontSize: { xs: '28px', md: '30px' }, padding: '0 3px 3px 3px', fontFamily: 'Work sans' }}>
                For Demonstration purpose you can login with Guest Id, By Button shown below
              </Typography>
              <Button sx={{ backgroundColor: 'skyblue', color: 'black' }} onClick={handleGuestLogin}>Guest Login</Button>
            </Box>
        }
      </Box >
      <ToastContainer containerId='myChats' />
    </>
  )
}

export default MyChats;