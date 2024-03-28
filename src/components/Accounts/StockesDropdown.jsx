import React, { useEffect, useState } from "react";
import "../../css/Accounts/StocksDropdown.css";
import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../Loader/Pulse";

const StockesDropdown = ({
  heading,
  options,
  isOpen,
  onToggle,
  id,
  onStockSelect,
  getsum,
}) => {
  const [dl_data, setDlData] = useState(null);
  const [stockDetailsArray, setStockDetailsArray] = useState({});
  const [loading, setloading] = useState(true);
  const [loading1, setloading1] = useState(true);

  const stock_saa_array = {};

  options.forEach((option) => {
    const stocks = option.stock.split(", ");
    const percentages = option.percentage.split(", ");

    stocks.forEach((stock, index) => {
      stock_saa_array[stock] = parseFloat(percentages[index]);
    });
  });

  const totalPercentage = Object.values(stock_saa_array).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const fetchData = async (id) => {
    try {
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/getdldta?id=${id}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      // throw error;
    }
  };

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        setloading(true);
        const data = await fetchData(id);
        setDlData(data.data);
        setTimeout(() => {
          setloading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching and setting data:", error);
      }
    };

    if (id) {
      fetchDataAndSetState();
    }
  }, [id]);

  const fetchStockData = async (stock) => {
    // console.log("stock name", stock);
    let stock_name = stock;
    // console.log(stock_name);
    try {
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/getstockinfo?stock=${stock_name}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchStockDetails = async () => {
    for (const stock of Object.keys(stock_saa_array)) {
      try {
        // const latestData =
        //   dl_data && dl_data.find((datum) => datum.security === stock);
        // setloading1(true);
        const stock_data = await fetchStockData(stock);
        // console.log(stock_data);

        setStockDetailsArray((prevStockDetails) => ({
          ...prevStockDetails,
          [stock]: {
            percentage_change: stock_data.percentage_change,
            detailed_name: stock_data.detailed_name,
          },
        }));

        // setTimeout(() => {

        //   setloading1(false);
        // }, 1000);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    }
  };

  useEffect(() => {
    setloading1(true);
    const fetchData = async () => {
      await fetchStockDetails();
    };
    setTimeout(() => {
      setloading1(false);
    }, 2000);

    fetchData();
  }, [id]);

  const latestValuesArray = {};
  Object.keys(stock_saa_array).forEach((stock) => {
    const latestData =
      dl_data && dl_data.find((datum) => datum.security === stock);

    if (latestData) {
      latestValuesArray[stock] = {
        predict_percentage: latestData.predict_percentage,
        correlation: latestData.correlation,
      };
    } else {
      latestValuesArray[stock] = {
        predict_percentage: null,
        correlation: null,
      };
    }
  });

  useEffect(() => {
    let total = 0;
    Object.keys(stock_saa_array).forEach((stock) => {
      total +=
        (stock_saa_array[stock] * latestValuesArray[stock].predict_percentage) /
        100;
    });
    getsum({ heading, total });
  }, [stock_saa_array, latestValuesArray]);

  const map_corr = (correlation) => {
    if (correlation > 0.9) {
      return "High";
    } else if (correlation > 0.7) {
      return "Medium";
    } else {
      return "Low";
    }
  };

  return !loading && !loading1 ? (
    <div className="stocks-dropdown-main">
      <div className="stocks-dropdown-header">
        <div className="stocks-dropdown-header-left">
          <div className="stocks-dropdown-heading" onClick={onToggle}>
            {heading}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            className={`stock-dropdown-icon ${
              isOpen ? "up-arrow" : "down-arrow"
            }`}
            onClick={onToggle}
          >
            <path
              d="M13 7L7 1L1 7"
              stroke="#011627"
              stroke-opacity="0.7"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className="stocks-dropdown-header-right">
          <p>{totalPercentage}%</p>
        </div>
      </div>
      {isOpen && (
        <div className="stocks-dropdown-options-container">
          <ul className="stocks-dropdown-options">
            {Object.keys(stock_saa_array).map((stock, index) => (
              <li
                key={index}
                onClick={() => onStockSelect(stock)}
                style={{ cursor: "pointer" }}
              >
                <div className="stocks-dropdown-option-details">
                  <div className="stocks-dropdown-option-left">
                    <div className="stocks-dropdown-option-up">
                      <div className="stocks-dropdown-option-title">
                        {stock}
                      </div>
                      <div className="stocks-dropdown-option-change">
                        <p className="stocks-dropdown-option-change-1">
                          {stock.company === ""}
                        </p>
                        <p
                          className={
                            "stocks-dropdown-option-change-2 " +
                            (stockDetailsArray[stock] &&
                            stockDetailsArray[stock].percentage_change >= 0
                              ? "green-text"
                              : "red-text")
                          }
                        >
                          {stockDetailsArray[stock] ? (
                            <p>
                              {index === 0 ? (
                                <span className="gray-text">(MTD)</span>
                              ) : (
                                ""
                              )}
                              {stockDetailsArray[
                                stock
                              ].percentage_change.toFixed(2)}
                              %
                            </p>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="stocks-dropdown-option-down">
                      {stockDetailsArray[stock]
                        ? stockDetailsArray[stock].detailed_name
                        : ""}
                    </div>
                  </div>
                  <div className="stocks-dropdown-option-info">
                    <p>{stock_saa_array[stock].toFixed(1)}%</p>
                    <p
                      className={
                        latestValuesArray[stock].predict_percentage * 100 > 0
                          ? "green-text"
                          : "red-text"
                      }
                    >
                      {(
                        latestValuesArray[stock].predict_percentage * 100
                      ).toFixed(2)}
                      %
                    </p>
                    <p>{map_corr(latestValuesArray[stock].correlation)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      {/* <p>Loading</p> */}
      <Pulse />
    </div>
  );
};

export default StockesDropdown;
