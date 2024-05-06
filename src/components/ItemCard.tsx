import { Button, CardActionArea, CardActions } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCartItem } from '../AppService';
import Loader from './Loader';
import SnackBar from './SnackBar';

function ItemCard(props) {
    const { itemsData, sendActionToParent } = props
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messge, setMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const handleEditBtn = (id) => {
        navigate(`/myitems/edit/${id}`);
    }
    const handleCartBtn = async (id, seller_id) => {
        setShowAlert(false);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.id === seller_id) {
            setShowAlert(true);
            setMessage('You cant buy own item');
            setAlertType('error')
        }
        else {
            sendActionToParent(false);
            const data = {
                user_id: user.id,
                item_id: id
            }
            const result = await addCartItem(data);
            if (result.data) {
                sendActionToParent(true);
                setShowAlert(true);
                setMessage('Item added to the cart !!');
                setAlertType('success')

            }
            else {
                setShowAlert(true);
                setMessage('Something went wrong');
                setAlertType('error')
            }
        }

    }
    return (
        <>
            {
                itemsData?.items?.map((item, index) =>
                    <>
                        {isLoading && <Loader data={isLoading} />}
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea sx={{ display: 'flex' }}>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        <b>Name :</b> {item.title} <br></br><b>Description :</b> {item.description}<br></br> <b>Price :</b>  {parseFloat(item.price).toString() + ' €'}
                                    </Typography>
                                </CardContent>
                                <CardMedia
                                    component="img"
                                    height="100"
                                    image="/placeholder.png"
                                    alt="green iguana"

                                    sx={{ width: '30%' }}
                                />
                            </CardActionArea>
                            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                {itemsData.isCart && <Button size='small' sx={{ textTransform: 'none' }} variant='contained' onClick={() => handleCartBtn(item.id, item.seller_id)} > Add to cart</Button>}
                                {itemsData.isEdit && <Button size='small' sx={{ textTransform: 'none' }} variant='contained' onClick={() => handleEditBtn(item.id)}> Edit</Button>}
                            </CardActions>
                        </Card>
                        {showAlert && <SnackBar data={{ message: messge, type: alertType, open: showAlert }} />}
                    </>
                )
            }
        </>
    )
}

export default ItemCard

function fetchCartItems() {
    throw new Error('Function not implemented.');
}
