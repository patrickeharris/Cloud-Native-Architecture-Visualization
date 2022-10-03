import React from "react";
import megaserviceData from "../../utils/antipatterns/mega_service.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { getNeighbors } from "../../utils/visualizer/nodeFunctions";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";

const Megaservice = () => {
    const [graphData] = useAtom(graphDataAtom);

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

    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={getColor}
                antipatternJSON={megaserviceData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Megaservice;