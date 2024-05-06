import { TextareaAutosize } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSingleItemById, UpdateShopItem, createShopItem } from '../AppService';
import Loader from './Loader';
import SnackBar from './SnackBar';

function CreateUpdateItemForm(props) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [itemData, setItemData] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [messge, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    const [error, setError] = useState(false);
    const [descriptionLimit, setDescriptionLimit] = useState(false);
    const [descriptionLong, setDescriptionLong] = useState(false);
    const [firstRender, setFirstRender] = useState(false);
    const [isPriceChange, setIsPriceChange] = useState(Boolean);
    const navigate = useNavigate();
    const params = useParams();
    const isAuthenticated = localStorage.getItem('tokenData');

    useEffect(() => {
        const getItem = async (id) => {
            setFetchData(true)
            const result = await GetSingleItemById(id);
            if (result) {
                setItemData(result);
                setName(props.data.isEdit && result ? result.title : '')
                setDescription(props.data.isEdit && result ? result.description : '')
                setPrice(props.data.isEdit && result ? parseFloat(result.price).toString() : '')
            }
        }
        if (props.data.isEdit === true) {
            const { id } = params;
            getItem(id);

        }
    }, [fetchData])

    useEffect(() => {
        if (description.length > 1 && description.length < 20) {
            setDescriptionLimit(true);
        }
        if (description.length > 20 && description.length < 80) {
            setDescriptionLimit(false);
            setDescriptionLong(false);
        }
        if (description.length > 80) {
            setDescriptionLong(true);

        }
    }, [description])

    useEffect(() => {
        if (firstRender) {
            setIsPriceChange(true);
        }
    }, [firstRender])

    const handlePrice = (e) => {
        setPrice(e.target.value);
        setFirstRender(true);
    }
    const handleSubmit = async (itemId) => {
        const loggedInUser = localStorage.getItem('user');
        const user = JSON.parse(loggedInUser);
        const data = {
            title: name,
            description: description,
            price: price,
            status: 'sale',
            isAvailable: true,
            user_id: user.id,
            seller_id: user.id,
        }
        setIsLoading(true);
        setShowAlert(false);
        let result;
        if (itemId != null && itemId != undefined) {
            const updateFormData = {...data,
            isPriceChange: isPriceChange,
            }
            result = await UpdateShopItem(updateFormData, itemId);
            if (result?.data) {
                setMessage('Item updated');
                setAlertType('success');
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/myitems')

                }, 1000)
            }
            else {
                setIsLoading(false);
                setError(true);

            }
        }
        else {
            result = await createShopItem(data);
            if (result?.data) {
                setMessage('Item created');
                setAlertType('success');
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/myitems')

                }, 1000)
            }
            else {
                setIsLoading(false);
                setError(true);
            }
        }
        if (error === true) {
            setMessage('Something went wrong');
            setAlertType('error');
            setShowAlert(true);
        }
    }


    return (
        <>
            {
                isAuthenticated ? <Box sx={{ height: 'auto', width: '40%', border: 'solid 2px #093b6c', marginLeft: '2rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                    {isLoading && <Loader data={isLoading} />}
                    <Box sx={{ marginTop: '1rem', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '2rem', width: '30%', alignItems: 'center' }}>
                                    <Typography color={'#093b6c'} >Name</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                                    <TextField onChange={(e) => setName(e.target.value)} value={name}></TextField>
                                </Box>
                            </Box>

                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '2rem', width: '30%', alignItems: 'center' }}>
                                    <Typography color={'#093b6c'} >Price</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

                                    <TextField value={price} onChange={(e) => handlePrice(e)} type='number'></TextField>
                                </Box>
                            </Box>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '30%', alignItems: 'center', flexDirection: 'column' }}>
                                    <Typography color={'#093b6c'}>Description</Typography>
                                    {
                                        props.data.isEdit && <Button disabled={!name || !description || !price || descriptionLimit || descriptionLong} onClick={() => handleSubmit(itemData != null ? itemData.id : null)} variant="contained" sx={{ textTransform: 'none' }}>Update</Button>
                                    }

                                    {
                                        props.data.isAdd && <Button disabled={!name || !description || !price || descriptionLimit || descriptionLong} onClick={() => handleSubmit(null)} variant="contained" sx={{ textTransform: 'none' }}>Add</Button>
                                    }
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ width: '100%', padding: '0rem 3.7rem 0rem 5rem' }}>
                                        <TextareaAutosize value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', height: '15vh' }}></TextareaAutosize>
                                    </Box>

                                </Box>
                            </Box>
                        </Box>
                    </Box>

                </Box>
                    : <p>unAuthorized</p>


            }

            {descriptionLong && <p style={{ marginLeft: '1rem', color: 'red' }}>Description too long</p>}

            {descriptionLimit && <p style={{ marginLeft: '1rem', color: 'red' }}>Description too short</p>}
            {showAlert && <SnackBar data={{ message: messge, type: alertType, open: showAlert }} />}
        </>
    )
}

export default CreateUpdateItemForm;