import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

/**
 * This page renders the 3d force graph.
 *
 * @TODO Implement buttons, search, etc.
 * @TODO Fix dragging by adding either the dragging script or exporting functionality
 * @returns {React.Component} The 3D viualizer page ("/visualizer/3d")
 */
const ThreeD = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/inter/cyclic-dependencies");
    }, []);

    return <></>;
};

export default ThreeD;
