import React from "react";
import GraphButtonMenu from "./GraphButtons";
import { forceReset } from "../../utils/visualizer/nodeFunctions";
import Search from "./Search";
import Slider from "./Slider";

const GraphMenu = () => {
    return (
        <div className="absolute top-2 right-2 z-50 flex flex-col gap-2 text-sm bg-slate-900 bg-opacity-60 rounded-lg p-4 w-44">
            <Search />
            <GraphButtonMenu />
            <Slider />
        </div>
    );
};

export default GraphMenu;
