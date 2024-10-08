import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from './auth/Auth';
import MiniAboutMe from './MiniAboutMe';

const Header = () => {
    const auth = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [, setWebsocket] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility
    const [currentURL, setCurrentURL] = useState("");
    
    useEffect(() => {
        setCurrentURL(window.location.pathname);
    }, []);

    useEffect(() => {
        if (auth.isLoggedIn) {
            getUserId().then((user_id) => {
                if (user_id) {
                    const ws = new WebSocket(`/importer/ws/${user_id}`);
                    console.log("Connecting to websocket");
                    ws.onmessage = (event) => {
                        const newNotification = event.data;
                        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
                    };
                    setWebsocket(ws);
                    console.log(ws);
                    console.log("Connected to websocket");

                    return () => {
                        if (ws) {
                            ws.close();
                        }
                    };
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.isLoggedIn]);

    const getUserId = async () => {
        if (auth.user != null) {
            return auth.user.id;
        }

        const response = await auth.fetch("/auth/users/me", {
            method: "GET",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const userInfo = await response.json();
            auth.setUser(userInfo);
            return userInfo.id;
        }

        return null;
    };

    return (
        <header className={`${currentURL == "/" ? "bg-gradient-to-r from-[#f9fdfef8] to-[#65BEE5]" : "bg-[#C8EDFD]" }`}>
            <nav className="flex max-w-8xl items-center justify-between p-6 lg:px-8 lg:py-3" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">WeClarifai</span>
                        <img className="h-16 w-auto" src="logotipo.png" alt="" />
                    </a>
                </div>

                {auth.isLoggedIn ? (
                    <>
                        <div className="hidden lg:flex lg:gap-x-12">
                            <a href="/about-us" className="text-sm font-semibold leading-6 text-gray-900">
                                About Us
                            </a>
                            <Link to="/workflows" className="text-sm font-semibold leading-6 text-gray-900">
                                Workflows
                            </Link>
                            <Link to="/schemas" className="text-sm font-semibold leading-6 text-gray-900">
                                Schemas
                            </Link>
                            <Link to="/templates" className="text-sm font-semibold leading-6 text-gray-900">
                                Templates
                            </Link>
                        </div>
                        <div className="flex lg:flex-1 justify-end items-center space-x-8">
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
                                >
                                    <img
                                        className="h-6 w-6"
                                        src="https://www.svgrepo.com/show/31480/notification-bell.svg"
                                        alt="Notifications"
                                    />
                                    {/* Notification count */}
                                    {notifications.length >= 0 && (
                                        <span className="absolute top-0 left-3 inline-block bg-red-500 text-white text-xs font-semibold px-1.5 rounded-full">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            {notifications.length === 0 && (
                                                <div className="px-4 py-2 text-sm text-gray-700">
                                                    No new notifications
                                                </div>
                                            )}
                                            {notifications.map((notification, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {notification}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link to="/profile">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="7" r="4"></circle>
                                            <path d="M12 14a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z"></path>
                                        </svg>
                                    </div>
                                    <MiniAboutMe />
                                </div>
                            </Link>
                            <Link to="/login" onClick={auth.onLogout} className="text-sm font-semibold leading-6 text-white px-4 py-2 rounded-md bg-[#447282] border border-gray-300 hover:bg-opacity-70 hover:text-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                                Log out
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex lg:flex-1 justify-end items-center space-x-8">
                        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded  hover:bg-opacity-70">
                            Log in
                        </Link>
                        <Link to="/register" className="text-sm font-semibold leading-6 text-blue-500 px-4 py-2 rounded-md bg-white border hover:bg-opacity-70 focus:outline-none focus:border-blue-500 focus:ring">
                            Sign up
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;