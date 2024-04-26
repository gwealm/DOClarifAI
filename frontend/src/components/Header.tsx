import React from 'react';

import { ModeToggle } from './ModeToggle';
import { Link } from 'react-router-dom';

const Header = ( {isLoggedIn, onLogout} ) => {

    return (
        <header className="bg-[#C8EDFD] shadow-md">
            <nav className="flex max-w-8xl items-center justify-between p-6 lg:px-8 lg:py-3" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">WeClarifai</span>
                    <img className="h-12 w-auto" src="./src/assets/weclarifai_logo.jpg" alt="" />
                    </a>
                </div>

                { isLoggedIn ? (
                    <>
                    <div className="hidden lg:flex lg:gap-x-12">
                        <a href="/about-us" className="text-sm font-semibold leading-6 text-gray-900">
                        About Us
                        </a>
                        <Link to="/workflows" className="text-sm font-semibold leading-6 text-gray-900">
                        Workflows
                        </Link>
                    </div>
                    <div className="flex lg:flex-1 justify-end items-center space-x-8">
                        <Link to="/profile">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="7" r="4"></circle>
                                    <path d="M12 14a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z"></path>
                                </svg>
                            </div>
                            <span className="text-sm text-gray-900">John Doe</span>
                        </div>
                        </Link>
            
                        <Link to="/login" onClick={onLogout} className="text-sm font-semibold leading-6 text-white px-4 py-2 rounded-md bg-[#447282] border border-gray-300 hover:bg-opacity-70 hover:text-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                            Log out
                        </Link>
                    </div>
                    </>
                ) : (
                    <div className="flex lg:flex-1 justify-end items-center space-x-8">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-white px-4 py-2 rounded-md bg-[#447282] border border-gray-300 hover:bg-opacity-70 hover:text-white focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                            Log in
                        </Link>
                    </div>
                )}
                <div className="hidden flex lg:flex lg:gap-x-12 px-2">
                    <ModeToggle />
                </div>
            </nav>
      </header>
    );
}

export default Header;