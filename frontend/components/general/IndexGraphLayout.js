import React, { useEffect, useRef, useState } from "react";
import Graph from "../graph/GraphWrapper";
import GraphMenu from "../graph/rightMenu/GraphMenu";
import { InfoBox } from "../graph/clickMenu/InfoBox";
import Router, { useRouter } from "next/router";
import StepDescription from "./StepDesc";
import { graphDataAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import { getNeighbors } from "../../utils/visualizer/nodeFunctions";

const IndexVisLayout = ({ step }) => {
    /**
     * This acts as a reference to the internal force graph to call methods
     * @type {React.MutableRefObject<ForceGraphMethods>}
     * */
    const graphRef = useRef();
    const [graphData] = useAtom(graphDataAtom);
    const [dimensions, setDimensions] = useState();

    useEffect(() => {
        if (typeof window == "undefined") return;
        setDimensions({
            width: window.innerWidth / 2,
            height: window.innerHeight / 1.5,
        });
    }, []);
    const { asPath } = useRouter();

    function getColor(node, threshold) {
        let { nodes, links } = graphData;
        let numNeighbors = getNeighbors(node, links).nodes.length;

        if (numNeighbors > threshold) {
            return `rgb(255,0,0)`;
        }
        if (numNeighbors > threshold / 2) {
            return `rgb(255,160,0)`;
        }

        return `rgb(0,255,0)`;
    }
    if (typeof graphData == "undefined" || typeof window == "undefined") {
        return <></>;
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen relative z-10 gap-8">
            <StepDescription step={step} className="" />

            <div className="relative h-fit w-fit bg-white bg-opacity-5 rounded-lg">
                <Graph
                    graphRef={graphRef}
                    graphColorFn={getColor}
                    key={"graph" + asPath}
                    graphDimensions={dimensions}
                />
                <InfoBox />
                <GraphMenu graphRef={graphRef} />
            </div>
        </div>
    );
};

export default IndexVisLayout;
