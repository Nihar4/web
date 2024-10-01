import React, { useEffect, useRef, useState } from "react";
import "../../../css/Accounts/StocksDropdown.css";
import ServerRequest from "../../../utils/ServerRequest";
import Pulse from "../../Loader/Pulse";
import SwiftModal from "../../CustomComponents/SwiftModal/SwiftModal";
import SearchLive from "../../CustomComponents/CustomLiveSearch/SearchLive";
import Close from "../../../assets/crossicon.svg";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";
import CustomPopupLiveSearch from "../../CustomComponents/CustomLiveSearch/CustomPopupLiveSearch";
import { isEmpty } from "../../../utils/Validation";
import { Alert } from "../../CustomComponents/CustomAlert/CustomAlert";
import {
  Add,
  ClockIcon,
  DeleteIcon,
  RunIcon,
} from "../../CustomComponents/SwiftIcon/Icons";
import moment from "moment";

const StockesDropdown = ({
  onStockSelect,
  selectedStock,
  selectedStrategy,
  setStocksLoading,
  RunAnalysis,
  DeleteHandle,
  change: change1,
  setSum,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [inputPopup, setInputPopup] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [change, setChange] = useState(1);
  const abortControllerRef = useRef(null);

  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  useEffect(() => {
    setLoading(true);
    setStocksLoading(true);
    fetchAllStocksDetails(true);
  }, [selectedStrategy, change, change1]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAllStocksDetails(false, selectedStock, intervalId);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedStock, selectedStrategy]);

  const fetchAllStocksDetails = async (
    isFirstTime,
    selectedStock,
    intervalId
  ) => {
    try {
      if (!selectedStrategy) return;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/stocks?id=${selectedStrategy}`,
        signal,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }
      setData(data.data);
      setSum(parseFloat(data.return).toFixed(2));
      setLoading(false);
      setStocksLoading(false);
      if (isFirstTime) {
        onStockSelect(data.data[0]);
      } else {
        const stockIndex = data.data.findIndex(
          (stock) => stock.symbol == selectedStock.symbol
        );

        if (stockIndex !== -1) {
          if (data.data[stockIndex].status != selectedStock.status)
            onStockSelect(data.data[stockIndex]);
        }
      }
    } catch (error) {
      if (intervalId) clearInterval(intervalId);
      console.error(error);
    }
  };

  const HandleAdd = async (symbol) => {
    if (isEmpty(symbol)) {
      Alert({
        TitleText: "Warning",
        Message: "Select Symbol First",
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
      return;
    } else {
      const symbolParts = symbol.split(",");
      const firstPartOfSymbol = symbolParts[0]?.trim();

      const data = await ServerRequest({
        method: "post",
        URL: `/strategy/stock/insert`,
        data: {
          id: selectedStrategy,
          symbol: firstPartOfSymbol,
          email: email_id,
        },
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }
      const symbolName = firstPartOfSymbol.split(".")[0];
      // setLoading(true);
      setSymbol("");
      // setChange(Math.random());
      fetchAllStocksDetails(false, selectedStock);
      setInputPopup(false);
      Alert({
        TitleText: "Success",
        Message: `${symbolName} added successfully`,
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
    }
  };

  return !loading ? (
    <div className="stocks-dropdown-main">
      <div className="stocks-dropdown-options-container">
        <ul className="stocks-dropdown-options">
          <li key={"header"} style={{ cursor: "normal" }}>
            <div
              className={`stocks-dropdown-option-details`}
              style={{ margin: "0", border: "none", borderRadius: "0" }}
            >
              <div className="stocks-dropdown-option-up">
                <div className="stocks-dropdown-option-title">
                  <p onClick={() => setInputPopup(true)}>
                    <Add color="black" size={20} />
                  </p>
                </div>
                <div className="stocks-dropdown-option-change">
                  <p
                    className={"stocks-dropdown-option-change-2 "}
                    style={{ width: "25%" }}
                  >
                    MTD
                  </p>
                  <p
                    className={"stocks-dropdown-option-change-2 "}
                    style={{ width: "25%" }}
                  >
                    Price
                  </p>
                  <p
                    className={"stocks-dropdown-option-change-2 "}
                    style={{ width: "25%" }}
                  >
                    Pred.(3M)
                  </p>
                  <p
                    className={"stocks-dropdown-option-change-2 "}
                    style={{ width: "12%" }}
                  ></p>
                  <p
                    className={"stocks-dropdown-option-change-2 "}
                    style={{ width: "12%" }}
                  ></p>
                </div>
              </div>
            </div>
          </li>

          {data.map((stock, index) => (
            <li
              key={index}
              onClick={() => onStockSelect(stock)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`stocks-dropdown-option-details ${
                  stock.symbol == selectedStock?.symbol
                    ? "stock-dropdown-option-details-active"
                    : ""
                }`}
              >
                <div className="stocks-dropdown-option-up">
                  <div className="stocks-dropdown-option-title">
                    {stock.symbol}
                  </div>
                  <div className="stocks-dropdown-option-change">
                    <p
                      className={
                        "stocks-dropdown-option-change-2 " +
                        (stock.percentage_change >= 0
                          ? "green-text"
                          : "red-text") +
                        (stock.symbol.split(".")[1] == "EH"
                          ? "normal-text"
                          : "")
                      }
                      style={{ width: "25%" }}
                    >
                      {stock.percentage_change !== null ? (
                        <p>{stock.percentage_change.toFixed(2)}%</p>
                      ) : (
                        <p>--</p>
                      )}
                    </p>
                    <p
                      className="stocks-dropdown-option-change-1"
                      style={{ width: "25%" }}
                    >
                      {stock.regularMarketPrice !== null ? (
                        <>{stock.regularMarketPrice.toFixed(2)}</>
                      ) : (
                        <>--</>
                      )}
                    </p>
                    <p
                      className={
                        "stocks-dropdown-option-change-2 " +
                        (stock.status === "Pending"
                          ? ""
                          : stock.predict_percentage * 100 > 0
                          ? "green-text"
                          : "red-text")
                      }
                      style={{ width: "25%" }}
                    >
                      {stock.status === "Pending" ? (
                        // <ClockIcon size={18} color="black" />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_7_8)">
                            <path
                              d="M10 2.3999C5.80002 2.3999 2.40002 5.7999 2.40002 9.9999C2.40002 14.1999 5.80002 17.5999 10 17.5999C14.2 17.5999 17.6 14.1999 17.6 9.9999C17.6 5.7999 14.2 2.3999 10 2.3999ZM10.4 16.7799V16.3799C10.4 16.1599 10.22 15.9799 10 15.9799C9.78002 15.9799 9.60002 16.1599 9.60002 16.3799V16.7799C6.16002 16.5799 3.42002 13.8199 3.22002 10.3999H3.62002C3.84002 10.3999 4.02002 10.2199 4.02002 9.9999C4.02002 9.7799 3.84002 9.5999 3.62002 9.5999H3.22002C3.42002 6.1599 6.18002 3.4199 9.60002 3.2199V3.6199C9.60002 3.8399 9.78002 4.0199 10 4.0199C10.22 4.0199 10.4 3.8399 10.4 3.6199V3.2199C13.84 3.4199 16.58 6.1799 16.78 9.5999H16.38C16.16 9.5999 15.98 9.7799 15.98 9.9999C15.98 10.2199 16.16 10.3999 16.38 10.3999H16.78C16.58 13.8399 13.84 16.5799 10.4 16.7799ZM12.4 12.3999C12.24 12.5599 12 12.5599 11.84 12.3999L9.72002 10.2799C9.74002 10.2999 9.60002 10.1999 9.60002 9.9999V5.1999C9.60002 4.9799 9.78002 4.7999 10 4.7999C10.22 4.7999 10.4 4.9799 10.4 5.1999V9.8399L12.4 11.8399C12.56 11.9999 12.56 12.2399 12.4 12.3999Z"
                              fill="black"
                            />
                            <path
                              d="M300.8 -214V122.8H-56V-214H300.8ZM302.4 -215.6H-57.6V124.4H302.4V-215.6Z"
                              fill="#0000FF"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_7_8">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      ) : (
                        `${(stock.predict_percentage * 100).toFixed(2)}%`
                      )}
                    </p>

                    <p
                      className={"stocks-dropdown-option-change-2"}
                      style={{
                        width: "12%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        DeleteHandle(stock.symbol);
                      }}
                      title="Delete"
                    >
                      {/* <DeleteIcon color="black" size={20} /> */}

                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="delete-hover-blue"
                      >
                        <path
                          d="M6.10002 18.6667H13.9667C14.8667 18.6667 15.5667 17.9333 15.5667 17.0667V6.23333H16.2667C16.4667 6.23333 16.6 6.1 16.6 5.9V5.13333C16.6 4.43333 16.0333 3.9 15.3667 3.9H12.5333V3.03333C12.5333 2.46667 12.0667 2 11.5 2H8.53335C7.96668 2 7.50002 2.46667 7.50002 3.03333V3.9H4.66668C3.96668 3.9 3.43335 4.46667 3.43335 5.13333V5.9C3.43335 6.1 3.56668 6.23333 3.76668 6.23333H4.46668V17.0667C4.46668 17.9333 5.20002 18.6667 6.10002 18.6667ZM14.9 17.0667C14.9 17.6 14.4667 18 13.9667 18H6.10002C5.56668 18 5.16668 17.5667 5.16668 17.0667V6.23333H14.9333V17.0667H14.9ZM8.16668 3.03333C8.16668 2.83333 8.33335 2.66667 8.53335 2.66667H11.5C11.7 2.66667 11.8667 2.83333 11.8667 3.03333V3.9H8.20002V3.03333H8.16668ZM4.10002 5.13333C4.10002 4.8 4.36668 4.56667 4.66668 4.56667H15.3334C15.6667 4.56667 15.9 4.83333 15.9 5.13333V5.56667H4.10002V5.13333Z"
                          fill="black"
                        />
                        <path
                          d="M12.6333 16.4C12.8333 16.4 12.9667 16.2667 12.9667 16.0667V8.13338C12.9667 7.93338 12.8333 7.80005 12.6333 7.80005C12.4333 7.80005 12.3 7.93338 12.3 8.13338V16.0667C12.3 16.2667 12.4667 16.4 12.6333 16.4ZM10.0333 16.4C10.2333 16.4 10.3667 16.2667 10.3667 16.0667V8.13338C10.3667 7.93338 10.2333 7.80005 10.0333 7.80005C9.83332 7.80005 9.69998 7.93338 9.69998 8.13338V16.0667C9.69998 16.2667 9.83332 16.4 10.0333 16.4ZM7.39998 16.4C7.59998 16.4 7.73332 16.2667 7.73332 16.0667V8.13338C7.73332 7.93338 7.59998 7.80005 7.39998 7.80005C7.19998 7.80005 7.06665 7.93338 7.06665 8.13338V16.0667C7.06665 16.2667 7.19998 16.4 7.39998 16.4Z"
                          fill="black"
                        />
                      </svg>
                    </p>
                    <p
                      className={"stocks-dropdown-option-change-2"}
                      style={{
                        width: "12%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={(event) => {
                        if (stock.status == "Pending") return;
                        else {
                          event.stopPropagation();
                          RunAnalysis(stock.symbol);
                        }
                      }}
                      title="Run Analysis"
                    >
                      {stock.status !== "Pending" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256.001 256.001"
                          id="gear"
                          width={20}
                          className="run-hover-blue"
                        >
                          <rect width="256" height="256" fill="none"></rect>
                          <circle
                            cx="128.002"
                            cy="128"
                            r="48"
                            fill="none"
                            stroke="#000"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="12"
                          ></circle>
                          <path
                            fill="none"
                            stroke="#000"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="12"
                            d="M122.8736,44.15392,104.00412,30.006a7.99514,7.99514,0,0,0-7.17954-1.24562A103.35049,103.35049,0,0,0,79.882,35.77028a8.00251,8.00251,0,0,0-4.20618,5.96441L72.34012,65.08557q-1.90725,1.69062-3.73445,3.51677Q66.779,70.429,65.088,72.33777l-.0005.0004-23.3468,3.33867a7.99513,7.99513,0,0,0-5.95748,4.19591,103.35186,103.35186,0,0,0-7.0235,16.93693,8.00252,8.00252,0,0,0,1.24326,7.19169l14.15287,18.87027q-.1532,2.54408-.15393,5.12738,0,2.58326.154,5.1287l-.00008.00064L30.008,151.99783a7.99512,7.99512,0,0,0-1.24562,7.17954,103.35131,103.35131,0,0,0,7.00985,16.94257,8.00251,8.00251,0,0,0,5.96441,4.20618l23.35089,3.33571q1.69061,1.90725,3.51676,3.73445,1.82664,1.82663,3.73544,3.51764l.00039.00051,3.33867,23.34679a7.99513,7.99513,0,0,0,4.19592,5.95749,103.35135,103.35135,0,0,0,16.93692,7.02349,8.00254,8.00254,0,0,0,7.1917-1.24326l18.87027-14.15286q2.54406.15318,5.12738.15392,2.58324,0,5.1287-.154l.00063.00008L151.99978,225.994a7.99514,7.99514,0,0,0,7.17954,1.24562,103.351,103.351,0,0,0,16.94258-7.00986,8.00254,8.00254,0,0,0,4.20618-5.96441l3.33571-23.35088q1.90725-1.69062,3.73444-3.51677,1.82664-1.82663,3.51764-3.73543l.00051-.0004,23.34679-3.33867a7.99514,7.99514,0,0,0,5.95749-4.19591,103.351,103.351,0,0,0,7.02349-16.93693,8.00251,8.00251,0,0,0-1.24325-7.19169L211.848,133.12836q.15318-2.54407.15392-5.12738,0-2.58326-.154-5.1287l.00008-.00064,14.14788-18.86947a7.99514,7.99514,0,0,0,1.24562-7.17954,103.35131,103.35131,0,0,0-7.00985-16.94257,8.00252,8.00252,0,0,0-5.96442-4.20618l-23.35088-3.33571q-1.69061-1.90725-3.51677-3.73445-1.82662-1.82662-3.73543-3.51764l-.00039-.00051-3.33868-23.34679a7.99512,7.99512,0,0,0-4.19591-5.95749,103.35135,103.35135,0,0,0-16.93692-7.02349,8.00254,8.00254,0,0,0-7.1917,1.24326L133.13031,44.15392q-2.54408-.15318-5.12738-.15392-2.58324,0-5.1287.154Z"
                          ></path>
                        </svg>
                      )}
                    </p>
                  </div>
                </div>

                <div className="stocks-dropdown-option-info">
                  <div
                    className="stocks-dropdown-option-down"
                    style={{ width: "100%" }}
                  >
                    {stock.detailed_name}
                  </div>
                </div>
                {stock.symbol == selectedStock?.symbol && (
                  <div className="stocks-dropdown-option-info">
                    <div
                      className="stocks-dropdown-option-down"
                      style={{ width: "100%", fontStyle: "italic" }}
                    >
                      Last Run date:{" "}
                      {moment
                        .tz(moment(stock.date_completed), moment.tz.guess())
                        .format("DD-MM-YYYY HH:mm:ss")}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
          {data.length == 0 && (
            <div className="analysis-pending" style={{ height: "80vh" }}>
              <p
                className="analysis-pending-heading"
                style={{ fontWeight: "600", fontSize: "12px" }}
              >
                Add Stocks First
              </p>
            </div>
          )}
        </ul>
      </div>

      {inputPopup && (
        <SwiftModal
          closeModal={() => setInputPopup(false)}
          top="10px"
          className="swift-symbol-input-model"
        >
          <div
            className="swift-input-modal-content"
            style={{ height: "600px", width: "500px" }}
          >
            <div className="custom__alert__close">
              <img src={Close} alt="X" onClick={() => setInputPopup(false)} />
            </div>

            <CustomPopupLiveSearch
              name="symbol"
              value={symbol}
              onInputChange={(name, value) => {
                setSymbol(value);
                HandleAdd(value);
              }}
              onInputChangeEmpty={true}
              filterArray={data.map((item) => item.symbol)}
            />

            {/* <div
              className="swift-modal-apply-btn"
              style={{ flex: "auto", alignItems: "end" }}
            >
              <CustomButton
                text="Add"
                classname="swift-accounts-content-button"
                onClick={HandleAdd}
              />
            </div> */}
          </div>
        </SwiftModal>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <Pulse />
    </div>
  );
};

export default StockesDropdown;
