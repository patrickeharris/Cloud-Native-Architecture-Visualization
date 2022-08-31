import { reset, resetView } from "./nodeFunctions";

export function toggleTrack() {
    if (trackMenu.checked) {
        trackMenu.checked = false;
    } else {
        trackMenu.checked = true;
    }
}

export function exportGraph(graphData) {
    exportToJsonFile(graphData);
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

export function forceReset(graphData) {
    let { nodes, links } = graphData;
    cb.checked = false;
    searchWrapper.classList.remove("active");
    visibleNodes = nodes;
    reset();
    resetView();
}
