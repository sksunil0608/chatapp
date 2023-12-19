import React, { useState } from "react";
import { NavLink } from "react-router-dom";
export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  return (
    <div>
      <nav className="bg-orange-500 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-white font-semibold text-lg ml-10 mr-10">
              V-Chat
            </div>
          </div>
          <div className="hidden lg:flex">
            <ul className="flex items-center space-x-4 mr-10">
              <li>
                <NavLink to="/" className="text-white hover:underline">
                  Chat
                </NavLink>
              </li>
              <li>
                <NavLink to="/login">
                  <button className="border-2 border-white-600 rounded-lg py-1 px-2 text-white">
                    Sign In
                  </button>
                </NavLink>
              </li>
              <li>
                <NavLink to="/signup">
                  <button className="border-2 rounded-lg py-1 px-2 text-white">
                    Signup
                  </button>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="lg:hidden">
            {/* Offcanvas menu button */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              )}
            </button>
            {/* Offcanvas menu */}
            {isMenuOpen && (
              <div className="fixed inset-0  bg-gray-400 bg-opacity-75 z-50 mt-16">
                <div className="flex items-start justify-end h-screen">
                  <div className="bg-white w-72 h-96 p-6 rounded-lg">
                    <ul className="space-y-4">
                      <li className="hover:bg-sky-400 hover:border-2 hover:rounded-lg hover:py-1.5 hover:px-2">
                        <NavLink
                          to="/"
                          className="text-gray-800 hover:text-bg-orange-500 transition duration-300"
                          onClick={toggleMenu}
                        >
                          Chat
                        </NavLink>
                      </li>
                      <li className="hover:bg-sky-400 hover:border-2 hover:rounded-lg hover:py-1.5 hover:px-2">
                        <NavLink
                          to="/login"
                          className="text-gray-800 transition duration-300"
                          onClick={toggleMenu}
                        >
                          Sign In
                        </NavLink>
                      </li>
                      <li className="hover:bg-sky-400 hover:border-2 hover:rounded-lg hover:py-1.5 hover:px-2">
                        <NavLink
                          to="/signup"
                          className="text-gray-800 hover:text-bg-orange-500 transition duration-300"
                          onClick={toggleMenu}
                        >
                          Signup
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
