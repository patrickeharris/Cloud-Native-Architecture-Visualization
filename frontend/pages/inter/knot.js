import React, { useEffect } from "react";
import theKnotData from "../../utils/antipatterns/the_knot.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { getNeighborsLinks } from "../../utils/visualizer/nodeFunctions";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";
import knotData from "../../public/data/knot-model.json";

const Knot = () => {
    const [graphData, setGraphData] = useAtom(graphDataAtom);

    useEffect(() => {
        setGraphData(knotData);
    }, []);

    function getColor(node, threshold) {
        let { links } = graphData;
        let totalLinks = getNeighborsLinks(node, links);
        console.log(totalLinks + " for " + node.id);

        if (totalLinks > threshold) {
            return `rgb(255,0,0)`;
        }
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
