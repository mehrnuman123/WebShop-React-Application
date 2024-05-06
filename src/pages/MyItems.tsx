import styled from '@emotion/styled';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetMyShopItems, getMyBoughtItems, getMySoldItems } from '../AppService';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';
import { CardDataProps } from '../types';

const ContentContainer = styled('div')({
    display: 'flex',
    height: 'auto',
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

const handleDataFromChild = (data) => {
};

function MyItems() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [boughtItems, setBoughtItems] = useState([])
    const [soldItems, setSoldItems] = useState([])
    const isAuthenticated = localStorage.getItem('tokenData');
    const handleAddItem = () => {
        navigate('/myitems/additems')
    }
    const inputProp: CardDataProps = {
        items: items,
        isEdit: true,
        isCart: false,
        query: null
    }


    const purchasedItemsProp: CardDataProps = {
        items: boughtItems,
        isEdit: false,
        isCart: false,
        query: null
    }



    const soldItemsProp: CardDataProps = {
        items: soldItems,
        isEdit: false,
        isCart: false,
        query: null
    }


    const myBoughtItems = async () => {
        const items = await getMyBoughtItems();
        setIsLoading(false);
        setBoughtItems(items)
    }

    const mySoldItems = async () => {
        const items = await getMySoldItems();
        setIsLoading(false);
        setSoldItems(items)
    }


    const fetchData = async () => {
        const shop = await GetMyShopItems();
        setIsLoading(false);
        if (shop) {
            setItems(shop);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchData();
        myBoughtItems();
        mySoldItems();
    }, [])


    useEffect(() => {



    }, [])
    return (
        <MainContainer>
            {
                isAuthenticated ? <>
                    <Header sendDataToParent={handleDataFromChild} />

                    <ContentContainer>
                        {isLoading && <Loader data={isLoading} />}
                        <Box sx={{ display: 'flex', width: '100%', height: '10vh', alignItems: 'center' }}>
                            <Button onClick={handleAddItem} variant='outlined' style={{ marginLeft: '2rem', height: '2rem' }}>Add Item</Button>
                        </Box>
                        <Box sx={{
                            display: 'flex', width: '90%', height: '50vh', overflow: 'auto', padding: '1rem', border: 'solid 1px #093b6c', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: '2rem', alignItems: 'center'
                        }}>
                            <Box sx={{ width: '100%' }}>
                                <span>My items for sale: {items.length}</span>
                            </Box>
                            {items?.length > 0 && <ItemCard itemsData={inputProp} />}

                        </Box>
                        <Box sx={{
                            display: 'flex', width: '90%', height: '50vh', overflow: 'auto', padding: '1rem', border: 'solid 1px #093b6c', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: '2rem', alignItems: 'center'
                        }}>
                            <Box sx={{ width: '100%' }}>
                                <span>My bought items: {boughtItems.length} </span>
                            </Box>
                            {boughtItems?.length > 0 && <ItemCard itemsData={purchasedItemsProp} />}
                        </Box>
                        <Box sx={{
                            display: 'flex', width: '90%', height: '50vh', overflow: 'auto', padding: '1rem', border: 'solid 1px #093b6c', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: '2rem', alignItems: 'center'
                        }}>
                            <Box sx={{ width: '100%' }}>
                                <span>My sold items: {soldItems.length}</span>
                            </Box>
                            {soldItems?.length > 0 && <ItemCard itemsData={soldItemsProp} />}
                        </Box>

                    </ContentContainer>
                </>
                    : <p>Please login first</p>
            }

        </MainContainer>
    )
}

export default MyItems