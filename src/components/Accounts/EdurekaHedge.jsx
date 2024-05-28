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
import SwiftModal from "../CustomComponents/SwiftModal/SwiftModal.js";
import "../../css/Accounts/HedgeModal.css";
import CustomInput from "../CustomComponents/CustomInput/CustomInput.jsx";
import ScatterChart from "./ScatterChart.jsx";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown.jsx";
import Close from "../../assets/crossicon.svg";

const EdurekaHedge = () => {
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
  const [lastupdated, setLastupdated] = useState("abc");
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

  const [visibleModal, setVisibleModal] = useState(false);

  const [weights, setWeights] = useState();
  const [scatter_data, setScatter_data] = useState();
  const [stock_weights, setStock_weights] = useState();

  // console.log(email_id);

  const handleDeleteStrategy = async (id) => {
    console.log("delete", id);

    const data = await ServerRequest({
      method: "delete",
      URL: `/strategy/eureka`,
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

    navigate(`/accounts/dashboard/eureka/addstrategy/${id}`, {
      state: { email_id: email_id },
    });
    // setChange(Math.random());
  };

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
    if (stock == stock.split(".")[0]) {
      setDuration("3Y");
    } else {
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
      URL: `/strategy/getEureka?email=${email_id}`,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    if (data) {
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
            min_weight: item.min_weight,
            max_weight: item.max_weight,
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
              existingAsset.min_weight += `, ${asset.min_weight}`;
              existingAsset.max_weight += `, ${asset.max_weight}`;
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
      // console.log("cc", combinedStrategiesArray);

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
          setDuration("3Y");
        } else {
          setDuration("1M");
        }
        setLastupdated("abc");
        // fetchDataAndUpdateState();
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
    setCnt((prev) => prev + 1);

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
    console.log("click", stock);
    if (stock == stock.split(".")[0]) {
      setDuration("3Y");
    } else {
      setDuration("1M");
    }
    // console.log("sa", initialStrategies[index].assetclass);
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
    // setloading(true);
    // setIschartvisible(true);
    // setTimeout(() => {
    //   setloading(false);
    // }, 1000);
  }, [selectedStrategy, reRenderKey, initialStrategies,ischartvisible]);

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
  const scatterRef = useRef(null);
  const [scatterDimensions, setScatterDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [graphDimensions, setGraphDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [reloadRequired, setReloadRequired] = useState(false);
  const [radarKey, setRadarKey] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const container = graphContainerRef.current;
      // console.log("container",container);

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // console.log("wh", containerHeight,containerWidth)

        setGraphDimensions({ width: containerWidth, height: containerHeight });
        setRadarKey((prevKey) => prevKey + 1);
      }

      if (window.innerWidth > 768 && reloadRequired) {
        // Reload the page
        window.location.reload();
      }
      setReloadRequired(window.innerWidth <= 768);
    };
    if (!loading && !loading2) {
      // console.log("hello");
      updateDimensions();
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [cnt, ischartvisible, loading, loading2]);

  useEffect(() => {
    const updateDimensions = () => {
      const container = scatterRef.current;
      // console.log("container",container);

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // console.log("wh", containerHeight,containerWidth)

        setScatterDimensions({
          width: containerWidth,
          height: containerHeight,
        });
        // setRadarKey((prevKey) => prevKey + 1);
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [scatter_data]);

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
            // console.log("hii");
            setloading2(false);
          }
          // console.log("hello");
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
  }, [selectedStock, strategyID, ischartvisible, duration]);

  const handleEdit = async () => {
    navigate(`/accounts/dashboard/eureka/addstrategy/${strategyID}`, {
      state: { email_id: email_id },
    });
  };

  const protfolio = [];
  const handleGetSum = (value) => {
    // console.log("val",value)
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

  const openModal = async () => {
    setVisibleModal(true);
    setScatter_data();
    setOptData();
    handleResultclick();
    // setWeights();
  };
  const closeModal = async () => {
    setVisibleModal(false);
    setScatter_data();
    setOptData();
    setDev("Select");
    // setChange((prev) => prev + 1);
    // setWeights();
  };

  const fetchStockDetails = async (stock) => {
    try {
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/getstockinfo?stock=${stock}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }
      // console.log(stock,data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [stock_details, setStock_details] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  // const [loadingChart,setLoadingChart] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (stockArray.length > 0) {
        setWeights();
        const min_weight_array = stockArray[0].min_weight.split(",");
        const max_weight_array = stockArray[0].max_weight.split(",");

        stockArray[0].stock.split(",").forEach(async (value, index) => {
          const stock = value.trim();
          setWeights((prev) => ({
            ...prev,
            [stock]: [
              parseFloat(min_weight_array[index]),
              parseFloat(max_weight_array[index]),
            ],
          }));

          const stockExists = stock_details.some(
            (item) => item.stock === stock
          );
          if (!stockExists) {
            // console.log(stock);
            const details = await fetchStockDetails(stock);
            // console.log(stock,details)
            setStock_details((prev) => [
              ...prev,
              { stock, detailed_name: details.detailed_name },
            ]);
          }
        });
      }
    };

    fetchData();
    setTimeout(() => {
      setLoadingStock(false);
    }, 1000);
  }, [stockArray]);

  const handleResultclick = async () => {
    // const data=weights;
    // console.log("wei", weights);
    if (weights) {
      try {
        // setLoadingChart(true);
        const data1 = await ServerRequest({
          method: "post",
          URL: `/strategy/insertdldataEureka?id=${strategyID}`,
          data: weights,
        });
        if (data1.server_error) {
          Alert({
            TitleText: "Error",
            Message: `Optimization is not possible for this weights`,
            BandColor: "#e51a4b",

            AutoClose: {
              Active: true,
              Line: true,
              LineColor: "#e51a4b",
              Time: 2,
            },
          });
        }

        if (data1.error) {
          Alert({
            TitleText: "Error",
            Message: `Optimization is not possible for this weights`,
            BandColor: "#e51a4b",

            AutoClose: {
              Active: true,
              Line: true,
              LineColor: "#e51a4b",
              Time: 2,
            },
          });
        }
        // console.log(data1);
        setScatter_data(data1.data);
        // setLoadingChart(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveclick = async () => {
    try {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/strategy/updateWeights?id=${strategyID}`,
        data: weights,
      });
      if (data1.server_error) {
        alert("Server Error");
      }

      if (data1.error) {
        alert("Update  weight Error");
      }
    } catch (error) {
      console.error(error);
    }
    setVisibleModal(false);
    setScatter_data();
    setOptData();
    setChange((prev) => prev + 1);
  };

  const handleUpdatePortfolio = async () => {
    const apiData = stockArray[0].stock.split(",").map((value, index) => ({
      [value.trim()]: OptData.z[index],
    }));
    try {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/strategy/updatepercentage?id=${strategyID}`,
        data: apiData,
      });
      if (data1.server_error) {
        alert("Server Error");
      }

      if (data1.error) {
        alert("Update  weight Error");
      }
    } catch (error) {
      console.error(error);
    }
    setVisibleModal(false);
    setScatter_data();
    setOptData();
    setChange((prev) => prev + 1);
  };

  const [OptData, setOptData] = useState();
  const HandleOptData = (array) => {
    setOptData(array);
  };
  const [dev, setDev] = useState("Select");
  const devationDropdownSelect = async (option) => {
    // let dev;
    if (option == "Select") {
      setLoadingStock(true);
      setDev("Select");
      setTimeout(() => {
        setLoadingStock(false);
      }, 1000);
    } else if (option == "Unconstrained") {
      setLoadingStock(true);
      setDev("Unconstrained");
      setTimeout(() => {
        setLoadingStock(false);
      }, 1000);
    } else {
      let x = option.split("%")[0];
      setLoadingStock(true);
      setDev(parseFloat(x / 100));
      setTimeout(() => {
        setLoadingStock(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (stockArray.length > 0) {
      stockArray[0].stock.split(",").forEach(async (value, index) => {
        const stock = value.trim();

        if (dev != "Select" && dev != "Unconstrained") {
          setWeights((prev) => ({
            ...prev,
            [stock]: [
             Math.max( parseFloat(
                (
                  (stockArray[0].percentage.split(",")[index] / 100) *
                  (1 - dev)
                ).toFixed(3)
              ),0),
              Math.min(parseFloat(
                (
                  (stockArray[0].percentage.split(",")[index] / 100) *
                  (1 + dev)
                ).toFixed(3)
              ),1),
            ],
          }));
        } else {
          // console.log(dev)
          if (dev == "Unconstrained") {
            // console.log("11",dev);
            stockArray[0].stock.split(",").forEach(async (value, index) => {
              const stock = value.trim();
              setWeights((prev) => ({
                ...prev,
                [stock]: [0, 1],
              }));
            });
          } else {
            const min_weight_array = stockArray[0].min_weight.split(",");

            const max_weight_array = stockArray[0].max_weight.split(",");

            stockArray[0].stock.split(",").forEach(async (value, index) => {
              const stock = value.trim();
              setWeights((prev) => ({
                ...prev,
                [stock]: [
                  parseFloat(min_weight_array[index]),
                  parseFloat(max_weight_array[index]),
                ],
              }));
            });
          }
        }
      });
    }
  }, [dev]);

  // console.log(dev);

  return !loading &&
    (chart_data.length > 0 || loading2 == false) &&
    lastupdated ? (
    <div className="swift-accounts-main">
      <Header email_id={email_id} setloading={setloading} />
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
                navigate("/accounts/dashboard/eureka/addstrategy", {
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
              {/* <div className="swift-asset-btn-div">
                <button className="asset-div-btn">Prediction</button>
                <button className="asset-div-btn">Optimization</button>
              </div> */}
              {/* eureka-graph */}
              <div className="swift-accounts-content-details">
                <p className="swift-account-content-heading">
                  {clickedStrategy != null && clickedStrategy.strategyname}
                </p>
                <p className="swift-account-content-content">
                  {clickedStrategy != null && clickedStrategy.description}
                </p>
              </div>
              <div
                className={`swift-account-content-graph   ${
                  isRightVisible ? "showgraph" : ""
                }`}
              >
                {/* <div
                  className="swift-account-graph eureka-graph"
                  ref={graphContainerRef}
                >
                  {graphDimensions.width > 0 && graphDimensions.height > 0 && (
                    <Radar
                      key={radarKey}
                      data={chart_data}
                      height={graphDimensions.height}
                      width={graphDimensions.width}
                      options={radarOptions}
                      updateMode={"resize"}
                    />
                    // <p> {graphDimensions.width }</p>
                  )}
                </div> */}

                <div className="swift-asset-range-buttons">
                  <p
                    onClick={() => handleDuraion("3Y")}
                    style={{ cursor: "pointer" }}
                    className={duration == "3Y" ? "selected_duration" : ""}
                  >
                    3y
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
                          {` (12m exp. ret `}

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
                    <button className="asset-div-btn" onClick={openModal}>
                      Optimization
                    </button>
                    <p className="run-analysis-btn" onClick={run_analysis}>
                      Run Analysis
                    </p>
                  </div>
                  <div className="swift-accounts-content-stocks-text">
                    <div className="swift-accounts-content-stocks-text-left">
                      <div className="swift-accounts-content-stocks-text-left-sub-div">
                        <p className="swift-accounts-content-stocks-text-left-sub-div-p1">
                          MTD
                        </p>
                        <p className="swift-accounts-content-stocks-text-left-sub-div-p2">
                          Price
                        </p>
                        <p className="swift-accounts-content-stocks-text-left-sub-div-p1">
                          SAA
                        </p>
                        <p className="swift-accounts-content-stocks-text-left-sub-div-p1">
                          Prediction (12 mth)
                        </p>
                        <p className="swift-accounts-content-stocks-text-left-sub-div-p1">
                          Confidence
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="swift-accounts-content-stocks-show"
                  key={reRenderKey}
                >
                  <StockesDropdown
                    heading={stockArray[0].name}
                    options={[stockArray[0]]}
                    id={strategyID}
                    isOpen={true}
                    onStockSelect={handleStockSelect}
                    getsum={handleGetSum}
                    selectedStock={selectedStock}
                  />
                  {/* ))} */}
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
      {visibleModal && (
        <SwiftModal closeModal={closeModal} top="2%">

          <div className="swift-modal-content">

          <div
            className="custom__alert__close"
            onClick={()=>closeModal()}
          >
            <img src={Close} alt="X" />
          </div>

          <div className="swift-modal-main-content">
            <div className="swift-modal-content-left">
              <div className="swift-modal-weights">
                <div className="swift-modal-dropdown">
                  <p>Select Deviation</p>
                  <CustomDropdown
                    options={[
                      "Select",
                      "Unconstrained",
                      "10%",
                      "20%",
                      "30%",
                      "40%",
                      "50%",
                      "60%",
                      "70%",
                      "80%",
                      "90%",
                      "100%",
                    ]}
                    onSelect={devationDropdownSelect}
                    default_value={"Select"}
                    style={{ width: "150px" }}
                  />
                </div>
                <div className="swift-modal-weights-heading">
                  <p>Stock</p>
                  <p>Weight</p>
                  <p>Min. Wt.(%)</p>
                  <p>Max. Wt.(%)</p>
                </div>
                {!loadingStock ? (
                  <div className="swift-modal-weights-content">
                    {stockArray[0].stock.split(",").map((item, index) => (
                      <div className="swift-modal-weights-content-main">
                        <div
                          className="swift-modal-weight-content-div"
                          key={index}
                        >
                          <div>
                            <p>{item}</p>
                          </div>
                          <p>{stockArray[0].percentage.split(",")[index]}%</p>
                          <p>
                            <CustomInput
                              classnameInput={"swift-modal-input-weight"}
                              type="number"
                              value={
                                dev == "Select"
                                  ? weights[item.trim()][0]
                                  : dev == "Unconstrained"
                                  ? 0
                                  : Math.max(parseFloat(
                                      (
                                        (stockArray[0].percentage.split(",")[
                                          index
                                        ] /
                                          100) *
                                        (1 - dev)
                                      ).toFixed(3)
                                    ),0)
                              }
                              styleInput={{ width: "100%", height: "10px" }}
                              // maxLength={"3"}
                              name={item.trim()}
                              onInputChange={(name, value) => {
                                setWeights((prevValues) => ({
                                  ...prevValues,
                                  [name]: [
                                    parseFloat(value),
                                    prevValues[name] ? prevValues[name][0] : 0,
                                  ],
                                }));
                              }}
                            />
                          </p>
                          <p>
                            <CustomInput
                              type="number"
                              classnameInput={"swift-modal-input-weight"}
                              styleInput={{ width: "100%", height: "10px" }}
                              // maxLength={"3"}
                              value={
                                dev == "Select"
                                  ? weights[item.trim()][1]
                                  : dev == "Unconstrained"
                                  ? 1
                                  : Math.min(parseFloat(
                                      (
                                        (stockArray[0].percentage.split(",")[
                                          index
                                        ] /
                                          100) *
                                        (1 + dev)
                                      ).toFixed(3)
                                    ),1)
                              }
                              name={item.trim()}
                              onInputChange={(name, value) => {
                                setWeights((prevValues) => ({
                                  ...prevValues,
                                  [name]: [
                                    prevValues[name] ? prevValues[name][0] : 0,
                                    parseFloat(value),
                                  ],
                                }));
                              }}
                            />
                          </p>
                        </div>
                        <div
                          className="swift-modal-weights-content-details"
                          title={
                            stock_details
                              ? stock_details.find(
                                  (s) => s.stock == item.trim()
                                ).detailed_name
                              : ""
                          }
                        >
                          {stock_details
                            ? stock_details.find((s) => s.stock == item.trim())
                                .detailed_name
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="swift-aseet-loader">
                    {/* <p>Loading</p> */}
                    <Pulse />
                  </div>
                )}
              </div>
              <div className="swift-accounts-content-btn modal-submit-btn-div">
                <CustomButton
                  text="Submit"
                  classname="swift-accounts-content-button modal-btn"
                  onClick={handleResultclick}
                />
              </div>
            </div>
            <div className="swift-modal-content-right">
              <div className="swift-modal-graph" ref={scatterRef}>
                {scatter_data &&
                scatter_data.length > 0 &&
                scatterDimensions.width > 0 &&
                scatterDimensions.height > 0 ? (
                  <ScatterChart
                    initialData={scatter_data}
                    width={scatterDimensions.width}
                    height={scatterDimensions.height}
                    HandleOptData={HandleOptData}
                    // chartload = {loadingChart}
                  />
                ) : (
                  // <p>Please provide weights for optimization</p>
                  <></>
                )}
              </div>
              <div className="swift-modal-optData">
                {OptData ? (
                  <div className="swift-modal-portfolio">
                    <p className="swift-modal-portfolio-heading">
                      Selected Portfolio
                    </p>
                    <div>
                      <p className="swift-modal-portfolio-title">
                        Extected Return
                      </p>
                      <p className="swift-modal-portfolio-heading">
                        {parseFloat(OptData.y).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="swift-modal-portfolio-title">
                        Extected Risk
                      </p>
                      <p className="swift-modal-portfolio-heading">
                        {parseFloat(OptData.x).toFixed(2)}%
                      </p>
                    </div>
                    {/* <p>risk - {OptData.risk}</p> */}
                    <div className="swift-modal-portfoli-weight">
                      <p className="swift-modal-portfolio-heading">
                        Portfolio Weights
                      </p>
                      <div className="swift-modal-portfolios-weights-heading">
                        <p className="swift-modal-portfolio-heading1">
                          Security
                        </p>
                        <p className="swift-modal-portfolio-heading2">
                          Proposed Wt.
                        </p>
                        <p className="swift-modal-portfolio-heading2">
                          Actual Wt
                        </p>
                        <p className="swift-modal-portfolio-heading2">Diff.</p>
                      </div>
                      <div className="swift-modal-portfolio-weights-content">
                        {stockArray[0].stock.split(",").map((item, index) => (
                          <div
                            key={index}
                            className="swift-modal-portfolio-weight-stock"
                          >
                            <div className="swift-modal-portfolio-detailed-list">
                              <p className="swift-modal-portfolio-title">
                                {item}
                              </p>
                              <p className="swift-modal-weight-detailed-name">
                                {stock_details
                                  ? stock_details.find(
                                      (s) => s.stock == item.trim()
                                    ).detailed_name
                                  : ""}
                              </p>
                            </div>
                            <p className="swift-modal-portfolio-title">
                              {parseFloat(OptData.z[index] * 100).toFixed(2)}%
                            </p>
                            <p className="swift-modal-portfolio-title">{stockArray[0].percentage.split(",")[index]}%</p>
                            <p className="swift-modal-portfolio-title" >
                              {(
                                parseFloat(OptData.z[index] * 100).toFixed(2) -
                                parseFloat(
                                  stockArray[0].percentage.split(",")[index]
                                )
                              ).toFixed(2)}
                              %
                            </p>
                          </div>
                        ))}
                        {/* </table> */}
                      </div>

                      <div className="swift-accounts-content-btn modal-submit-btn-div">
                        <CustomButton
                          text="Update portfolio"
                          classname="swift-accounts-content-button modal-submit-btn"
                          onClick={handleUpdatePortfolio}
                        />
                        <CustomButton
                          text="Save ranges"
                          classname="swift-accounts-content-button modal-submit-btn"
                          onClick={handleSaveclick}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // <p>Select the risk and return</p>
                  <></>
                )}
              </div>
            </div>
            </div>
          </div>
        </SwiftModal>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  );
};

export default EdurekaHedge;
