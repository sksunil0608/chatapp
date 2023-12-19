export const fetchLocalAttachments = (groupId) => {
    const allGroupAttachments = sessionStorage.getItem('group_attachments');
    const groupAttachments = allGroupAttachments ? JSON.parse(allGroupAttachments) : {};
    return groupAttachments[groupId] || [];
};


export const storeAttachmentSessionStorage = (apiAttachments, groupId, sender_name) => {
    try {
        let attachmentsToStore = [];
        if (apiAttachments instanceof Array) {
            // If the response has an attachments array, iterate through it
            attachmentsToStore = apiAttachments.map(attachment => {
                return {
                    "id": attachment.id,
                    "sender_id": attachment.sender_id,
                    "sender_name": attachment['User.sender_name'],
                    "file_name": attachment.file_name,
                    "file_type": attachment.file_type,
                    "file_url": attachment.file_url,
                    "timestamp": attachment.timestamp
                }
            });
        } 

        const allGroupAttachments = sessionStorage.getItem('group_attachments');
        const groupAttachments = allGroupAttachments ? JSON.parse(allGroupAttachments) : {};

        if (!groupAttachments[groupId]) {
            groupAttachments[groupId] = [];
        }

        groupAttachments[groupId].unshift(...attachmentsToStore);

        // Ensure that only the last 10 attachments are stored for each group
        const maxLength = 5;
        if (groupAttachments[groupId].length > maxLength) {
            groupAttachments[groupId].splice(maxLength);
        }

        const updatedAttachments = JSON.stringify(groupAttachments);
        sessionStorage.setItem('group_attachments', updatedAttachments);
    } catch (error) {
        console.log(error);
    }
};

