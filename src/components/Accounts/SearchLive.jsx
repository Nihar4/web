import React, { useEffect, useState } from "react";
import CustomLiveSearch from "../CustomComponents/CustomLiveSearch/CustomLiveSearch";
import ServerRequest from "../../utils/ServerRequest";

const SearchLive = ({ name, onInputChange, value }) => {
  const [selectedValue, setSelectedValue] = useState("");
  // console.log("value", selectedValue);
  // useEffect(() => {
  //   const setData = async () => {
  //     try {
  //       const data = await ServerRequest({
  //         method: "post",
  //         URL: "/access/getstockprice",
  //         data: { code: selectedValue },
  //       });

  //       // console.log(data);
  //       if (data.error == false) {
  //         console.log(data.message);
  //       } else {
  //         console.log("error", data.message);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   if (selectedValue) {
  //     setData();
  //   }
  // }, [selectedValue]);

  const handleItemClick = (value) => {
    // console.log("dropdown value",value);
    setSelectedValue(value);
    onInputChange(name, value);
  };
  return <CustomLiveSearch onItemClick={handleItemClick} prevvalue={value} />;
};

export default SearchLive;
