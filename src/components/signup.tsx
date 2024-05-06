import { Button, TextField, Typography, styled } from '@mui/material';
import Box from '@mui/material/Box/Box';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SnackBar from './SnackBar';
import Loader from './Loader';

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
    marginTop: '2rem'
})


function AuthForm() {
    const [showAlert, setShowAlert] = useState(false);
    const [messge, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [alertType, setAlertType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);
        setShowAlert(false);
        if (password !== repeatPassword) {
            setMessage('Password must be same');
            setAlertType('error');
            setIsLoading(false);
            setShowAlert(true);
        }
        else {
            try {
                const data = {
                    email: email,
                    username: username,
                    password: password
                }
                await axios.post(`${apiUrl}/api/signup/`, data);
                setMessage('User created');
                setAlertType('success');
                setShowAlert(true);
                setTimeout(() => {
                    setIsLoading(false)
                    navigate('/login')
                }, 3000)

            }
            catch (error) {
                setMessage(error['response']['data']['email'] ? error['response']['data']['email'][0] : error['response']['data']['username'] ? error['response']['data']['username'][0] : '');
                setAlertType('error');
                setIsLoading(false);
                setShowAlert(true);

            }
        }

    }

    const handleDataFromChild = (data) => {
    };
    return (
        <MainContainer>
            <Header sendDataToParent={handleDataFromChild} />
            {isLoading && <Loader data={isLoading} />}
            <MainContainerDiv>
                <Box sx={{ height: '60vh', width: '100%', border: 'solid 2px #093b6c', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ marginTop: '1rem', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '2rem', width: '30%', alignItems: 'center' }}>
                                    <Typography color={'#093b6c'} >Email</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                                    <TextField onChange={(e) => setEmail(e.target.value)} type='email'></TextField>
                                </Box>
                            </Box>
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
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', height: 'auto' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '2rem', width: '30%', alignItems: 'center' }}>
                                    <Typography color={'#093b6c'}>Repeat Password</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                                    <TextField value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} type='password'></TextField>
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ marginTop: '1rem', backgroundColor: '#093b6c', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button disabled={!email || !username || !password || !repeatPassword} onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none' }}>Signup</Button>
                    </Box>
                </Box>
                {showAlert && <SnackBar data={{ message: messge, type: alertType, open: showAlert }} />}



            </MainContainerDiv>
        </MainContainer>
    )
}


export default AuthForm