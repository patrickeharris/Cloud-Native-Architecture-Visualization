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
export function getColor(node) {
    let { nodes, links } = Graph.graphData();
    let numNeighbors = getNeighbors(node, links).length;

    if (numNeighbors > threshold) {
        return "rgb(255,0,0)";
    }
    if (numNeighbors > threshold / 2) {
        //node.color =
        return "rgba(255,160,0)";
    }

    return "rgba(0,255,0)";
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

// Node is visible if contained in visibleNodes
export function customNodeVisibility(node) {
    return visibleNodes.includes(node);
}

// Link is visible if nodes on either end are visible
export function customLinkVisibility(link) {
    return (
        customNodeVisibility(link.source) && customNodeVisibility(link.target)
    );
}

// Event when node is clicked on
export function nodeClick(node) {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos =
        node.x || node.y || node.z
            ? {
                  x: node.x * distRatio,
                  y: node.y * distRatio,
                  z: node.z * distRatio,
              }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

    Graph.cameraPosition(
        newPos, // new position
        node, // lookAt ({ x, y, z })
        2000 // ms transition duration
    );

    // Hide all other nodes
    visibleNodes = [];
    visibleNodes.push(node);

    // Update visible nodes
    reset();

    // Show info box
    const cb = document.querySelector("#menuToggle");
    cb.checked = true;

    // Set info box data
    document.getElementById("nodeName").innerHTML = node.id;
    document.getElementById("nodeType").innerHTML =
        "<b>Node Type: </b>" + node.nodeType;
    document.getElementById("nodeID").innerHTML =
        "<b>Node ID: </b>" + node.nodeID;

    let found = false;
    let found2 = false;
    let newLinks = [];
    let dependLinks = [];

    // Searching for dependencies to display them
    allLinks.forEach((link) => {
        if (link.source === node) {
            found = true;
            newLinks.push(link);
        }
        if (link.target === node) {
            found2 = true;
            dependLinks.push(link);
        }
    });

    // Display dependencies in info box
    if (found) {
        newLinks = newLinks.map((data) => {
            data = "<li>" + data.target.id + "</li>";
            return data;
        });
        dependencies.innerHTML = newLinks.join("");
    } else {
        dependencies.innerHTML = "<li>N/A</li>";
    }

    // Display depends on in info box
    if (found2) {
        dependLinks = dependLinks.map((data) => {
            data = "<li>" + data.source.id + "</li>";
            return data;
        });
        dependson.innerHTML = dependLinks.join("");
    } else {
        dependson.innerHTML = "<li>N/A</li>";
    }
}
