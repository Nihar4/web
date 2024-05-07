import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import "../../css/Accounts/AssetAllocation.css";
import Strategy from "./Strategy";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import StockesDropdown from "./StockesDropdown";
import BackButton from "../AccessManagement/BackButton";
import ServerRequest from "../../utils/ServerRequest";
import { useNavigate } from "react-router-dom";
import LineChart from "./LineChart";
import { useLocation } from "react-router-dom";
import Pulse from "../Loader/Pulse";
import moment from "moment-timezone";

const AssetAllocation = () => {
  const [initialStrategies, setInitialStrategies] = useState([]);

  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [clickedStrategy, setClickedStrategy] = useState(initialStrategies[0]);
  const [optionSelect, setOptionSelect] = useState(null);
  const [cnt, setCnt] = useState(0);

  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [change, setChange] = useState(0);
  const [ischartvisible, setIschartvisible] = useState();
  const [strategyID, setStrategyid] = useState(null);
  const [lastupdated, setLastupdated] = useState('abc');
  const navigate = useNavigate();

  const [stockArray, setStockArray] = useState([]);
  const [reRenderKey, setReRenderKey] = useState(0);
  const [loading, setloading] = useState(true);
  const [loading1, setloading1] = useState(true);
  const [loading2, setloading2] = useState(true);
  const [duration, setDuration] = useState("1M");
  const [openDropdown, setOpenDropdown] = useState();

  const [sum, setTotalsum] = useState(null);

  const [selectedStock, setSelectedStock] = useState(null);
  const [selectStockName, setSelectedStockName] = useState(null);

  const location = useLocation();
  const email_id = location.state ? location.state.email_id : null;
  // console.log(email_id);

  const handleDeleteStrategy = async (id) => {
    console.log("delete", id);

    const data = await ServerRequest({
      method: "delete",
      URL: `/strategy/`,
      data: { id: id },
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }
    setChange(Math.random());
  };

  const handleEditStrategy = async (id) => {
    // console.log("delete", id);

    navigate(`/accounts/dashboard/addstrategy/${id}`,{
      state: {email_id: email_id},
    });
    // setChange(Math.random());
  }

  const fetchStockData = async (stock) => {
    let stock_name = stock;
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

      return data.data.detailed_name;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStockSelect = (stock, detailed_name) => {
    // console.log(stock,detailed_name, "stock");
    setloading2(true);
    setSelectedStock(stock);
    if(stock == stock.split(".")[0]){
      setDuration("1Y");
    }
    else{
      setDuration("1M");
    }
    setSelectedStockName(detailed_name);
    setTimeout(() => {
      setloading2(false);
    }, 1000);
  };

  const fetchdata = async () => {
    // setloading(true);
    const data = await ServerRequest({
      method: "get",
      URL: `/strategy/get?email=${email_id}`,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    console.log(data);
    if (data.data.length > 0) {
      const uniqueIds = new Set();

      const filteredData = data.data.filter((item) => {
        if (uniqueIds.has(item.id)) {
          return false;
        } else {
          uniqueIds.add(item.id);
          return true;
        }
      });

      const strategiesArray = data.data.map((item) => ({
        id: item.id,
        strategyname: item.name,
        description: item.description,
        assetclass: [
          {
            name: item.asset_class_name,
            stock: item.stock,
            percentage: item.percentage,
          },
        ],
      }));

      const combinedStrategiesArray = strategiesArray.reduce((acc, curr) => {
        const existingStrategy = acc.find((item) => item.id === curr.id);

        if (existingStrategy) {
          curr.assetclass.forEach((asset) => {
            const existingAsset = existingStrategy.assetclass.find(
              (a) => a.name === asset.name
            );
            if (existingAsset) {
              existingAsset.stock += `, ${asset.stock}`;
              existingAsset.percentage += `, ${asset.percentage}`;
            } else {
              existingStrategy.assetclass.push(asset);
            }
          });
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);

      setInitialStrategies(combinedStrategiesArray);
      // console.log(combinedStrategiesArray);

      if (combinedStrategiesArray.length > 0) {
        setClickedStrategy(combinedStrategiesArray[0]);
        setSelectedStrategy(0);
        setStockArray(combinedStrategiesArray[0].assetclass);
        setSelectedStock(
          combinedStrategiesArray[0].assetclass[0].stock.split(",")[0]
        );
        setStrategyid(combinedStrategiesArray[0].id);
        let stock =
          combinedStrategiesArray[0].assetclass[0].stock.split(",")[0];
          console.log(stock);
        if (stock == stock.split(".")[0]) {
          setDuration("1Y");
        } else {
          setDuration("1M");

        }
        fetchDataAndUpdateState();
      }
      // setTimeout(() => {
      // setloading(false);
      // }, 1000);
    }
  };
  useEffect(() => {
    setloading(true);
    fetchdata();
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, [change]);

  const handleStrategyClick = (index) => {
    setCnt(cnt + 1);
    const strategyClicked = initialStrategies[index];
    setSelectedStrategy(index);
    setClickedStrategy(strategyClicked);
    setStockArray(initialStrategies[index].assetclass);
    setStrategyid(initialStrategies[index].id);
    setSelectedStock(
      initialStrategies[index].assetclass[0].stock.split(",")[0]
    );
    setIschartvisible(false);
    let stock = initialStrategies[index].assetclass[0].stock.split(",")[0];
    console.log("click",stock);
    if (stock == stock.split(".")[0]) {
      setDuration("1Y");
    } else {
      setDuration("1M");
    }

    // console.log(initialStrategies[index].assetclass);

    // setStockArray(initialStrategies[index])
    // console.log(stockArray);

    if (window.innerWidth <= 768) {
      setIsLeftVisible(false);
      setIsRightVisible(true);
    }
  };

  const fetchDlData = async (id) => {
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

      return data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataAndUpdateState = async () => {
    if (selectedStrategy !== null) {
      try {
        if (initialStrategies.length !== 0) {
          setloading(true);
          // setIschartvisible(false);
          const data = await fetchDlData(
            initialStrategies[selectedStrategy].id
          );
          // console.log(data);
          const hasPendingStatus = data.some(
            (item) => item.status === "Pending"
          );
          setIschartvisible(!hasPendingStatus);
          const dateCompletedArray = data.map((item) =>
            new Date(item.date_completed).toISOString()
          );
          const filteredDates = dateCompletedArray.filter((date) => date);
          const latestDate = new Date(
            Math.max(...filteredDates.map((date) => new Date(date)))
          );
          setLastupdated(latestDate);
          // setLastupdated("abc");
          // console.log(hasPendingStatus);

          setTimeout(() => {
            setloading(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching and setting data:", error);
      }
    }
  };

  useEffect(() => {
    fetchDataAndUpdateState();
  }, [selectedStrategy, reRenderKey, initialStrategies]);

  const backButoonFunction = () => {
    setIsLeftVisible(true);
    setIsRightVisible(false);
  };

  useEffect(() => {
    if (stockArray.length > 0) {
      setOpenDropdown(new Array(stockArray.length).fill(true));
    }
  }, [stockArray]);

  const handleDropdownToggle = (dropdownIndex) => {
    // if (openDropdown === dropdownIndex) {
    //   setOpenDropdown(null);
    // } else {
    //   setOpenDropdown(dropdownIndex);
    // }
    setOpenDropdown((prevOpenDropdown) => {
      const newOpenDropdown = [...prevOpenDropdown];
      newOpenDropdown[dropdownIndex] = !newOpenDropdown[dropdownIndex];
      return newOpenDropdown;
    });
  };

  const graphContainerRef = useRef(null);
  const [graphDimensions, setGraphDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [reloadRequired, setReloadRequired] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const container = graphContainerRef.current;
      // console.log("container",container);

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // console.log("wh", containerHeight,containerWidth)

        setGraphDimensions({ width: containerWidth, height: containerHeight });
        // setRadarKey((prevKey) => prevKey + 1);
      }

      if (window.innerWidth > 768 && reloadRequired) {
        // Reload the page
        window.location.reload();
      }
      setReloadRequired(window.innerWidth <= 768);
    };
    if (!loading && !loading2) {
      updateDimensions();
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [cnt, ischartvisible, loading, loading2]);

  const insertStocks = async (stock, id, email_id) => {
    try {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/strategy/jobqueue`,
        data: {
          stock: `${stock}`,
          id: id,
          email_id: email_id,
        },
      });
      if (data1.server_error) {
        alert("error jobqueue");
      }

      if (data1.error) {
        alert("error1 jobqueue");
      }
      // console.log(data1);
    } catch (error) {
      console.error(error);
    }
  };

  const run_analysis = async () => {
    // setloading(true);
    for (const stock of stockArray) {
      const stockList = stock.stock;
      const trimmedStocks = stockList.split(",").map((stock) => stock.trim());
      for (const value of trimmedStocks) {
        await insertStocks(value, strategyID, email_id);
      }
    }
    navigate("/accounts/dashboard/jobqueue", {
      state: { email_id: email_id },
    });
    // setReRenderKey((prevKey) => prevKey + 1);
    // setloading(false);
  };

  const [chart_data, setChartData] = useState([]);

  const handleDuraion = (item) => {
    setDuration(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          !selectedStock ||
          !duration ||
          !strategyID ||
          initialStrategies.length == 0 ||
          ischartvisible == false ||
          !ischartvisible
          // || loading == true
        ) {
          if (ischartvisible == false || initialStrategies.length == 0) {
            setloading2(false);
          }
          return;
        }

        setloading2(true);

        const name = await fetchStockData(selectedStock);
        // console.log("name", name);
        // const name = "abc";
        setSelectedStockName(name);

        const data1 = await ServerRequest({
          method: "get",
          URL: `/strategy/chartdata?stock=${selectedStock}&range=${duration}&id=${strategyID}`,
        });
        if (data1.server_error) {
          // alert("error chart");
        }

        if (data1.error) {
          // alert("error1 chart");
        }

        setChartData(data1.data);
        setTimeout(() => {
          setloading2(false);
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [selectedStock, strategyID, duration, ischartvisible]);

  const handleEdit = async () => {
    navigate(`/accounts/dashboard/addstrategy/${strategyID}`, {
      state: { email_id: email_id },
    });
  };

  const protfolio = [];
  const handleGetSum = (value) => {
    const existingItem = protfolio.find(
      (item) => item.heading === value.heading
    );

    if (existingItem) {
      existingItem.total = value.total;
    } else {
      protfolio.push(value);
    }
    setTotalsum(protfolio.reduce((sum, item) => sum + item.total, 0));
  };

  const [animatedValue, setAnimatedValue] = useState(0);
  const animationDuration = 2000;
  const animateValue = (finalValue) => {
    let start = 0;
    const increment = (finalValue / animationDuration) * 5;

    const intervalId = setInterval(() => {
      start += increment;
      setAnimatedValue(start);

      if (start >= finalValue) {
        clearInterval(intervalId);
      }
    }, 5);
  };

  useEffect(() => {
    animateValue(sum * 100);
  }, [sum]);
  // console.log(lastupdated);

  console.log(loading, loading2,lastupdated,chart_data.length,initialStrategies.length);
  // console.log("chart", ischartvisible, chart_data.length);
  // console.log(openDropdown);

  return !loading &&
    (chart_data.length > 0 || loading2 == false) &&
    lastupdated ? (
    <div className="swift-accounts-main">
      <Header email_id={email_id} setloading={setloading}  />
      <div className="swift-accounts-content">
        <div
          className={`swift-accounts-content-left ${
            isLeftVisible ? "" : "hideleft"
          }`}
          id="left"
        >
          <div className="swift-accounts-content-strategy">
            {initialStrategies.length == 0 && (
              <div className="analysis-pending">
                <p className="analysis-pending-heading">
                  No Strategy Avaliable
                </p>
              </div>
            )}
            {initialStrategies.length > 0 &&
              initialStrategies.map((strategy, index) => (
                <Strategy
                  key={index}
                  setChange={setChange}
                  id={strategy.id}
                  email_id={email_id}
                  heading={strategy.strategyname}
                  content={strategy.description}
                  isClicked={index === selectedStrategy}
                  style={
                    index !== selectedStrategy
                      ? { color: "rgba(1, 22, 39, 0.30)" }
                      : {}
                  }
                  edithandler={handleEditStrategy}
                  deletehandler={handleDeleteStrategy}
                  onClick={() => handleStrategyClick(index)}
                />
              ))}
          </div>
          <div className="swift-accounts-content-btn">
            <CustomButton
              text="Add Strategy"
              classname="swift-accounts-content-button"
              onClick={() => {
                navigate("/accounts/dashboard/addstrategy", {
                  state: { email_id: email_id },
                });
              }}
            />
          </div>
        </div>

        {initialStrategies.length == 0 ? (
          <div className="analysis-pending">
            <p className="analysis-pending-heading">Add Strategy First</p>
          </div>
        ) : ischartvisible ? (
          <div
            className={`swift-accounts-content-right ${
              isRightVisible ? "showright" : ""
            }`}
            id="right"
          >
            <div
              className={`back-button ${
                isRightVisible ? "showbackbutton" : ""
              }`}
            >
              <BackButton customFunction={backButoonFunction} />
            </div>
            <div
              className={`swift-accounts-content-div-1 ${
                isRightVisible ? "showdiv-1" : ""
              }`}
            >
              <div className="swift-accounts-content-details">
                <p className="swift-account-content-heading">
                  {clickedStrategy != null && clickedStrategy.strategyname}
                </p>
                <p className="swift-account-content-content">
                  {clickedStrategy != null && clickedStrategy.description}
                </p>
              </div>
              <div
                className={`swift-account-content-graph ${
                  isRightVisible ? "showgraph" : ""
                }`}
              >
                <div className="swift-asset-range-buttons">
                  {selectedStock &&
                    selectedStock.split(".")[0] !== selectedStock && (
                      <>
                        <p
                          onClick={() => handleDuraion("1M")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "1M" ? "selected_duration" : ""
                          }
                        >
                          1m
                        </p>
                        <p
                          onClick={() => handleDuraion("3M")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "3M" ? "selected_duration" : ""
                          }
                        >
                          3m
                        </p>
                        <p
                          onClick={() => handleDuraion("6M")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "6M" ? "selected_duration" : ""
                          }
                        >
                          6m
                        </p>
                        <p
                          onClick={() => handleDuraion("YTD")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "YTD" ? "selected_duration" : ""
                          }
                        >
                          YTD
                        </p>
                      </>
                    )}
                  <p
                    onClick={() => handleDuraion("1Y")}
                    style={{ cursor: "pointer" }}
                    className={duration == "1Y" ? "selected_duration" : ""}
                  >
                    1y
                  </p>
                  <p
                    onClick={() => handleDuraion("5Y")}
                    style={{ cursor: "pointer" }}
                    className={duration == "5Y" ? "selected_duration" : ""}
                  >
                    5y
                  </p>
                  <p
                    onClick={() => handleDuraion("MAX")}
                    style={{ cursor: "pointer" }}
                    className={duration == "MAX" ? "selected_duration" : ""}
                  >
                    Max
                  </p>
                </div>
                <div className="swift-account-graph" ref={graphContainerRef}>
                  {graphDimensions.width > 0 && graphDimensions.height > 0 && (
                    <LineChart
                      data={chart_data}
                      width={graphDimensions.width}
                      height={graphDimensions.height}
                      duration={duration}
                      loading2={loading2}
                      name={selectStockName}
                    />
                    // <p> {graphDimensions.width }</p>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`swift-accounts-content-div-2 ${
                isRightVisible ? "showdiv-1" : ""
              }`}
            >
              <div className="swift-accounts-content-stocks-info">
                <div className="swift-accounts-content-stocks-details">
                  <div className="swift-accounts-content-stocks-header">
                    <div className="swift-accounts-content-stocks-left">
                      <p>
                        Portfolio
                        <span style={{ fontSize: "12px" }}>
                          {` (3m exp. ret `}

                          <span
                            className={
                              animatedValue >= 0 ? "green-text" : "red-text"
                            }
                          >
                            {animatedValue.toFixed(2)}%
                          </span>
                          {")"}
                        </span>
                      </p>
                    </div>
                    <div className="swift-accounts-content-stocks-right">
                      <p onClick={handleEdit}>Change</p>
                    </div>
                  </div>
                  <div className="swift-accounts-content-stocks-checkbox">
                    {lastupdated && (
                      <p>
                        Last Run date:{" "}
                        {moment
                          .tz(moment(lastupdated), moment.tz.guess())
                          // .add(5, "hours")
                          // .add(30, "minutes")
                          .format("DD-MM-YYYY HH:mm:ss")}
                      </p>
                    )}
                    <p className="run-analysis-btn" onClick={run_analysis}>
                      Run Analysis
                    </p>
                  </div>
                  <div className="swift-accounts-content-stocks-text">
                    <div className="swift-accounts-content-stocks-text-left">
                      <div className="swift-accounts-content-stocks-text-left-sub-div">
                      <p className="swift-accounts-content-stocks-text-left-sub-div-p1">MTD</p>
                      <p className="swift-accounts-content-stocks-text-left-sub-div-p2">Price</p>
                      <p className="swift-accounts-content-stocks-text-left-sub-div-p1">SAA</p>
                      <p className="swift-accounts-content-stocks-text-left-sub-div-p1">Prediction (3 mth)</p>
                      <p className="swift-accounts-content-stocks-text-left-sub-div-p1">Confidence</p>
                      </div>
                    </div>

                  </div>
                </div>
                <div
                  className="swift-accounts-content-stocks-show"
                  key={reRenderKey}
                >
                  {stockArray.map((asset, index) => (
                    <StockesDropdown
                      key={index}
                      heading={asset.name}
                      options={[asset]}
                      id={strategyID}
                      // isOpen={openDropdown === index}
                      isOpen={openDropdown[index]}
                      onToggle={() => handleDropdownToggle(index)}
                      onStockSelect={handleStockSelect}
                      getsum={handleGetSum}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`swift-accounts-content-right ${
              isRightVisible ? "showright" : ""
            }`}
            id="right"
          >
            <div className="analysis-pending">
              <p className="analysis-pending-heading">Analysis pending</p>
              <p className="analysis-pending-content">
                We will be running the securities via our ML algorithims every
                10 minutes. You should see results of of our models in 1-2
                hours.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  );
};

export default AssetAllocation;
