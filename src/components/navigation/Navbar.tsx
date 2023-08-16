import React from 'react';
import logo from '../../logo.svg'

interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  return (
    <nav className="border-gray-700 bg-gray-800">
        <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between p-4">
            <a href="/" className="ml-5 flex h-7 items-center">
                <img src={logo} className="mr-3 h-full" alt="Flowbite Logo" />
            </a>
            <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden" aria-controls="navbar-solid-bg" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
            </div>
        </div>
    </nav>
  );
};

export default NavBar;