import React, { useState } from 'react'
import { Alert, Box, Button, FormControl, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import axios from 'axios';

const initialValues = {
    name: '',
    email: '',
    password: '',
    pic: '',
}

const Signup = () => {
    const [credentials, setCredentials] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState("");

   
    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignup = async () => {
        try {
            if (credentials.email !== '' && credentials.password !== '' && credentials.name !== '') {
                const response = await axios.post('http://localhost:5000/api/user/signup', credentials);
                if (response.status === 200) {
                    localStorage.setItem("userInfo", JSON.stringify(response.data));
                    // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                    // console.log('userInfo',userInfo)
                    // setUser(userInfo);
                    navigate('/login');
                }
            }
            else {
                setError('* feilds are required');
            }
        } catch (error) {
            setError(error?.response?.data?.msg)
        }
    }

    const postImage = async (pic) => {
        try {
            if (pic.type === "image/jpeg" || pic.type === "image/png") {
                setProfileImage(pic.name);
                const data = new FormData();
                data.append("file", pic);
                data.append("upload_preset", "chat_app");
                data.append("cloud_name", "dsgy1uji7");
                const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dsgy1uji7/image/upload", data);
                setCredentials({ ...credentials, ['pic']: uploadRes.data.url.toString()});
                
            }
            else {
                setError('Please select JPEG/PNG image file')
            }

        } catch (error) {
            setError('Error uploading image');
        }
    }
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'grey' }}>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '400px', height: '35px', borderRadius: '5px' }}>
                <Typography>Gossip</Typography>
            </Box>
            <Box style={{ backgroundColor: 'white', width: '400px', height: 'auto', borderRadius: '5px', marginTop: '10px' }}>
                <Typography variant='h6' style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', marginTop: '10px', paddingLeft: '25px' }}>Sign in</Typography>

                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 25px 0px 25px' }}>
                    <TextField style={{ width: '100%', marginBottom: '20px' }} size='small' name='name' label='name' placeholder='Enter your name' onChange={(e) => handleChange(e)} required />
                    <TextField style={{ width: '100%', marginBottom: '20px' }} size='small' name='email' label='Email' placeholder='Enter your Email Address' onChange={(e) => handleChange(e)} required />
                    <TextField
                        name='password'
                        style={{ width: '100%', marginBottom: '20px' }}
                        size="small"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        onChange={(e) => handleChange(e)}
                        required={true}
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
                    <FormControl style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start', width: '100%', paddingLeft: '10px' }} variant='contained'>
                        <label style={{ cursor: 'pointer', backgroundColor: 'white', border: '1px solid black', width: '90px', padding: '2px', borderRadius: '5px' }} htmlFor='fileInput'>
                            Upload Photo
                        </label>
                        <input id='fileInput' name='pic' type='file'  size="10" hidden onChange={(e) => postImage(e.target.files[0])} />
                        {profileImage && <span style={{display:'inline'}}>{profileImage}</span>}
                    </FormControl>
                    {error ? <Alert severity="error" color="error" style={{ padding: '0 10px 0 10px', marginBottom: '10px' }}>
                        {error}
                    </Alert> : ""}
                    <Button style={{ width: '100%', marginBottom: '20px', height: '40px', borderRadius: '20px' }} variant='contained' onClick={() => handleSignup()}>Sign Up</Button>
                    <Typography style={{ marginBottom: '10px' }}>OR</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography>Already have an account?</Typography>
                        <Link to='/login' style={{color:'#0000FF',textDecorationLine:'none',fontWeight:'500' }} >Login</Link>
                    </Box>
                    
                </Box>
            </Box>
        </Box>
    )
}

export default Signup;