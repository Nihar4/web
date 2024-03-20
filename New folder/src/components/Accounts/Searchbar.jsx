import React, { useEffect, useState } from "react";
import CustomSearch from "../CustomComponents/CustomSearch/CustomSearch";
import ServerRequest from "../../utils/ServerRequest";

const Searchbar = () => {
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await ServerRequest({
          method: "get",
          URL: "/access/getstockdetails",
        });
        setItems(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
    //   console.log(items)
  }, []);

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

  return <CustomSearch items={items} onItemClick={handleItemClick} />;
};

export default Searchbar;
