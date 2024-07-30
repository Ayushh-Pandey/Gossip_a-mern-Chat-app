import { Box, Button, CircularProgress, FormControl, IconButton, Modal, TextField, Typography } from '@mui/material';
import React, { useContext, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ChatContext, DOMAIN } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: 'auto',

};


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages, children }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

    const [open, setOpen] = useState(false);
    const handleClick = () => {
        open === true ? setOpen(false) : setOpen(true);
        setSearchResult([]);
        setSearch("")
    }
    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.warning('Only Admin can remove someone!', {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(`${DOMAIN}/api/chats/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            setLoading(false);
        }
        setGroupChatName("")
    }
    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(`${DOMAIN}/api/chats/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            setRenameLoading(false);
        }
        setGroupChatName("");
    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResult([])
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`${DOMAIN}/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error("Failed to load the Search Results", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            setLoading(false);
        }
    }
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.warning("User Already in group", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.warning("Only Admin can add user", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.put(`${DOMAIN}/api/chats/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId:'updateGroupModal'
            })
            setLoading(false);
        }
        setGroupChatName("")
    }
    return (
        <>
            <div>
                {children ? (
                    <span onClick={handleClick}>{children}</span>
                ) : (
                    <Button display={{ xs: 'flex' }} onClick={() => handleClick()}><MoreVertIcon /></Button>
                )
                }

                <Modal open={open} onClose={handleClick}>
                    <Box sx={style}>
                    <IconButton style={{position:'absolute',top:'0',right:'0'}} onClick={handleClick}>
                       <CloseIcon />
                       </IconButton>
                        <Typography fontSize="35px" fontFamily="Work sans" display='flex' justifyContent="center">{selectedChat.chatName}</Typography>


                        <Box id="modal-body" display='flex' flexDirection='column' alignItems='center'>
                            <Box width="100%" display="flex" flexWrap="wrap" paddingBottom={3}>
                                {selectedChat.users.map((u) => (
                                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                                ))}
                            </Box>
                            <FormControl fullWidth style={{ display: "flex", justifyContent: 'space-between', flexDirection: 'row', marginBottom: '5px' }}>
                                <TextField style={{ width: "100%" }} size='small' placeholder='Chat Name' value={groupChatName} marginBottom={3} onChange={(e) => setGroupChatName(e.target.value)} />
                                <Button variant='contained' style={{ background: 'teal' }} marginLeft={1} onClick={handleRename}>Update</Button>
                            </FormControl>
                            <FormControl fullWidth >
                                <TextField size='small' placeholder='Add Users to group' marginBottom={1} onChange={(e) => handleSearch(e.target.value)} />
                            </FormControl>
                            {loading ? (
                                <CircularProgress size="large" />
                            ) : (
                                searchResult.length > 4 ? (<Box sx={{ overflowY: 'auto', overflowX: 'hidden', width: '300px', height: '300px', marginTop: '5px' }} >
                                    {searchResult?.map((user) => (
                                        <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                    ))}
                                </Box>
                                ) : (<Box sx={{ overflowY: 'auto', overflowX: 'hidden', width: '300px', height: 'auto', marginTop: '5px' }} >
                                    {searchResult?.map((user) => (
                                        <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                    ))}
                                </Box>)
                            )}
                        </Box>
                        <Box display='flex' justifyContent='flex-end' marginTop={1}>
                            <Button color='error' variant='contained' onClick={() => handleRemove(user)} >
                                Leave Group
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
            <ToastContainer containerId='updateGroupModal'/>
        </>

    )
}

export default UpdateGroupChatModal