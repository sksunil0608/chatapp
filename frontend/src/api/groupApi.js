import { apiConfig } from '../config/apiConfig';
import axios from 'axios';

const api = axios.create({
    baseURL: apiConfig.baseURL,
});

export const getGroups = async (token) => {
    try {
        const response = await api.get('/groups', {
            headers: { Authorization: token },
        });
        return response.data.groups;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};

export const postCreateGroup = async(groupDetails,token)=>{
    try{
        const response = await api.post(`/groups/create`, groupDetails, {
            headers: { Authorization: token },
        })
        return response;
    }catch(error){
        console.error('Error creating group message:', error);
        throw error;
    }
}

export default api;
