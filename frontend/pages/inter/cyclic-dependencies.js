import React, { useEffect, useState } from "react";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import cyclicDependencyData from "../../utils/antipatterns/cyclic_dependency.json";
import { Graph } from "../../utils/graphAlgorithms";
import { useAtom } from "jotai";
import cyclicData from "../../public/data/cyclic-model.json";
import { graphDataAtom } from "../../utils/atoms";

/**
 * @todo This is broken
 */
const CyclicDependencies = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);
    const [sccs, setSccs] = useState();

    const getSccs = (cyclicData) => {
        var graph = new Graph();

        if (!cyclicData) {
            cyclicData = import("../../public/data/cyclic-model.json").then(
                (data) => {
                    const { links } = data;

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
                }
            );
        } else {
            const { links } = cyclicData;

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
        }
    };
    useEffect(() => {
        setGraphData(cyclicData);
        getSccs(cyclicData);
    }, []);

    function getColor(node) {
        let color = null;
        if (!sccs) {
            sccs = getSccs();
        } else {
            sccs.forEach((scc) => {
                if (scc.length > 1 && scc.includes(node.id)) {
                    color = `rgb(255,0,0)`;
                }
                if (color) return;
            });

            return color ?? `rgb(0,255,0)`;
        }
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
