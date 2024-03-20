import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import "../../css/Accounts/AssetAllocation.css";
import Strategy from "./Strategy";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import CustomCheckbox from "../CustomComponents/CustomCheckbox/CustomCheckbox";
import StockesDropdown from "./StockesDropdown";
import {
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  RadialLinearScale,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import BackButton from "../AccessManagement/BackButton";
import ServerRequest from "../../utils/ServerRequest";
import { useNavigate } from "react-router-dom";

const AssetAllocation = () => {
  // const initialStrategies = [
  //   {
  //     heading: "TA Advanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds.",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  //   {
  //     heading: "TA Balanced",
  //     content:
  //       "Mixed-asset portfolio in the portfolio manager range. Primarily consists of ETFs, tracker funds, and alternative funds. Lower risk than TA Advanced",
  //   },
  // ];
  const [initialStrategies, setInitialStrategies] = useState([]);

  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [clickedStrategy, setClickedStrategy] = useState(initialStrategies[0]);
  const [optionSelect, setOptionSelect] = useState(null);
  const [cnt, setCnt] = useState(0);

  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [change, setChange] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/get`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      const uniqueIds = new Set();

      const filteredData = data.data.filter((item) => {
        if (uniqueIds.has(item.id)) {
          return false;
        } else {
          uniqueIds.add(item.id);
          return true;
        }
      });

      const iniarray = filteredData.map((item) => ({
        heading: item.name,
        content: item.description,
        id: item.id,
      }));

      setInitialStrategies(iniarray);
      setClickedStrategy(iniarray[0]);
      setSelectedStrategy(0);
    };

    fetchdata();
  }, [change]);

  const handleStrategyClick = (index) => {
    setCnt(cnt + 1);
    const strategyClicked = initialStrategies[index];
    setSelectedStrategy(index);
    setClickedStrategy(strategyClicked);

    if (window.innerWidth <= 768) {
      setIsLeftVisible(false);
      setIsRightVisible(true);
    }
  };

  const backButoonFunction = () => {
    setIsLeftVisible(true);
    setIsRightVisible(false);
  };

  const options = ["0%", "25%", "50%", "75%", "100%"];
  const handleDropdownSelect = (selectedOption) => {
    setOptionSelect(selectedOption);
  };

  const [checkbox1, setCheckbox1] = useState(false);
  const handleCheckboxChange = (isChecked, value) => {
    if (value === "checkbox1") {
      setCheckbox1(isChecked);
    }
  };

  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (dropdownIndex) => {
    if (openDropdown === dropdownIndex) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownIndex);
    }
  };

  const stocksArrays = [
    [
      {
        title: "IVV",
        company: "MTD",
        change: "+3.23%",
        saa: "40.0%",
        taa: "45.5%",
        actwt: "5.5%",
        info: "iShares Core S&P 500 ETF Lorem ipsum dolor sit amet.",
      },
      {
        title: "EWU",
        company: "",
        change: "6.23%",
        saa: "5.0%",
        taa: "4.5%",
        actwt: "-0.5%",
        info: "iShares MSCI United Kingdom ETF Lorem ipsum dolor sit amet.",
      },
      {
        title: "IEEM",
        company: "",
        change: "1.23%",
        saa: "6.0%",
        taa: "7.5%",
        actwt: "2.5%",
        info: "iShares Emerging Markets Lorem ipsum dolor sit amet.",
      },
    ],
    [
      {
        title: "IVV",
        company: "MTD",
        change: "+3.23%",
        saa: "40.0%",
        taa: "45.5%",
        actwt: "5.5%",
        info: "iShares Core S&P 500 ETF Lorem ipsum dolor sit amet.",
      },
      {
        title: "EWU",
        company: "",
        change: "6.23%",
        saa: "5.0%",
        taa: "4.5%",
        actwt: "-0.5%",
        info: "iShares MSCI United Kingdom ETF Lorem ipsum dolor sit amet.",
      },
      {
        title: "EWU",
        company: "",
        change: "6.23%",
        saa: "5.0%",
        taa: "4.5%",
        actwt: "-0.5%",
        info: "iShares MSCI United Kingdom ETF Lorem ipsum dolor sit amet.",
      },
    ],
    [
      {
        title: "IVV",
        company: "MTD",
        change: "+3.23%",
        saa: "40.0%",
        taa: "45.5%",
        actwt: "5.5%",
        info: "iShares Core S&P 500 ETF Lorem ipsum dolor sit amet.",
      },
      {
        title: "EWU",
        company: "",
        change: "6.23%",
        saa: "5.0%",
        taa: "4.5%",
        actwt: "-0.5%",
        info: "iShares MSCI United Kingdom ETF Lorem ipsum dolor sit amet.",
      },
      {
        title: "IEEM",
        company: "",
        change: "1.23%",
        saa: "6.0%",
        taa: "7.5%",
        actwt: "2.5%",
        info: "iShares Emerging Markets Lorem ipsum dolor sit amet.",
      },
      {
        title: "IEEM",
        company: "",
        change: "1.23%",
        saa: "6.0%",
        taa: "7.5%",
        actwt: "2.5%",
        info: "iShares Emerging Markets Lorem ipsum dolor sit amet.",
      },
    ],
  ];

  function sumPropertyForArrays(arrays, property) {
    return arrays.map((array) =>
      array.reduce((sum, obj) => sum + parseFloat(obj[property]), 0)
    );
  }

  const allSaa = sumPropertyForArrays(stocksArrays, "saa");
  const allTaa = sumPropertyForArrays(stocksArrays, "taa");

  const data = {
    labels: ["Equity", "Fixed Income", "Alternatives"],
    datasets: [
      {
        label: "SAA",
        data: allSaa,
        // data: ['50','40','10'],
        fill: false,
        backgroundColor: "white",
        borderColor: "gray",
        pointBackgroundColor: "gray",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "gray",
      },
      {
        label: "TAA",
        data: allTaa,
        // data: ['57.5','35','7.5'],
        fill: false,
        backgroundColor: "white",
        borderColor: "#000fff",
        pointBackgroundColor: "#000fff",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#000fff",
      },
    ],
  };

  const radarOptions = {
    maintainAspectRatio: false,
    responsive: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 60,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "start",
        labels: {
          usePointStyle: true,
          // boxHeight: 0
        },
      },
    },
    layout: {
      padding: 0,
    },
  };

  Chart.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    RadialLinearScale,
    Legend
  );

  const [radarKey, setRadarKey] = useState(0);
  const graphContainerRef = useRef(null);
  const [graphDimensions, setGraphDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [reloadRequired, setReloadRequired] = useState(false);
  useEffect(() => {
    const updateDimensions = () => {
      const container = graphContainerRef.current;

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        setGraphDimensions({ width: containerWidth, height: containerHeight });
        setRadarKey((prevKey) => prevKey + 1);
      }

      if (window.innerWidth > 768 && reloadRequired) {
        // Reload the page
        window.location.reload();
      }
      setReloadRequired(window.innerWidth <= 768);
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [cnt]);

  return (
    // <div><Header /></div>
    <div className="swift-accounts-main">
      <Header />
      <div className="swift-accounts-content">
        <div
          className={`swift-accounts-content-left ${
            isLeftVisible ? "" : "hideleft"
          }`}
          id="left"
        >
          <div className="swift-accounts-content-strategy">
            {initialStrategies.map((strategy, index) => (
              <Strategy
                key={index}
                setChange={setChange}
                id={strategy.id}
                heading={strategy.heading}
                content={strategy.content}
                isClicked={index === selectedStrategy}
                // isClicked={true}
                style={
                  index !== selectedStrategy
                    ? { color: "rgba(1, 22, 39, 0.30)" }
                    : {}
                }
                onClick={() => handleStrategyClick(index)}
              />
            ))}
          </div>
          <div className="swift-accounts-content-btn">
            <CustomButton
              text="Add another strategy"
              classname="swift-accounts-content-button"
              onClick={() => {
                navigate("/accounts/dashboard/addstrategy");
              }}
            />
          </div>
        </div>

        <div
          className={`swift-accounts-content-right ${
            isRightVisible ? "showright" : ""
          }`}
          id="right"
        >
          <div
            className={`back-button ${isRightVisible ? "showbackbutton" : ""}`}
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
                {clickedStrategy != null && clickedStrategy.heading}
              </p>
              <p className="swift-account-content-content">
                {clickedStrategy != null && clickedStrategy.content}
              </p>
            </div>
            <div
              className={`swift-account-content-graph ${
                isRightVisible ? "showgraph" : ""
              }`}
            >
              <div className="swift-account-graph" ref={graphContainerRef}>
                {graphDimensions.width > 0 && graphDimensions.height > 0 && (
                  <Radar
                    key={radarKey}
                    data={data}
                    options={radarOptions}
                    height={graphDimensions.height}
                    width={graphDimensions.width}
                  />
                )}
              </div>
              <div className="swift-account-download">
                <CustomButton
                  classname="swift-account-download-btn"
                  text="Download Report"
                />
              </div>
            </div>
          </div>
          <div
            className={`swift-accounts-content-div-2 ${
              isRightVisible ? "showdiv-1" : ""
            }`}
          >
            <div className="swift-accounts-content-info">
              <p className="swift-accounts-content-info-1">Parameter</p>
              <div className="swift-accounts-content-info-2">
                <div className="swift-accounts-content-dropdown">
                  <p className="swift-accounts-content-dropdoen-heading">
                    Total Active Weight
                  </p>
                  <CustomDropdown
                    options={options}
                    onSelect={handleDropdownSelect}
                  />
                  <p className="swift-accounts-content-dropdown-details">
                    Select weight
                  </p>
                </div>
                <p className="swift-accounts-content-information">
                  This parameter decides on how aggressive you need the deep
                  learning model to be. Volatility weighting is used assuming
                  all assets are orthogonal.
                </p>
              </div>
            </div>
            <div className="swift-accounts-content-stocks-info">
              <div className="swift-accounts-content-stocks-details">
                <div className="swift-accounts-content-stocks-header">
                  <div className="swift-accounts-content-stocks-left">
                    <p>Portfolio</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M8.125 1.25C7.95924 1.25 7.80027 1.31585 7.68306 1.43306C7.56585 1.55027 7.5 1.70924 7.5 1.875V6.875C7.5 7.04076 7.56585 7.19973 7.68306 7.31694C7.80027 7.43415 7.95924 7.5 8.125 7.5H13.125C13.2908 7.5 13.4497 7.43415 13.5669 7.31694C13.6842 7.19973 13.75 7.04076 13.75 6.875C13.75 5.38316 13.1574 3.95242 12.1025 2.89752C11.0476 1.84263 9.61684 1.25 8.125 1.25ZM8.75 6.25V2.54375C9.68513 2.67851 10.5515 3.11236 11.2196 3.78043C11.8876 4.44849 12.3215 5.31487 12.4563 6.25H8.75Z"
                        fill="#011627"
                        fill-opacity="0.7"
                      />
                      <path
                        d="M13.0125 8.78752C12.935 8.7598 12.8527 8.74768 12.7705 8.75185C12.6882 8.75602 12.6076 8.77641 12.5333 8.81184C12.4589 8.84727 12.3923 8.89704 12.3373 8.95829C12.2822 9.01955 12.2398 9.09107 12.2125 9.16877C11.9309 9.96497 11.4521 10.6768 10.8209 11.238C10.1898 11.7991 9.42675 12.1913 8.60306 12.3778C7.77936 12.5643 6.92184 12.5392 6.1105 12.3047C5.29915 12.0702 4.56043 11.634 3.96324 11.0368C3.36605 10.4396 2.92987 9.70089 2.69537 8.88954C2.46088 8.0782 2.43572 7.22068 2.62224 6.39699C2.80877 5.57329 3.2009 4.81026 3.76204 4.17909C4.32319 3.54792 5.03508 3.06917 5.83128 2.78752C5.98792 2.73281 6.11642 2.61813 6.1885 2.46868C6.26059 2.31924 6.27035 2.14728 6.21565 1.99064C6.16095 1.834 6.04626 1.7055 5.89682 1.63342C5.74738 1.56133 5.57542 1.55156 5.41878 1.60627C4.42318 1.958 3.53292 2.55624 2.8311 3.34515C2.12927 4.13406 1.63877 5.08792 1.40535 6.11771C1.17194 7.14749 1.20323 8.21962 1.4963 9.23404C1.78937 10.2485 2.33468 11.1721 3.08132 11.9187C3.82795 12.6654 4.75158 13.2107 5.766 13.5037C6.78042 13.7968 7.85255 13.8281 8.88233 13.5947C9.91212 13.3613 10.866 12.8708 11.6549 12.1689C12.4438 11.4671 13.042 10.5769 13.3938 9.58127C13.4478 9.42543 13.4381 9.25454 13.3667 9.10585C13.2953 8.95716 13.168 8.84274 13.0125 8.78752Z"
                        fill="#011627"
                        fill-opacity="0.7"
                      />
                    </svg>
                  </div>
                  <div className="swift-accounts-content-stocks-right">
                    <p>Export</p>
                    <p>Change</p>
                  </div>
                </div>
                <div className="swift-accounts-content-stocks-checkbox">
                  <CustomCheckbox
                    label="Maintain Asset Class  Weighting"
                    value="checkbox1"
                    onChange={handleCheckboxChange}
                  />

                  <div className="swift-accounts-content-stocks-text">
                    <p>SAA</p>
                    <p>TAA</p>
                    <p>Act.Wt.</p>
                  </div>
                </div>
              </div>

              <div className="swift-accounts-content-stocks-show">
                <StockesDropdown
                  heading="Equity"
                  options={stocksArrays[0]}
                  isOpen={openDropdown === 0}
                  onToggle={() => handleDropdownToggle(0)}
                />
                <StockesDropdown
                  heading="Fixed Income"
                  options={stocksArrays[1]}
                  isOpen={openDropdown === 1}
                  onToggle={() => handleDropdownToggle(1)}
                />
                <StockesDropdown
                  heading="Alternatives"
                  options={stocksArrays[2]}
                  isOpen={openDropdown === 2}
                  onToggle={() => handleDropdownToggle(2)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
