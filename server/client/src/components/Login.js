import React, { useState, useEffect, useContext } from 'react'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import { Link, useNavigate, } from 'react-router-dom';
import { ConstructionOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment} from "@mui/material";
import axios from 'axios';
import { ChatContext,  } from '../context/ChatProvider';


const initialValues = {
    email:'',
    password:''
}
const Login = () => {
    const navigate = useNavigate();

    // useEffect(()=>{
    //     const user = JSON.parse(localStorage.getItem("userInfo"));
        
    //     if(user){
    //         navigate("/chats");
    //     }
    // },[navigate]);

    const [credentials,setCredentials] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [error,setError] = useState(null);
    const {setUser} = useContext(ChatContext);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }

    const handleLogin = async()=>{
        try {
            if(credentials.email!=='' && credentials.password!==''){
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };
            const response = await axios.post("/api/user/login",credentials,config);
            // console.log(response);
            if(response.status===200){
                setUser(response.data);
                localStorage.setItem("userInfo",JSON.stringify(response.data))
                // console.log(credentials)
                // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                // console.log('userInfo',userInfo)
                
                navigate("/chats")
            }
            }
            else{
                setError('*feilds are required')
            }
        } catch (error) {
            setError(error?.response?.data?.msg);
        }
    }
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh', backgroundColor: 'grey' }}>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: '400px', height: '35px', borderRadius: '5px' }}>
                <Typography>Gossip</Typography>
            </Box>
            <Box style={{ backgroundColor: 'white', width: '400px', height: 'auto', borderRadius: '5px', marginTop: '10px' }}>
            <Typography variant='h6' style={{display:'flex',justifyContent: 'flex-start',marginBottom:'10px',marginTop:'10px',paddingLeft:'25px'}}>Login</Typography>
                <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0px 25px 0px 25px' }}>


                    <TextField style={{ width: '100%', marginBottom: '20px' }} size='small' name='email' label='Email' placeholder='Enter your Email Address' onChange={(e)=>handleChange(e)}/>
                    <TextField
                        style={{ width: '100%', marginBottom: '20px' }}
                        size="small"
                        name='password'
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        onChange={(e)=>handleChange(e)}
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
                    {error ? <Alert severity="error" color="error" style={{padding:'0 10px 0 10px',marginBottom:'10px'}}>
                        {error}
                    </Alert> : ""}
                    <Button style={{ width: '100%', marginBottom: '20px', height: '40px', borderRadius: '20px' }} variant='contained' onClick={()=>handleLogin()}>Login</Button>
                    <Typography style={{ marginBottom: '10px' }}>OR</Typography>
                    <Box style={{ display: 'flex', flexDirection: 'row', gap: '5px', justifyContent: 'center', alignItems: 'center',marginBottom:'10px' }}>
                        <Typography>Don't have an account?</Typography>
                        <Link to='/signup' style={{ color:'#0000FF',textDecorationLine:'none',fontWeight:'500' }} >Sign Up here</Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
    
}

export default Login