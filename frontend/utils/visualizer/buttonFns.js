export function toggleTrack() {
    if (trackMenu.checked) {
        trackMenu.checked = false;
    } else {
        trackMenu.checked = true;
    }
}

export function exportGraph() {
    exportToJsonFile(Graph.graphData());
}

export function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(
        Object.assign({}, jsonData, Graph.cameraPosition()),
        replacer
    );

    //let dataStr2 = JSON.stringify(Graph.cameraPosition());
    let dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    let exportFileDefaultName = "data-out.json";

    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
}

export function importGraph() {
    let input = document.createElement("input");
    input.type = "file";

    input.onchange = (e) => {
        let file = e.target.files[0];

        // setting up the reader
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        // here we tell the reader what to do when it's done reading...
        reader.onload = (readerEvent) => {
            let content = readerEvent.target.result; // this is the content!
            let parsedData = JSON.parse(content);
            Graph.graphData(parsedData);
            delay(150).then(() => {
                let { nodes, links } = Graph.graphData();
                allLinks = links;
                visibleNodes = nodes;
                reset();

                Graph.cameraPosition(
                    { x: parsedData.x, y: parsedData.y, z: parsedData.z }, // new position
                    { x: 0, y: 0, z: 0 }, //parsedData.lookAt, // lookAt ({ x, y, z })
                    0 // ms transition duration
                );
            });
        };
    };

    input.click();
}

export function addNode() {
    // When the add node form is submitted, this happens.
    nodeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Data Abstraction
        let { nodes, links } = Graph.graphData();
        let newName = event.target.elements.name.value;
        let found = false;

        // Check if node already exists
        nodes.forEach((node) => {
            if (node.id === newName) {
                found = true;
            }
        });

        // If node already exists, warn the user. If not, continue adding node.
        if (found) {
            window.alert("That node already exists! Try again.");
        } else {
            // Extract info about new node.
            let newType = event.target.elements.node_type.value;
            let newDeps = event.target.elements.dependencies.value;
            let deps = newDeps.split(",");

            // Create new node with info from form.
            let node = {
                id: newName,
                nodeType: newType,
                dependencies: deps,
                nodeID: 23,
            };
            nodes.push(node);

            // Create new links if new node has dependencies.
            deps.forEach((d) => {
                nodes.forEach((n) => {
                    if (n.nodeID.toString() === d) {
                        let link = {
                            source: newName,
                            target: n.id,
                        };
                        links.push(link);
                    }
                });
            });

            // Update graph data
            Graph.graphData({
                nodes: nodes,
                links: links,
            });

            // Update the simulation
            updateSimulation();
            closeNodeForm();
        }
    });

    // Show the add node form
    nodeForm.style.display = "block";
}
