import React, { useState } from "react";

const AntiPatternDescription = ({ data }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="isolate z-40 bg-slate-900 bg-opacity-80 w-1/4 h-fit absolute top-4 left-16 rounded-lg p-4 duration-200 ease-in-out">
            <button
                className={`absolute top-4 right-4 w-fit h-fit duration-200 ease-in-out ${
                    open ? `rotate-180` : ``
                }`}
                onClick={() => setOpen(!open)}
            >
                <i className={`fa-solid fa-caret-down fa-lg`}></i>
            </button>

            <h1 className="text-xl font-semibold">{data.name}</h1>
            <ul
                className={`flex flex-col gap-2 mt-4 font-light duration-200 ease-in-out ${
                    open ? `` : `hidden`
                }`}
            >
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
