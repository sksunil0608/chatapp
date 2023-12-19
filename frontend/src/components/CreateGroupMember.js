import React, { useState, useEffect } from "react";
import { getContacts, getisVChatUser } from "../api/contactlistApi";
import { postCreateGroupMember } from "../api/groupMemebrApi";

export default function CreateGroupMember({
  onClose,
  onSuccess,
  token,
  selectedGroup,
}) {
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [clickedContacts, setClickedContacts] = useState([]);
  const [groupMemberDetails, setGroupMemberDetails] = useState({
    group_id: "",
    user_id: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await getContacts(token);
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setErrorMessage("Error fetching contacts");
      } finally {
        setIsLoadingContacts(false);
      }
    };

    fetchContacts();
  }, [token]);

  const handleContactClick = async (contact) => {
    if (clickedContacts.includes(contact.id)) {
      return;
    }

    setClickedContacts((prevClickedContacts) => [
      ...prevClickedContacts,
      contact.id,
      setErrorMessage(""),
    ]);

    const email = contact.email;
    const phone = contact.phone;
    const groupId = selectedGroup.id;

    const contactDetails = {
      email,
      phone,
      groupId,
    };

    try {
      const response = await getisVChatUser(contactDetails, token);
      const userResponse = response.data;

      if (userResponse.isalreadyGroupMember) {
        setErrorMessage("User is already a member of the group");
        return;
      }

      if (userResponse.isVChatUser) {
        setSelectedContacts((prevSelectedContacts) => [
          ...prevSelectedContacts,
          contact,
        ]);

        try {
          const userId = userResponse.userId;
          setGroupMemberDetails({ group_id: groupId, user_id: userId });
        } catch (error) {
          console.error("Error adding contact");
          setErrorMessage("Error adding contact");
        }
      } else {
        setErrorMessage("User is not registered to Vchat");
      }
    } catch (error) {
      console.error("Error fetching isVChatUser:", error);
      setErrorMessage("Error fetching user information");
    }
  };

  const handleCreateGroupMember = async () => {
    try {
      const response = await postCreateGroupMember(groupMemberDetails, token);
      if (response.status === 201) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error creating group member");
    }
  };
  // ------------------------Handling Search Contacts/Filter Contacts
  const filterContacts = (contacts, searchTerm) => {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredContacts = [];

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const contactNameLower = contact.name.toLowerCase();
      const contactEmailLower = contact.email.toLowerCase();
      const contactPhoneLower = contact.phone.toLowerCase();

      if (
        contactNameLower.includes(searchTermLower) ||
        contactEmailLower.includes(searchTermLower) ||
        contactPhoneLower.includes(searchTermLower)
      ) {
        filteredContacts.push(contact);
      }
    }
    return filteredContacts;
  };
  // Calling filterContacts to get filtered contacts
  const filteredContacts = filterContacts(contacts, searchTerm);

  return (
    <div>
      <div className="fixed inset-0 bg-gray-400 bg-opacity-75 z-50 mt-24">
        <div className="w-3/6 lg:w-2/6 border h-128 bg-teal-100 border-red-400 rounded-lg mt-2 mx-auto">
          <h2 className="mt-2 text-center text-white bg-orange-500 border-2 border-red-500 rounded-lg mx-44 py-1">
            Select Members
          </h2>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search contacts"
            className="p-1.5 mt-5 mx-14 w-96 border rounded-lg border-gray-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Showing Selected Contacts */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            {selectedContacts.length > 0 &&
              selectedContacts.map((selectedContact) => (
                <div key={selectedContact.id} className="flex items-center">
                  <img
                    className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                    src="/images/profile.jpeg"
                    alt="Bordered avatar"
                  />
                </div>
              ))}
          </div>

          {/* Showing Error Message */}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* Showing Contacts */}
          <div className="mt-5">
            {isLoadingContacts ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <li
                      key={contact.id}
                      className={`flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer`}
                      onClick={() => handleContactClick(contact)}
                    >
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                          src="/images/profile.jpeg"
                          alt="Bordered avatar"
                        />
                        <span className="ml-3">{contact.name}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No contacts found.</p>
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

            <button
              className="bg-orange-500 px-3 rounded-sm py-1.5 text-white ml-2"
              type="button"
              onClick={handleCreateGroupMember}
            >
              Add Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
