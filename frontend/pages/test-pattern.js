import React, { useEffect, useState } from "react";
import InterNodeVisLayout from "../components/antipatterns/InterNodeVisLayout";
import { Graph } from "../utils/graphAlgorithms";
import { useAtom } from "jotai";
import { graphDataAtom } from "../utils/atoms";
import { useRouter } from "next/router";
import { getNeighborsLinks } from "../utils/visualizer/nodeFunctions";

const TestPattern = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);
    const router = useRouter();
    const { pattern, key } = router.query;
    const [colorFn, setColorFn] = useState();
    const [hasThreshold, setHasThreshold] = useState(false);
    const [antipatternJSON, setAntipatternJson] = useState();

    useEffect(() => {
        if (!pattern) return;
        getGraphDataAndColorFn(pattern, key).then((arr) => {
            const [data, colorFn, hasThreshold, antiJson] = arr;
            setGraphData(data);
            setColorFn(() => {
                return colorFn;
            });
            setHasThreshold(hasThreshold);
            setAntipatternJson(antiJson);
        });
    }, [router.query, key, pattern, setGraphData]);

    if (!pattern || !graphData) {
        return <></>;
    }

    if (!graphData || typeof colorFn !== "function" || !antipatternJSON) {
        return <></>;
    }

    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={colorFn}
                antipatternJSON={antipatternJSON}
                hasThreshold={hasThreshold}
            ></InterNodeVisLayout>
        </div>
    );
};

export default TestPattern;

const getGraphDataAndColorFn = async (pattern, key) => {
    let data = null;
    let hasThreshold = false;
    let antiJson = null;
    let colorFn = defColorFn;

    switch (pattern) {
        case "cyclic-deps-s":
            data = await import("../public/data/cyclic-verysimple.json");
            antiJson = await import(
                "../utils/antipatterns/cyclic_dependency.json"
            );
            break;
        case "knot-s":
            data = await import("../public/data/knot-simple.json");
            antiJson = await import("../utils/antipatterns/the_knot.json");
            hasThreshold = true;
            break;
        case "knot-c":
            data = await import("../public/data/test-knot.json");
            antiJson = await import("../utils/antipatterns/the_knot.json");
            hasThreshold = true;
            break;
        case "cyclic-deps-c":
            data = await import("../public/data/train-ticket.json");
            antiJson = await import(
                "../utils/antipatterns/cyclic_dependency.json"
            );
            break;
        case "practice":
            data = await import("../public/data/cyclic-simple.json");
            antiJson = await import(
                "../utils/antipatterns/chatty_service.json"
            );
            break;
        default:
            data = await import("../public/data/red-hat.json");
            antiJson = await import("../utils/antipatterns/the_knot.json");
            break;
    }

    const sccs = getSccs(data);

    if (
        (pattern === "cyclic-deps-s" &&
            key === "494aea21d1227ac035a624d176acd8d0") ||
        (pattern == "cyclic-deps-c" &&
            key === "1ed661fc2f476ba1c19ea5df0bc458e3")
    ) {
        colorFn = (node) => {
            return getCyclicColor(node, sccs);
        };
    } else if (
        (pattern === "knot-s" && key === "9386d9609cd10e2b69b321d36b754d6c") ||
        (pattern == "knot-c" && key === "51667b0a3cddb50e4b05c4bc4ce97c3a")
    ) {
        colorFn = (node, threshold) => {
            return getKnotColor(node, threshold, data);
        };
    }
    return [data, colorFn, hasThreshold, antiJson];
};

const getSccs = (data) => {
    var graph = new Graph();

    if (!data) {
        return null;
    }
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
    return res;
};

const getKnotColor = (node, threshold, data) => {
    const { links } = data;
    let totalLinks = getNeighborsLinks(node, links);

    if (totalLinks > threshold) {
        return `rgb(255,0,0)`;
    }
    return `rgb(0,255,0)`;
};

const getCyclicColor = (node, sccs) => {
    let color = null;
    sccs.forEach((scc) => {
        if (scc.length > 1 && scc.includes(node.id)) {
            color = `rgb(255,0,0)`;
        }
        if (color) return;
    });

    return color ?? `rgb(0,255,0)`;
};

const defColorFn = () => {
    return `rgb(0,255,0)`;
};
