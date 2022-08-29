import React from "react";
import GraphComponent from "../../components/graph/Graph";

const ThreeD = () => {
    return (
        <div className="flex flex-row justify-center items-center w-full h-screen relative z-10">
            <GraphComponent></GraphComponent>
        </div>
    );
};

export default ThreeD;
