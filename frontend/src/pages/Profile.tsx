import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import DeleteProfileModal from "../components/DeleteProfileModal";

import { useAuth } from '../components/auth/Auth';



const Profile = () => {
    const [editMode, setEditMode] = useState(false);

    const auth = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
    }
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const onCancelPasswordChange = () => {
        setPasswordError(false);
        setEditMode((e) => !e);
        setPassword("");
        setPasswordConfirm("");
    }
    const onChangePassword = () => {
        debugger;
        if (password === passwordConfirm && password !== "") {
            setPasswordError(false);
            setEditMode((e) => !e);
            auth.fetch("http://localhost:8083/users/me/change-password", {
                method: "POST", headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ new_password: password })
            });

        }
        else {
            setPasswordError(true);
            setPassword("");
            setPasswordConfirm("");

        }
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="flex flex-col items-center w-[900px] my-8">
                    <div className="flex justify-between items-center w-[900px]">
                        <div className="h-16 w-16 bg-none rounded-full flex items-center justify-center">
                            <svg className="h-10 w-10 text-gray-600" viewBox="0 0 24 24" fill="#D9D9D9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="7" r="4"></circle>
                                <path d="M12 14a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z"></path>
                            </svg>
                        </div>
                        <div className="flex items-center">
                            <button onClick={toggleDeleteModal} className="text-sm font-semibold leading-6 text-black flex items-center px-4 py-2 mr-3 rounded-md bg-white bg-opacity-80 border-2 border-[#D9D9D9] hover:bg-gray-100 focus:outline-none" >
                                Delete Profile
                                <FontAwesomeIcon icon={faTrashCan} className="ml-3" />
                            </button>
                            {editMode ?
                                <>
                                    <button onClick={onCancelPasswordChange} className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none" >
                                        Cancel
                                        <FontAwesomeIcon icon={faPenToSquare} className="ml-3" />
                                    </button>
                                    <button onClick={onChangePassword} className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none" >
                                        Save Changes
                                        <FontAwesomeIcon icon={faPenToSquare} className="ml-3" />
                                    </button>
                                </>
                                : <button onClick={() => setEditMode(e => !e)} className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none" >
                                    Change Password
                                    <FontAwesomeIcon icon={faPenToSquare} className="ml-3" />
                                </button>
                            }
                        </div>
                    </div>

                    <div className="w-full h-0.5 bg-[#C8EDFD] my-3"></div>

                    <div className="flex flex-row w-full">
                        <div className="flex flex-col w-1/2 mr-4">
                            <p className="text-left mb-2">User name</p>
                            <div className="h-10 bg-[#ECF9FF] rounded-lg flex items-center justify-start">
                                <p className="text-left mx-4">{(auth.user == null) ? "" : auth.user.username}</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-row w-full mt-4">
                        {editMode ?
                            <>
                                <div className="flex flex-col w-1/2 mr-4">
                                    <p className="text-left mb-2">New Password</p>
                                    <div className="h-10 bg-[#ECF9FF] rounded-lg flex items-center justify-start">
                                        <input onChange={(e) => { setPassword(e.target.value) }} type="password" className="mx-4 bg-transparent border-none outline-none w-full" />
                                    </div>
                                </div>

                                <div className="flex flex-col w-1/2">
                                    <p className="text-left mb-2">Confirm Password</p>
                                    <div className="h-10 bg-[#ECF9FF] rounded-lg flex items-center justify-start">
                                        <input onChange={(e) => { setPasswordConfirm(e.target.value) }} type="password" className="mx-4 bg-transparent border-none outline-none w-full" />
                                    </div>
                                </div>
                                {passwordError &&
                                    <p>Passwords do not match!</p>
                                }
                            </>
                            : <></>
                        }
                    </div>
                </div>
            </div>
            {/* Render NewWorkflowModal component if isModalOpen is true */}
            {isDeleteModalOpen && <DeleteProfileModal onDelete={toggleDeleteModal} />}
        </>
    );
}

export default Profile;