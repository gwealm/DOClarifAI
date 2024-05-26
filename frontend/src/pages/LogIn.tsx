import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";

const LogIn = () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const {state} = useLocation();
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(state && state.errorMsg?state.errorMsg:null);


    const onClickLogIn = async () => {
        if (username == null || password == null) {
            setErrorMsg("Username and Password are mandatory");
            return;
        }
        const errors = await auth.logIn(username, password);
        if (!errors) {
            navigate("/workflows");
        } else {
            setErrorMsg(errors);
        }
    }
    const LogInFeedBack = () => {
        return (
            errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>
        );

    }
    return (
        <div className='w-full h-full bg-white p-8'>
        <div className="flex justify-center items-center">
            <div className="border-[3px] border-blue-[#5583C5] rounded-lg w-[600px] min-h-[500px] h-auto mx-20 my-12 p-3 flex flex-col">
                <div className="flex justify-start items-center max-w-8xl bg-[#C8EDFD] rounded-md p-2">
                    <div className="flex">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img className="h-8 w-auto" src="./src/assets/weclarifai_logo.jpg" alt="" />
                        </a>
                    </div>
                    <div className="flex px-4">
                        <h2 className="text-lg font-semibold leading-6 text-gray-900">Log In</h2>
                    </div>
                </div>

                <div className="flex flex-col justify-center mx-8">
                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <label className="block text-gray-700 text-lg font-medium mb-2 text-left" htmlFor="username"> Username </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <label className="block text-gray-700 text-lg font-medium mb-2 text-left" htmlFor="Password"> Password </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="Password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={onClickLogIn}
                        className="text-md font-semibold leading-6 text-white mx-6 mt-6 py-2 rounded-md bg-[#1976D2] border border-gray-300 hover:bg-opacity-80 hover:text-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        Log In
                    </button>
                </div>
                <LogInFeedBack />
                <div className="relative my-6 mx-14 mt-12">
                    <div className="w-full h-0.5 bg-[#C8EDFD]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">Or</div>
                </div>

                <div className="flex justify-center items-center">

                    <a href="/register" className="w-1/2 text-sm font-semibold leading-6 text-white mx-6 p-2 rounded-md bg-[#1976D2] border hover:bg-opacity-80 hover:text-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                        Register here
                    </a>
                </div>
            </div>
        </div>
        </div>
    );
}

export default LogIn;