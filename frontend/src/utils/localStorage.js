export const fetchLocalMessage = (groupId) => {
    const allGroupMessages = localStorage.getItem('group_messages');
    const groupMessages = allGroupMessages ? JSON.parse(allGroupMessages) : {};
    return groupMessages[groupId] || [];;
}
export const storeMessageLocalStorage = (apiMessages, groupId, sender_name) => {
    try {
        let messagesToStore = [];

        if (apiMessages instanceof Array) {
            // If the response has a message array, iterate through it
            messagesToStore = apiMessages.map(message => ({
                "id": message.id,
                "sender_id": message.sender_id,
                "sender_name": message['User.sender_name'],
                "message": message.message,
                "timestamp": message.timestamp
            }));
        } else {
            // If the response has a single message object
            const { id, sender_id, message, timestamp } = apiMessages;
            messagesToStore = [{
                "id": id,
                "sender_id": sender_id,
                "sender_name": sender_name,
                "message": message,
                "timestamp": timestamp
            }];
        }

        const allGroupMessages = localStorage.getItem('group_messages');
        const groupMessages = allGroupMessages ? JSON.parse(allGroupMessages) : {};

        if (!groupMessages[groupId]) {
            groupMessages[groupId] = [];
        }

        groupMessages[groupId].unshift(...messagesToStore);

        // Ensure that only the last 5 messages are stored for each group
        const maxLength = 10;
        if (groupMessages[groupId].length > maxLength) {
            groupMessages[groupId].splice(maxLength);
        }

        const updatedMessages = JSON.stringify(groupMessages);
        localStorage.setItem('group_messages', updatedMessages);
    } catch (error) {
        console.log(error);
    }
};

