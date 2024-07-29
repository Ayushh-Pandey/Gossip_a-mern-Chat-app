import React, { useState } from 'react'
import {  Box, Button, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import chatBackground from './chatBackground.jpg'

const initialValues = {
    name: '',
    email: '',
    password: '',
    pic: '',
}

const Signup = () => {
    const [credentials, setCredentials] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState("");

   
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            
                const response = await axios.post('/api/user/signup', credentials);
                
                // localStorage.setItem("userInfo", JSON.stringify(response.data));
                navigate('/login');
        } catch (error) {
            toast.error(`${error?.response?.data?.msg}`, {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId: 'signupPage'
            });
        }
    }

    const postImage = async (pic) => {
        try {
                setProfileImage(pic.name);
                const data = new FormData();
                data.append("file", pic);
                data.append("upload_preset", "chat_app");
                data.append("cloud_name", "dsgy1uji7");
                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dsgy1uji7/image/upload", data);
                setCredentials({ ...credentials, ['pic']: uploadRes.data.url.toString()});                

        } catch (error) {
            toast.error("Error uploading image!", {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId: 'signupPage'
            });
        }
    }
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundImage: `url(${chatBackground})`, backgroundRepeat: "no-repeat",
        backgroundSize: "cover"}}>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '400px', height: '35px', borderRadius: '5px',border:'1px solid black' }}>
                <Typography sx={{fontFamily:'Work sans', fontSize:'30px'}}>Gossip</Typography>
            </Box>
            <Box style={{ backgroundColor: 'white', width: '400px', height: 'auto', borderRadius: '5px',border:'1px solid black', marginTop: '10px' }}>
                <Typography variant='h6' style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', marginTop: '10px', paddingLeft: '25px',fontFamily:'Work sans',fontWeight:'300' }}>Sign Up</Typography>

                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 25px 0px 25px' }}>
                    <form onSubmit={handleSignup}>
                    <TextField style={{ width: '100%', marginBottom: '20px' }} size='small' name='name' label='Name' placeholder='Enter your name' onChange={(e) => handleChange(e)} required />
                    <TextField style={{ width: '100%', marginBottom: '20px' }} size='small' name='email' label='Email' placeholder='Enter your Email Address' onChange={(e) => handleChange(e)} required />
                    <TextField
                        name='password'
                        style={{ width: '100%', marginBottom: '20px' }}
                        size="small"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        onChange={(e) => handleChange(e)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                    />
                    <form style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start',alignItems:'center', width: '100%'}} variant='contained'>
                        <label style={{ cursor: 'pointer', backgroundColor: 'white', border: '1px solid black', width: '90px', padding: '2px', borderRadius: '5px' }} htmlFor='fileInput'>
                            Upload Photo
                        </label>
                        <input id='fileInput' name='pic' type='file' accept="image/png, image/jpeg" size="10" hidden onChange={(e) => postImage(e.target.files[0])} />
                        {profileImage && <span style={{display:'inline',marginLeft:'5px'}}>{profileImage}</span>}
                    </form>
                    <Button style={{ width: '100%', marginBottom: '20px', height: '40px', borderRadius: '20px',fontFamily:'Work sans' }} variant='contained' type='submit'>Sign Up</Button>
                    </form>
                    <Typography style={{ marginBottom: '10px' }}>OR</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography>Already have an account?</Typography>
                        <Link to='/login' style={{color:'#0000FF',textDecorationLine:'none',fontWeight:'500', }} >Login</Link>
                    </Box>
                    
                </Box>
            </Box>
            <ToastContainer containerId='signupPage'/>
        </Box>
    )
}

export default Signup;