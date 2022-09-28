import React from "react";
import theKnotData from "../../utils/antipatterns/the_knot.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";

const Knot = () => {
    // function getColor(node, threshold) {
    //     let color = null;
    //     if (!sccs) {
    //         sccs = getSccs();
    //     }
    //     sccs.forEach((scc, index) => {
    //         if (scc.includes(node.id)) {
    //             if (scc.length >= threshold) {
    //                 color = `rgb(255,102,102)`;
    //             } else if (scc.length >= threshold / 2) {
    //                 color = `rgb(102,102,255)`;
    //             }
    //         }
    //         if (color) return;
    //     });
    //
    //     return color ?? `rgb(100,100,100)`;
    // }

    return (
        <div>
            <InterNodeVisLayout
                //graphColorFn={getColor}
                antipatternJSON={theKnotData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Knot;
