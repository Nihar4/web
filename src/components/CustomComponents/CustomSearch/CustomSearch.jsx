import React, { useState } from "react";
import "./CustomSearch.css";

const CustomSearch = ({ items, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredItems = items.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
    );
    setFilteredResults(filteredItems);
  };

  const handleItemClick = (result) => {
    onItemClick(`${result.code}`);
    setSearchQuery(`${result.code}-${result.name}`);
    setFilteredResults([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search..."
        className="search-input"
      />
      {searchQuery && filteredResults.length > 0 && (
        <ul className="results-list">
          {filteredResults.map((result) => (
            <li key={result.code} onClick={() => handleItemClick(result)}>
              {`${result.code}-${result.name}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSearch;
