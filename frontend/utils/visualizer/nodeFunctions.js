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
    hoverNode,
    opacityFn
) {
    let { nodes, links } = graphData;
    let numNeighbors = getNeighbors(node, links).nodes.length;

    if (!opacityFn) {
        opacityFn = (node) => {
            return 1;
        };
    }

    if (highlightNodes && highlightNodes.has(node)) {
        if (node === hoverNode) {
            return `rgba(50,50,200,${opacityFn(node)})`;
        } else {
            return `rgba(0,200,200,${opacityFn(node)})`;
        }
    }

    if (numNeighbors > threshold) {
        return `rgba(255,0,0,${opacityFn(node)})`;
    }
    if (numNeighbors > threshold / 2) {
        return `rgba(255,160,0, ${opacityFn(node)})`;
    }

    return `rgba(0,255,0, ${opacityFn(node)})`;
}

// Find neighbors of a given node
export function getNeighbors(node, links) {
    return {
        nodeLinks: links.filter((link) => {
            return (
                link.source.nodeID === node.nodeID ||
                link.target.nodeID === node.nodeID
            );
        }),
        nodes: links.reduce(
            (neighbors, link) => {
                if (link.target.id === node.id) {
                    neighbors.push(link.source);
                } else if (link.source.id === node.id) {
                    neighbors.push(link.target);
                }
                return neighbors;
            },
            [node]
        ),
    };
}

// Refresh visible nodes
export function reset(graphRef) {
    graphRef.current.refresh();
}

// Set camera back to default view
export function resetView(graphRef, initCoords) {
    graphRef.current.cameraPosition(
        initCoords, // new position
        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
        2000 // ms transition duration
    );
    reset(graphRef);
}
