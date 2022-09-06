import React, { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const Search = () => {
    const [search, setSearch] = useState();

    const handleInput = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="mx-2 mb-3">
            <label for="search" className="inline-block mb-2">
                Search
            </label>
            <input
                id="search"
                type="search"
                className="block w-full px-3 py-1.5 text-sm font-normal rounded transition ease-in-out m-0
                 focus:border-cyan-600 focus:outline-none text-gray-300 bg-transparent border-white border-2"
                value={search}
                placeholder="Type query"
                onInput={handleInput}
            />
        </div>
    );
};

export default Search;
