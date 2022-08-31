import React from "react";
import * as ButtonFns from "../../utils/visualizer/buttonFns";

/**
 * A styled graph button with a function to interface with the graph.
 * @param {Object} props the props passed to this object
 * @param {Function} props.onClick on click function
 * @param {String} props.children text to display
 * @returns {React.Component} A single, functional button for the graph
 */
const GraphButton = ({ onClick, ...props }) => {
    return (
        <button
            className={`border-2 rounded-lg px-2 py-1 text-center text-sm mx-2 transition hover:bg-gradient-to-br hover:from-cyan-800 hover:to-green-800 bg-slate-900 bg-opacity-40 border-opacity-40 ${props.className}`}
            onClick={onClick}
        >
            {props.children}
        </button>
    );
};

const GraphButtonMenu = () => {
    return (
        <div className="flex flex-col gap-2 w-fit h-fit">
            <GraphButton onClick={ButtonFns.importGraph}>Import</GraphButton>
            <GraphButton onClick={ButtonFns.exportGraph}>Export</GraphButton>
            <GraphButton onClick={() => window.requestAnimationFrame(download)}>
                Screenshot
            </GraphButton>
            <GraphButton onClick={ButtonFns.toggleTrack}>
                Track Menu
            </GraphButton>
            <GraphButton onClick={ButtonFns.forceReset}>Reset</GraphButton>
        </div>
    );
};

export default GraphButtonMenu;
