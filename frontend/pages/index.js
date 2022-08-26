import React from "react";

/**
 * The home page of the web app, returned as a react component, auto-routed by next to "/"
 * @returns {React.Component} The home page of the web app.
 */
export default function Home() {
    return (
        <div>
            <main>
                <h1 className="text-center pt-16 text-xl">guten morgen.</h1>
            </main>
        </div>
    );
}
