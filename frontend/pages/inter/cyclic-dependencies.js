import React, { useEffect, useState } from "react";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { getNeighbors } from "../../utils/visualizer/nodeFunctions";
import cyclicDependencyData from "../../utils/antipatterns/cyclic_dependency.json";
import { Graph } from "../../utils/graphAlgorithms";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";

const CyclicDependencies = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);
    const [sccs, setSccs] = useState();

    const getSccs = () => {
        const { links } = graphData;
        var graph = new Graph();

        let res;
        if (typeof links[0].source === "string") {
            links.forEach((link) => {
                graph.insert(link.source, link.target);
            });
            res = graph.getStrongComponent(links[0].source);
        } else {
            links.forEach((link) => {
                graph.insert(link.source.id, link.target.id);
            });
            res = graph.getStrongComponent(links[0].source.id);
        }

        setSccs(res);
        return res;
    };
    useEffect(getSccs, []);

    function getColor(
        node,
        graphData,
        threshold,
        highlightNodes,
        hoverNode,
        opacityFn
    ) {
        if (highlightNodes && highlightNodes.has(node)) {
            if (node === hoverNode) {
                return `rgba(50,50,200,${opacityFn(node)})`;
            } else {
                return `rgba(0,200,200,${opacityFn(node)})`;
            }
        }

        let color = null;
        if (!sccs) {
            sccs = getSccs();
        }
        sccs.forEach((scc, index) => {
            if (scc.includes(node.id)) {
                if (scc.length >= threshold) {
                    color = `rgba(255,102,102,${opacityFn(node)})`;
                } else if (scc.length >= threshold / 2) {
                    color = `rgba(102,102,255,${opacityFn(node)})`;
                }
            }
            if (color) return;
        });

        return color ?? `rgba(100,100,100,${opacityFn(node)})`;
    }

    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={getColor}
                antipatternJSON={cyclicDependencyData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default CyclicDependencies;
