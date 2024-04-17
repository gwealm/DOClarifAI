import React from 'react';

import { ModeToggle } from './ModeToggle';

const Header = () => {

    return (
        <header className="bg-[#C8EDFD] shadow-md">
            <nav className="flex max-w-8xl items-center justify-between p-6 lg:px-8 lg:py-3" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">WeClarifai</span>
                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                    </a>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                    Workflows
                    </a>
                </div>
                <div className="flex lg:flex-1 justify-end items-center space-x-8">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="7" r="4"></circle>
                                <path d="M12 14a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z"></path>
                            </svg>
                        </div>
                        <span className="text-sm text-gray-900">John Doe</span>
                    </div>
                    <button className="text-sm font-semibold leading-6 text-gray-900 px-4 py-2 rounded-md bg-[#B65EED] border border-gray-300 hover:bg-gray-100 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
                        Log out
                    </button>
                </div>

                <div className="hidden flex lg:flex lg:gap-x-12 px-2">
                    <ModeToggle />
                </div>
            </nav>
      </header>
    );
}

export default Header;