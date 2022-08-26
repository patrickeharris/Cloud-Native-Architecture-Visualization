import React, { useState } from "react";
import NavItem from "./NavItem";

const tabs = [
    { name: "Home", href: "/" },
    { name: "Visualizer", href: "/visualize" },
    { name: "Learn", href: "/learn" },
];

const Navbar = ({ ...props }) => {
    const [navOpen, setNavOpen] = useState();

    return (
        <div
            className={`absolute top-0 left-0 h-screen w-1/4 overflow-x-clip text-gray-50 ${props.className}`}
        >
            <nav
                className={`relative bg-opacity-50 h-full w-full ease-in-out duration-200 ${
                    navOpen
                        ? `bg-slate-900 shadow-lg`
                        : `-translate-x-[21rem] bg-transparent`
                }`}
            >
                <div className="absolute top-4 right-4 overflow-x-clip">
                    <button
                        className={`transform duration-200 ease-in-out ${
                            navOpen ? `rotate-90` : ``
                        }`}
                        onClick={() => setNavOpen(!navOpen)}
                    >
                        <i className="fa-solid fa-bars fa-xl"></i>
                    </button>
                </div>
                <ul className="flex flex-col p-8">
                    {tabs.map((tab, index) => (
                        <NavItem key={index} href={tab.href}>
                            {tab.name}
                        </NavItem>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
