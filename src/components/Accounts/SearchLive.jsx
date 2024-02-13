import React, { useEffect, useState } from "react";
import CustomLiveSearch from "../CustomComponents/CustomLiveSearch/CustomLiveSearch";
import ServerRequest from "../../utils/ServerRequest";

const SearchLive = () => {

  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const setData = async () => {
      try {
        const data = await ServerRequest({
          method: "post",
          URL: "/access/getstockprice",
          data: { code: selectedValue },
        });

        // console.log(data);
        if (data.error == false) {
          console.log(data.message);
        } else {
          console.log("error", data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedValue) {
      setData();
    }
  }, [selectedValue]);

  const handleItemClick = (value) => {
    console.log(value);
    setSelectedValue(value);
  };
  return <CustomLiveSearch onItemClick={handleItemClick}/>;
};

export default SearchLive;
