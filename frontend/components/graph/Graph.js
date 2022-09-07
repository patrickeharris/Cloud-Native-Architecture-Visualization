import * as THREE from "three";
import * as NodeFns from "../../utils/visualizer/nodeFunctions";
import { CustomSinCurve } from "../../utils/visualizer/ThreeExtensions";
import { rightClick } from "../../utils/visualizer/rightClickFunctions.js";
import React, { useEffect, useState, useCallback } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { useAtom } from "jotai";
import {
    initCoordsAtom,
    initRotationAtom,
    graphDataAtom,
    couplingThresholdAtom,
    graphSearchAtom,
} from "../../utils/atoms";

/**
 * @TODO fullscreen bug?
 * @TODO navbar obscures right side graph
 * @TODO right click needs to be moved to be embedded with graph like left click
 * @TODO drag bug
 * @TODO names over each node
 * @param {Object} props The props passed to this object
 * @param {React.MutableRefObject<ForceGraphMethods>} props.graphRef Reference to the internal force graph to access methods/camera
 * @returns {JSX.Element} The graph
 */
const GraphComponent = ({ graphRef }) => {
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());

    const [selectedNode, setSelectedNode] = useState();
    const [selectedLink, setSelectedLink] = useState();

    const [hoverNode, setHoverNode] = useState();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [threshold, setThreshold] = useAtom(couplingThresholdAtom);

    const [graphData, setGraphData] = useAtom(graphDataAtom);

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);
    const [search] = useAtom(graphSearchAtom);

    const nodes = graphData.nodes.map((node) => node.id);

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        let { x, y, z } = graphRef.current.cameraPosition();

        setInitCoords({ x, y, z });
        setInitRotation(graphRef.current.camera().quaternion);
    }, []);

    // Highlight neighbors
    function getHighlightNeighbors(node) {
        let { links } = graphData;
        const { nodeLinks, nodes } = NodeFns.getNeighbors(node, links);
        nodeLinks.forEach((link) => highlightLinks.add(link));
        nodes.forEach((node) => highlightNodes.add(node));
    }

    // Refresh the graph and update states
    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
        graphRef.current.refresh();
    };

    // Handle behavior on hovering over a node
    const handleNodeHover = (node) => {
        // No state change
        if ((!node && !highlightNodes.size) || (node && hoverNode === node))
            return;

        highlightNodes.clear();
        highlightLinks.clear();

        if (node) {
            highlightNodes.add(node);
            getHighlightNeighbors(node);
        }

        setHoverNode(node || null);
        updateHighlight();
    };

    // Handle behavior on hovering over a link
    const handleLinkHover = (link) => {
        if (highlightLinks.has(link)) return;
        highlightNodes.clear();
        highlightLinks.clear();

        if (link != null) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }
        updateHighlight();
    };

    // Set node opacity based on search
    const getNodeOpacity = (node) => {
        if (search === "") {
            return 0.75;
        }
        if (node.id.toLowerCase().includes(search.toLowerCase())) {
            return 0.8;
        } else {
            return 0.1;
        }
    };

    // Event when node is clicked on
    const handleNodeClick = useCallback(
        (node) => {
            if (node != null) {
                setSelectedNode(node);
                const distance = 100;
                const distRatio =
                    1 + distance / Math.hypot(node.x, node.y, node.z);
                if (graphRef.current) {
                    graphRef.current.cameraPosition(
                        {
                            x: node.x * distRatio,
                            y: node.y * distRatio,
                            z: node.z * distRatio,
                        },
                        node,
                        1500
                    );
                }

                const event = new CustomEvent("nodeClick", {
                    detail: { node: node },
                });
                document.dispatchEvent(event);
            }
        },
        [graphRef]
    );

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
                        color: NodeFns.getColor(
                            node,
                            graphData,
                            threshold,
                            highlightNodes,
                            hoverNode
                        ),
                        transparent: true,
                        opacity: getNodeOpacity(node),
                    })
                )
            }
            nodeThreeObjectExtend={false}
            // Get data
            graphData={graphData}
            // JSON column for node names
            nodeLabel="id"
            // Setup link width
            linkWidth={(link) => (highlightLinks.has(link) ? 4 : 1)}
            // Setup data transfer visualization across links
            linkDirectionalParticles={(link) =>
                highlightLinks.has(link) ? 4 : 0
            }
            // Width of data transfer points
            linkDirectionalParticleWidth={4}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            // Change where node is when clicking and dragging
            onNodeDragEnd={(node) => {
                if (node.x && node.y && node.z) {
                    node.fx = node.x;
                    node.fy = node.y;
                    node.fz = node.z;
                }
            }}
            // Select node on left click
            onNodeClick={handleNodeClick}
            //  node right click menu
            onNodeRightClick={(node, e) => {
                // Set selected node
                setSelectedNode(node);
                rightClick();
            }}
            // Setup hovering on nodes
            onNodeHover={handleNodeHover}
            // Setup hovering on links
            onLinkHover={handleLinkHover}
            // Setup clicking on links
            onLinkClick={(link) => {
                setSelectedLink(link);
            }}
            width={dimensions.width}
            height={dimensions.height}
            ref={graphRef}
            backgroundColor={"rgba(0,0,0,0)"}
        ></ForceGraph3D>
    );

    return Graph;
};

export default GraphComponent;
