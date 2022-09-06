import React, { useState } from "react";
import NavItem from "./NavItem";

const tabs = [
    { name: "Home", href: "/" },
    { name: "3D Visualizer", href: "/visualizer/3d" },
    { name: "Anti-patterns", href: "/antipatterns" },
];

/**
 * A navbar to be displayed on the left side of the screen, pops out
 * when clicking on the bars with a small animation.
 * @param {Object} props The props passed to this object
 * @returns {React.Component} The navbar populated with tabs
 */
const Navbar = ({ ...props }) => {
    const [navOpen, setNavOpen] = useState();

    return (
        <div
            className={`fixed top-0 left-0 w-fit h-screen overflow-x-clip text-gray-50 z-50 ${props.className}`}
        >
            <nav
                className={`relative bg-opacity-60 sm:w-64 ease-in-out z-50 h-full duration-200 bg-slate-900 ${
                    navOpen ? `` : `sm:-translate-x-[13rem] `
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
                <ul className={`flex flex-col p-8 ${navOpen ? `` : `hidden`}`}>
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
