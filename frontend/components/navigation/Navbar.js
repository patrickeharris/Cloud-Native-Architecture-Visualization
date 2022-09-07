import React, { useState } from "react";
import NavItem from "./NavItem";

const tabs = [
    { name: "3D Visualizer", href: "/visualizer/3d" },
    {
        section: "Anti-patterns",
        tabs: [
            { name: "Cyclical Dependencies", href: "/antipatterns" },
            { name: "Knot", href: "/antipatterns" },
            { name: "Bottleneck", href: "/antipatterns" },
        ],
    },
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
            className={`fixed top-0 left-0 w-fit h-screen overflow-x-clip text-gray-50 z-50 ease-in-out duration-200 ${
                navOpen ? `` : `sm:-translate-x-[13rem]`
            } ${props.className}`}
        >
            <nav
                className={`relative isolate bg-opacity-50 sm:w-64 h-full bg-slate-900`}
            >
                <div className="absolute top-4 right-4 overflow-x-clip z-50">
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
                    {tabs.map((tab, index) =>
                        tab.section ? (
                            <div
                                key={tab.section}
                                className="my-3 text-gray-300 text-sm"
                            >
                                <h2 className="uppercase">{tab.section}</h2>
                                {tab.tabs.map((tab, index) => (
                                    <NavItem key={index} href={tab.href}>
                                        {tab.name}
                                    </NavItem>
                                ))}
                            </div>
                        ) : (
                            <NavItem key={index} href={tab.href}>
                                {tab.name}
                            </NavItem>
                        )
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
