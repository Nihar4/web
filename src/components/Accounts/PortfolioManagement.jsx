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
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import SwiftModal from "../CustomComponents/SwiftModal/SwiftModal";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import ScatterChart from "./ScatterChart";
import Close from "../../assets/crossicon.svg";
import { numberFormat, numberFormatMatrix } from "../../utils/utilsFunction";
import PerformanceChart from "./PerformanceChart";
import PortfolioStockesDropdown from "./PortfolioStockesDropdown";
import CustomNumberInput from "../CustomComponents/CustomInput/CustomNumberInput";

const PortfolioManagement = () => {
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
  const [pageLoading, setPageLoading] = useState(false);
  const [loading2, setloading2] = useState(true);
  const [duration, setDuration] = useState("1Y");
  const [openDropdown, setOpenDropdown] = useState();

  const [sum, setTotalsum] = useState(null);

  const [selectedStock, setSelectedStock] = useState(null);
  const [selectStockName, setSelectedStockName] = useState(null);

  const location = useLocation();
  // const email_id = location.state ? location.state.email_id : null;
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;
  const [visibleModal, setVisibleModal] = useState(false);

  const [weights, setWeights] = useState();
  const [scatter_data, setScatter_data] = useState();
  const [stock_weights, setStock_weights] = useState();
  const [runanalysis, setRunAnalysis] = useState(false);
  const [chartModal, setchartModal] = useState(false);

  const [inflow, setInflow] = useState(0);
  const [portfolio_value, setPortfolio_Value] = useState(0);

  const handleDeleteStrategy = async (id) => {
    alert("Delete");
    const data = await ServerRequest({
      method: "delete",
      URL: `/strategy/portfolio`,
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
    navigate(`/accounts/dashboard/addstrategy/${id}`, {
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
    setloading2(true);
    setchartModal(true);
    setSelectedStock(stock);
    if (stock == stock.split(".")[0]) {
      setDuration("1Y");
    } else {
      setDuration("1Y");
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
      URL: `/strategy/portfolio/get?email=${email_id}`,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

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
        if (stock == stock.split(".")[0]) {
          setDuration("1Y");
        } else {
          setDuration("1Y");
        }
        // setLastupdated("abc");
        fetchDataAndUpdateState();
      }
      // setTimeout(() => {
      // setloading(false);
      // }, 1000);
    }
  };

  const handleStrategyClick = (index, initialStrategies) => {
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
    if (stock == stock.split(".")[0]) {
      setDuration("1Y");
    } else {
      setDuration("1Y");
    }

    // setStockArray(initialStrategies[index])

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

      return data;
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
          const { data, isPending } = await fetchDlData(
            initialStrategies[selectedStrategy].id
          );
          const hasPendingStatus = isPending;
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

          setTimeout(() => {
            setloading(false);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching and setting data:", error);
      }
    }
  };

  const backButoonFunction = () => {
    setIsLeftVisible(true);
    setIsRightVisible(false);
  };

  const handleDropdownToggle = (dropdownIndex) => {
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

  const handleEdit = async () => {
    navigate(
      `/accounts/dashboard/portfolio-management/addstrategy/${strategyID}`,
      {
        state: { email_id: email_id },
      }
    );
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
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const newValue = progress * finalValue;

      setAnimatedValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    animateValue(sum * 100);
  }, [sum]);

  let currentIndex = 0;
  const openModal = async () => {
    setVisibleModal(true);
    setScatter_data();
    setOptData();
    handleResultclick();
    currentIndex = 0;
    // setWeights();
  };

  const closeModal = async () => {
    setVisibleModal(false);
    setScatter_data();
    setOptData();
    currentIndex = 0;
    setDev("Select");
    // setChange((prev) => prev + 1);
    // setWeights();
  };
  const closeChartModal = () => {
    setchartModal(false);
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
      return data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [stock_details, setStock_details] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  // const [loadingChart,setLoadingChart] = useState(true);

  const handleResultclick = async () => {
    // const data=weights;
    if (weights) {
      try {
        // setLoadingChart(true);
        const data1 = await ServerRequest({
          method: "post",
          URL: `/strategy/insertdldata-asset?id=${strategyID}`,
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
            Message: `Optimization is not possible for this weights1`,
            BandColor: "#e51a4b",

            AutoClose: {
              Active: true,
              Line: true,
              LineColor: "#e51a4b",
              Time: 2,
            },
          });
        }
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
        URL: `/strategy/updateWeights-asset?id=${strategyID}`,
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
    currentIndex = 0;
    setChange((prev) => prev + 1);
  };

  const handleUpdatePortfolio = async () => {
    const apiData = [];
    let valueIndex = 0;
    for (let stockObj of stockArray) {
      stockObj.stock.split(",").forEach(async (value, index) => {
        const stock = stockObj.name + "+" + value.trim();
        const percentage = OptData.z[valueIndex];
        valueIndex++;
        apiData.push({ [stock]: percentage });
      });
    }
    // const apiData = stockArray[0].stock.split(",").map((value, index) => ({
    //   [value.trim()]: OptData.z[index],
    // }));
    try {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/strategy/updatePercentage-asset?id=${strategyID}`,
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
    const updateDimensions = () => {
      const container = graphContainerRef.current;

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

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

  useEffect(() => {
    const updateDimensions = () => {
      const container = scatterRef.current;

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

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

  useEffect(() => {
    fetchDataAndUpdateState();
  }, [selectedStrategy, reRenderKey, initialStrategies, ischartvisible]);

  useEffect(() => {
    const fetchData = async () => {
      if (stockArray.length > 0) {
        setWeights();
        for (let stockObj of stockArray) {
          const minWeightStr = String(stockObj.min_weight);
          const maxWeightStr = String(stockObj.max_weight);

          const min_weight_array = minWeightStr.split(",");
          const max_weight_array = maxWeightStr.split(",");

          stockObj.stock.split(",").forEach(async (value, index) => {
            const stock = value.trim();

            if (
              min_weight_array[index] !== undefined &&
              max_weight_array[index] !== undefined
            ) {
              setWeights((prev) => ({
                ...prev,
                [stock]: [
                  parseFloat(min_weight_array[index]),
                  parseFloat(max_weight_array[index]),
                ],
              }));
            }

            const stockExists = stock_details.some(
              (item) => item.stock === stock
            );
            if (!stockExists) {
              const details = await fetchStockDetails(stock);
              setStock_details((prev) => [
                ...prev,
                { stock, detailed_name: details.detailed_name },
              ]);
            }
          });
        }
      }
    };

    fetchData();

    setTimeout(() => {
      setLoadingStock(false);
    }, 1000);
  }, [stockArray]);

  useEffect(() => {
    if (stockArray.length > 0) {
      for (let stockObj of stockArray) {
        stockObj.stock.split(",").forEach(async (value, index) => {
          const stock = value.trim();

          if (dev != "Select" && dev != "Unconstrained") {
            setWeights((prev) => ({
              ...prev,
              [stock]: [
                Math.max(
                  parseFloat(
                    (stockObj.percentage.split(",")[index] * (1 - dev)).toFixed(
                      3
                    )
                  ),
                  0
                ),
                Math.min(
                  parseFloat(
                    (stockObj.percentage.split(",")[index] * (1 + dev)).toFixed(
                      3
                    )
                  ),
                  100
                ),
              ],
            }));
          } else {
            if (dev == "Unconstrained") {
              stockObj.stock.split(",").forEach(async (stock, stockindex) => {
                const stockvalue = stock.trim();
                setWeights((prev) => ({
                  ...prev,
                  [stockvalue]: [0, 100],
                }));
              });
            } else {
              const minWeightStr = String(stockObj.min_weight);
              const maxWeightStr = String(stockObj.max_weight);

              const min_weight_array = minWeightStr.split(",");
              const max_weight_array = maxWeightStr.split(",");

              stockObj.stock.split(",").forEach(async (value, index) => {
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
    }
  }, [dev]);

  useEffect(() => {
    if (stockArray.length > 0) {
      setOpenDropdown(new Array(stockArray.length).fill(true));
    }
  }, [stockArray]);

  const fieldNames = [
    "Target Weight",
    "Curr. Price",
    "Target Qty.",
    "Curr. Qty.",
    "Curr. Value",
    "Curr. Weight",
    "Active Weight",
    "Inv. Price",
    "Inv. Value",
    "Total Ret",
    "Today's Return",
    "Today's Cont.",
    "Real. Gains",
    "Unreal. Gains",
    "Total Gains",
    "Prop. Invesment Qty.",
    "Prop. Invesment Value",
    "Eff. Weight",
    "Mtd. Ret.",
    "3Mth. Pred. Ret.",
    "",
  ];

  return (
    <>
      <div className="swift-accounts-main swift-accounts-portfolio-main">
        <Header
          email_id={email_id}
          setloading={setloading}
          display={true}
          handleStrategyClick={handleStrategyClick}
          setInitialStrategies={setInitialStrategies}
          change={change}
        />
        {!loading &&
        (chart_data.length > 0 || loading2 == false) &&
        lastupdated ? (
          <>
            <div
              className="swift-accounts-content"
              style={{ padding: "0 10px 10px 10px" }}
            >
              {initialStrategies.length == 0 ? (
                <div className="analysis-pending">
                  <p className="analysis-pending-heading">Add Strategy First</p>
                </div>
              ) : ischartvisible ? (
                <div
                  className={`swift-accounts-content-right ${
                    isRightVisible ? "showright" : ""
                  }`}
                  style={{ width: "100%", padding: "0px" }}
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
                    className={`swift-accounts-content-div-2 ${
                      isRightVisible ? "showdiv-1" : ""
                    }`}
                    style={{ width: "100%" }}
                  >
                    <div className="swift-accounts-content-stocks-info">
                      <div className="swift-accounts-content-stocks-details">
                        <div
                          className="swift-accounts-content-stocks-header"
                          style={{ flexDirection: "row-reverse" }}
                        >
                          <div
                            className="swift-accounts-content-stocks-left"
                            style={{ columnGap: "15px" }}
                          >
                            {lastupdated && (
                              <p
                                style={{
                                  color: "#011627b3",
                                  fontSize: "var(--font-small)",
                                  letterSpacing: "-0.5px",
                                  fontWeight: "400",
                                }}
                              >
                                Last Run date:{" "}
                                {moment
                                  .tz(moment(lastupdated), moment.tz.guess())
                                  // .add(5, "hours")
                                  // .add(30, "minutes")
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </p>
                            )}
                            <p>
                              Portfolio
                              <span
                                style={{ paddingLeft: "5px", fontSize: "12px" }}
                              >
                                {numberFormatMatrix(portfolio_value, 0)}
                              </span>
                              <span
                                style={{ fontSize: "12px", paddingLeft: "2px" }}
                              >
                                {` (3m exp. ret `}

                                <span
                                  className={
                                    animatedValue >= 0
                                      ? "green-text"
                                      : "red-text"
                                  }
                                >
                                  {animatedValue.toFixed(2)}%
                                </span>
                                {")"}
                              </span>
                            </p>
                          </div>
                          <div
                            className="swift-accounts-content-stocks-right"
                            style={{ alignItems: "center" }}
                          >
                            <p onClick={handleEdit}>Change</p>
                            <p onClick={() => handleDeleteStrategy(strategyID)}>
                              Delete
                            </p>
                            <p
                              className="run-analysis-btn"
                              onClick={run_analysis}
                            >
                              Run Analysis
                            </p>
                            <CustomNumberInput
                              labelText="Today's Inflow"
                              type="text"
                              classnameDiv="swift-accounts-portfolio-inflow-input"
                              name="inflow"
                              placeholder=""
                              styleInput={{
                                marginTop: "4px",
                                width: "150px",
                                padding: "5px 8px",
                                fontSize: "12px",
                                border: "none",
                                // borderBottom: "1px solid #f0f0f0",
                                backgroundColor: "#f1f1f1",
                              }}
                              onInputChange={(symbol, value) =>
                                setInflow(value)
                              }
                              value={inflow}
                            />
                          </div>
                        </div>

                        <div
                          className="swift-accounts-content-stocks-text"
                          style={{
                            borderBottom: "0.5px solid rgba(1, 22, 39, 0.1)",
                            paddingBottom: "8px",
                          }}
                        >
                          <div className="swift-accounts-content-stocks-text-left">
                            <div
                              className="swift-accounts-content-stocks-text-left-sub-div"
                              style={{ width: "92%" }}
                            >
                              {fieldNames.map((item, index) => {
                                const words = item.split(" ");
                                const firstPart = words.slice(0, -1).join(" ");
                                const lastWord = words[words.length - 1];

                                return (
                                  <p
                                    key={index}
                                    className={`swift-accounts-content-stocks-text-left-sub-div-p1 portfolio-dropdown-column`}
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "700",
                                      lineHeight: "1.5em",
                                    }}
                                  >
                                    {firstPart}
                                    <br />
                                    {lastWord}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="swift-accounts-content-stocks-show"
                        key={reRenderKey}
                      >
                        <PortfolioStockesDropdown
                          id={strategyID}
                          isOpen={openDropdown}
                          onToggle={handleDropdownToggle}
                          onStockSelect={handleStockSelect}
                          selectedStock={selectedStock}
                          setPortfolio_Value={setPortfolio_Value}
                          inflow={inflow ? inflow : 0}
                          setTotalsum={setTotalsum}
                        />
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
                      We will be running the securities via our ML algorithims
                      every 10 minutes. You should see results of of our models
                      in 1-2 hours.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {chartModal && (
              <SwiftModal closeModal={closeChartModal} top="10px">
                <div className="swift-chart-modal-content">
                  <div className="custom__alert__close">
                    <img
                      src={Close}
                      alt="X"
                      onClick={() => closeChartModal()}
                    />
                  </div>
                  <div
                    className={`swift-accounts-content-div-1 ${
                      isRightVisible ? "showdiv-1" : ""
                    }`}
                  >
                    {/* <div className="swift-accounts-content-details">
                      <p className="swift-account-content-heading">
                        {clickedStrategy != null &&
                          clickedStrategy.strategyname}
                      </p>
                      <p className="swift-account-content-content">
                        {clickedStrategy != null && clickedStrategy.description}
                      </p>
                    </div> */}
                    <div
                      className={`swift-account-content-graph ${
                        isRightVisible ? "showgraph" : ""
                      }`}
                      style={{ height: "100%" }}
                    >
                      <div className="swift-asset-range-buttons">
                        {/* {selectedStock &&
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
                  </p> */}
                        <p
                          onClick={() => handleDuraion("1Y")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "1Y" ? "selected_duration" : ""
                          }
                        >
                          1y
                        </p>
                        <p
                          onClick={() => handleDuraion("5Y")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "5Y" ? "selected_duration" : ""
                          }
                        >
                          5y
                        </p>
                        <p
                          onClick={() => handleDuraion("MAX")}
                          style={{ cursor: "pointer" }}
                          className={
                            duration == "MAX" ? "selected_duration" : ""
                          }
                        >
                          Max
                        </p>
                      </div>
                      <div
                        className="swift-account-graph"
                        ref={graphContainerRef}
                      >
                        {graphDimensions.width > 0 &&
                          graphDimensions.height > 0 && (
                            <LineChart
                              data={chart_data}
                              width={graphDimensions.width}
                              height={graphDimensions.height}
                              duration={duration}
                              loading2={loading2}
                              name={selectStockName}
                              lastupdated={lastupdated}
                            />
                          )}
                        {/* <p> {graphDimensions.width}</p>
                        <p> {graphDimensions.height}</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiftModal>
            )}
          </>
        ) : (
          <div className="swift-aseet-loader">
            <p>Loading</p>
            <Pulse />
          </div>
        )}
      </div>
    </>
  );
};

export default PortfolioManagement;
