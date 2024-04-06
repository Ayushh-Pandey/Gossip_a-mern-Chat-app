import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Button, IconButton, Modal, Typography } from '@mui/material';

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
const ProfileModal = ({ User, children }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        open === true ? setOpen(false) : setOpen(true);
    }
    
    return (
        <>

            <div>
                {children ? (
                    <span onClick={handleClick}>{children}</span>
                ) : (
                    <Button display={{ xs: 'flex' }} onClick={handleClick}>
                        <MoreVertIcon />
                    </Button>
                )
                }
                <Modal open={open}
                    onClose={handleClick}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">

                    <Box sx={style}>
                       <IconButton style={{position:'absolute',top:'0',right:'0'}} onClick={handleClick}>
                       <CloseIcon />
                       </IconButton>
                        <Typography id="modal-modal-title" sx={{ fontSize: '40px', fontFamily: 'Work sans', display: 'flex', justifyContent: 'center' }}>{User.name}</Typography>
                        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Avatar sx={{ width: '150px', height: '150px',fontSize:'150px',objectFit:'cover' }} alt={User.name} src={User.pic === "" ? '/' : User.pic} />
                            <Typography id="modal-modal-description" sx={{ fontSize: { xs: '28px', md: '30px' }, marginTop: '10px' }}>{User.email}</Typography>
                        </Box>
                        
                    </Box>

                </Modal>
            </div>
        </>
    )
}

export default ProfileModal