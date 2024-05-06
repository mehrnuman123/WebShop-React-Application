import React from 'react'
import Header from '../components/Header'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import AddItemForm from '../components/CreateUpdateItemForm'
import CreateUpdateItemForm from '../components/CreateUpdateItemForm'

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

const handleDataFromChild = () => {

}

function AddItems() {
    const isAuthenticated = localStorage.getItem('tokenData');
    const propToChild = {
        isEdit: false,
        isAdd: true
    }
    return (
        <MainContainer>
            {
                isAuthenticated ? <>
                    <Header sendDataToParent={handleDataFromChild} />
                    <ContentContainer>
                        <Box sx={{ display: 'flex', width: '100%', height: '10vh', alignItems: 'center' }}>
                            <Button disabled={true} variant='outlined' style={{ marginLeft: '2rem', height: '2rem' }}>Add Item</Button>
                        </Box>
                        <Box sx={{
                            display: 'flex', width: '100%', height: 'auto',
                            backgroundColor: '#f4f5f6',
                        }}>
                            <CreateUpdateItemForm data={propToChild} />
                        </Box>
                    

                    </ContentContainer>
                </>
                    : <p>Please login first</p>
            }

        </MainContainer>
    )
}

export default AddItems