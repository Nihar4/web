import React, { useState } from "react";
import "../CustomSearch/CustomSearch.css";

const CustomSearch = ({ options }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query == "") {
      setFilteredOptions([]);
    } else {
      const filtered = options.filter((option) =>
        option.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
        style={{ fontSize: "16px" }}
      />
      <div
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "18px",
        }}
      >
        <ul style={{ listStyleType: "none" }}>
          {filteredOptions.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomSearch;
