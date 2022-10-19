import * as THREE from "three";
import * as NodeFns from "../../utils/visualizer/nodeFunctions";
import { CustomSinCurve } from "../../utils/visualizer/ThreeExtensions";
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
import SpriteText from "three-spritetext";
import { useRouter } from "next/router";

/**
 * @TODO right click needs to be moved to be embedded with graph like left click
 * @TODO make arrows more visible
 * @param {Object} props The props passed to this object
 * @param {React.MutableRefObject<ForceGraphMethods>} props.graphRef Reference to the internal force graph to access methods/camera
 * @returns {JSX.Element} The graph
 */
const GraphComponent = ({ graphRef, graphColorFn, isIntraNode }) => {
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());

    const [hoverNode, setHoverNode] = useState();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [threshold, setThreshold] = useAtom(couplingThresholdAtom);

    const [graphData] = useAtom(graphDataAtom);

    const [initCoords, setInitCoords] = useAtom(initCoordsAtom);
    const [initRotation, setInitRotation] = useAtom(initRotationAtom);
    const [search] = useAtom(graphSearchAtom);

    const router = useRouter();

    useEffect(() => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        let { x, y, z } = graphRef.current.cameraPosition();

        setInitCoords({ x, y, z });
        setInitRotation(graphRef.current.camera().quaternion);

        // if (isIntraNode) {
        //     console.log("here");
        //     var cubeMat = new THREE.MeshStandardMaterial({
        //         color: "rgb(100,100,100)",
        //         side: THREE.BackSide,
        //     });
        //     var mesh = new THREE.Mesh(
        //         new THREE.BoxGeometry(100, 100, 100),
        //         cubeMat
        //     );
        //     graphRef.current.scene().add(mesh);
        // }
    }, [window.innerWidth, window.innerHeight]);

    // This is a hack
    useEffect(() => {
        router.events.on("routeChangeComplete", () => {
            router.reload();
        });
    }, []);

    // Glow on search
    useEffect(() => {
        if (typeof graphData.links[0].source == "string") return;
    }, [search]);

    // Highlight neighbors
    const getHighlightNeighbors = (node) => {
        let { links } = graphData;
        const { nodeLinks, nodes } = NodeFns.getNeighbors(node, links);
        nodeLinks.forEach((link) => highlightLinks.add(link));
        nodes.forEach((node) => highlightNodes.add(node));
    };

    // Refresh the graph and update states
    const updateHighlight = () => {
        setHighlightNodes(highlightNodes);
        setHighlightLinks(highlightLinks);

        graphRef.current.refresh();
    };

    // Handle behavior on hovering over a node
    const handleNodeHover = (node, prevNode) => {
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
                const distance = 300;
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

    const getGraphColor = (node) => {
        if (highlightNodes && highlightNodes.has(node)) {
            if (node === hoverNode) {
                return `rgb(50,50,200)`;
            } else {
                return `rgb(0,200,200)`;
            }
        }
        return graphColorFn(node, threshold);
    };

    const textNode = (node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = getGraphColor(node);
        sprite.textHeight = 2;
        sprite.fontWeight = "bold";
        sprite.backgroundColor = "rgba(10,10,10,0.2)";
        sprite.padding = 2;
        return sprite;
    };

    const customNode = (node) => {
        return new THREE.Mesh(
            [
                new THREE.SphereGeometry(5),
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.ConeGeometry(5, 10),
                new THREE.CylinderGeometry(5, 5, 10),
                new THREE.TubeGeometry(new CustomSinCurve(10), 5, 2, 8, false),
                new THREE.OctahedronGeometry(5),
            ][NodeFns.getShape(node.nodeType)],
            new THREE.MeshLambertMaterial({
                // Setup colors
                color: graphColorFn(node, threshold, getNodeOpacity),
                transparent: true,
                opacity: getNodeOpacity(node),
            })
        );
    };

    const labeledNode = (node) => {
        const group = new THREE.Group();
        const shape = customNode(node);
        const text = textNode(node);
        shape.position.set(0, 0, 0);
        text.position.set(0, 10, 0);
        group.add(text);
        group.add(shape);

        if (
            node.id.toLowerCase().includes(search.toLowerCase()) &&
            search != ""
        ) {
            var outlineMaterial1 = new THREE.MeshStandardMaterial({
                color: "rgba(255,255,255,0.3)",
                side: THREE.BackSide,
                emissive: 0xffffff,
            });
            var outlineMesh1 = new THREE.Mesh(shape.geometry, outlineMaterial1);
            outlineMesh1.position.set(0, 0, 0);
            outlineMesh1.scale.multiplyScalar(1.25);
            group.add(outlineMesh1);
        }

        return group;
    };

    const Graph = (
        <ForceGraph3D
            //  Setup shapes
            nodeThreeObject={labeledNode}
            nodeThreeObjectExtend={false}
            // Get data
            graphData={graphData}
            // JSON column for node names
            nodeLabel="id"
            // Setup link width
            linkWidth={(link) => (highlightLinks.has(link) ? 3 : 1)}
            // Setup data transfer visualization across links
            linkDirectionalParticles={(link) =>
                highlightLinks.has(link) ? 4 : 0
            }
            // Width of data transfer points
            linkDirectionalParticleWidth={3}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            // Select node on left click
            onNodeClick={handleNodeClick}
            //  node right click menu
            // Setup hovering on nodes
            // This is causing some error
            onNodeHover={handleNodeHover}
            // Setup hovering on links
            onLinkHover={handleLinkHover}
            // Setup clicking on links
            width={dimensions.width}
            height={dimensions.height}
            ref={graphRef}
            backgroundColor={"rgba(0,0,0,0)"}
            enableNodeDrag={false}
        ></ForceGraph3D>
    );

    return Graph;
};

export default GraphComponent;

// Broken post-processing code that I hate deeply

// /**@type {OutlinePass} */
// const [outlinePass, setOutlinePass] = useState();
// const [outlineNodes, setOutlineNodes] = useState([]);

// useEffect(() => {
//     outlinePass = new OutlinePass(
//         new THREE.Vector2(window.innerWidth, window.innerHeight),
//         graphRef.current.camera(),
//         graphRef.current.scene(),
//         []
//     );
//     outlinePass.renderToScreen = true;

//     var params = {
//         edgeStrength: 2,
//         edgeGlow: 2,
//         edgeThickness: 1.0,
//         pulsePeriod: 0,
//         usePatternTexture: false,
//     };

//     outlinePass.edgeStrength = params.edgeStrength;
//     outlinePass.edgeGlow = params.edgeGlow;
//     outlinePass.visibleEdgeColor.set(0xffffff);
//     outlinePass.hiddenEdgeColor.set(0xffffff);

//     graphRef.current.postProcessingComposer().addPass(outlinePass);
//     console.log("here");
// }, []);

// useEffect(() => {
//     if (typeof graphData.links[0].source == "string") return;

//     let newSelected = [];
//     const nodes = graphData.nodes.filter((node) =>
//         node.id.toLowerCase().includes(search.toLowerCase())
//     );
//     nodes.forEach((node) => {
//         const group = node.__threeObj;
//         const mesh = group.children[1];
//         if (mesh.matrix.elements) {
//             newSelected.push(group.children[1]);
//         }
//     });
//     outlinePass.renderCamera = graphRef.current.camera();
//     outlinePass.renderScene = graphRef.current.scene();
//     outlinePass.selectedObjects = newSelected;
//     setOutlinePass(outlinePass);
//     // graphRef.current.postProcessingComposer().reset();
// }, [search]);
