import React from "react";
import bottleneckData from "../../utils/antipatterns/bottleneck_service.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { graphDataAtom } from "../../utils/atoms";
import { useAtom } from "jotai";

function getDegreeIn(node, links) {
    return {
        nodeLinks: links.filter((link) => {
            return link.target.id === node.id;
        }),
        nodes: links.reduce(
            (neighbors, link) => {
                if (link.target.id === node.id) {
                    neighbors.push(link.source);
                }
                return neighbors;
            },
            [node]
        ),
    };
}

const Bottleneck = () => {
    const [graphData] = useAtom(graphDataAtom);

    function getColor(node, threshold) {
        let { nodes, links } = graphData;
        let numNeighbors = getDegreeIn(node, links).nodes.length;

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
