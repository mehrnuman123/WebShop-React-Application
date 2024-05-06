import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { GetShopItems } from '../AppService';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import { CardDataProps } from '../types';
import { deleteTokenIfExpired } from '../utils';
import Loader from '../components/Loader';

const ContentContainer = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
    height: 'auto',
    width: '90vw',
    border: 'solid 1px #093b6c',
    backgroundColor: '#f4f5f6   ',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: '1rem',
    gap: '2rem'

})
const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '1rem'
})



export const ShopPage = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [allCartItems, setAllCartItems] = useState(false);
    const loggedInUser = localStorage.getItem('tokenData');



    useEffect(() => {
        deleteTokenIfExpired();
    }, []);


    const fetchData = async () => {
        let limit = itemsPerPage;
        limit += 10;
        setItemsPerPage(limit);
        const shop = await GetShopItems(itemsPerPage);
        setIsLoading(false);
        if (shop) {
            setItems(shop?.results);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        fetchData()
    }, [])

    useEffect(() => {
        if (query) {
            let filteredItem = [];
            filteredItem = items.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredItems(filteredItem)
        }
    }, [query, items])

    const inputProp: CardDataProps = {
        items: query ? filteredItems : items,
        isEdit: false,
        isCart: loggedInUser ? true : false,
        query: query
    }

    const handleActionFromItemCard = (data) => {

        setAllCartItems(data);
    }

    const handleBuyAction = (state) => {
        if (state === true) {
            fetchData();
        }
    }
    const handleDataFromChild = (data) => {
        setQuery(data);
    };
    return (
        <MainContainer>
            <Header sendDataToParent={handleDataFromChild} fetchAllCartItems={allCartItems} itemBought={handleBuyAction} />
            <ContentContainer>
                {isLoading && <Loader data={isLoading} />}
                {filteredItems?.length === 0 && query ? <span>
                    No item found
                </span> : items?.length === 0 ? <span>
                    No item
                </span> : <ItemCard itemsData={inputProp} sendActionToParent={handleActionFromItemCard} />}
                {
                    items.length > 9 && !query && <Box sx={{ height: '10vh', width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'background' }}>
                        <Button sx={{ height: '5vh' }} onClick={fetchData} variant='outlined'>Load more</Button>
                    </Box>
                }

            </ContentContainer>
        </MainContainer>
    );
};
