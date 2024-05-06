import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Box, Popover, Typography } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { GetUserById, UpdateShopItem, deleteItemById, emptyCart, getMyCartItems, sendEmail } from '../AppService';
import SnackBar from './SnackBar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from './Loader';

const TopBar = styled('div')({
    display: 'flex',
    height: '20vh',
    width: '90vw',
    justifyContent: 'space-between',
    backgroundColor: '#093b6c',
    alignItems: 'center',
    padding: '1rem',
});


const Logo = styled('div')({
    marginRight: '2rem',
});

const SearchContainer = styled('div')({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
});

const SearchBar = styled('div')({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: '999px',
    padding: '0.5rem 1rem',
    maxWidth: 400,
    width: '100%',
});
const SearchInput = styled(InputBase)({
    marginLeft: '1rem',
});

const ButtonsContainer = styled('div')({
    display: 'flex',
    width: 'auto',
    height: '100%'
});
function Header(props) {
    const { fetchAllCartItems, sendDataToParent, itemBought } = props;
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [hideSignup, setHideSignup] = React.useState(false);
    const [hideLogin, setHideLogin] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isAuth, setIsAuth] = React.useState(false);
    const [hideSearch, setHideSearch] = React.useState(false);
    const [cartItems, setCartItems] = React.useState([])
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = React.useState(false);
    const [messge, setMessage] = React.useState('');
    const [alertType, setAlertType] = React.useState('');
    const [sumOfPrice, setSumOfPrice] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isBought, setIsBought] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const params = String(window.location.href);
    const loggedInUser = localStorage.getItem('user');
    let totalPrice = 0;

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleBuy = () => {
        setOpenDialog(true)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (params.includes('myitems')) {
            setHideSearch(true);
        }
        if (params.includes('additems')) {
            setHideSearch(true);
        }
        if (params.includes('account')) {
            setHideSearch(true);
        }
        if (params.includes('signup')) {
            setHideSearch(true);
        }
        if (params.includes('login')) {
            setHideSearch(true);
        }
    }, [])
    useEffect(() => {
        if (localStorage.getItem('tokenData')) {
            setIsAuth(true);
        }
        if (loggedInUser) {
            setCurrentUser(JSON.parse(loggedInUser));
        }
        else {

            if (params.includes('signup')) {
                setHideLogin(true);
                setHideSignup(false);
            }
            if (params.includes('login')) {
                setHideSignup(true);
                setHideLogin(false)
            }

            if (params.includes('shop')) {
                setHideSignup(true);
                setHideLogin(true)
            }
        }

    }, [params])
    const handleSignup = () => {
        navigate("/signup");
    }

    const fetchCartItems = async () => {
        const cartData = await getMyCartItems();
        setCartItems(cartData);
        for (let i = 0; i < cartData.length; i++) {
            totalPrice += Number(cartData[i].price)
        }
        setSumOfPrice(totalPrice);

    }
    useEffect(() => {
        fetchCartItems();
    }, [fetchAllCartItems])

    const handleLogin = () => {
        navigate("/login");
    }
    const handleLogo = () => {
        navigate("/shop");
    }
    const handleLogout = () => {
        localStorage.removeItem('tokenData');
        localStorage.removeItem('user');
        window.location.reload();
        navigate('/')
    }

    const handleAgreeDialog = async () => {
        setOpenDialog(false)
        setIsLoading(true);
        const loggedInUser = localStorage.getItem('user');
        const user = JSON.parse(loggedInUser)
        let executed = false;
        for (let i = 0; i < cartItems.length; i++) {
            const itemId = cartItems[i].item_id;
            const data = {
                user_id: cartItems[i].user_id,
                title: cartItems[i].title,
                description: cartItems[i].description,
                price: cartItems[i].price,
                status: 'purchased',
                isPriceChange: cartItems[i].isPriceChange,
                buyer_id: user.id,
                isAvailable: false

            }
            const result = await UpdateShopItem(data, itemId);
            const sellerDetails = await GetUserById(cartItems[i].seller_id);
            const emailPayload = [
                {
                    message: `Congratulation !! Youre Listed Product "${cartItems[i].title}" has been sold`,
                    email_to: sellerDetails.email
                },
                {
                    message: `Congratulation !! You have Bought Product "${cartItems[i].title}" having price "${cartItems[i].price}"`,
                    email_to: user.email
                },
            ]
            let emailer;
            for (let j = 0; j < emailPayload.length; j++) {

                emailer = await sendEmail(emailPayload[j])
            }
            if (result.data && emailer.data) {
                executed = true
            }
        }
        if (executed === true) {
            setShowAlert(false)
            await emptyCart();
            await fetchCartItems();
            itemBought(true)
            setMessage('Item purchased successfully and Email has been sent');
            setAlertType('success')
            setIsLoading(false)
            setShowAlert(true);
        }
        else {
            setIsBought(false);
            setIsLoading(false)
            setMessage('Something went wrong');
            setAlertType('error')
            setShowAlert(true);
        }
    }

    const handleDeleteItem = async (id) => {
        setShowAlert(false);
        let deleteItem;
        if (id != null) {
            deleteItem = await deleteItemById(id);
            if (deleteItem) {
                await fetchCartItems();
                setShowAlert(true);
                setMessage('Item deleted successfully');
                setAlertType('success')
            }
            else {
                setShowAlert(true);
                setMessage('Something went wrong');
                setAlertType('error')
            }
        }
        else {
            deleteItem = await emptyCart();
            if (deleteItem) {
                await fetchCartItems();
                setShowAlert(true);
                setMessage('All Items deleted successfully');
                setAlertType('success')
            }
            else {
                setShowAlert(true);
                setMessage('Something went wrong');
                setAlertType('error')
            }
        }




    }
    const handleDataFromChild = (e) => {
        sendDataToParent(e.target.value);
    };

    return (

        <TopBar>
            <Logo>
                <img src='/logo.jpg' onClick={handleLogo} style={{ cursor: 'pointer' }} height={100} width={200} />
            </Logo>
            {
                !hideSearch && <SearchContainer>
                    <SearchBar>

                        <SearchInput onChange={(e) => handleDataFromChild(e)} sx={{ width: '100%' }} placeholder="Search..." />
                    </SearchBar>
                </SearchContainer>
            }
            <ButtonsContainer>
                {isAuth && <Box sx={{ height: '100%', width: '30vw', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                        <span style={{ color: 'white' }}>{currentUser?.username}</span>

                    </Box>
                    <Box sx={{ height: '100%', display: 'flex', marginLeft: '1rem', justifyContent: 'space-evenly' }}>

                        <Link style={{ color: 'white', cursor: 'pointer' }} to='/account'>Change Password</Link>
                        {!hideSearch &&
                            <Link style={{ color: 'white' }} to='/myitems'>My Items</Link>}
                        <Typography style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleLogout}>Logout</Typography>
                        {
                            !hideSearch && <>
                                <ShoppingCartOutlinedIcon style={{ color: 'white' }} onClick={handleClick} />
                            </>
                        }
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}


                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',

                            }}
                        >
                            <Box sx={{ width: '20vw', height: 'auto', backgroundColor: '#e8e5e5' }}>
                                <Box sx={{ padding: '1rem' }}>

                                    <Box sx={{ height: '5vh', borderBottom: 'solid 1px #093b6c', display: 'flex', width: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%' }}>
                                            <Typography>Item, Price</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%' }}>
                                            {cartItems.length > 0 ? <Typography onClick={() => handleDeleteItem(null)} sx={{ textDecoration: 'underline', color: '#085394', cursor: 'pointer' }}>Remove all</Typography>
                                                : <Typography sx={{ textDecoration: 'underline', color: '#7a8085', cursor: 'pointer' }}>Remove all</Typography>
                                            }
                                        </Box>
                                    </Box>
                                    <Box sx={{ height: 'auto' }}>
                                        {cartItems?.length > 0 ? cartItems.map((item, key) => <>
                                            <Box sx={{ height: '5vh', width: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', gap: '1rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%' }}>
                                                    <p style={{ marginLeft: '3px' }}>{item?.title},  {parseFloat(item.price).toString() + ' €'}</p>
                                                    {item.isPriceChange === "True" && <p style={{ color: 'blue', fontSize: '10px' }}>Price Changed</p>}
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '10%' }}>

                                                    <p style={{ marginRight: '3px', cursor: 'pointer' }} onClick={() => handleDeleteItem(item?.item_id)} >X</p>
                                                </Box>
                                            </Box>
                                        </>)

                                            :
                                            <span>No item</span>
                                        }

                                    </Box>
                                    <Box sx={{ height: '10vh', borderTop: 'solid 1px #093b6c', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', height: '100%', justifyContent: 'start', borderBottom: 'solid 1px #093b6c', alignItems: 'center', width: '100%' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%' }}>
                                                <Typography>Total :</Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '70%' }}>

                                                <Typography>{parseFloat(sumOfPrice).toString() + ' €'}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', height: '100%', justifyContent: 'start', alignItems: 'center', width: '100%' }}>
                                            {cartItems.length > 0 ? <Typography sx={{ textDecoration: 'underline', color: '#085394', cursor: 'pointer' }} onClick={handleBuy}>Buy</Typography> :
                                                <Typography sx={{ textDecoration: 'underline', color: '#7a8085', cursor: 'pointer' }} >Buy</Typography>}

                                        </Box>
                                        <Dialog
                                            open={openDialog}
                                            onClose={handleDialogClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {"Want to buy all items?"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Youre are buying all the items of cart at on click. If you want to continue please Agree;
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleDialogClose}>Disagree</Button>
                                                <Button onClick={handleAgreeDialog} autoFocus>
                                                    Agree
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>
                                </Box>

                            </Box>
                        </Popover>
                    </Box>
                </Box>}
                {hideLogin && !isAuth && <>
                    <Button onClick={handleLogin} color="inherit" sx={{ color: 'white' }}>Login</Button>
                </>}
                {
                    hideSignup && !isAuth && <>
                        <Button onClick={handleSignup} color="inherit" sx={{ color: 'white' }}>Signup</Button>
                    </>
                }
                {isLoading && <Loader data={isLoading} />}
                {showAlert && <SnackBar data={{ message: messge, type: alertType, open: showAlert }} />}
            </ButtonsContainer>
        </TopBar>
    )
}

export default Header