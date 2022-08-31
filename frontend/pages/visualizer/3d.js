import React from "react";
import Graph from "../../components/graph/GraphWrapper";
import Script from "next/script";
import Head from "next/head";
import GraphMenu from "../../components/graph/GraphMenu";

/**
 * This page renders the 3d force graph.
 *
 * @TODO Implement buttons, search, etc.
 * @TODO Fix dragging by adding either the dragging script or exporting functionality
 * @returns {React.Component} The 3D viualizer page ("/visualizer/3d")
 */
const ThreeD = () => {
    return (
        <>
            <Head>
                {/* <Script src="../../utils/visualizer/drag.js"></Script> */}
            </Head>
            <div className="flex flex-row justify-center items-center w-full h-screen relative z-10">
                <GraphMenu />
                <Graph />
            </div>
        </>
    );
};

export default ThreeD;
