import React, { useState } from "react";
import { postCreateGroup } from "../api/groupApi";

export default function Creategroup({ onClose, onSuccess }) {

  const [groupDetails, setGroupDetails] = useState({
    name: "",
    icon: "",
    about: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGroupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await postCreateGroup(groupDetails,token);
      if (response.status === 201) {
        onSuccess();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className="fixed inset-0 bg-gray-400 bg-opacity-75 z-50 mt-24">
        <div className="w-5/6 border bg-teal-100 border-red-400 rounded-lg  mx-auto">
          <form className="mx-auto p-2" onSubmit={(e) => e.preventDefault()}>
            {/* Group Name */}
            <div className=" mb-2">
              <label className="text-gray-700 text-sm font-bold" htmlFor="name">
                Group Name:
              </label>
              <input
                className=" border rounded py-1  text-gray-700 px-2 w-full"
                id="name"
                type="text"
                name="name"
                value={groupDetails.name}
                onChange={handleInputChange}
                placeholder="Group Name"
                autoComplete="true"
              />
            </div>
            {/* Group icon */}
            <div className="mb-2">
              <label className="text-gray-700 text-sm font-bold" htmlFor="icon">
                Group Icon:
              </label>
              <input
                className="border rounded py-1 text-gray-700 px-2 w-full"
                id="icon"
                name="icon"
                type="file"
                value={groupDetails.icon}
                onChange={handleInputChange}
                placeholder="Group Icon"
              />
            </div>

            {/* Group About */}
            <div className="mb-2">
              <label
                className="text-gray-700 text-sm font-bold"
                htmlFor="about"
              >
                Group About:
              </label>
              <input
                className=" border rounded py-1 text-gray-700 px-2 w-full"
                id="about"
                name="about"
                type="text"
                value={groupDetails.about}
                onChange={handleInputChange}
                placeholder="Group About"
              />
            </div>
            <div className="flex justify-center">
              <button
                className="px-4 py-1 bg-orange-500 text-white rounded-lg mb-4 mt-2"
                type="submit"
                onClick={handleCreateGroup}
              >
                Create
              </button>
            </div>
          </form>
          <div className="flex justify-end">
            <button
              className=" bg-orange-500 px-3 rounded-sm py-1.5 text-white"
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
