import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscClose } from "react-icons/vsc";
import useNavbarToggle from "../hooks/useNavbarToggle";
import useScrollHideNavbar from "../hooks/useScrollhideNavbar";
import LoginModal from "../components/LoginModal.jsx";

const NavbarPage = () => {
    const { isOpen, toggleMenu, menuRef } = useNavbarToggle();
    const showNavbar = useScrollHideNavbar();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleOpenLogin = () => {
        setIsLoginOpen(true);
        if (isOpen) {
            toggleMenu();
        }
    };

    const handleCloseLogin = () => {
        setIsLoginOpen(false);
    };

    return (
        <motion.nav
            className={`fixed top-0 left-0 w-full text-white z-50 transition-colors ${showNavbar ? "block" : "hidden"} supports-[backdrop-filter]:backdrop-blur-md md:bg-transparent`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: showNavbar ? 1 : 0, y: showNavbar ? 0 : -50 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
        >
            <nav className="max-w-8xl mx-auto px-6 py-6 flex items-center justify-between md:px-12 md:py-8">
                <div className="text-xl font-bold tracking-tight">
                    <Link to="/" className="text-white hover:text-gray-300">
                        DEVSIGN
                    </Link>
                </div>

                {/* Desktop nav */}
                <ul className="hidden md:flex space-x-6 text-lg font-medium text-white items-cnenter">
                    <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
                    <div className="relative group">
                      <li>
                        <span className="hover:text-gray-300 cursor-pointer">Board</span>
                      </li>
                      <ul className="absolute left-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 z-50">
                        <li><Link to="/board/notice" className="block px-4 py-2 hover:bg-gray-700">공지</Link></li>
                        <li><Link to="/board/performance" className="block px-4 py-2 hover:bg-gray-700">실적</Link></li>
                        <li><Link to="/board/study" className="block px-4 py-2 hover:bg-gray-700">학습</Link></li>
                        <li><Link to="/board/free" className="block px-4 py-2 hover:bg-gray-700">자유</Link></li>
                        <li><Link to="/board/project" className="block px-4 py-2 hover:bg-gray-700">프로젝트 진행</Link></li>
                      </ul>
                    </div>
                    <li>
                        <button
                            className="hover:text-gray-300 focus:outline-none"
                            onClick={handleOpenLogin}
                            type="button"
                        >
                            LogIn
                        </button>
                    </li>
                    <li><Link to="/signup" className="hover:text-gray-300">SignUp</Link></li>
                </ul>

                {/* Mobile nav */}
                <button onClick={toggleMenu} className="text-white md:hidden">
                    {isOpen ? (
                        <VscClose className="w-6 h-6" strokeWidth={1} />
                    ) : (
                        <GiHamburgerMenu className="w-6 h-6" />
                    )}
                </button>
            </nav>

            {isOpen && (
                <div className="inset-0 backdrop-blur-sm md:hidden px-12 pb-6" ref={menuRef}>
                    <ul className="flex flex-col space-y-3 text-white text-sm font-bold">
                        <li><Link to="/about" onClick={toggleMenu} className="hover:text-gray-300">About</Link></li>
                        <li><Link to="/board" onClick={toggleMenu} className="hover:text-gray-300">Board</Link></li>
                        <li>
                            <button
                                className="text-left hover:text-gray-300 focus:outline-none"
                                onClick={handleOpenLogin}
                                type="button"
                            >
                                LogIn
                            </button>
                        </li>
                        <li><Link to="/signup" onClick={toggleMenu} className="hover:text-gray-300">SignUp</Link></li>
                    </ul>
                </div>
            )}
            <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} />
        </motion.nav>
    );
};

export default NavbarPage;
