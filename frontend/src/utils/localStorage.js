export const fetchLocalMessage = (groupId)=>{
    const messages = localStorage.getItem("messages")
    return JSON.parse(messages)||[]
}

export const storeMessageLocalStorage = (response)=>{
try{
    const {id,sender_id,group_id,message} = response.data.message;
    try{
    const storedMessages = localStorage.getItem('messages');
    const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];
        const messageObject = {
            "id": id,
            "group_id": group_id,
            "sender_id": sender_id,
            "message": message
        }
        if (existingMessages.length < 10) {
            existingMessages.push(messageObject)
        } else {
            existingMessages.shift();
            // Push the new message
            existingMessages.push(messageObject);
        }

        // Convert the array back to a JSON string
        const updatedMessages = JSON.stringify(existingMessages);
        localStorage.setItem('messages', updatedMessages);
    }catch(error){
        console.log(error)
    }
    

   
    

}catch(error){
    console.log("Message Storing in failed")
    throw new Error("Error")
}
}