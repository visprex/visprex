import React from 'react';
import logo from './logo.svg';
import { classNames } from '../../utils/classnames';

interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  return (
    <div className="w-full">
        <nav className="border-gray-700 bg-gray-800">
        <div className="mx-auto flex flex-wrap items-center justify-between p-4">
            <a href="/" className="mx-auto flex flex-col h-7 items-center">
                <img src={logo} className="mr-3 h-full" alt="Visprex Logo" />
            </a>
        </div>
        </nav>
    </div>
  );
};

export default NavBar;