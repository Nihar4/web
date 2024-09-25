import React, { useEffect, useRef, useState } from "react";
import "../../../css/Accounts/AssetAllocation.css";
import BackButton from "../../AccessManagement/BackButton";
import ServerRequest from "../../../utils/ServerRequest";
import { useNavigate } from "react-router-dom";
import LineChart from "../Charts/LineChart";
import Pulse from "../../Loader/Pulse";
import moment from "moment-timezone";
import SwiftModal from "../../CustomComponents/SwiftModal/SwiftModal";
import Close from "../../../assets/crossicon.svg";
import { numberFormatMatrix } from "../../../utils/utilsFunction";
import PortfolioStockesDropdown from "./PortfolioStockesDropdown";
import CustomNumberInput from "../../CustomComponents/CustomInput/CustomNumberInput";
import "../../../css/Accounts/PortfolioManagement.css";
import PortfolioTrades from "./PortfolioTrades";
import PortfolioCash from "./PortfolioCash";
import ConfirmBox from "../../CustomComponents/ConfirmBox/ConfirmBox";
import HistoricalLineChart from "../Charts/HistoricalLineChart";
import Strategy from "../AssetManagement/Strategy";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";

const PortfolioManagement = () => {
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

  const [openDropdown, setOpenDropdown] = useState();
  const [inflow, setInflow] = useState(0);
  const [portfolio_value, setPortfolio_Value] = useState(0);
  const [pred_return, setPred_Return] = useState(0);

  const [current_tab, setCurrent_Tab] = useState("portfolio");
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [chartModal, setchartModal] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

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

  useEffect(() => {
    setPageLoading(true);
    setChartLoading(true);
    fetchStrategyDetail();
  }, [change]);

  const fetchStrategyDetail = async () => {
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
      const groupedData = data.data.reduce((acc, current) => {
        const existingStrategy = acc.find((item) => item.id === current.id);

        if (existingStrategy) {
          existingStrategy.assets.push({
            asset_class_name: current.asset_class_name,
            stock: current.stock,
            percentage: current.percentage,
          });
        } else {
          acc.push({
            id: current.id,
            name: current.name,
            description: current.description,
            assets: [
              {
                asset_class_name: current.asset_class_name,
                stock: current.stock,
                percentage: current.percentage,
              },
            ],
          });
        }
        return acc;
      }, []);

      setStrategyDetails(groupedData);
      setSelectedStrategy(groupedData[0].id);
      if (groupedData[0].assets.length > 0) {
        setOpenDropdown(new Array(groupedData[0].assets.length).fill(true));
      }
    }
    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (selectedStrategy && StrategyDetails.length > 0) {
      const index = StrategyDetails.findIndex(
        (strategy) => strategy.id === selectedStrategy
      );
      if (StrategyDetails[index].assets.length > 0) {
        setOpenDropdown(
          new Array(StrategyDetails[index].assets.length).fill(true)
        );
      }
    }
  }, [selectedStrategy, StrategyDetails]);

  const handleStrategyClick = (id) => {
    setSelectedStrategy(id);
    setShowPortfolio(false);
  };

  const handleDeleteStrategy = async (id) => {
    const DeleteStrategyCall = async (id) => {
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

    ConfirmBox({
      title: "Delete Portfolio",
      description: (
        <>
          <>Are you sure you want to delete this portfolio ?</>
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
    navigate(
      `/accounts/dashboard/portfolio-management/addstrategy/${selectedStrategy}`,
      {
        state: { email_id: email_id },
      }
    );
  };

  const handleStockSelect = (symbol, name) => {
    setSelectedStock({ symbol: symbol, name: name });
    setDuration("1Y");
    setchartModal(true);
  };

  // const fetchPortfolioData = async () => {
  //   setloading && setloading(true);
  //   setloader(true);

  //   const data = await ServerRequest({
  //     method: "get",
  //     URL: `/strategy/portfolio/get?email=${email_id}`,
  //   });

  //   if (data.server_error) {
  //     alert("error");
  //   }

  //   if (data.error) {
  //     alert("error1");
  //   }

  //   if (data.data.length > 0) {
  //     const uniqueIds = new Set();

  //     const filteredData = data.data.filter((item) => {
  //       if (uniqueIds.has(item.id)) {
  //         return false;
  //       } else {
  //         uniqueIds.add(item.id);
  //         return true;
  //       }
  //     });

  //     const strategiesArray = data.data.map((item) => ({
  //       id: item.id,
  //       strategyname: item.name,
  //       description: item.description,
  //       assetclass: [
  //         {
  //           name: item.asset_class_name,
  //           stock: item.stock,
  //           percentage: item.percentage,
  //           // min_weight: item.min_weight,
  //           // max_weight: item.max_weight,
  //         },
  //       ],
  //     }));

  //     const combinedStrategiesArray = strategiesArray.reduce((acc, curr) => {
  //       const existingStrategy = acc.find((item) => item.id === curr.id);

  //       if (existingStrategy) {
  //         curr.assetclass.forEach((asset) => {
  //           const existingAsset = existingStrategy.assetclass.find(
  //             (a) => a.name === asset.name
  //           );
  //           if (existingAsset) {
  //             existingAsset.stock += `, ${asset.stock}`;
  //             existingAsset.percentage += `, ${asset.percentage}`;
  //             // existingAsset.min_weight += `, ${asset.min_weight}`;
  //             // existingAsset.max_weight += `, ${asset.max_weight}`;
  //           } else {
  //             existingStrategy.assetclass.push(asset);
  //           }
  //         });
  //       } else {
  //         acc.push(curr);
  //       }

  //       return acc;
  //     }, []);

  //     setStrategies(combinedStrategiesArray);
  //     const strategyNamesArray = combinedStrategiesArray.map(
  //       (strategy) => strategy.strategyname
  //     );
  //     setStrategyNames(strategyNamesArray);
  //     // setloading(false);
  //     setloader(false);
  //   }
  // };

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

  const closeChartModal = () => {
    setchartModal(false);
  };

  const closeShowPortfolio = () => {
    setShowPortfolio(false);
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

        if (!selectedStock || !duration) {
          setChartLoading(false);
          return;
        }

        const data1 = await ServerRequest({
          method: "get",
          URL: `/strategy/chartdata?stock=${
            selectedStock.symbol
          }&range=${duration}&historicalOnly=${true}`,
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
  }, [selectedStock, duration]);

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
    "Total Gains (Real. + Unreal.)",
    "Prop. Invesment Qty.",
    "Prop. Invesment Value",
    "Eff. Weight",
    "",
  ];

  return (
    <>
      <div className="swift-accounts-main swift-accounts-portfolio-main">
        {!PageLoading ? (
          <>
            <div
              className="swift-accounts-content"
              style={{ padding: "0 10px 10px 10px" }}
            >
              {StrategyDetails.length == 0 ? (
                <div className="analysis-pending">
                  <p className="analysis-pending-heading">
                    Add Portfolio First
                  </p>
                </div>
              ) : (
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
                    style={{
                      width: "100%",
                      rowGap: current_tab == "trade" ? "0px" : "20px",
                    }}
                  >
                    <div className="swift-accounts-sub-menu">
                      <div>
                        <p
                          className={
                            current_tab === "portfolio" ? "active" : ""
                          }
                          onClick={() => setCurrent_Tab("portfolio")}
                        >
                          Portfolio
                        </p>
                        <p
                          className={current_tab === "trade" ? "active" : ""}
                          onClick={() => setCurrent_Tab("trade")}
                        >
                          Trades
                        </p>
                        <p
                          className={current_tab === "cash" ? "active" : ""}
                          onClick={() => setCurrent_Tab("cash")}
                        >
                          Cash
                        </p>
                      </div>
                      <p
                        onClick={() => setShowPortfolio(true)}
                        style={{ fontWeight: "700" }}
                      >
                        Select Portfolio
                      </p>
                    </div>
                    {current_tab == "portfolio" ? (
                      <div
                        className="swift-accounts-content-stocks-info"
                        style={{
                          border: "none",
                          padding: "0px 10px 10px 10px",
                        }}
                      >
                        <div className="swift-accounts-content-stocks-details">
                          <div className="swift-accounts-content-stocks-header">
                            <div className="swift-accounts-content-stocks-right">
                              <p onClick={handleEditStrategy}>Change</p>
                              <p
                                onClick={() =>
                                  handleDeleteStrategy(selectedStrategy)
                                }
                              >
                                Delete
                              </p>

                              <CustomNumberInput
                                labelText="Today's Inflow"
                                type="number"
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
                                  setInflow(parseFloat(value))
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
                                  let firstPart, secondPart;
                                  if (index === 12 && words.length > 2) {
                                    firstPart = words.slice(0, 2).join(" ");
                                    secondPart = words.slice(2).join(" ");
                                  } else {
                                    firstPart = words.slice(0, -1).join(" ");
                                    secondPart = words[words.length - 1];
                                  }

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
                                      {secondPart}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="swift-accounts-content-stocks-show">
                          <PortfolioStockesDropdown
                            id={selectedStrategy}
                            isOpen={openDropdown}
                            onToggle={handleDropdownToggle}
                            onStockSelect={handleStockSelect}
                            selectedStock={selectedStock}
                            setPortfolio_Value={setPortfolio_Value}
                            inflow={inflow ? inflow : 0}
                          />
                        </div>
                      </div>
                    ) : current_tab == "trade" ? (
                      <PortfolioTrades id={selectedStrategy} />
                    ) : (
                      <PortfolioCash id={selectedStrategy} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {chartModal && (
              <SwiftModal closeModal={closeChartModal} top="10px">
                <div className="swift-chart-modal-content">
                  <div
                    className="custom__alert__close"
                    style={{ justifyContent: "flex-end" }}
                  >
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
                    style={{ border: "none" }}
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
                      style={{
                        height: "100%",
                        border: "none",
                        boxShadow: "none",
                      }}
                    >
                      {!chartError ? (
                        <>
                          <div className="swift-asset-range-buttons">
                            <p
                              onClick={() => setDuration("1Y")}
                              style={{ cursor: "pointer" }}
                              className={
                                duration == "1Y" ? "selected_duration" : ""
                              }
                            >
                              1y
                            </p>
                            <p
                              onClick={() => setDuration("5Y")}
                              style={{ cursor: "pointer" }}
                              className={
                                duration == "5Y" ? "selected_duration" : ""
                              }
                            >
                              5y
                            </p>
                            <p
                              onClick={() => setDuration("MAX")}
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
                                <HistoricalLineChart
                                  data={chart_data}
                                  width={graphDimensions.width}
                                  height={graphDimensions.height}
                                  duration={duration}
                                  loading2={ChartLoading}
                                  name={selectedStock.name}
                                  error={chartError}
                                />
                              )}
                            {/* <p> {graphDimensions.width}</p>
                        <p> {graphDimensions.height}</p> */}
                          </div>
                        </>
                      ) : (
                        <div className="analysis-pending">
                          <p className="analysis-pending-heading">
                            Server Connection Issue
                          </p>
                          <p className="analysis-pending-content">
                            We're currently experiencing issues connecting to
                            our servers. Our team is working to resolve this as
                            quickly as possible. Please check back shortly. We
                            appreciate your patience and apologize for any
                            inconvenience caused.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SwiftModal>
            )}

            {showPortfolio && (
              <SwiftModal
                closeModal={closeShowPortfolio}
                top="0"
                className="swift-show-portfolio-modal"
              >
                <div className="swift-show-portfolio-modal-content">
                  <div
                    className="custom__alert__close"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <img
                      src={Close}
                      alt="X"
                      onClick={() => closeShowPortfolio()}
                    />
                  </div>
                  <div
                    className={`swift-accounts-content-left`}
                    id="left"
                    style={{ width: "100%", border: "none" }}
                  >
                    <div className="swift-accounts-content-strategy">
                      {StrategyDetails.length == 0 && (
                        <div className="analysis-pending">
                          <p className="analysis-pending-heading">
                            No Portfolio Avaliable
                          </p>
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
                        text="Add Portfolio"
                        classname="swift-accounts-content-button"
                        onClick={() => {
                          navigate(
                            "/accounts/dashboard/portfolio-management/addstrategy",
                            {
                              state: { email_id: email_id },
                            }
                          );
                        }}
                      />
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
