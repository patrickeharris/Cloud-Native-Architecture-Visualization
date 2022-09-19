import React from "react";
import NodeVisLayout from "../../components/antipatterns/NodeVisLayout";
import { getNeighbors } from "../../utils/visualizer/nodeFunctions";
import cyclicDependencyData from "../../utils/antipatterns/cyclic_dependency.json";

const CyclicDependencies = () => {
    return (
        <div>
            <NodeVisLayout
                graphColorFn={getColor}
                antipatternJSON={cyclicDependencyData}
            ></NodeVisLayout>
        </div>
    );
};

function getColor(node, graphData, threshold, highlightNodes, hoverNode) {
    let { nodes, links } = graphData;
    let numNeighbors = getNeighbors(node, links).nodes.length;

    if (highlightNodes && highlightNodes.has(node)) {
        if (node === hoverNode) {
            return "rgb(50,50,200)";
        } else {
            return "rgb(0,200,200)";
        }
    }

    if (numNeighbors > threshold) {
        return "rgb(255,0,0)";
    }
    if (numNeighbors > threshold / 2) {
        return "rgb(255,160,0)";
    }

    return "rgb(0,255,0)";
}

export default CyclicDependencies;
