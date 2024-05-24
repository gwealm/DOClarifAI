import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/Auth";

const Register = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    const onClickRegister = async () => {
        if (username === null || password === null) {
            setErrorMsg("Username and Password are mandatory");
            return;
        }
        const errors = await auth.register(username, password);
        if (!errors) {
            navigate("/workflows");
        } else {
            setErrorMsg(errors);
        }
    }

    const RegisterFeedBack = () => {
        return (
            errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>
        );
    };

    return (
        <div className="flex justify-center items-center">
            <div className="border-[3px] border-[#C8EDFD] rounded-lg w-[600px] min-h-[600px] h-auto mx-20 my-5 p-3 flex flex-col">
                <div className="flex justify-start items-center max-w-8xl bg-[#C8EDFD] rounded-md p-2">
                    <div className="flex">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img className="h-8 w-auto" src="./src/assets/weclarifai_logo.jpg" alt="" />
                        </a>
                    </div>
                    <div className="flex px-4">
                        <h2 className="text-lg font-semibold leading-6 text-gray-900">Register</h2>
                    </div>
                </div>

                <div className="flex flex-col justify-center mx-8">
                    <div className="px-4 sm:px-6 py-4">
                        <label className="block text-gray-700 text-md font-medium mb-2 text-left" htmlFor="Name"> Name </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="Name"
                            type="text"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="px-4 sm:px-6 py-4">
                        <label className="block text-gray-700 text-md font-medium mb-2 text-left" htmlFor="username"> Username </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="px-4 sm:px-6 py-4">
                        <label className="block text-gray-700 text-md font-medium mb-2 text-left" htmlFor="Password"> Password </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="Password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex items-center">
                        <input
                            className="form-checkbox h-4 w-4 text-blue-500"
                            type="checkbox"
                            value=""
                            id="checkboxDefault" />
                        <label
                            className="text-xs inline-block ps-[0.15rem] hover:cursor-pointer mx-2">
                            I agree to the
                            <a href="#" className="text-gray-700 underline"> terms & policy</a>
                        </label>
                    </div>
                    <button
                        onClick={onClickRegister}
                        className="text-md font-semibold leading-6 text-white mx-6 py-2 rounded-md bg-[#1976D2] border border-gray-300 hover:bg-opacity-80 hover:text-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                        Register
                    </button>
                </div>
                <RegisterFeedBack />


                <div className="relative my-6 mx-14 mt-10">
                    <div className="w-full h-0.5 bg-[#C8EDFD]"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">Or</div>
                </div>

                <div className="flex justify-between items-center mx-8">
                    <button className="flex items-center justify-center w-1/2 text-sm font-semibold leading-6 text-black mx-6 p-2 rounded-md bg-white border-2 border-[#D9D9D9] hover:bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                        <img className="h-6 w-auto me-3" src="./src/assets/google_logo.png" alt="" />
                        Sign up with Google
                    </button>

                    <button className="w-1/2 text-sm font-semibold leading-6 text-white mx-6 p-2 rounded-md bg-[#1976D2] border hover:bg-opacity-80 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                        Log in here
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;