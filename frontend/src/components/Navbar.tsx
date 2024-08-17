import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-10 bg-white transition-shadow ${hasScrolled ? 'shadow-line' : ''}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6 relative">
        {/* Brand */}
        <div className="text-primary font-bold text-2xl">
          DataSift
        </div>

        {/* Menu Links - Hidden on Mobile */}
        <div className="hidden md:flex space-x-6">
          <a href="#test" className="hover:text-gray-600 transition-colors">test</a>
        </div>

        {/* Hamburger Menu - Visible on Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      {/* Animated Thinner Purple Line */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-500 ${hasScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
    </nav>
  );
};

export default Navbar;
