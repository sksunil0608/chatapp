import { apiConfig } from '../config/apiConfig';
import axios from 'axios';

const api = axios.create({
    baseURL: apiConfig.baseURL,
});

export const getGroupMembers = async (groupId,token) => {
    try {
        const response = await api.get(`/groups/${groupId}/members`, {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};


export const getUserGroups = async (token) => {
    try {
        const response = await api.get('/user/groups', {
            headers: { Authorization: token },
        });
        return response;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};


export const postCreateGroupMember = async (memberDetails, token) => {
    try {
        const groupId = memberDetails.group_id
        const response = await api.post(`/groups/${groupId}/members`, memberDetails, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        console.error('Error creating Group Member:', error);
        throw error;
    }
}

export const postRemoveGroupMember = async (memberDetails, token) => {
    try {
        const groupId = memberDetails.group_id;
        const response = await api.post(`/groups/${groupId}/members/remove`, memberDetails, {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (error) {
        console.error('Error Removing Member:', error);
        throw error;
    }
};


export const postMakeMemberAdmin = async (groupDetails, token) => {
    try {
        const groupId = groupDetails.group_id
        const response = await api.put(`/groups/${groupId}/members/make-admin`, groupDetails, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        console.error('Error Making User Admin:', error);
        throw error;
    }
}

export const postRemoveMemberFromAdmin = async (groupDetails, token) => {
    try {
        const groupId = groupDetails.group_id
        const response = await api.put(`/groups/${groupId}/members/remove-admin`, groupDetails, {
            headers: { Authorization: token },
        })
        return response;
    } catch (error) {
        console.error('Error Removing User Admin:', error);
        throw error;
    }
}



export default api;
