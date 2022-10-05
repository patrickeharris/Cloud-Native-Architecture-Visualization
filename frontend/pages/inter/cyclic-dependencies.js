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

    function getColor(node, threshold) {
        let color = null;
        if (!sccs) {
            sccs = getSccs();
        }
        sccs.forEach((scc, index) => {
            if (scc.includes(node.id)) {
                if (scc.length >= threshold) {
                    color = `rgb(255,0,0)`;
                } else if (scc.length >= threshold / 2) {
                    color = `rgb(255,160,0)`;
                }
            }
            if (color) return;
        });

        return color ?? `rgb(0,255,0)`;
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
