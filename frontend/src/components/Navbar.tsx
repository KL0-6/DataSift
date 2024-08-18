import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const handleScroll = () => {
		if (window.scrollY > 0)
			setHasScrolled(true);
		else
			setHasScrolled(false);
	};

	useEffect(() =>
  {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<nav className={`fixed top-0 w-full z-10 bg-white transition-shadow ${hasScrolled ? "shadow-md" : ""}`}>
			<div className="container mx-auto flex justify-between items-center py-4 px-6 relative">
				<a href="/datasift" className="text-primary font-bold text-2xl">
					DataSift
				</a>

				<div className="hidden md:flex space-x-6">
					<a href="/datasift/try" className="hover:text-gray-600 transition-colors">Try it</a>
					<a href="https://github.com/KL0-6/DataSift/blob/main/documentation/Documentation.md" className="hover:text-gray-600 transition-colors">Documentation</a>
				</div>

				<div className="md:hidden">
					<button onClick={toggleMenu}>
						{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>
				</div>
			</div>

			<div className={`absolute top-0 left-0 w-full bg-white md:hidden transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} shadow-md`}>
				<div className="flex flex-col items-center py-4">
					<a href="/datasift/try" className="py-2 hover:text-gray-600 hover:bg-purple-100 transition-colors">Try it</a>
					<a href="https://github.com/KL0-6/DataSift/blob/main/documentation/Documentation.md" className="py-2 hover:text-gray-600 hover:bg-purple-100 transition-colors">Documentation</a>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
