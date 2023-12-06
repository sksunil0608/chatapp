import { apiConfig } from '../config/apiConfig';
import axios from 'axios';

const api = axios.create({
    baseURL: apiConfig.baseURL,
});

export const getisVChatUser = async (contactDetails, token) => {
    try {
        const response = await api.post(`/verify-vchat-user`, contactDetails, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        console.error('Is not a vchatuser:', error);
        throw error;
    }
}

export const getContacts = async (token) => {
    try {
        const response = await api.get('/contacts', {
            headers: { Authorization: token },
        });
        return response.data.contacts;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};

export const postCreateContact = async (contactDetails, token) => {
    try {
        const response = await api.post(`/contacts/add`, contactDetails, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        console.error('Error creating Contact:', error);
        throw error;
    }
}

export default api;
