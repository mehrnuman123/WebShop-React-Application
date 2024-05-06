import React, { useState } from 'react'
import Header from './Header'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import SnackBar from './SnackBar'
import Button from '@mui/material/Button'
import axios from 'axios'
import { setTokenWithExpiry } from '../utils/index';
import { AuthenticatedUser } from '../AppService'

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '1rem'
})
const MainContainerDiv = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2rem',
    width: '35vw'
})

function Login() {
    const [showAlert, setShowAlert] = useState(false);
    const [messge, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [alertType, setAlertType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setShowAlert(false);
            const data = {
                username: username,
                password: password
            }
            const user = await axios.post(`${apiUrl}/api/login/`, data);
            const expiresInDays = 7;
            setTokenWithExpiry(user.data.access, expiresInDays);
            if (user) {
                const response = await AuthenticatedUser();
                localStorage.setItem('user', JSON.stringify(response));
                localStorage.setItem('isLogout', 'false')

            }

            setMessage('User verified');
            setAlertType('success');
            setShowAlert(true);
            setTimeout(() => {
                setIsLoading(false)
                navigate('/shop')
            }, 3000)

        }
        catch (error) {
            setIsLoading(false);
            setMessage(error['response']['data'].detail);
            setAlertType('error');
            setShowAlert(true);

        }
    }

    const handleDataFromChild = (data) => {
        console.log(data)
    };
    return (
        <MainContainer>
            <Header sendDataToParent={handleDataFromChild} />
            {isLoading && <Loader data={isLoading} />}
            <MainContainerDiv>
                <Box sx={{ height: '40vh', width: '100%', border: 'solid 2px #093b6c', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ marginTop: '1rem', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '2rem', width: '30%', alignItems: 'center' }}>
                                    <Typography color={'#093b6c'}>Username</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                                    <TextField value={username} onChange={(e) => setUserName(e.target.value)} type='text'></TextField>
                                </Box>
                            </Box>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '2rem', width: '30%', alignItems: 'center' }}>
                                    <Typography color={'#093b6c'}>Password</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                                    <TextField value={password} onChange={(e) => { setPassword(e.target.value) }} type='password'></TextField>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                    <Box sx={{ marginTop: '1rem', backgroundColor: '#093b6c', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button disabled={!username || !password} onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none' }}>Login</Button>
                    </Box>
                </Box>
                {showAlert && <SnackBar data={{ message: messge, type: alertType, open: showAlert }} />}



            </MainContainerDiv>
        </MainContainer>
    )
}

export default Login