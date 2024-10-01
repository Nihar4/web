import React, { useEffect, useRef, useState } from "react";
import "../../../css/Accounts/AssetAllocation.css";
import "../../../css/Accounts/HedgeModal.css";
import Strategy from "./Strategy";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";
import StockesDropdown from "./StockesDropdown";
import BackButton from "../../AccessManagement/BackButton";
import ServerRequest from "../../../utils/ServerRequest";
import { useNavigate } from "react-router-dom";
import LineChart from "../Charts/LineChart";
import { useLocation } from "react-router-dom";
import Pulse from "../../Loader/Pulse";
import moment from "moment-timezone";
import { Alert } from "../../CustomComponents/CustomAlert/CustomAlert";
import SwiftModal from "../../CustomComponents/SwiftModal/SwiftModal";
import CustomDropdown from "../../CustomComponents/CustomDropdown/CustomDropdown";
import CustomInput from "../../CustomComponents/CustomInput/CustomInput";
import ScatterChart from "../Charts/ScatterChart";
import Close from "../../../assets/crossicon.svg";
import ConfirmBox from "../../CustomComponents/ConfirmBox/ConfirmBox";

const AssetAllocation = () => {
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const navigate = useNavigate();
  const [chartError, setChartError] = useState(false);

  const graphContainerRef = useRef(null);
  const [graphDimensions, setGraphDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [reloadRequired, setReloadRequired] = useState(false);

  const [PageLoading, setPageLoading] = useState(true);
  const [ChartLoading, setChartLoading] = useState(true);
  const [StocksLoading, setStocksLoading] = useState(true);

  const [StrategyDetails, setStrategyDetails] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState();

  const [selectedStock, setSelectedStock] = useState();

  const [chart_data, setChartData] = useState([]);
  const [duration, setDuration] = useState("1Y");
  const [change, setChange] = useState(1);
  const [changeStock, setChangeStock] = useState(1);

  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [isRightVisible, setIsRightVisible] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const container = graphContainerRef.current;

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        setGraphDimensions({ width: containerWidth, height: containerHeight });
      }

      if (window.innerWidth > 768 && reloadRequired) {
        window.location.reload();
      }
      setReloadRequired(window.innerWidth <= 768);
    };
    if (!PageLoading) {
      updateDimensions();
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [PageLoading, graphContainerRef, graphContainerRef.current]);

  const [animatedValue, setAnimatedValue] = useState(0);
  const animationDuration = 2000;
  const [sum, setSum] = useState(0);

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
    animateValue(sum);
  }, [sum]);

  useEffect(() => {
    console.log("call");
    setPageLoading(true);
    setChartLoading(true);
    fetchStrategyDetail();
  }, [change]);

  const fetchStrategyDetail = async () => {
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

    if (data.data.length > 0) {
      const uniqueIds = new Set();

      const uniqueData = data.data.reduce((acc, current) => {
        if (!uniqueIds.has(current.id)) {
          uniqueIds.add(current.id);
          acc.push({
            id: current.id,
            name: current.name,
            description: current.description,
          });
        }
        return acc;
      }, []);

      setStrategyDetails(uniqueData);
      setSelectedStrategy(uniqueData[0].id);
    } else {
      setStrategyDetails([]);
      setSelectedStrategy();
    }

    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  };

  const handleStrategyClick = (id) => {
    setSelectedStrategy(id);
    if (window.innerWidth <= 768) {
      setIsLeftVisible(false);
      setIsRightVisible(true);
    }
  };

  const handleDeleteStrategy = async (id) => {
    const DeleteStrategyCall = async (id) => {
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

    ConfirmBox({
      title: "Delete Bucket",
      description: (
        <>
          <>Are you sure you want to delete this bucket ?</>
        </>
      ),
      properties: [
        {
          id: "2",
          label: "Yes",
          color: "#192b40",
          bgColor: "#ffffff",
          handleFunction: (callback) => {
            DeleteStrategyCall(id);
            callback();
          },
        },
      ],
      cancel: true,
    });
  };

  const handleEditStrategy = async (id) => {
    navigate(`/accounts/dashboard/addstrategy/${id}`, {
      state: { email_id: email_id },
    });
    // setChange(Math.random());
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setDuration("1Y");
  };

  const backButoonFunction = () => {
    setIsLeftVisible(true);
    setIsRightVisible(false);
  };

  const run_analysis = async (symbol) => {
    try {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/strategy/jobqueue`,
        data: {
          stock: `${symbol}`,
          id: selectedStrategy,
          email_id: email_id,
        },
      });
      if (data1.server_error) {
        alert("error jobqueue");
      }

      if (data1.error) {
        alert("error1 jobqueue");
      }
      setChangeStock(Math.random());
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStock = async (symbol) => {
    try {
      const data1 = await ServerRequest({
        method: "delete",
        URL: `/strategy/stock`,
        data: {
          symbol: `${symbol}`,
          id: selectedStrategy,
          email: email_id,
        },
      });
      if (data1.server_error) {
        alert("error delete");
      }

      if (data1.error) {
        alert("error1 delete");
      }
      // setChange(Math.random());s
      setChangeStock(Math.random());
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteStock = async (symbol) => {
    ConfirmBox({
      title: "Delete Stock",
      description: (
        <>
          <>Are you sure you want to delete this stock ?</>
        </>
      ),
      properties: [
        {
          id: "2",
          label: "Yes",
          color: "#192b40",
          bgColor: "#ffffff",
          handleFunction: (callback) => {
            handleDeleteStock(symbol);
            callback();
          },
        },
      ],
      cancel: true,
    });
  };
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setChartLoading(true);
        setChartError(false);

        if (!selectedStock || !duration || selectedStock.status == "Pending") {
          setChartLoading(false);
          return;
        }

        const data1 = await ServerRequest({
          method: "get",
          URL: `/strategy/chartdata?stock=${selectedStock.symbol}&range=${duration}&id=${selectedStrategy}`,
          signal,
        });

        if (data1.server_error || data1.error) {
          setChartError(true);
          setChartLoading(false);
          setChartData([]);
          return;
        }

        setChartData(data1.data);
        setChartLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [selectedStock?.symbol, duration, selectedStock?.status]);

  return !PageLoading ? (
    <div className="swift-accounts-main">
      <div className="swift-accounts-content">
        <div
          className={`swift-accounts-content-left ${
            isLeftVisible ? "" : "hideleft"
          }`}
          id="left"
        >
          <div className="swift-accounts-content-strategy">
            {StrategyDetails.length == 0 && (
              <div className="analysis-pending">
                <p className="analysis-pending-heading">No Buckets Avaliable</p>
              </div>
            )}
            {StrategyDetails.length > 0 &&
              StrategyDetails.map((strategy, index) => (
                <Strategy
                  key={index}
                  setChange={setChange}
                  id={strategy.id}
                  email_id={email_id}
                  heading={strategy.name}
                  content={strategy.description}
                  isClicked={strategy.id == selectedStrategy}
                  style={
                    strategy.id !== selectedStrategy
                      ? { color: "rgba(1, 22, 39, 0.30)" }
                      : {}
                  }
                  edithandler={handleEditStrategy}
                  deletehandler={handleDeleteStrategy}
                  onClick={() => handleStrategyClick(strategy.id)}
                />
              ))}
          </div>
          <div className="swift-accounts-content-btn">
            <CustomButton
              text="Add Bucket"
              classname="swift-accounts-content-button"
              onClick={() => {
                navigate("/accounts/dashboard/addstrategy", {
                  state: { email_id: email_id },
                });
              }}
            />
          </div>
        </div>

        {StrategyDetails.length == 0 ? (
          <div className="analysis-pending">
            <p className="analysis-pending-heading">Add Bucket First</p>
          </div>
        ) : (
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
              <div
                className={`swift-account-content-graph ${
                  isRightVisible ? "showgraph" : ""
                }`}
              >
                {!chartError &&
                selectedStock &&
                !StocksLoading &&
                selectedStock?.status !== "Pending" ? (
                  <>
                    <div className="swift-asset-range-buttons">
                      <p
                        onClick={() => setDuration("1Y")}
                        style={{ cursor: "pointer" }}
                        className={duration == "1Y" ? "selected_duration" : ""}
                      >
                        1y
                      </p>
                      <p
                        onClick={() => setDuration("5Y")}
                        style={{ cursor: "pointer" }}
                        className={duration == "5Y" ? "selected_duration" : ""}
                      >
                        5y
                      </p>
                      <p
                        onClick={() => setDuration("MAX")}
                        style={{ cursor: "pointer" }}
                        className={duration == "MAX" ? "selected_duration" : ""}
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
                            loading2={ChartLoading}
                            name={selectedStock?.symbol}
                            lastupdated={selectedStock?.date_completed}
                            error={chartError}
                          />
                        )}
                    </div>
                  </>
                ) : StocksLoading ? (
                  <div className="swift-aseet-loader">
                    <Pulse />
                  </div>
                ) : chartError ? (
                  <div className="analysis-pending">
                    <p className="analysis-pending-heading">
                      Server Connection Issue
                    </p>
                    <p className="analysis-pending-content">
                      We're currently experiencing issues connecting to our
                      servers. Our team is working to resolve this as quickly as
                      possible. Please check back shortly. We appreciate your
                      patience and apologize for any inconvenience caused.
                    </p>
                  </div>
                ) : selectedStock && selectedStock?.status == "Pending" ? (
                  <div className="analysis-pending">
                    <p className="analysis-pending-heading">Analysis Pending</p>
                    <p className="analysis-pending-content">
                      We will be running the securities via our ML algorithims
                      every 10 minutes. You should see results of of our models
                      in 1-2 hours.
                    </p>
                  </div>
                ) : (
                  <div className="analysis-pending">
                    <p className="analysis-pending-heading">Add Stocks First</p>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`swift-accounts-content-div-2 ${
                isRightVisible ? "showdiv-1" : ""
              }`}
            >
              <div className="swift-accounts-content-stocks-info">
                <div className="swift-accounts-content-stocks-show">
                  <StockesDropdown
                    onStockSelect={handleStockSelect}
                    selectedStock={selectedStock}
                    selectedStrategy={selectedStrategy}
                    setStocksLoading={setStocksLoading}
                    RunAnalysis={run_analysis}
                    DeleteHandle={DeleteStock}
                    setSum={setSum}
                    change={changeStock}
                  />
                </div>
              </div>
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
