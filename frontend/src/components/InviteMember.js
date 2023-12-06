import { useState } from "react";

export default function Creategroup({ onClose, onSuccess,inviteLink }) {
    const [isCopied,setCopied] = useState(false)

    const handleCopyToClipboard = async () => {
        try{
            await navigator.clipboard.writeText(inviteLink)
            setCopied(true)
        }catch(error){
            console.error('Unable to copy to clipboard', error)
        }
    };
    return (
        <div>
            <div className="fixed inset-0 bg-7a7d85 bg-opacity-75 z-50 mt-24">
                <div className="w-3/6 border bg-e6ffff border-red-400 rounded-lg  mx-auto">
                    <form className="mx-auto p-6" onSubmit={(e) => e.preventDefault()}>
                        {/* Eamil */}
                        <div className="flex mb-2 space-x-4">
                            <label className="text-gray-700 mt-2 text-sm font-bold" htmlFor="email">
                                Email:
                            </label>
                            <input
                                className=" border rounded py-1  text-gray-700 px-2 w-full"
                                id="email"
                                type="text"
                                email="email"
                                placeholder="User Email Name"
                                autoComplete="true"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                className="px-4 py-1 bg-eb6134 text-white rounded-lg mt-2"
                                type="submit"
                            >
                                Invite
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p>---------------------------------------------------</p>
                        <p className="mb-3">Copy the Link to Invite User:</p>
                        <h1 className="border border-red-600 mx-28 py-3">{inviteLink}</h1>
                        <button className="mt-5 bg-008000 px-3 py-1.5 text-white rounded-lg"
                        type="button"
                        onClick={handleCopyToClipboard}
                        >
                            {isCopied?"Coppied":"Copy"}
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className=" bg-eb6134 px-3 rounded-sm py-1.5 text-white"
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
