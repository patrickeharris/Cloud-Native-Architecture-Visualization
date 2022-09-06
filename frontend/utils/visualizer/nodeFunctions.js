import { Color } from "three";

// Sets shape based on type of node
export function getShape(type) {
    if (type === "service") {
        return 0;
    } else if (
        type === "kafka" ||
        type === "proxy" ||
        type === "writer" ||
        type === "pipeline"
    ) {
        return 1;
    } else if (type === "customer" || "srcSink") {
        return 2;
    } else if (type === "archive" || type === "database" || type === "bucket") {
        return 3;
    } else if (type === "API") {
        return 4;
    } else if (type === "config") {
        return 5;
    } else {
        return 0;
    }
}

// Sets color of node
export function getColor(
    node,
    graphData,
    threshold,
    highlightNodes,
    hoverNode
) {
    let { nodes, links } = graphData;
    let numNeighbors = getNeighbors(node, links).length;

    if (highlightNodes && highlightNodes.has(node)) {
        if (node === hoverNode) {
            return "rgb(50,50,200)";
        } else {
            return "rgb(0,200,200)";
        }
    }

    if (numNeighbors > threshold) {
        return "rgb(255,0,0)";
    }
    if (numNeighbors > threshold / 2) {
        return "rgb(255,160,0)";
    }

    return "rgb(0,255,0)";
}

// set node color based on if it is selected, hovered over, or a neighbor
export function get2DNodeColor(
    node,
    neighbors,
    selectedNode,
    hoverNode,
    threshold
) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node) > -1) {
        if (node === selectedNode || node === hoverNode) {
            return "blue";
        }
        if (neighbors.indexOf(hoverNode) > -1) {
            return "deepskyblue";
        }
        if (neighbors.length > threshold) {
            return "red";
        }
        if (neighbors.length > threshold / 2) {
            return "orange";
        }
        return "green";
    }
}

// set link color based on if it selected or hovered over
export function get2DLinkColor(link, hoverNode, hoverLink, theme) {
    if (link.source === hoverNode) {
        return "green";
    }
    if (link.target === hoverNode) {
        return "magenta";
    }
    if (link === hoverLink) {
        return "hotpink";
    }
    if (theme === 1) {
        return "rgba(255,255,255,1)";
    }
    return "rgba(50, 50, 50, 0.2)";
}

// find neighbors of node
export function getNeighbors(node, links) {
    return links.reduce(
        (neighbors, link) => {
            if (link.target.id === node.id) {
                neighbors.push(link.source);
            } else if (link.source.id === node.id) {
                neighbors.push(link.target);
            }
            return neighbors;
        },
        [node]
    );
}

// Refresh visible nodes
export function reset(graphRef) {
    graphRef.refresh();
}

// Set camera back to default view
export function resetView(graphRef, initCoords) {
    graphRef.current.cameraPosition(
        initCoords, // new position
        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
        2000 // ms transition duration
    );
}
