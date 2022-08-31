import React, { useState } from "react";

const Slider = () => {
    const [value, setValue] = useState(8);

    const handleInput = (e) => {
        setValue(e.target.value);
    };
    return (
        <div className="w-full h-6 p-0 bg-transparent accent-gray-50 border-none ">
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onInput={(e) => handleInput(e)}
            />
            <p className="mb-2" id="rangeValue">
                {value}
            </p>
        </div>
    );
};

export default Slider;
