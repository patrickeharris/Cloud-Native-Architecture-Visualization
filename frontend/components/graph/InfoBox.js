import { useInfoBox } from "../../hooks/useInfoBox";

export const InfoBox = () => {
    const {
        anchorPoint,
        show,
        name,
        id,
        type,
        depends,
        setShow,
        dependencies,
    } = useInfoBox();

    if (show) {
        return (
            <ul
                className="absolute flex flex-col bg-slate-900 bg-opacity-80 gap-2 rounded-lg p-4"
                style={{ top: anchorPoint.y, left: anchorPoint.x }}
            >
                <p>Name: {name}</p>
                <p>Type: {type}</p>
                <p>ID: {id}</p>
                <ul className="list-disc list-inside">
                    Dependencies: {dependencies}
                </ul>
                <ul className="list-disc list-inside">Depends On: {depends}</ul>
                <button
                    onClick={() => setShow(false)}
                    className="hover:blue-green-gradient-text"
                >
                    Close Box
                </button>
            </ul>
        );
    }
    return <></>;
};
