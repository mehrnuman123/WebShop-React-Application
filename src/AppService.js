import axios from "axios"
const apiUrl = process.env.REACT_APP_BACKEND_URL;

export const AuthenticatedUser = async () => {
    try {
        const data = localStorage.getItem('tokenData');
        const token = JSON.parse(data)?.token;
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const user = await axios.get(`${apiUrl}/user/details/`, { headers: headers });
        const response = user.data;
        return response;
    }
    catch (error) {
        console.log(error)
    }
}

export const GetShopItems = async (limit) => {
    try {
        const items = await axios.get(`${apiUrl}/api/items/public/?limit=${limit}`);
        return items.data;
    }
    catch (error) {
        console.log(error)
    }
}

export const GetMyShopItems = async () => {
    try {
        const data = localStorage.getItem('tokenData');
        const token = JSON.parse(data)?.token;
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const items = await axios.get(`${apiUrl}/api/items/myitems`, { headers: headers });
        return items.data;
    }
    catch (error) {
        console.log(error)
    }
}

export async function createShopItem(data) {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.post(`${apiUrl}/api/items/`, data, config);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}

export const GetSingleItemById = async (id) => {
    try {
        const data = localStorage.getItem('tokenData');
        const token = JSON.parse(data)?.token;
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        const items = await axios.get(`${apiUrl}/api/items/${id}`, { headers: headers });
        return items.data;
    }
    catch (error) {
        console.log(error)
    }
}


export async function UpdateShopItem(data, id) {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.put(`${apiUrl}/api/items/${id}/`, data, config);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}


export async function getMyCartItems() {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const result = await axios.get(`${apiUrl}/api/cart-items`, config);
        return result.data;
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}

export async function addCartItem(data) {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.post(`${apiUrl}/api/add-to-cart/`, data, config);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}



export async function deleteItemById(id) {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.delete(`${apiUrl}/api/remove-from-cart/${id}/`, config);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}

export async function emptyCart() {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.delete(`${apiUrl}/api/remove-all-cart-items/`, config);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}


export async function getMyBoughtItems() {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const result = await axios.get(`${apiUrl}/api/my-bought-items/`, config);
        return result.data;
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}

export async function getMySoldItems() {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const result = await axios.get(`${apiUrl}/api/my-sold-items/`, config);
        return result.data;
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}

export async function UpdatePassword(data) {
    try {
        const tokenData = localStorage.getItem('tokenData');
        const token = JSON.parse(tokenData)?.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return await axios.put(`${apiUrl}/api/change-password/`, data, config);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}



export async function GetUserById(id) {
    try {

        const result = await axios.get(`${apiUrl}/api/user/${id}`);

        return result.data;

    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}


export async function sendEmail(data) {
    try {
        return await axios.post(`${apiUrl}/api/send-email/`, data);
    }
    catch (error) {
        console.log(error, 'Appservice error')
        return error;

    }
}