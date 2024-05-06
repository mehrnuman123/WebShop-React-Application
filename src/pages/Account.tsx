import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Loader from '../components/Loader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SnackBar from '../components/SnackBar';
import { UpdatePassword } from '../AppService';


const ContentContainer = styled('div')({
    display: 'flex',
    height: '60vh',
    flexDirection: 'column',
    gap: '1rem',
    width: '90vw',
    border: 'solid 1px #093b6c',
    backgroundColor: '#f4f5f6   ',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: '1rem',

})
const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '1rem'
})
function Account() {
    const [messge, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [againNewPswd, setAgainNewPswd] = useState('');
    const isAuthenticated = localStorage.getItem('tokenData');
    const handleDataFromChild = () => {

    }

    const handleSave = async () => {
        setIsLoading(true);
        setShowAlert(false);
        if (againNewPswd != newPassword) {
            console.log('wrong password')
            setMessage('New password and again password must be same');
            setAlertType('error');
            setIsLoading(false);
            setShowAlert(true);
        } else {
            const data = {
                old_password: oldPassword,
                new_password: newPassword
            }
            const result = await UpdatePassword(data);
            if (result.data) {
                setMessage('Password updated');
                setAlertType('success');
                setIsLoading(false);
                setShowAlert(true);
                window.location.reload();

            }
            else {

                setMessage(result['response']['data'].error);
                setAlertType('error');
                setIsLoading(false);
                setShowAlert(true);
            }
        }

    }
    return (
        <MainContainer>
            {
                isAuthenticated ? <>
                    <Header sendDataToParent={handleDataFromChild} />

                    <ContentContainer>
                        {isLoading && <Loader data={isLoading} />}
                        <Box sx={{ height: '50vh', width: '60%', border: 'solid 2px #093b6c', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ marginTop: '1rem', width: '100%', height: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '2rem', width: '100%', alignItems: 'center' }}>
                                            <Typography color={'#093b6c'}>Old Password</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }}>

                                            <TextField value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type='password'></TextField>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '2rem', width: '100%', alignItems: 'center' }}>
                                            <Typography color={'#093b6c'}>New Password</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }}>

                                            <TextField value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} type='password'></TextField>
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', height: 'auto' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', marginLeft: '2rem', width: '100%', alignItems: 'center' }}>
                                            <Typography color={'#093b6c'}>Repeat New Password</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%' }}>

                                            <TextField value={againNewPswd} onChange={(e) => setAgainNewPswd(e.target.value)} type='password'></TextField>
                                        </Box>

                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ marginTop: '1rem', backgroundColor: '#093b6c', width: '100%', height: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button disabled={!oldPassword || !newPassword || !againNewPswd} onClick={handleSave} variant="contained" sx={{ textTransform: 'none' }}>Save</Button>
                            </Box>
                        </Box>
                        {showAlert && <SnackBar data={{ message: messge, type: alertType, open: showAlert }} />}

                    </ContentContainer>
                </>
                    : <p>Please login first</p>
            }

        </MainContainer>
    )
}

export default Account