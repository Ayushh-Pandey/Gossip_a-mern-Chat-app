import React, { useContext, useEffect, useState } from 'react'
import { ChatContext,DOMAIN } from '../context/ChatProvider'
import { Box, Button, CircularProgress, Divider, FormControl, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification, isAuthenticated } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // const defaultOptions = {
    //     loop:true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //         preserveAspectRatio: 'XMidYMid slice',
    //     }
    // }

    useEffect(() => {
        if (isAuthenticated) {
            socket = io('https://gossip-a-mern-chat-app.onrender.com');
            socket.emit("setup", user);
            socket.on('connected', () =>
                setSocketConnected(true)
            );
            socket.on('typing', () => setIsTyping(true));
            socket.on('stop_typing', () => setIsTyping(false));
        }
    }, [])

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            setLoading(true)

            const { data } = await axios.get(`${DOMAIN}/api/message/${selectedChat._id}`, config)

            setMessages(data);
            setLoading(false);
            socket.emit('join_chat', selectedChat._id);
        } catch (error) {
            toast.error("Failed to Load the Messages", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'singleChatPage'
            })
        }
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    const sendMessage = async (e) => {
        if (e.key === 'Enter' && newMessage && isAuthenticated) {
            socket.emit('stop_typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${DOMAIN}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config)

                socket.emit('new_message', data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error("Failed to Load the Messages", {
                    position: 'top-center',
                    autoClose: 5000,
                    closeOnClick: true,
                    containerId:'singleChatPage'
                })
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            socket.on('message_received', (newMessageReceived) => {
                if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                    if (!notification.includes(newMessageReceived)) {
                        setNotification([newMessageReceived, ...notification])
                        setFetchAgain(!fetchAgain)
                    }
                }
                else {
                    setMessages([...messages, newMessageReceived]);
                }
            })
        }
    })


    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop_typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClear = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const response = await axios.delete(`${DOMAIN}/api/message/${selectedChat._id}`, config);
            if (response.status === 200) {
                console.log('message delete successfull')
                fetchMessages();
            }
        } catch (error) {
            console.log(error);
        }
        handleClose();
    }

    return (
        <>
            {
                selectedChat ? (<>

                    <Typography
                        paddingBottom={3}
                        paddingX={2}

                        fontFamily="Work sans"
                        sx={{
                            justifyContent: { xs: "space-between" },
                            display: "flex", fontSize: { xs: "28px", md: "30px" },
                            alignItems: "center", width: "100%"
                        }}
                    >
                        <IconButton sx={{ display: { xs: "flex", md: "none" } }}
                            onClick={() => setSelectedChat("")} >
                            <ArrowBackIcon />
                        </IconButton>
                        {messages && (!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <div>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <MoreVertIcon />
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <ProfileModal User={getSenderFull(user, selectedChat.users)}>
                                            <MenuItem >View Contact</MenuItem>
                                        </ProfileModal>
                                        <Divider />
                                        <MenuItem>
                                            <Button size='small' color='secondary' variant='outlined' style={{ textDecoration: 'none', }} onClick={() => handleClear()}>clear chat</Button>
                                        </MenuItem>
                                    </Menu>

                                </div>

                            </>
                        ) : (<>
                            {selectedChat.chatName.toUpperCase()}
                            <div>
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <MoreVertIcon />
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem>
                                        <Button size='small' color='secondary' variant='outlined' style={{ textDecoration: 'none' }} onClick={() => handleClear()}>clear chat</Button>
                                    </MenuItem>
                                    <Divider />
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} >
                                        <MenuItem style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none', marginTop: '0' }} >
                                            <Button size='small' style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }} endIcon={<ArrowRightIcon />}>
                                                More
                                            </Button>
                                        </MenuItem>
                                    </UpdateGroupChatModal>
                                </Menu>

                            </div>

                        </>
                        ))}
                    </Typography>
                    <Box display="flex" flexDirection="column" justifyContent="flex-end" padding={3} width="100%" height="100%" borderRadius="10px" overflow="hidden" backgroundColor='#E8E8E8'>
                        {loading ? (<CircularProgress style={{ fontSize: '80px', width: '80px', height: '80px', alignSelf: "center", margin: "auto" }} />
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                overflow: "auto",
                                scrollbarWidth: "none",
                            }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} required sx={{ marginTop: '8px' }}>
                            {isTyping ? <div>
                                typing...

                                {/* <Lottie options={defaultOptions} width={70} style={{marginBottom: 15,marginLeft: 0}}/> */}
                            </div> : <></>}
                            <TextField size='small' required variant='filled' backgroundColor="#E8E8E8" placeholder='Enter a message' value={newMessage} onChange={typingHandler} />
                        </FormControl>
                    </Box>
                </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <Typography variant="h3" fontSize="3xl" paddingBottom={3} fontFamily="Work sans">
                            click on a user to start chatting
                        </Typography>
                    </Box>
                )
            }

            <ToastContainer containerId='singleChatPage'/>
        </>
    )
}

export default SingleChat
