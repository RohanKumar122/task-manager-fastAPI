import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../utils/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); 
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center">
      <img src={logo} alt="Logo" className="w-6 h-6 mx-2" />
      <h1 className="text-xl">Task Manager</h1>
      </div>
      <div className="relative">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center justify-center p-2 rounded-md bg-blue-700 hover:bg-blue-600 focus:outline-none"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
            <button
              onClick={() => handleNavigation("/")}
              className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/login")}
              className="block px-4 py-2 w-full text-left text-green-600 hover:bg-gray-100"
            >
              Login
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token"); 
                window.location.href = "/login"; 
              }}
              className="text-red-500 hover:text-red-700 block px-4 py-2 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
