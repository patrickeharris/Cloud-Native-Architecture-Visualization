import React, { useRef, useState } from "react";
import Graph from "../graph/GraphWrapper";
import GraphMenu from "../graph/rightMenu/GraphMenu";
import { Menu } from "../graph/clickMenu/Menu";
import { InfoBox } from "../graph/clickMenu/InfoBox";
import AntiPatternDescription from "./AntiPatternDescription";

const NodeVisLayout = ({ graphColorFn, antipatternJSON }) => {
    /**
     * This acts as a reference to the internal force graph to call methods
     * @type {React.MutableRefObject<ForceGraphMethods>}
     * */
    const graphRef = useRef();

    return (
        <div className="flex flex-row justify-center items-center w-full h-screen relative z-10">
            <GraphMenu graphRef={graphRef} />
            <Graph graphRef={graphRef} graphColorFn={graphColorFn} />
            <AntiPatternDescription data={antipatternJSON} />
            <InfoBox />
        </div>
    );
};

export default NodeVisLayout;
