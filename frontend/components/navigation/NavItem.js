import React from "react";
import Link from "next/link";

const NavItem = ({ ...props }) => {
    return (
        <li
            className={`my-6 underline underline-offset-2 decoration-yellow-200 ${props.className}`}
        >
            <Link href={props.href ? props.href : "/"}>
                <a className="flex flex-col items-center">
                    <span className="text-base text-center font-hubballi">
                        {props.children}
                    </span>
                </a>
            </Link>
        </li>
    );
};

export default NavItem;
