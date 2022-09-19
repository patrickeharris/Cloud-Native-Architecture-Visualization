import React from "react";

const AntiPatternDescription = ({ data }) => {
    return (
        <div className="isolate z-40 bg-slate-900 bg-opacity-80 w-1/2 h-fit absolute top-4 left-16 rounded-lg p-4">
            <h1 className="text-xl font-semibold mb-4">{data.name}</h1>
            <ul className="flex flex-col gap-2 font-light">
                <li>
                    <span className="font-semibold">Description:</span>{" "}
                    {data.description}
                </li>
                <li>
                    <span className="font-semibold">Detection:</span>{" "}
                    {data.detection}
                </li>
                <li>
                    <span className="font-semibold">Solution:</span>{" "}
                    {data.solution}
                </li>
                <li>
                    <span className="font-semibold">Example:</span>{" "}
                    {data.example}
                </li>
            </ul>
        </div>
    );
};

export default AntiPatternDescription;
