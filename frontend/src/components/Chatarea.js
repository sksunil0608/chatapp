import React, { useState, useEffect, useRef } from "react";
import { getGroupMessages, postGroupMessage } from "../api/messageApi";
import { format } from "date-fns-tz";
import { io } from "socket.io-client";

import parseJwt from "../utils/jwt";
import {
  fetchLocalMessage,
  storeMessageLocalStorage,
} from "../utils/localStorage";

const Chatarea = ({ selectedGroup, token, updateSelectedGroup }) => {
  const decodedToken = parseJwt(token);
  const userName = decodedToken.name

  //--------------------------------Socket.io code here------------------------
  // Connect to the group chat namespace
  const groupChatSocket = io(`${process.env.REACT_APP_BASE_URL}/group-chat`, {
    auth: {
      token: token,
    },
  });
  //Here i am handling the if new messages are there
  useEffect(() => {
    groupChatSocket.on("new-message", (message,senderName) => {
      storeMessageLocalStorage(message, selectedGroup.id, senderName);
      setMessages((prevMessages) => [...prevMessages,message]);
    });

    return () => {
      groupChatSocket.off("new-message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupChatSocket]);

  //Handling if scrollbar is scrolling and reqest to load more message
  useEffect(() => {
    groupChatSocket.on("more-messages", (moreMessages) => {
      setMessages((prevMessages) => [...moreMessages.reverse(), ...prevMessages]);
    });
    return () => {
      groupChatSocket.off("more-messages");
    };
  }, [groupChatSocket]);
//-------------------------------socket .io end ----------------------------------------
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const handleLocalMessages = async () => {
      try {
        let fetchedMessages;

        const localMessages = fetchLocalMessage(
          selectedGroup.id,
          decodedToken.userId
        );
        if (localMessages.length > 0) {
          fetchedMessages = localMessages;
        } else {
          const startIndex = 0;
          const apiMessages = await getGroupMessages(
            selectedGroup.id,
            token,
            startIndex
          );
          // I have sorted message from backend
          storeMessageLocalStorage(apiMessages, selectedGroup.id);
          fetchedMessages = apiMessages;
        }

        setMessages(fetchedMessages.reverse());
      } catch (error) {
        console.error("Error fetching group messages:", error);
      }
    };

    if (selectedGroup) {
      handleLocalMessages();
      updateSelectedGroup(selectedGroup);
    }
  }, [selectedGroup, token, updateSelectedGroup, decodedToken.userId]);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const postCreateMessage = async () => {
    try {
      const groupId = selectedGroup.id
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
        storeMessageLocalStorage(response.data.message, groupId,userName);
        setMessages((prevMessages) => [...prevMessages, response.data.message]);
        setNewMessage("");
        groupChatSocket.emit("send-message", response.data.message, groupId,userName);
      }
    } catch (error) {
      console.log("Error creating group message:", error);
    }
  };

  const handleScroll = async () => {
    const container = containerRef.current;
    const isAtTop = container.scrollTop === 0;
    if (isAtTop && !isLoadingMore) {
      try {
        setIsLoadingMore(true);
        groupChatSocket.emit(
          "load-more-messages",
          selectedGroup.id,
          messages.length
        );

      } catch (error) {
        console.error("Error fetching more messages:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };
  return (
    <div className="hidden sm:block md:col-span-4 lg:col-span-4 bg-e6ffff">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="container h-128 max-h-screen overflow-y-auto relative"
      >
        {/* chats will show here */}
        <div className="grid grid-cols-1 gap-4 pb-16">
          {messages.length > 0 &&
            messages.map((message) => (
              <div
                key={message.id + selectedGroup.id}
                className={`flex ${
                  message.sender_id === decodedToken.userId
                    ? "justify-end"
                    : "justify-start"
                } mx-10`}
              >
                <div
                  className={`rounded-lg p-2 px-4 w-2/6 ${
                    message.sender_id === decodedToken.userId
                      ? "bg-80ffbf"
                      : "bg-ffb3ff"
                  }`}
                >
                  <div>
                    <p
                      className={
                        message.sender_id === decodedToken.userId
                          ? "text-xs"
                          : "text-blue-800 text-xs"
                      }
                    >
                      {message.sender_id === decodedToken.userId
                        ? "You"
                        : message.sender_name}
                    </p>
                    <h1 className="">{message.message}</h1>
                    <p className="text-xs text-right">
                      {format(new Date(message.timestamp), "HH:mm", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            postCreateMessage();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="fixed bottom-2 w-4/6 p-4">
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
              type="submit"
              className="ml-4 px-4 py-2 bg-eb6134 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatarea;
