import React, { useRef, useState } from "react";
import ServerRequest from "../../../utils/ServerRequest";

const CustomLiveSearch = ({ onItemClick, prevvalue }) => {
  const [searchQuery, setSearchQuery] = useState(prevvalue);
  const [filteredResults, setFilteredResults] = useState([]);
  const abortControllerRef = useRef(null);

  const handleInputChange = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      if (query) {
        const response = await ServerRequest({
          method: "get",
          URL: `/access/getsearchlive?search=${query}`,
          signal,
        });
        setFilteredResults(response);
      } else {
        setFilteredResults([]);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // Handle aborted request error if needed
        console.log("Request aborted");
      } else {
        console.log(error);
      }
    }
  };

  const handleItemClick = (result) => {
    // console.log(result.code);
    onItemClick(`${result.code}`);
    setSearchQuery(`${result.code}`);
    setFilteredResults([]);
  };

  const handleInputBlur = () => {
    // Clear the filtered results when input box loses focus
    setTimeout(() => {
      setFilteredResults([]);
    }, 200);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Search..."
        className="search-input swift-custom-input-box swift-addstrategy-underlying-input"
      />
      {searchQuery && filteredResults && filteredResults.length > 0 && (
        <ul className="results-list">
          {filteredResults.map((result) => (
            <li
              key={result.code}
              onClick={() => handleItemClick(result)}
            >{`${result.code}-${result.name}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomLiveSearch;
