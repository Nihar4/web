import React, { useEffect, useState } from "react";
import CustomLiveSearch from "./CustomLiveSearch";
import ServerRequest from "../../../utils/ServerRequest";
import CustomLiveSearchBelow from "./CustomLiveSearchBelow";

const CustomPopupLiveSearch = ({
  name,
  onInputChange,
  value,
  filterArray,
  onInputChangeEmpty,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleItemClick = (value) => {
    setSelectedValue(value);
    onInputChange(name, value);
  };
  return (
    <CustomLiveSearchBelow
      onItemClick={handleItemClick}
      prevvalue={value}
      filterArray={filterArray}
      onInputChangeEmpty={onInputChangeEmpty}
    />
  );
};

export default CustomPopupLiveSearch;
