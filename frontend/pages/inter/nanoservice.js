import React from "react";
import nanoData from "../../utils/antipatterns/nano_service.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";

function getDegreeOut(node, links) {
    return {
        nodeLinks: links.filter((link) => {
            return link.source.id === node.id;
        }),
        nodes: links.reduce(
            (neighbors, link) => {
                if (link.source.id === node.id) {
                    neighbors.push(link.target);
                }
                return neighbors;
            },
            [node]
        ),
    };
}

const Nanoservice = () => {
    const [graphData] = useAtom(graphDataAtom);

    function getColor(node, threshold) {
        let { nodes, links } = graphData;
        let numNeighbors = getDegreeOut(node, links).nodes.length;

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
                antipatternJSON={nanoData}
                hasThreshold={true}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Nanoservice;
