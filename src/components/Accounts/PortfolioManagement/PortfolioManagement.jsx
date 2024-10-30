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
import { PortfolioIcon } from "../../CustomComponents/SwiftIcon/Icons";

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

  const jobqueueRef = useRef(null);
  const [selectedStrategyName, setSelectedStrategyName] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = () => {
    const jobqueueElement = document.querySelector(
      ".swift-accounts-header-right .swift-accounts-heading-2"
    );
    const btnElement = document.querySelector(
      ".swift-accounts-header-right .swift-accounts-header-user"
    );
    if (jobqueueElement && btnElement) {
      const jobqueueRect = jobqueueElement.getBoundingClientRect();
      const btnRect = btnElement.getBoundingClientRect();

      setPosition({
        top: btnRect.top,
        left: jobqueueRect.left - 41 - 110,
      });

      console.log({
        top: btnRect.top,
        left: jobqueueRect.left - 41 - 110,
      });
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

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
    } else {
      setStrategyDetails([]);
      setSelectedStrategy();
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
      setSelectedStrategyName(StrategyDetails[index].name);
      if (StrategyDetails[index].assets.length > 0) {
        setOpenDropdown(
          new Array(StrategyDetails[index].assets.length).fill(true)
        );
      }
    }
  }, [selectedStrategy, StrategyDetails]);

  const handleStrategyClick = (id, name) => {
    setSelectedStrategy(id);
    setSelectedStrategyName(name);
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

  return (
    <>
      <div className="swift-accounts-portfolio-main">
        {!PageLoading ? (
          <>
            <div className="swift-accounts-portfolio-content">
              {StrategyDetails.length == 0 ? (
                <div className="analysis-pending" style={{ rowGap: "15px" }}>
                  <p className="analysis-pending-heading">No Portfolio Exist</p>
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
              ) : (
                <>
                  <div className="swift-accounts-portfolio-sub-menu">
                    <div>
                      <div className="swift-portfolio-name">
                        {selectedStrategyName}
                      </div>
                      <p
                        className={current_tab === "portfolio" ? "active" : ""}
                        onClick={() => setCurrent_Tab("portfolio")}
                      >
                        <svg
                          width="20"
                          height="15"
                          viewBox="0 0 20 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.6374 0.000909468C12.6387 0.000909468 11.8192 0.820463 11.8192 1.81911C11.8192 2.66003 12.4028 3.36731 13.1828 3.5714V4.44505L10.0205 11.1647L7.69184 5.73051C7.65477 5.64363 7.59155 5.57046 7.51098 5.52116C7.4304 5.47186 7.33647 5.44889 7.24224 5.45544C7.14801 5.46199 7.05815 5.49773 6.98517 5.5577C6.91219 5.61767 6.85971 5.69889 6.83501 5.79006L5.81409 9.53237L4.96408 7.54872C4.92915 7.46672 4.87089 7.3968 4.79653 7.34766C4.72218 7.29851 4.63502 7.27231 4.5459 7.27231C4.45677 7.27231 4.36961 7.29851 4.29526 7.34766C4.2209 7.3968 4.16264 7.46672 4.12771 7.54872L2.8177 10.6065L1.81859 11.2733L0.706764 10.5319C0.657103 10.4988 0.6014 10.4758 0.542837 10.4642C0.484274 10.4526 0.423998 10.4526 0.365452 10.4643C0.306907 10.476 0.251237 10.4991 0.201625 10.5323C0.152012 10.5655 0.109427 10.6082 0.076303 10.6578C0.043188 10.7075 0.020188 10.7633 0.00861656 10.8218C-0.00295485 10.8804 -0.00287085 10.9407 0.00886409 10.9992C0.020599 11.0578 0.0437547 11.1135 0.0770083 11.1631C0.110262 11.2127 0.152962 11.2552 0.202668 11.2883L1.56632 12.1974C1.64101 12.2472 1.7288 12.2738 1.81859 12.2738C1.90839 12.2738 1.99617 12.2472 2.07087 12.1974L3.43452 11.2883C3.5078 11.2394 3.56529 11.1702 3.59998 11.0892L4.5459 8.88327L5.49136 11.0892C5.52839 11.1761 5.59157 11.2493 5.67211 11.2986C5.75266 11.348 5.84657 11.371 5.9408 11.3645C6.03502 11.358 6.12489 11.3223 6.1979 11.2624C6.27091 11.2024 6.32344 11.1213 6.34819 11.0301L7.36911 7.2878L9.58277 12.4529C9.61731 12.5334 9.67439 12.6022 9.74713 12.651C9.81987 12.6998 9.90516 12.7266 9.99276 12.7281C10.0804 12.7296 10.1665 12.7057 10.2409 12.6594C10.3152 12.6131 10.3746 12.5462 10.4119 12.4669L13.1824 6.57825V14.092C13.1824 14.2125 13.2302 14.3281 13.3155 14.4134C13.4007 14.4986 13.5163 14.5465 13.6369 14.5465C13.7575 14.5465 13.8731 14.4986 13.9583 14.4134C14.0436 14.3281 14.0915 14.2125 14.0915 14.092V6.34961L16.4183 10.6706C16.4597 10.7473 16.5224 10.8105 16.5987 10.8527C16.6751 10.8948 16.762 10.9141 16.849 10.9082C16.936 10.9023 17.0195 10.8715 17.0895 10.8194C17.1595 10.7674 17.2131 10.6963 17.2438 10.6147L19.9711 3.34185C20.0134 3.22907 20.0092 3.10411 19.9594 2.99442C19.9096 2.88473 19.8183 2.79929 19.7056 2.75685C19.6576 2.73876 19.6069 2.72892 19.5556 2.72776C19.4615 2.72579 19.3692 2.75306 19.2912 2.80582C19.2133 2.85858 19.1537 2.93422 19.1206 3.0223L16.746 9.35964L14.0915 4.43005V3.57095C14.871 3.3664 15.4551 2.65912 15.4551 1.8182C15.4551 0.819554 14.6355 0 13.6369 0L13.6374 0.000909468ZM13.6374 0.910009C14.1446 0.910009 14.5465 1.31183 14.5465 1.81911C14.5465 2.32639 14.1446 2.72821 13.6374 2.72821C13.1301 2.72821 12.7283 2.32639 12.7283 1.81911C12.7283 1.31183 13.1301 0.910009 13.6374 0.910009Z"
                            // fill="black"
                            // fill-opacity="0.9"
                          />
                        </svg>
                        Portfolio
                      </p>
                      <p
                        className={current_tab === "trade" ? "active" : ""}
                        onClick={() => setCurrent_Tab("trade")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          // fill="#CCCCCC"
                        >
                          <path d="M17.279 11.2C17.089 11.2 16.899 11.13 16.749 10.98C16.6095 10.8389 16.5313 10.6484 16.5313 10.45C16.5313 10.2516 16.6095 10.0612 16.749 9.92001L19.939 6.73001L16.749 3.54001C16.6095 3.39887 16.5313 3.20844 16.5313 3.01001C16.5313 2.81158 16.6095 2.62115 16.749 2.48001C17.039 2.19001 17.519 2.19001 17.809 2.48001L21.529 6.20001C21.6695 6.34064 21.7484 6.53126 21.7484 6.73001C21.7484 6.92876 21.6695 7.11939 21.529 7.26001L17.809 10.98C17.659 11.12 17.469 11.2 17.279 11.2Z"></path>
                          <path d="M21 7.48001H3C2.59 7.48001 2.25 7.14001 2.25 6.73001C2.25 6.32001 2.59 5.98001 3 5.98001H21C21.41 5.98001 21.75 6.32001 21.75 6.73001C21.75 7.14001 21.41 7.48001 21 7.48001ZM6.72 21.75C6.53 21.75 6.34 21.68 6.19 21.53L2.47 17.81C2.32955 17.6694 2.25066 17.4788 2.25066 17.28C2.25066 17.0813 2.32955 16.8906 2.47 16.75L6.19 13.03C6.48 12.74 6.96 12.74 7.25 13.03C7.54 13.32 7.54 13.8 7.25 14.09L4.06 17.28L7.25 20.47C7.54 20.76 7.54 21.24 7.25 21.53C7.18183 21.6015 7.09948 21.6581 7.00822 21.6959C6.91695 21.7338 6.81879 21.7522 6.72 21.75Z"></path>
                          <path d="M21 18.02H3C2.59 18.02 2.25 17.68 2.25 17.27C2.25 16.86 2.59 16.52 3 16.52H21C21.41 16.52 21.75 16.86 21.75 17.27C21.75 17.68 21.41 18.02 21 18.02Z"></path>
                        </svg>
                        Trades
                      </p>
                      <p
                        className={current_tab === "cash" ? "active" : ""}
                        onClick={() => setCurrent_Tab("cash")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          // fill="#CCCCC"
                        >
                          <path d="M17 22.75H7C3.56 22.75 1.25 20.44 1.25 17V12C1.25 8.92 3.15 6.69 6.1 6.32C6.38 6.28 6.69 6.25 7 6.25H17C17.24 6.25 17.55 6.26 17.87 6.31C20.82 6.65 22.75 8.89 22.75 12V17C22.75 20.44 20.44 22.75 17 22.75ZM7 7.75C6.76 7.75 6.53 7.77 6.3 7.8C4.1 8.08 2.75 9.68 2.75 12V17C2.75 19.58 4.42 21.25 7 21.25H17C19.58 21.25 21.25 19.58 21.25 17V12C21.25 9.66 19.88 8.05 17.66 7.79C17.42 7.75 17.21 7.75 17 7.75H7Z"></path>
                          <path d="M6.192 7.81099C5.952 7.81099 5.732 7.70099 5.582 7.50099C5.49958 7.38982 5.45022 7.25763 5.4396 7.11964C5.42899 6.98165 5.45755 6.84347 5.522 6.72099C5.692 6.38099 5.932 6.05099 6.242 5.75099L9.492 2.49099C10.2933 1.69833 11.3749 1.25374 12.502 1.25374C13.6291 1.25374 14.7107 1.69833 15.512 2.49099L17.262 4.26099C18.002 4.99099 18.452 5.97099 18.502 7.01099C18.5076 7.12283 18.4881 7.2345 18.445 7.33785C18.4019 7.4412 18.3363 7.53363 18.2529 7.60837C18.1696 7.68312 18.0705 7.73831 17.9631 7.7699C17.8557 7.8015 17.7426 7.8087 17.632 7.79099C17.432 7.76099 17.222 7.75099 17.002 7.75099H7.002C6.762 7.75099 6.532 7.77099 6.302 7.80099C6.272 7.81099 6.232 7.81099 6.192 7.81099ZM7.862 6.25099H16.822C16.692 5.91099 16.482 5.60099 16.202 5.32099L14.442 3.54099C13.372 2.48099 11.622 2.48099 10.542 3.54099L7.862 6.25099ZM22 17.25H19C17.48 17.25 16.25 16.02 16.25 14.5C16.25 12.98 17.48 11.75 19 11.75H22C22.41 11.75 22.75 12.09 22.75 12.5C22.75 12.91 22.41 13.25 22 13.25H19C18.6685 13.25 18.3505 13.3817 18.1161 13.6161C17.8817 13.8505 17.75 14.1685 17.75 14.5C17.75 14.8315 17.8817 15.1495 18.1161 15.3839C18.3505 15.6183 18.6685 15.75 19 15.75H22C22.41 15.75 22.75 16.09 22.75 16.5C22.75 16.91 22.41 17.25 22 17.25Z"></path>
                        </svg>
                        Cash
                      </p>
                    </div>
                    <p
                      onClick={() => setShowPortfolio(true)}
                      className="active"
                      style={{
                        position: "absolute",
                        top: position.top,
                        left: position.left,
                      }}
                    >
                      Select Portfolio
                    </p>
                    {current_tab == "portfolio" && (
                      <div style={{ display: "flex", columnGap: "10px" }}>
                        <p onClick={handleEditStrategy}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            // fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.0243 11.5998C16.9207 11.5998 16.8213 11.641 16.7481 11.7142C16.6748 11.7875 16.6337 11.8868 16.6337 11.9904V15.4588C16.6333 15.7695 16.5098 16.0674 16.2901 16.2871C16.0704 16.5068 15.7725 16.6304 15.4618 16.6307H4.50122C4.19053 16.6304 3.89266 16.5068 3.67297 16.2871C3.45328 16.0674 3.3297 15.7695 3.32935 15.4588V5.27954C3.3297 4.96885 3.45328 4.67098 3.67297 4.45129C3.89266 4.2316 4.19053 4.10802 4.50122 4.10767H7.96962C8.07322 4.10767 8.17258 4.06651 8.24583 3.99325C8.31909 3.92 8.36024 3.82064 8.36024 3.71704C8.36024 3.61344 8.31909 3.51408 8.24583 3.44083C8.17258 3.36757 8.07322 3.32642 7.96962 3.32642H4.50122C3.9834 3.32701 3.48696 3.53297 3.1208 3.89912C2.75465 4.26528 2.54869 4.76172 2.5481 5.27954V15.4589C2.54869 15.9767 2.75465 16.4731 3.1208 16.8393C3.48696 17.2054 3.9834 17.4114 4.50122 17.412H15.4618C15.9796 17.4114 16.4761 17.2054 16.8422 16.8393C17.2084 16.4731 17.4143 15.9767 17.4149 15.4589V11.9905C17.4149 11.9392 17.4048 11.8884 17.3852 11.841C17.3656 11.7936 17.3368 11.7505 17.3005 11.7142C17.2643 11.678 17.2212 11.6492 17.1738 11.6296C17.1264 11.6099 17.0756 11.5998 17.0243 11.5998Z"
                              // fill="black"
                            />
                            <path
                              d="M14.3599 3.84052L8.65625 9.54419L10.4957 11.3837L16.1994 5.67999L14.3599 3.84052Z"
                              // fill="black"
                            />
                            <path
                              d="M7.72559 12.3143L9.7584 11.7512L8.28871 10.2815L7.72559 12.3143Z"
                              // fill="black"
                            />
                            <path
                              d="M16.7079 2.87372C16.5247 2.69084 16.2763 2.58813 16.0174 2.58813C15.7585 2.58813 15.5102 2.69084 15.3269 2.87372L14.9126 3.28802L16.7521 5.12751L17.1664 4.71321C17.3492 4.52993 17.4519 4.28159 17.4519 4.02269C17.4519 3.76378 17.3492 3.51545 17.1664 3.33216L16.7079 2.87372Z"
                              // fill="black"
                            />
                          </svg>
                          Change
                        </p>
                        <p
                          onClick={() => handleDeleteStrategy(selectedStrategy)}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            // fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="delete-hover-blue"
                          >
                            <path
                              d="M6.10002 18.6667H13.9667C14.8667 18.6667 15.5667 17.9333 15.5667 17.0667V6.23333H16.2667C16.4667 6.23333 16.6 6.1 16.6 5.9V5.13333C16.6 4.43333 16.0333 3.9 15.3667 3.9H12.5333V3.03333C12.5333 2.46667 12.0667 2 11.5 2H8.53335C7.96668 2 7.50002 2.46667 7.50002 3.03333V3.9H4.66668C3.96668 3.9 3.43335 4.46667 3.43335 5.13333V5.9C3.43335 6.1 3.56668 6.23333 3.76668 6.23333H4.46668V17.0667C4.46668 17.9333 5.20002 18.6667 6.10002 18.6667ZM14.9 17.0667C14.9 17.6 14.4667 18 13.9667 18H6.10002C5.56668 18 5.16668 17.5667 5.16668 17.0667V6.23333H14.9333V17.0667H14.9ZM8.16668 3.03333C8.16668 2.83333 8.33335 2.66667 8.53335 2.66667H11.5C11.7 2.66667 11.8667 2.83333 11.8667 3.03333V3.9H8.20002V3.03333H8.16668ZM4.10002 5.13333C4.10002 4.8 4.36668 4.56667 4.66668 4.56667H15.3334C15.6667 4.56667 15.9 4.83333 15.9 5.13333V5.56667H4.10002V5.13333Z"
                              // fill="black"
                            />
                            <path
                              d="M12.6333 16.4C12.8333 16.4 12.9667 16.2667 12.9667 16.0667V8.13338C12.9667 7.93338 12.8333 7.80005 12.6333 7.80005C12.4333 7.80005 12.3 7.93338 12.3 8.13338V16.0667C12.3 16.2667 12.4667 16.4 12.6333 16.4ZM10.0333 16.4C10.2333 16.4 10.3667 16.2667 10.3667 16.0667V8.13338C10.3667 7.93338 10.2333 7.80005 10.0333 7.80005C9.83332 7.80005 9.69998 7.93338 9.69998 8.13338V16.0667C9.69998 16.2667 9.83332 16.4 10.0333 16.4ZM7.39998 16.4C7.59998 16.4 7.73332 16.2667 7.73332 16.0667V8.13338C7.73332 7.93338 7.59998 7.80005 7.39998 7.80005C7.19998 7.80005 7.06665 7.93338 7.06665 8.13338V16.0667C7.06665 16.2667 7.19998 16.4 7.39998 16.4Z"
                              // fill="black"
                            />
                          </svg>
                          Delete
                        </p>
                      </div>
                    )}
                  </div>
                  {current_tab == "portfolio" ? (
                    <div className="swift-accounts-portfolio-content-stocks-info">
                      {/* <div className="swift-accounts-portfolio-content-stocks-header"> */}
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
                          borderBottom: "1px solid #e8e8e8",
                          backgroundColor: "white",
                        }}
                        onInputChange={(symbol, value) =>
                          setInflow(parseFloat(value))
                        }
                        value={inflow}
                      />
                      {/* </div> */}
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
                  ) : current_tab == "trade" ? (
                    <PortfolioTrades id={selectedStrategy} />
                  ) : (
                    <PortfolioCash id={selectedStrategy} />
                  )}
                </>
              )}
            </div>

            {chartModal && (
              <SwiftModal closeModal={closeChartModal} top="10px">
                <div className="swift-chart-modal-content">
                  <div
                    className="custom__alert__close"
                    style={{
                      justifyContent: "flex-end",
                      padding: "20px 15px 0px 0px",
                    }}
                  >
                    <img
                      src={Close}
                      alt="X"
                      onClick={() => closeChartModal()}
                    />
                  </div>
                  <div className="swift-account-chart-wrapper">
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
                          We're currently experiencing issues connecting to our
                          servers. Our team is working to resolve this as
                          quickly as possible. Please check back shortly. We
                          appreciate your patience and apologize for any
                          inconvenience caused.
                        </p>
                      </div>
                    )}
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
                <div className="swift-show-portfolio-modal-wrapper">
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
                  <div className={`swift-show-portfolio-modal-content`}>
                    <div className="swift-show-portfolio-modal-strategy-wrapper">
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
                            onClick={() =>
                              handleStrategyClick(strategy.id, strategy.name)
                            }
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
