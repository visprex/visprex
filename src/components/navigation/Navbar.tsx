import React from 'react';
import logo from './logo.svg';

interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className="w-full">
        <nav className="border-gray-700 bg-gray-800">
        <div className="mx-auto flex flex-wrap items-center justify-between p-4">
            <a href="/" className="mx-auto flex h-7 flex-col items-center">
              <img src={logo} className="mr-3 h-auto max-h-full w-auto" alt="Visprex Logo" />
            </a>
        </div>
        </nav>
    </div>
  );
};

export default NavBar;