import React, { useEffect, useState } from "react";
import NodeVisLayout from "../../components/antipatterns/NodeVisLayout";
import { getNeighbors } from "../../utils/visualizer/nodeFunctions";
import cyclicDependencyData from "../../utils/antipatterns/cyclic_dependency.json";
import { Graph } from "../../utils/graphAlgorithms";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";

const CyclicDependencies = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);
    const [sccs, setSccs] = useState();

    useEffect(() => {
        const { links } = graphData;
        var graph = new Graph();
        links.forEach((link) => {
            graph.insert(link.source, link.target);
        });
        setSccs(graph.getStrongComponent(links[0].source));
    }, []);

    function getColor(node, graphData, threshold, highlightNodes, hoverNode) {
        if (highlightNodes && highlightNodes.has(node)) {
            if (node === hoverNode) {
                return "rgb(50,50,200)";
            } else {
                return "rgb(0,200,200)";
            }
        }

        let color = null;
        sccs.forEach((scc, index) => {
            if (scc.includes(node.id)) {
                if (scc.length >= threshold) {
                    color = "rgb(100,0,0)";
                } else if (scc.length >= threshold / 2) {
                    color = "rgb(0,0,50)";
                }
            }
            if (color) return;
        });

        return color ?? "rgb(100,100,100)";
    }

    return (
        <div>
            <NodeVisLayout
                graphColorFn={getColor}
                antipatternJSON={cyclicDependencyData}
            ></NodeVisLayout>
        </div>
    );
};

export default CyclicDependencies;
