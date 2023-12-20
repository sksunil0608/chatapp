/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { getGroupMessages, postGroupMessage } from "../api/messageApi";
import { format } from "date-fns-tz";
import { io } from "socket.io-client";
import { postGroupAttachmentUpload } from "../api/messageApi";
import parseJwt from "../utils/jwt";
import { getGroupAttachments } from "../api/messageApi";
// Add these imports
import {
  fetchLocalAttachments,
  storeAttachmentSessionStorage,
} from "../utils/sessionStorage";

import {
  fetchLocalMessage,
  storeMessageLocalStorage,
} from "../utils/localStorage";

const Chatarea = ({ selectedGroup, token, updateSelectedGroup }) => {
  const decodedToken = parseJwt(token);
  const userName = decodedToken.name;

  //--------------------------------Socket.io code here------------------------
  // Connect to the group chat namespace
  const groupChatSocket = io(`${process.env.REACT_APP_BASE_URL}/group-chat`, {
    auth: {
      token: token,
    },
  });
  //Here i am handling the if new messages are there

  useEffect(() => {
    groupChatSocket.on("new-message", (message, senderName) => {
      storeMessageLocalStorage(message, selectedGroup.id, senderName);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      groupChatSocket.off("new-message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupChatSocket]);
  useEffect(() => {
    groupChatSocket.on("new-attachments", (attachments, senderName) => {
      storeAttachmentSessionStorage(attachments, selectedGroup.id, senderName);
      setAttachments((prevAttachments) => [...prevAttachments, ...attachments]);
    });
    return () => {
      groupChatSocket.off("new-attachments");
    };
  }, [groupChatSocket]);

  //Handling if scrollbar is scrolling and reqest to load more message
  useEffect(() => {
    groupChatSocket.on("more-messages", (moreMessages) => {
      setMessages((prevMessages) => [
        ...moreMessages.reverse(),
        ...prevMessages,
      ]);
    });

    return () => {
      groupChatSocket.off("more-messages");
    };
  }, [groupChatSocket]);

  useEffect(() => {
    groupChatSocket.on("more-attachments", (moreAttachments) => {
      setAttachments((prevAttachments) => [
        ...moreAttachments.reverse(),
        ...prevAttachments,
      ]);
    });
    return () => {
      groupChatSocket.off("more-attachments");
    };
  });
  //-------------------------------socket .io end ----------------------------------------
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);

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

  useEffect(() => {
    const handleLocalAttachments = async () => {
      try {
        // Fetch local attachments from session storage
        const localAttachments = fetchLocalAttachments(selectedGroup.id);
        if (localAttachments.length > 0) {
          setAttachments(localAttachments);
        } else {
          // Fetch attachments from the backend
          const startIndex = 0;
          const apiAttachments = await getGroupAttachments(
            selectedGroup.id,
            token,
            startIndex
          );
          // Store attachments in session storage
          storeAttachmentSessionStorage(apiAttachments, selectedGroup.id);
          setAttachments(apiAttachments);
        }
      } catch (error) {
        console.error("Error fetching group attachments:", error);
      }
    };

    if (selectedGroup) {
      handleLocalAttachments();
    }
  }, [selectedGroup, token]);

  const handleMessageInputChange = (event) => {
    setNewMessage(event.target.value);
  };
  const handleAttachmentFileChange = async (event) => {
    const selectedFiles = event.target.files;
    setSelectedAttachments([...selectedFiles]);
  };

  useEffect(() => {
    if (selectedAttachments.length > 0) {
      postCreateAttachment();
    }
  }, [selectedAttachments]);

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
        storeMessageLocalStorage(response.data.message, groupId, userName);
        setMessages((prevMessages) => [...prevMessages, response.data.message]);
        setNewMessage("");
        groupChatSocket.emit(
          "send-message",
          response.data.message,
          groupId,
          userName
        );
      }
    } catch (error) {
      console.log("Error creating group message:", error);
    }
  };

  const postCreateAttachment = async () => {
    try {
      setAttachmentLoading(true);
      const groupId = selectedGroup.id;
      const senderId = decodedToken.userId;
      // Handle the case if no file selected
      if (!selectedAttachments) {
        console.log("No files selected");
      }

      const formData = new FormData();
      selectedAttachments.forEach((attachment) => {
        formData.append("attachments[]", attachment);
      });
      const attachmentDetails = {
        senderId: senderId,
        attachments: selectedAttachments,
      };

      const response = await postGroupAttachmentUpload(
        groupId,
        attachmentDetails,
        token
      );
      if (response.status === 200) {
        setAttachmentLoading(false);
        storeAttachmentSessionStorage(
          ...response.data.attachments,
          groupId,
          userName
        );
        setAttachments((prevMessages) => [
          ...prevMessages,
          ...response.data.attachments,
        ]);

        groupChatSocket.emit(
          "send-attachments",
          response.data.attachments,
          groupId,
          userName
        );
      }
    } catch (error) {
      setAttachmentLoading(false);
      console.log("Erroor uploading attachment", error);
    }
  };

  const handleScroll = async () => {
    const container = containerRef.current;
    const isAtTop = container.scrollTop === 0;

    if (isAtTop && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        groupChatSocket.emit(
          "load-more-messages",
          selectedGroup.id,
          messages.length
        );
      } catch (error) {
        console.error("Error fetching more messages:", error);
      }
      try {
        groupChatSocket.emit(
          "load-more-attachments",
          selectedGroup.id,
          attachments.length
        );
      } catch (error) {
        console.error("Error fetching more attachments:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };
  const [allChats, setAllChats] = useState([]);
  const [isAttachmentLoading, setAttachmentLoading] = useState(false);
  useEffect(() => {
    const combinedChats = [...attachments, ...messages].map((chat) => {
      // Convert message or attachment to a common format

      const tempKey = chat.id;

      return {
        id: tempKey,
        sender_id: chat.sender_id ? chat.sender_id : decodedToken.userId,
        sender_name: chat.sender_name
          ? chat.sender_name
          : decodedToken.userName,
        message: chat.message || chat.file_name,
        timestamp: chat.timestamp || new Date(),
        file_url: chat.file_url ? chat.file_url : "",
        file_type: chat.file_type ? chat.file_type : "",
        type: chat.message ? "message" : "attachment",
      };
    });

    // Sort combined chats based on timestamp
    const sortedChats = combinedChats.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    setAllChats(sortedChats);
  }, [messages, attachments]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className=" h-128 max-h-screen overflow-y-auto relative"
    >
      {/* chats will show here */}
      <div className="grid grid-cols-1 gap-4 pb-4">
        {allChats.length > 0 &&
          selectedGroup &&
          allChats.map((chat) => (
            <div
              key={chat.id + selectedGroup.id + chat.type + chat.sender_id}
              className={`flex ${
                chat.sender_id === decodedToken.userId
                  ? "justify-end"
                  : "justify-start"
              } mx-10`}
            >
              <div
                className={`rounded-lg p-2 px-4 w-fit ${
                  chat.sender_id === decodedToken.userId
                    ? "bg-emerald-300"
                    : "bg-fuchsia-300"
                }`}
              >
                <div>
                  <p
                    className={
                      chat.sender_id === decodedToken.userId
                        ? "text-xs"
                        : "text-blue-800 text-xs"
                    }
                  >
                    {chat.sender_id === decodedToken.userId
                      ? "You"
                      : chat.sender_name}
                  </p>
                  <div className="flex items-center">
                    {chat.file_type && chat.file_type.startsWith("image/") ? (
                      <img
                        src={chat.file_url}
                        alt={chat.file_name}
                        className="max-w-sm max-h-56"
                      />
                    ) : (
                      <>
                        <h1 className="">
                          {chat.message ? chat.message : chat.file_name}
                        </h1>
                        {chat.file_url && (
                          <div className="ml-4 flex relative items-center">
                            <div className="rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                            <a
                              href={chat.file_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src="/images/download.svg"
                                className="rounded-full h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                alt="Loading avatar"
                              />
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <p className="text-xs text-right">
                    {format(new Date(chat.timestamp), `dd:MM:yyyy HH:mm`, {
                      timeZone: "Asia/Kolkata",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Loading indicator aligned to the right */}
      {isAttachmentLoading && (
        <div className="flex justify-end mx-10">
          <div className="rounded-lg p-2 px-4 bg-emerald-300 flex items-center">
            <p className="mr-2">Uploading Files</p>
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
              <img
                src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
                className="rounded-full h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                alt="Loading avatar"
              />
            </div>
          </div>
        </div>
      )}

      {selectedGroup && (
        <div className="fixed bottom-2 w-8/12">
          <div className="mx-auto flex items-center justify-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                postCreateMessage();
              }}
              className="flex items-center bg-white rounded-lg w-5/6"
            >
              <div className="flex items-center">
                <label
                  htmlFor="attachments"
                  className="cursor-pointer py-1 px-3 bg-white rounded-lg"
                >
                  <img
                    src="/images/attachment.svg"
                    alt="Attachment"
                    width="20"
                    height="20"
                  />
                </label>

                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  accept="image/*,video/*,audio/*"
                  multiple
                  className="hidden"
                  onChange={handleAttachmentFileChange}
                />
              </div>

              <input
                type="text"
                id="message"
                name="message"
                className="py-1 px-3 flex-grow focus:outline-none"
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleMessageInputChange}
              />

              <button
                type="submit"
                className="ml-2 px-4 py-1  rounded-lg relative"
              >
                <div className="flex items-center justify-center relative w-15 h-15 p-2 rounded-full ring-2 ring-green-500  bg-emerald-500 ">
                  <img src="/images/send.png" className="" alt="Send" />
                </div>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatarea;
