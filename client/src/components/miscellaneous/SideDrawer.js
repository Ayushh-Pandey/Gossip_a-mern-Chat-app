import { Avatar, Box, Button, CircularProgress, Divider, Drawer, IconButton, Menu, MenuItem, MenuList, TextField, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ChatContext, DOMAIN, } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import Badge from '@mui/material/Badge';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);


  const navigate = useNavigate();

  const { user,setUser, setSelectedChat, chats, setChats, notification, setNotification, isAuthenticated, isUserAuthenticated } = useContext(ChatContext);

  const handleNotifications = () => {
    setOpenNotifications(true);
  }
  // {notification && console.log('notif',notification)}

  const handleMenu = () => {
    setOpenMenu(true);
  }

  const handleSearch = async () => {

    if (!isAuthenticated) {
      toast.warning("Please Login to search", {
        position: 'top-center',
        autoClose: 5000,
        closeOnClick: true,
        containerId:'navbar'
      })
      return;
    }
    else if (!search) {
      toast.warning("Please Enter something to search", {
        position: 'top-center',
        autoClose: 5000,
        closeOnClick: true,
        containerId:'navbar'
      })
      return;
    }
    else {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        const { data } = await axios.get(`${DOMAIN}/api/user?search=${search}`, config);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast.error("Failed to Load the search Result", {
          autoClose: 5000,
          position: 'top-center',
          closeOnClick: true,
          containerId:'navbar'
        })
      }
    }
  }

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true)
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post(`${DOMAIN}/api/chats`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);

      setLoadingChat(false);
      setOpenDrawer(false);
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
        title: 'Error fetching the chats',
        position: 'top-center',
        autoClose: 5000,
        closeOnClick: true,
        containerId:'navbar'
      })
    }
  }

  const handleDrawer = () => {
    openDrawer === false ? setOpenDrawer(true) : setOpenDrawer(false);
  }

  const handleLogout = () => {
    setTimeout(() => {
      logoutHandler();
    }, 1800000);
  }

  useEffect(() => {
    handleLogout();
  }, [])

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser({})
    isUserAuthenticated(false);
    navigate("/");
  }

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', background: 'white', padding: '5px 10px 5px 10px', borderRadius: '5px', width: '100%', margin: '10px 10px 5px 10px' }}>
        <Tooltip title='Search Users to Chat' arrow >
          <Button style={{ textTransform: 'none' }} onClick={handleDrawer}>
            <SearchIcon />
            <Typography display={{ xs: 'none', sm: 'none', md: 'flex' }} style={{ padding: '4px', color: 'black' }} >Search User</Typography>

          </Button>
        </Tooltip>
        <Typography sx={{ fontSize: '40px',fontFamily:'Work sans' }}>GOSSIP</Typography>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
          <>
            <Button style={{ padding: '1px' }} onClick={handleNotifications}>
              <Badge badgeContent={notification.length} color='error'>
                <NotificationsIcon color='action' style={{ fontSize: '2xl', margin: '1px' }} />
              </Badge>
            </Button>
            <Menu open={openNotifications} onClose={() => setOpenNotifications(false)}
              anchorReference="anchorPosition"
              anchorPosition={{ top: 55, left: 1350 }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}

            >
              <MenuList sx={{ width: 'auto', padding: '0 8px 0 8px' }}>
                {!notification.length && "No New Message"}
                {
                  notification.map((notif) => (
                    <MenuItem key={notif._id} onClick={() => {
                      setSelectedChat(notif.chat)
                      setNotification(notification.filter((n) => n !== notif));
                      setOpenNotifications(false);
                    }}>
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(user, notif.chat.users)}`}
                    </MenuItem>
                  ))
                }
              </MenuList>

            </Menu>
          </>
          <>
            {isAuthenticated ? <>
              <Button size="small" id="basic-button" aria-controls={openMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? 'true' : undefined} style={{ padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleMenu}>
                <Avatar sx={{ cursor: 'pointer', objectFit: 'cover', width: 42, heigth:'auto' }} alt={user.name} src={user.pic === "" ? '/' : user.pic} />
                <ExpandMoreOutlinedIcon style={{ fontSize: '2xl', margin: '1px' }} />
              </Button>
              <Menu id="basic-menu" open={openMenu} onClose={() => setOpenMenu(false)}
                MenuListProps={{ 'aria-labelledby': 'basic-button', }}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 55, left: 1500 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}>
                <ProfileModal User={user} >
                  <MenuItem >My Profile</MenuItem>
                </ProfileModal>
                <Divider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </Menu>
            </> : <Button sx={{ color: 'inherit' }} onClick={handleClick}>LOGIN</Button>
            }
          </>
        </div>
      </Box>
      <Drawer open={openDrawer} onClose={handleDrawer}>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography borderBottomWidth="2px" variant='h5' style={{ padding: '5px' }}>Search User</Typography>
          <IconButton size='medium' onClick={handleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Box style={{ display: 'flex', paddingBottom: '2px' }}>
          <TextField size="small" placeholder='Search by name or email' value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginLeft: '5px' }} />
          <Button size='large' onClick={handleSearch}>Go</Button>
        </Box>
        {loading ? (<ChatLoading />
        ) : (
          <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
            {searchResult?.map((user) => (

              <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />

            ))}
          </div>
        )}
        {loadingChat &&
          <Box display='flex'>
            <CircularProgress />
          </Box>
        }
      </Drawer>
      <ToastContainer containerId='navbar'/>
    </>
  )
}

export default SideDrawer