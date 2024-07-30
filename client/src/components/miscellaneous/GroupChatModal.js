import { Box, Button, FormControl, IconButton, Modal, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import CloseIcon from '@mui/icons-material/Close';
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

const GroupChatModal = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats, isAuthenticated } = useContext(ChatContext);

    const handleClick = () => {
        setOpen(true);
    }

    const handleSearch = async (query) => {
        console.log(query)
        if (!isAuthenticated) {
            toast.warning("Login to load the search results", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId: 'groupChatModal'
            });
            return;
        }
        else if (!query) {
            setSearchResult([])
            setSearch("")
            return;
        }
        else {
            try {
                setSearch(query)
                setLoading(true)
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get(`/api/user?search=${search}`, config);

                setLoading(false);
                setSearchResult(data);
            } catch (error) {
                toast.error("Failed to load the search results", {
                    position: 'top-center',
                    autoClose: 5000,
                    closeOnClick: true,
                    containerId: 'groupChatModal'
                });
                setLoading(false);
            }
        }
    }

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            toast.warning("Please Login to create group chat", {
                autoClose: 5000,
                closeOnClick: true,
                position: 'top-center',
                containerId: 'groupChatModal'
            })
            return;
        }
        else if (!groupChatName || !selectedUsers) {
            toast.warning("Please fill all the details", {
                autoClose: 5000,
                closeOnClick: true,
                position: 'top-center',
                containerId: 'groupChatModal'
            })
            return;
        }
        else {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                };
                const response = await axios.post("/api/chats/group", {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                }, config)

                setChats([response.data, ...chats]);
                setOpen(false);

                toast.success('New Group Chat created successfully', {
                    position: 'top-center',
                    autoClose: 5000,
                    closeOnClick: true,
                    containerId: 'groupChatModal'
                })
            } catch (error) {
                toast.error(`${error.response.data.message}`, {
                    position: 'top-center',
                    autoClose: 5000,
                    closeOnClick: true,
                    containerId: 'groupChatModal'
                })
            }
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warning("User Already added to the group", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId: 'groupChatModal'
            })
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }
    const handleCloseModal = () => {
        setOpen(false)
        setSearchResult([]);
        setSearch("")
        setLoading(false);
        setGroupChatName('')
        setSelectedUsers([])
    }

    return (
        <div>
            <>
                <span onClick={handleClick}>{children}</span>
                <Modal open={open} onClose={handleCloseModal}>
                    <Box sx={style}>
                        <IconButton style={{ position: 'absolute', top: '0', right: '0' }} onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                        <Typography fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">Create Group Chat</Typography>

                        <Box display="flex" flexDirection="column" alignItems="center">
                            <FormControl fullWidth style={{ marginBottom: '10px' }}>
                                <TextField size='small' placeholder='Chat Name' marginBottom={3} onChange={(e) => setGroupChatName(e.target.value)} />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField size='small' placeholder='Add Users eg: ayush, jane' marginBottom={1} onChange={(e) => handleSearch(e.target.value)} />
                            </FormControl>
                            <Box width="100%" display="flex" flexWrap="wrap">

                                {selectedUsers.map(u => (
                                    <UserBadgeItem key={user._id} user={u} handleFunction={() => handleDelete(u)} />
                                ))}
                            </Box>
                            {loading ? <div>loading...</div> : (

                                searchResult.length > 4 ? (<Box style={{ overflowY: 'auto', overflowX: 'hidden', width: '300px', height: '300px', marginTop: '5px' }} >
                                    {searchResult?.map((user) => (
                                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                    ))}
                                </Box>
                                ) : (<Box style={{ overflowY: 'auto', overflowX: 'hidden', width: '300px', height: 'auto', marginTop: '5px' }} >
                                    {searchResult?.map((user) => (
                                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                                    ))}
                                </Box>)


                            )}
                        </Box>
                        <Box display='flex' justifyContent="flex-end" marginTop={1}>
                            <Button variant="contained" onClick={handleSubmit}>Create chat</Button>
                        </Box >
                    </Box>

                </Modal>
            </>
            <ToastContainer containerId='groupChatModal' />
        </div>
    )
}

export default GroupChatModal


