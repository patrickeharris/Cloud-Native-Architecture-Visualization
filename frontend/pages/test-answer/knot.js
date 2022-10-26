import React, { useEffect } from "react";
import theKnotData from "../../utils/antipatterns/the_knot.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";
import knotData from "../../public/data/knot-model.json";

const Knot = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);

    useEffect(() => {
        setGraphData(knotData);
    }, []);

    function getColor(node, threshold) {
        return `rgb(0,255,0)`;
    }

    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={getColor}
                hasThreshold={true}
                antipatternJSON={theKnotData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Knot;
