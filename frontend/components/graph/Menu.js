import { useContextMenu } from "../../hooks/useContextMenu";

export const Menu = () => {
    const { anchorPoint, show } = useContextMenu();

    if (show) {
        return (
            <ul
                className="absolute flex flex-col"
                style={{ top: anchorPoint.y, left: anchorPoint.x }}
            >
                <button onClick="">Show Neighbors</button>
                <button onClick="">Highlight Node</button>
                <button onClick="">Track Node</button>
            </ul>
        );
    }
    return <></>;
};
