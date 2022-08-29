import dynamic from "next/dynamic";
import * as THREE from "three";
import * as NodeFns from "../../utils/visualizer/nodeFunctions";
import { CustomSinCurve } from "../../utils/visualizer/ThreeExtensions";
// import {
//     rightClick,
//     rightClickLink,
// } from "../../utils/visualizer/rightClickFunctions.js";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

/**
 * This has to be a dynamic import to work. Why? Idk.
 * https://github.com/vasturiano/react-force-graph/issues/352
 *
 */
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
    ssr: false,
});

const GraphComponent = () => {
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [selectedNode, setSelectedNode] = useState();
    const [selectedLink, setSelectedLink] = useState();
    const [hoverNode, setHoverNode] = useState();
    const [graphData, setGraphData] = useState();
    const [visibleNodes, setVisibleNodes] = useState();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimensions({
            width: window.innerWidth / 1.5,
            height: window.innerHeight / 1.5,
        });
    }, []);

    // Highlight neighbors
    function getHighlightNeighbors(node) {
        let { nodes, links } = graphData;

        // If problems, might be this line
        highlightNodes = new Set(NodeFns.getNeighbors(node, links));

        links.forEach((link) => {
            if (
                (highlightNodes.has(link.source) && link.target === node) ||
                (highlightNodes.has(link.target) && link.source === node)
            ) {
                highlightLinks.add(link);
            }
        });
        updateHighlight();
    }

    // Notify react stateful values to refresh based on new contents
    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    // Handle behavior on hovering over a node
    const handleNodeHover = (node) => {
        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
            node.links.forEach((link) => highlightLinks.add(link));
        }

        setHoverNode(node || null);
        updateHighlight();
    };

    // Handle behavior on hovering over a link
    const handleLinkHover = (link) => {
        highlightNodes.clear();
        highlightLinks.clear();

        if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }

        updateHighlight();
    };

    const Graph = (
        <ForceGraph3D
            //  Setup shapes
            nodeThreeObject={(node) =>
                new THREE.Mesh(
                    [
                        new THREE.SphereGeometry(5),
                        new THREE.BoxGeometry(10, 10, 10),
                        new THREE.ConeGeometry(5, 10),
                        new THREE.CylinderGeometry(5, 5, 10),
                        new THREE.TubeGeometry(
                            new CustomSinCurve(10),
                            5,
                            2,
                            8,
                            false
                        ),
                        new THREE.OctahedronGeometry(5),
                    ][NodeFns.getShape(node.nodeType)],
                    new THREE.MeshLambertMaterial({
                        // Setup colors
                        color: highlights.nodes.has(node)
                            ? node === hoverNode
                                ? "rgb(50,50,200)"
                                : "rgba(0,200,200)"
                            : NodeFns.getColor(node),
                        transparent: true,
                        opacity: 0.75,
                    })
                )
            }
            nodeThreeObjectExtend={false}
            // Get data
            /** TODO: load data from json "../data/pipeline.json" */
            graphData={graphData}
            // JSON column for node names
            nodeLabel="id"
            // Setup link width
            linkWidth={(link) => (highlights.links.has(link) ? 4 : 1)}
            // Setup data transfer visualization across links
            linkDirectionalParticles={(link) =>
                highlights.links.has(link) ? 4 : 0
            }
            // Width of data transfer points
            linkDirectionalParticleWidth={4}
            // Setup visibility for filtering of nodes
            nodeVisibility={(node) => NodeFns.customNodeVisibility(node)}
            linkVisibility={(link) => NodeFns.customLinkVisibility(link)}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            // Change where node is when clicking and dragging
            onNodeDragEnd={(node) => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            }}
            // Select node on left click
            // onNodeClick={(node) => {
            //     NodeFns.nodeClick(node);
            // }}
            // Setup node right click menu
            onNodeRightClick={(node, e) => {
                // Set selected node
                setSelectedNode(node);
                //rightClick(e);
            }}
            // Setup hovering on nodes
            onNodeHover={handleNodeHover}
            // Setup hovering on links
            onLinkHover={handleLinkHover}
            // Setup clicking on links
            onLinkClick={(link) => {
                setSelectedLink(link);
            }}
            // Setup right clicking on links
            onLinkRightClick={(link, e) => {
                //rightClickLink(e);
                setSelectedLink(link);
            }}
            width={dimensions.width}
            height={dimensions.height}
        />
    );

    return <React.Suspense>{Graph}</React.Suspense>;
};

export default GraphComponent;
