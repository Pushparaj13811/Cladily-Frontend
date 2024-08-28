import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-primaryBackground font-heading sticky z-50 top-0 bg-primary">
            <nav className="px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    {/* Logo */}
                    <Link to="/" className="flex items-center text-secondary font-bold text-2xl">
                        Logo
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex lg:space-x-4">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `py-2 px-4 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                `py-2 px-4 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                            }
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/categories"
                            className={({ isActive }) =>
                                `py-2 px-4 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                            }
                        >
                            Categories
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `py-2 px-4 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `py-2 px-4 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                            }
                        >
                            Contact
                        </NavLink>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:flex lg:w-1/3">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full py-2 px-4 rounded-lg border border-secondaryBackground focus:outline-none focus:ring-2 focus:ring-[#c8f1d9]"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary">
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center space-x-4 lg:space-x-6 lg:order-2">
                        <Link to="/profile" className="text-secondary hover:text-tertery">
                            <FaUser size={20} />

                        </Link>
                        <Link to="/wishlist" className="text-secondary hover:text-tertery">
                            <FaHeart size={20} />
                        </Link>
                        <Link to="/cart" className="text-secondary hover:text-tertery">
                            <FaShoppingCart size={20} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-secondary rounded-lg hover:text-tertery focus:outline-none focus:ring-2 focus:ring-terteryText"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col mt-4 font-medium">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/products"
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/categories"
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `block py-2 pr-4 pl-3 text-secondary ${isActive ? "text-tertery" : "hover:text-tertery"}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
