import * as THREE from "three";
import * as NodeFns from "../../utils/visualizer/nodeFunctions";
import data from "../../public/data/pipeline.json";
import { CustomSinCurve } from "../../utils/visualizer/ThreeExtensions";
// import {
//     rightClick,
//     rightClickLink,
// } from "../../utils/visualizer/rightClickFunctions.js";
import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { useAtom } from "jotai";
import { initCoordsAtom, initRotationAtom } from "../../utils/atoms";

/**
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
    const [visibleNodes, setVisibleNodes] = useState([]);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [threshold, setThreshold] = useState(8);

    const [graphData, setGraphData] = useState(data);

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);

    /**
     * https://reactjs.org/docs/hooks-effect.html
     *
     * React useEffect allows us to perform operations at certain points
     * in a component's lifecycle or based on variables. The empty [] array
     * at the end of this means that useEffect is only called once when
     * the component renders.
     */
    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        setVisibleNodes(graphData.nodes);

        let { x, y, z } = graphRef.current.cameraPosition();
        setInitCoords({ x, y, z });
        setInitRotation(graphRef.current.camera().quaternion);
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
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    }

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
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
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

        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);
    };

    // Event when node is clicked on
    const handleNodeClick = useCallback(
        (node) => {
            const distance = 100;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
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

            /** @TODO dim other nodes */

            // Show info box
            // const cb = document.querySelector("#menuToggle");
            // cb.checked = true;

            // Set info box data
            // document.getElementById("nodeName").innerHTML = node.id;
            // document.getElementById("nodeType").innerHTML =
            //     "<b>Node Type: </b>" + node.nodeType;
            // document.getElementById("nodeID").innerHTML =
            //     "<b>Node ID: </b>" + node.nodeID;

            // let found = false;
            // let found2 = false;
            // let newLinks = [];
            // let dependLinks = [];

            // // Searching for dependencies to display them
            // allLinks.forEach((link) => {
            //     if (link.source === node) {
            //         found = true;
            //         newLinks.push(link);
            //     }
            //     if (link.target === node) {
            //         found2 = true;
            //         dependLinks.push(link);
            //     }
            // });

            // // Display dependencies in info box
            // if (found) {
            //     newLinks = newLinks.map((data) => {
            //         data = "<li>" + data.target.id + "</li>";
            //         return data;
            //     });
            //     dependencies.innerHTML = newLinks.join("");
            // } else {
            //     dependencies.innerHTML = "<li>N/A</li>";
            // }

            // // Display depends on in info box
            // if (found2) {
            //     dependLinks = dependLinks.map((data) => {
            //         data = "<li>" + data.source.id + "</li>";
            //         return data;
            //     });
            //     dependson.innerHTML = dependLinks.join("");
            // } else {
            //     dependson.innerHTML = "<li>N/A</li>";
            // }
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
                        color: highlightNodes.has(node)
                            ? node === hoverNode
                                ? "rgb(50,50,200)"
                                : "rgba(0,200,200)"
                            : NodeFns.getColor(node, graphData, threshold),
                        transparent: true,
                        opacity: 0.75,
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
            // Setup visibility for filtering of nodes
            nodeVisibility={(node) =>
                NodeFns.customNodeVisibility(node, visibleNodes)
            }
            linkVisibility={(link) =>
                NodeFns.customLinkVisibility(link, visibleNodes)
            }
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            // Change where node is when clicking and dragging
            onNodeDragEnd={(node) => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            }}
            // Select node on left click
            onNodeClick={handleNodeClick}
            //  node right click menu
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
            ref={graphRef}
            backgroundColor={"rgba(0,0,0,0)"}
        />
    );

    return Graph;
};

export default GraphComponent;
