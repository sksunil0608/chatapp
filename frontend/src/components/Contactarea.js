import React, { useState } from "react";
import CreateContact from "../components/CreateContact";
const Contactarea = ({
  setSelectedGroup,
  groups,
  updateSelectedGroup,
  selectedGroup,
  isLoading,
}) => {
  // ------------------------------Handle Group Click---------------
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    updateSelectedGroup(group);
  };

  // ----------------Add Conact Section----------------
  const [isCreateContactPopupOpen, setCreateContactPopupOpen] = useState(false);

  const openCreateContactPopup = () => {
    setCreateContactPopupOpen(true);
  };
  const closeCreateContactPopup = () => {
    setCreateContactPopupOpen(false);
  };

  const handleCreateContactSuccess = () => {
    try {
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      closeCreateContactPopup();
    }
  };

  return (
    <div className=" h-screen max-h-screen overflow-y-auto">
      {/* Search Contact */}
      <form className="flex items-center mt-1">
        <input
          type="text"
          id="contact-search"
          className="border-2 w-5/6 text-gray-900 text-sm rounded-lg py-2 px-2 ml-4"
          placeholder="Search contacts..."
        />

        <button
          type="submit"
          className="ng-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
        >
          <svg
            className=" w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>

      <hr className="border-t mt-2" />
      {/* Show popup on clicking create group */}
      <div className="mt-5">
        {isCreateContactPopupOpen && (
          <CreateContact
            onClose={closeCreateContactPopup}
            onSuccess={handleCreateContactSuccess}
          />
        )}
      </div>
      {/* Showing Contact lists */}
      <div className="">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {groups.length > 0 &&
              groups.map((group) => (
                <li
                  key={group.id}
                  className={`flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer ${
                    selectedGroup && selectedGroup.id === group.id
                      ? " bg-blue-200"
                      : ""
                  }`}
                  onClick={() => handleGroupClick(group)}
                >
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 ml-2"
                      src="/images/profile.jpeg"
                      alt="Bordered avatar"
                    />
                    <span className="ml-3">{group.name}</span>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
      {/* Contact bottom area */}
      <div className="fixed bottom-2 w-full lg:w-2/6 border bg-fuchsia-300 p-4 text-center">
        <button onClick={openCreateContactPopup}> Add Contacts</button>
      </div>
    </div>
  );
};

export default Contactarea;
