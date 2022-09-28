import React from "react";
import bottleneckData from "../../utils/antipatterns/bottleneck_service.json";
import InterNodeVisLayout from "../../components/antipatterns/InterNodeVisLayout";

const Bottleneck = () => {
    return (
        <div>
            <InterNodeVisLayout
                //graphColorFn={getColor}
                antipatternJSON={bottleneckData}
            ></InterNodeVisLayout>
        </div>
    );
};

export default Bottleneck;
