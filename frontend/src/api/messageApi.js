import { apiConfig } from '../config/apiConfig';
import axios from 'axios';

const api = axios.create({
    baseURL: apiConfig.baseURL,
});


export const getGroupMessages = async (groupId, token, startIndex = 0) => {
    try {
        const response = await api.get(`/groups/${groupId}/messages`, {
            headers: { Authorization: token },
            params: { startIndex }, // Include the startIndex as a query parameter
        });
        return response.data.message;
    } catch (error) {
        console.error('Error fetching group messages:', error);
        throw error;
    }
};


export const postGroupMessage = async (groupId, messageDetails, token) => {
    try {
        const response = await api.post(`/groups/${groupId}/messages`, messageDetails, {
            headers: { Authorization: token },
        });
        return response;
    } catch (error) {
        console.error('Error creating group message:', error);
        throw error;
    }
};

export default api;
