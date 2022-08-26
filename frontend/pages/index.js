import React from "react";
import TypewritterText from "../components/general/TypewritterText";

/**
 * The home page of the web app, returned as a react component, auto-routed by next to "/"
 * @returns {React.Component} The home page of the web app.
 */
export default function Home() {
    return (
        <div className="w-screen flex flex-row justify-center pt-16">
            <TypewritterText text={"Welcome to our visualization tool."} />
        </div>
    );
}
