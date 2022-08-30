import React, { useState } from "react";
import NavItem from "./NavItem";

const tabs = [
    { name: "Home", href: "/" },
    { name: "2D Visualizer", href: "/visualizer/2d" },
    { name: "3D Visualizer", href: "/visualizer/3d" },
    { name: "Learn", href: "/learn" },
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
            className={`absolute top-0 left-0 w-fit h-full overflow-x-clip text-gray-50 ${props.className}`}
        >
            <nav
                className={`relative bg-opacity-50 sm:w-64 ease-in-out z-50 h-full duration-200 ${
                    navOpen
                        ? `bg-slate-900`
                        : `sm:-translate-x-[13rem] bg-slate-900`
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
