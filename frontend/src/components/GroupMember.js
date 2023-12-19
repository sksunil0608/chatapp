import React, { useState, useEffect } from "react";
import {
  getGroupMembers,
  postMakeMemberAdmin,
  postRemoveGroupMember,
  postRemoveMemberFromAdmin,
} from "../api/groupMemebrApi";

import parseJwt from "../utils/jwt";
export default function GroupMember({ onClose, onSuccess, selectedGroup }) {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;

  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdminActionMenuOpen, setIsAdminActionMenuOpen] = useState(false);
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);
  const [isLoginSuperAdmin, setIsLoginSuperAdmin] = useState(false);

  const [memberDetails, setMemberDetails] = useState({
    user_id: "",
    group_id: "",
  });

  const toggleAdminActionMenu = () => {
    setIsAdminActionMenuOpen(!isAdminActionMenuOpen);
  };

  const checkSuperAdmin = () => {
    if (userId === selectedGroup.superadmin_user_id) {
      setIsLoginSuperAdmin(true);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const fetchedMembers = await getGroupMembers(selectedGroup.id, token);
        setMembers(fetchedMembers.groupMembers);
        if (fetchedMembers.is_admin) {
          setIsLoginAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching group members:", error);
        setErrorMessage("Error fetching group members");
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [token, selectedGroup.id]);

  const handleMemberClick = async (member) => {
    setSelectedMember(member);
    toggleAdminActionMenu();
    setMemberDetails({ group_id: selectedGroup.id, user_id: member.id });
  };

  const handleMakeGroupAdmin = async () => {
    try {
      const response = await postMakeMemberAdmin(memberDetails, token);
      console.log("User is now Admin");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error creating group member");
    }
  };

  const handleRemoveGroupAdmin = async () => {
    try {
      const response = await postRemoveMemberFromAdmin(memberDetails, token);
      console.log("User is Removed From Admin Admin");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error creating group member");
    }
  };

  const handleRemoveGroupMember = async () => {
    try {
      const response = await postRemoveGroupMember(memberDetails, token);
      console.log("User is Removed ");
    } catch (err) {
      console.error(err);
      setErrorMessage("Error Removing User");
    }
  };
  // ------------------------Handling Search Members/Filter Members
  const filterMembers = (members, searchTerm) => {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredMembers = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const memberNameLower = member.name.toLowerCase();
      const memberPhoneLower = member.phone.toLowerCase();

      if (
        memberNameLower.includes(searchTermLower) ||
        memberPhoneLower.includes(searchTermLower)
      ) {
        filteredMembers.push(member);
      }
    }
    return filteredMembers;
  };
  // Calling filterMembers to get filtered members
  const filteredMembers = filterMembers(members, searchTerm);

  return (
    <div>
      <div className="fixed inset-0 bg-gray-400 bg-opacity-75 z-50 mt-24">
        <div className="w-5/6 border h-fit bg-teal-100 border-red-400 rounded-lg mt-2 mx-auto">
          <div className="mt-2 text-center text-lg text-decoration-line: underline mx-44 py-1">
            Group Info
          </div>

          <div className="mx-20 text-center justify-center items-center">
            <div className="flex justify-center items-center">
              <img
                className="w-40 h-40 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                src={"   "}
                alt=""
              />
            </div>

            <h1 className="text-2xl">{selectedGroup.name}</h1>
            <p className="">Group {selectedGroup.total_users} memebrs</p>
            <p>{selectedGroup.about}</p>
          </div>
          <div className="border-t">
            <p className="text-center">
              Group Created By {selectedGroup.superadmin_user_id} at{" "}
              {selectedGroup.createdAt}
            </p>
          </div>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search group members"
            className="p-1.5 mt-5 mx-14 w-96 border rounded-lg border-gray-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Showing Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Showing Group Members */}
          <div className="mt-5">
            {isLoadingMembers ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <li
                      key={member.id}
                      className={`flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer`}
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                          src={member.icon}
                          alt="Bordered avatar"
                        />
                        <div>
                          <span className="ml-3">{member.name}</span>
                          {member.is_admin && (
                            <p className="mr-28 text-purple-700">admin</p>
                          )}
                        </div>
                        {isLoginAdmin &&
                          selectedMember &&
                          selectedMember.id === member.id && (
                            <div>
                              {isAdminActionMenuOpen && (
                                <div className="fixed bg-gray-400 bg-opacity-75 z-50">
                                  {/* Admin Action Menu */}
                                  <div className="flex items-center bg-white w-36 h-20 p-1 rounded-sm">
                                    <ul className="mx-auto">
                                      {/* Make Admin Area */}
                                      <li onClick={handleMakeGroupAdmin}>
                                        Make Admin
                                      </li>
                                      {/* Make Admin Area End */}

                                      {/* Remove User */}
                                      <li onClick={handleRemoveGroupMember}>
                                        Remove User
                                      </li>
                                      {/* Remove User Area End */}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No group members found.</p>
                )}
              </ul>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex bottom-0 justify-end">
            <button
              className="bg-orange-500 px-3 rounded-sm py-1.5 text-white"
              type="button"
              onClick={onClose}
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
