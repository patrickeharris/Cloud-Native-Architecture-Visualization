import React from "react";
import Navbar from "../components/navigation/Navbar";

/**
 * The home page of the web app, returned as a react component, auto-routed by next to "/"
 * @returns {React.Component} The home page of the web app.
 */
export default function Home() {
    return (
        <div>
            <Navbar />
            <main>
                <h1 className="text-center pt-16 text-xl">guten morgen.</h1>
            </main>

            <footer></footer>
        </div>
    );
}
