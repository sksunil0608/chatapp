import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Header from "../components/Header";
import Chatarea from "../components/Chatarea";
import Contactarea from "../components/Contactarea";
import Creategroup from "../components/Creategroup";
import InviteMember from "../components/InviteMember";
import CreateGroupMember from "../components/CreateGroupMember";
import GroupMember from "../components/GroupMember";
import { getGroups } from "../api/groupApi";

export default function Home() {
  const token = localStorage.getItem("token");

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isViewGroupMemberPopupOpen, setViewGroupMemberPopupOpen] =
    useState(false);
  const openViewGroupMembrPopupOpen = () => {
    setViewGroupMemberPopupOpen(true);
  };
  const closeViewGroupMembrPopupOpen = () => {
    setViewGroupMemberPopupOpen(false);
  };
  // Callback function to update selectedGroup in Contactarea.js
  const updateSelectedGroup = (group) => {
    setSelectedGroup(group);
  };

  // Callback function to update groups in Contactarea.js
  const updateGroups = async () => {
    try {
      const fetchedGroups = await getGroups(token);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    updateGroups(); // Fetch groups initially
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create Group Popup thing
  const [isCreateGroupPopupOpen, setCreateGroupPopupOpen] = useState(false);
  const openCreateGroupPopup = () => {
    setCreateGroupPopupOpen(true);
  };
  const closeCreateGroupPopup = () => {
    setCreateGroupPopupOpen(false);
  };

  const handleCreateGroupSuccess = async () => {
    try {
      updateGroups();
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      closeCreateGroupPopup();
    }
  };
  // Create Group Popup thing end

  //----------------------Add Group Memeber ----------------------------------------
  const [isCreateGroupMemberPopupOpen, setCreateGroupMemberPopupOpen] =
    useState(false);

  const openCreateGroupMemberPopup = () => {
    setCreateGroupMemberPopupOpen(true);
  };
  const closeCreateGroupMemberPopup = () => {
    setCreateGroupMemberPopupOpen(false);
  };

  const handleCreateGroupMemberSuccess = () => {
    try {
      console.log("Group Created Successfully");
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      closeCreateGroupMemberPopup();
    }
  };
  // -------------------------------Invite LInk---------------------
  const [isinviteLinkPopupOpen, setInviteLinkPopupOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const openInviteLinkPopup = () => {
    if (selectedGroup) {
      setInviteLinkPopupOpen(true);
      const link = `http://127.0.0.1:3000/join/group/${selectedGroup.id}`;
      setInviteLink(link);
      console.log("Popup opened");
    }
  };
  const closeInviteLinkPopup = () => {
    setInviteLinkPopupOpen(false);
  };
  const handleInviteLinkSuccess = () => {
    try {
      console.log("User Invited Successfully");
    } catch (error) {
      console.error("Invitation Failed", error);
    } finally {
      closeInviteLinkPopup();
    }
  };

  return (
    <div>
      <div>
        <div className=" h-screen overflow-hidden">
          <Header />
          <hr />
          {/* Navbar above chat screen */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-300  rounded-lg mt-1">
            {/* Contacts Header */}
            <div className="flex items-start">
              <ul className="flex items-center space-x-10 mx-10">
                {/* Contacts */}
                <li className="flex flex-col items-center justify-center">
                  <NavLink to="" className="hover: flex flex-col items-center">
                    <img
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                      src="/images/contact.webp"
                      alt="Contact  "
                    />
                  </NavLink>
                </li>
                {/* Contacts End */}

                {/* Groups */}
                <li className="flex flex-col items-center">
                  <NavLink
                    to=""
                    className="hover: flex flex-col items-center"
                    onClick={openCreateGroupPopup}
                  >
                    <img
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                      src="/images/groups.png"
                      alt="Bordered avatar"
                    />
                  </NavLink>
                  {/* Show popup on clicking create group */}
                  <div className="mt-5">
                    {isCreateGroupPopupOpen && (
                      <Creategroup
                        onClose={closeCreateGroupPopup}
                        onSuccess={handleCreateGroupSuccess}
                      />
                    )}
                  </div>
                </li>
                {/* Groups End */}

                {/* Notification */}
                <li className="flex flex-col items-center">
                  <NavLink
                    to=""
                    className=" hover:font-red flex flex-col items-center"
                  >
                    <img
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                      src="/images/notification.webp"
                      alt="Bordered avatar"
                    />
                  </NavLink>
                </li>
              </ul>
            </div>
            {/* contact header end */}
            {/* Chat header */}
            <div className="hidden md:block  items-center mx-auto">
              {selectedGroup && (
                <div className="flex">
                  <button
                    className="flex"
                    onClick={openViewGroupMembrPopupOpen}
                  >
                    <h4 className="ml-2 text-2xl text-transform: uppercase">
                      {selectedGroup.name}
                    </h4>
                    <img
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                      src="/images/profile.jpeg"
                      alt="Bordered avatar"
                    />
                  </button>
                  {isViewGroupMemberPopupOpen && (
                    <GroupMember
                      onClose={closeViewGroupMembrPopupOpen}
                      selectedGroup={selectedGroup}
                    />
                  )}
                  <button
                    className="border-2 bg-orange-500 border-red-200 text-white px-2 py-1 rounded-lg ml-40"
                    onClick={openCreateGroupMemberPopup}
                  >
                    +Member
                  </button>
                  <button
                    className="border-2 bg-orange-500 border-red-200 text-white px-2 py-1 rounded-lg"
                    onClick={openInviteLinkPopup}
                  >
                    Invite
                  </button>
                  {isinviteLinkPopupOpen && (
                    <InviteMember
                      onClose={closeInviteLinkPopup}
                      onSuccess={handleInviteLinkSuccess}
                      inviteLink={inviteLink}
                    />
                  )}
                  <div className="mt-5">
                    {isCreateGroupMemberPopupOpen && (
                      <CreateGroupMember
                        onClose={closeCreateGroupMemberPopup}
                        onSuccess={handleCreateGroupMemberSuccess}
                        token={token}
                        selectedGroup={selectedGroup}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Chat header end */}
          </div>
          <div className="grid grid-cols-12">
            {/* Contacts Area */}
            <div
              className={`lg:col-span-4 bg-blue-100 ${
                selectedGroup ? "hidden md:block" : "col-span-12"
              }`}
            >
              <Contactarea
                setSelectedGroup={setSelectedGroup}
                groups={groups}
                updateSelectedGroup={updateSelectedGroup}
                selectedGroup={selectedGroup}
                isLoading={isLoadingGroups}
              />
            </div>
            {/* Chat Area */}
            <div
              className={`lg:col-span-8 h-screen bg-blue-100 ${
                selectedGroup ? "col-span-12" : "hidden md:block"
              }`}
            >
              {selectedGroup && (
                <div className="sm:w-full lg:hidden flex bg-blue-200 p-2 mb-2">
                  <button onClick={() => setSelectedGroup(null)}>
                    <img
                      className="w-10 h-10 p-1 rounded-full  ring-gray-300 dark:ring-gray-500 ml-2"
                      src="/images/back.svg"
                      alt="Back Button"
                    />
                  </button>
                  <div className="flex mx-auto">
                    <button
                      className="flex"
                      onClick={openViewGroupMembrPopupOpen}
                    >
                      <h4 className="ml-2 text-2xl text-transform: uppercase">
                        {selectedGroup.name}
                      </h4>
                      <img
                        className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                        src="/images/profile.jpeg"
                        alt="Bordered avatar"
                      />
                    </button>
                    {isViewGroupMemberPopupOpen && (
                      <GroupMember
                        onClose={closeViewGroupMembrPopupOpen}
                        selectedGroup={selectedGroup}
                      />
                    )}
                  </div>
                </div>
              )}
              <Chatarea
                selectedGroup={selectedGroup}
                token={token}
                updateSelectedGroup={updateSelectedGroup}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
