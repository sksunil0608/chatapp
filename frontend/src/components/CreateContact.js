import React, { useState } from "react";
import { postCreateContact } from "../api/contactlistApi";

export default function CreateContact({ onClose, onSuccess }) {

    const [contactDetails, setContactDetails] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContactDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleCreateContact = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await postCreateContact(contactDetails, token);
            if (response.status === 201) {
                onSuccess();
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            <div className="col-span-6 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-blue-100">
                <div className="container h-screen max-h-screen overflow-y-auto">
                    <div className=" inset-0 bg-gray-400 bg-opacity-75 z-50 mx-1">
                        <div className=" border bg-teal-100 border-red-400 rounded-lg  mx-auto">
                            <form className="mx-auto p-2" onSubmit={(e) => e.preventDefault()}>
                                {/*  Name */}
                                <div className=" mb-2">
                                    <label className="text-gray-700 text-sm font-bold" htmlFor="name">
                                        Contact Name:
                                    </label>
                                    <input
                                        className=" border rounded py-1  text-gray-700 px-2 w-full"
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={contactDetails.name}
                                        onChange={handleInputChange}
                                        placeholder="Contact Name"
                                        autoComplete="true"
                                    />
                                </div>
                                {/*  email */}
                                <div className="mb-2">
                                    <label className="text-gray-700 text-sm font-bold" htmlFor="email">
                                        Email:
                                    </label>
                                    <input
                                        className="border rounded py-1 text-gray-700 px-2 w-full"
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={contactDetails.email}
                                        onChange={handleInputChange}
                                        placeholder=" Email"
                                    />
                                </div>

                                {/*  Phone */}
                                <div className="mb-2">
                                    <label
                                        className="text-gray-700 text-sm font-bold"
                                        htmlFor="phone"
                                    >
                                         Phone:
                                    </label>
                                    <input
                                        className=" border rounded py-1 text-gray-700 px-2 w-full"
                                        id="phone"
                                        name="phone"
                                        type="phone"
                                        value={contactDetails.phone}
                                        onChange={handleInputChange}
                                        placeholder=" Phone"
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        className="px-4 py-1 bg-orange-500 text-white rounded-lg mb-4 mt-2"
                                        type="submit"
                                        onClick={handleCreateContact}
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
            </div>
        </div>
    );
}
