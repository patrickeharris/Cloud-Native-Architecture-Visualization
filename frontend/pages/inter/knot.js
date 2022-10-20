import React from "react";
import theKnotData from "../../utils/antipatterns/the_knot.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";
import { getNeighborsLinks } from "../../utils/visualizer/nodeFunctions";
import { useAtom } from "jotai";
import { graphDataAtom } from "../../utils/atoms";

const Knot = () => {
    const [graphData] = useAtom(graphDataAtom);

    function getColor(node, threshold) {
        let {links} = graphData;
        let totalLinks = getNeighborsLinks(node, links);
        console.log(totalLinks + ' for ' +  node.id);

        if(totalLinks > threshold){
            return `rgb(255,0,0)`;
        }
        return `rgb(0,255,0)`;
    }

    return (
        <div>
            <InterNodeVisLayout
                graphColorFn={getColor}
                antipatternJSON={theKnotData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Knot;
