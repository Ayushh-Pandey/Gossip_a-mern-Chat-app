import React, { useState, useContext } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { Link, useNavigate, } from 'react-router-dom';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import axios from 'axios';
import { ChatContext, } from '../../context/ChatProvider';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import chatBackground from './chatBackground.jpg'

const initialValues = {
    email: '',
    password: ''
}
const Login = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);

    const { setUser, isUserAuthenticated} = useContext(ChatContext);
    
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post("/api/user/login", credentials, config);

            setUser(response.data);
            localStorage.setItem("userInfo", JSON.stringify(response.data))
            isUserAuthenticated(true);
            navigate("/chats")
        } catch (error) {
            toast.error(`${error?.response?.data?.msg}`, {
                position: 'top-center',
                autoClose: 5000,
                closeOnClick: true,
                containerId: 'loginPage'
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
                <Typography variant='h6' sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', marginTop: '10px', paddingLeft: '25px',fontFamily:'Work sans',fontWeight:'300' }}>Login</Typography>
                <Box noValidate style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0px 25px 0px 25px' }}>

                    <form  onSubmit={handleLogin}>
                        <TextField style={{ width: '100%', marginBottom: '20px' }} size='small' name='email' label='Email' required placeholder='Enter your Email Address' onChange={(e) => handleChange(e)} />
                        <TextField
                            style={{ width: '100%', marginBottom: '20px' }}
                            size="small"
                            name='password'
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
                        <Button style={{ width: '100%', marginBottom: '20px', height: '40px', borderRadius: '20px',fontFamily:'Work sans' }} variant='contained' type='submit'>Login</Button>
                    </form>
                    <Typography style={{ marginBottom: '10px' }}>OR</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography>Don't have an account?</Typography>
                        <Link to='/signup' style={{ color: '#0000FF', textDecorationLine: 'none', fontWeight: '500' }} >Sign Up here</Link>
                    </Box>
                </Box>
            </Box>
            <ToastContainer containerId='loginPage'/>
        </Box>
    )

}

export default Login