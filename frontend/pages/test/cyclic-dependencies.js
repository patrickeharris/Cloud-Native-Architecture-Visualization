import React, { useEffect, useState } from "react";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import cyclicDependencyData from "../../utils/antipatterns/cyclic_dependency.json";
import { useAtom } from "jotai";
import cyclicData from "../../public/data/test-cyclic.json";
import { graphDataAtom } from "../../utils/atoms";

/**
 * @todo This is broken
 */
const CyclicDependencies = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);

    useEffect(() => {
        setGraphData(cyclicData);
    }, []);

    function getColor(node) {
        return `rgb(0,255,0)`;
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
