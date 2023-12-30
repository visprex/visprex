import React from 'react';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className="w-full">
      <nav className="border-gray-700 bg-gray-800">
        <div className="mx-auto flex flex-wrap items-center justify-between p-4">
          <a href="/" className="mx-auto flex h-7 flex-col items-center">
            <img
              src="/logo.png"
              className="mr-3 max-h-full"
              alt="Visprex Logo"
            />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
