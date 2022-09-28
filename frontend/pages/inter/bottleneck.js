import React from "react";
import bottleneckData from "../../utils/antipatterns/bottleneck_service.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { graphDataAtom } from "../../utils/atoms";
import { useAtom } from "jotai";
import { getNeighbors } from "../../utils/visualizer/nodeFunctions";

const Bottleneck = () => {
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
                antipatternJSON={bottleneckData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Bottleneck;
