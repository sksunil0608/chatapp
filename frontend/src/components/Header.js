import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLogout = ()=>{
    sessionStorage.clear()
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div>
      <nav className="m-5">
        <div className="container flex items-center mx-auto justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-lg ml-10">
              <p className="text-5xl">
                <span className="red">V</span> - Chat
              </p>
            </div>
          </div>

          {/* Offcanvas Menu Button */}
          <button
            onClick={toggleMenu}
            className="inline-flex items-center w-10 h-10 justify-center"
          >
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
            {isMenuOpen ? (
              <img
                className="w-10 h-10 p-2 text-black border-2 border-solid rounded-lg border-black"
                src="/images/menu-close.png"
                alt="Close menu"
              />
            ) : (
              <img
                className="w-10 h-10 p-2 text-black border-2 border-solid rounded-lg border-black"
                src="/images/menu.png"
                alt="Open menu"
              />
            )}
          </button>

          {/* Offcanvas menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-gray-400 bg-opacity-75 z-50 mt-24">
              {/* Offcanvas menu content */}
              <div className="flex items-start justify-end h-screen">
                <div className="bg-white w-3/6 sm:w-2/6 md:w-2/6 lg:w-1/6 h-36 p-6 rounded-sm ">
                  <ul className="">
                    {/* My Account */}
                    <li>
                      <NavLink
                        to="/my-account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Account
                      </NavLink>
                    </li>
                    {/* My Account End */}

                    {/* Settings */}
                    <li>
                      <NavLink
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </NavLink>
                    </li>
                    {/* Settings End */}

                    {/* Logout */}
                    <li onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                    </li>
                    {/* Logout End */}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {/* Offcanvas menu end */}
        </div>
      </nav>
    </div>
  );
}
