import React, { useState, useEffect } from "react";
import { getGroupMessages,postGroupMessage } from "../api/messageApi";
import parseJwt from "../utils/jwt";
import { fetchLocalMessage, storeMessageLocalStorage } from "../utils/localStorage"

const Chatarea = ({selectedGroup,token,updateSelectedGroup}) => {
    const decodedToken = parseJwt(token);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const handleLocalMessages = async () => {
            try {
                try{
                    const fetchedMessages = fetchLocalMessage(selectedGroup.id);
                    setMessages(fetchedMessages)
                }catch{
                    const apiMessages = await getGroupMessages(selectedGroup.id, token)
                    setMessages(apiMessages)
                }
                
                
            } catch (error) {
                console.error("Error fetching group messages:", error);
            }
        };
        if (selectedGroup) {
            handleLocalMessages();
            updateSelectedGroup(selectedGroup);
        }
    }, [selectedGroup, token, updateSelectedGroup]);

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };

    const postCreateMessage = async () => {
        try {
            const groupId = selectedGroup.id;
            const senderId = decodedToken.userId;
            const message_type = "txt";

            const messageDetails = {
                senderId,
                message: newMessage,
                message_type,
            };

            // Use the postGroupMessage function from js
            const response = await postGroupMessage(groupId, messageDetails, token);

            if (response.status === 201) {
                setMessages((prevMessages) => [...prevMessages, response.data.message]);
                storeMessageLocalStorage(response)
                setNewMessage("");
            }
        } catch (error) {
            console.log("Error creating group message:", error);
        }
    };

    return (
        <div className="hidden sm:block md:col-span-4 lg:col-span-4 bg-e6ffff">
            <div className="container h-128 max-h-screen overflow-y-auto flex flex-col-reverse relative">
                {/* chats will show here */}
                <div className="grid grid-cols-1 gap-4 pb-16">
               
                    {messages.length > 0 &&
                        
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender_id === decodedToken.userId
                                        ? "justify-end"
                                        : "justify-start"
                                    } mx-10`}
                            >
                                
                                <div
                                    className={`rounded-lg p-2 ${message.sender_id === decodedToken.userId
                                            ? "bg-ffb3ff"
                                            : "bg-7a7d85 text-white"
                                        }`}
                                >
                                    {message.message}
                                </div>
                            </div>
                        ))}
                </div>
                <div className="fixed bottom-2 w-4/6 p-4 flex items-center justify-center bg-7a7d85 bg-opacity-10">
                    <input
                        type="text"
                        id="message"
                        name="message"
                        className="border-2 w-3/4 py-2 px-3 rounded-lg"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={handleInputChange}
                    />
                    <button
                        className="ml-4 px-4 py-2 bg-eb6134 text-white rounded-lg"
                        onClick={postCreateMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatarea;
