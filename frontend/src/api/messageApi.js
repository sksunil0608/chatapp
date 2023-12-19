import { apiConfig } from "../config/apiConfig";
import axios from "axios";

const api = axios.create({
  baseURL: apiConfig.baseURL,
});

export const getGroupMessages = async (groupId, token, startIndex = 0) => {
  try {
    const response = await api.get(`/groups/${groupId}/messages`, {
      headers: { Authorization: token },
      params: { startIndex }, 
    });
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching group messages:", error);
    throw error;
  }
};

export const postGroupMessage = async (groupId, messageDetails, token) => {
  try {
    const response = await api.post(
      `/groups/${groupId}/messages`,
      messageDetails,
      {
        headers: { Authorization: token },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating group message:", error);
    throw error;
  }
};


export const postGroupAttachmentUpload = async (groupId, attachmentDetails, token) => {
  try {
    const response = await api.post(
      `/groups/${groupId}/attachments`,
      attachmentDetails,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error Sending Attachment", error);
  }
};

export const getGroupAttachments = async (groupId, token, startIndex = 0) => {
  try {
    const response = await api.get(`/groups/${groupId}/attachments`, {
      headers: { Authorization: token },
      params: { startIndex },
    });

    return response.data.attachments;
  } catch (error) {
    console.log("Error fetching group attachments:", error);
    throw error;
  }
};


export default api;
