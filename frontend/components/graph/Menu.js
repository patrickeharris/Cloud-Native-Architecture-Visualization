import { useContextMenu } from "../../hooks/useContextMenu";

export const Menu = () => {
    const { anchorPoint, show } = useContextMenu();

    if (show) {
        return (
            <ul
                className="absolute flex flex-col bg-slate-900 bg-opacity-80 gap-2 rounded-lg p-4"
                style={{ top: anchorPoint.y, left: anchorPoint.x }}
            >
                <button onClick="" className="gradient">
                    Show Neighbors
                </button>
                <button onClick="" className="gradient">
                    Highlight Node
                </button>
                <button onClick="" className="gradient">
                    Track Node
                </button>
            </ul>
        );
    }
    return <></>;
};
