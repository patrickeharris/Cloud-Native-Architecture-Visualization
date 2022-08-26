import React from "react";

const bgGradient = {
    backgroundColor: "rgb(2,0,36)",
    backgroundImage:
        "linear-gradient(208deg, rgba(2,0,36,1) 0%, rgba(32,32,37,1) 34%, rgba(9,9,121,1) 80%, rgba(0,212,255,1) 100%)",
    backgroundSize: "cover",
};

const gradientBackground = {
    backgroundColor: `rgb(2,0,36)`,
    backgroundImage: `radial-gradient(at 69% 76%, rgb(2,0,36) 0, transparent 57%), 
                      radial-gradient(at 35% 78%, rgb(32,32,37) 0, transparent 82%), 
                      radial-gradient(at 2% 94%, rgb(9,9,121) 0, transparent 69%), 
                      radial-gradient(at 82% 46%, rgb(32,32,37) 0, transparent 38%), 
                      radial-gradient(at 13% 86%, rgb(245, 245, 244) 0, transparent 98%), 
                      radial-gradient(at 85% 4%, rgb(0,0,0) 0, transparent 100%), 
                      radial-gradient(at 10% 30%, rgb(0,212,255) 0, transparent 39%)`,
    backgroundSize: "cover",
};

const Layout = ({ children }) => {
    return (
        <div
            className="w-screen h-screen text-gray-50"
            style={gradientBackground}
        >
            {children}
        </div>
    );
};

export default Layout;
