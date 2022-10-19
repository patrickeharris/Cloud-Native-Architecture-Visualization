import React from "react";
import duplicatedServiceData from "../../utils/antipatterns/duplicated_service.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { getNeighbors, getDuplicates } from "../../utils/visualizer/nodeFunctions";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";

const DuplicatedService = () => {
    const [graphData] = useAtom(graphDataAtom);

    function getColor(node, threshold) {
        let { nodes, links } = graphData;
        let { duplicates } = getDuplicates(node, nodes);
        //let numNeighbors = getNeighbors(node, links).nodes.length;
        /*
        if (numNeighbors > threshold) {
            return `rgb(255,0,0)`;
        }
        if (numNeighbors > threshold / 2) {
            return `rgb(255,160,0)`;
        }
        */
        if(duplicates > 1){
            return `rgb(255,0,0)`;
        }
        return `rgb(0,255,0)`;
    }

    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={getColor}
                antipatternJSON={duplicatedServiceData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default DuplicatedService;