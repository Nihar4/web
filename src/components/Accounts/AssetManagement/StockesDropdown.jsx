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

  const HandleAdd = async () => {
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
      setInputPopup(false);
      setSymbol("");
      setChange(Math.random());
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
                        <ClockIcon size={18} color="black" />
                      ) : (
                        `${(stock.predict_percentage * 100).toFixed(2)}%`
                      )}
                    </p>

                    <p
                      className={"stocks-dropdown-option-change-2 "}
                      style={{
                        width: "12%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => DeleteHandle(stock.symbol)}
                    >
                      <DeleteIcon color="black" size={20} />
                    </p>
                    <p
                      className={"stocks-dropdown-option-change-2 "}
                      style={{
                        width: "12%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        if (stock.status == "Pending") return;
                        else RunAnalysis(stock.symbol);
                      }}
                    >
                      {stock.status !== "Pending" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256.001 256.001"
                          id="gear"
                          width={20}
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
              <p className="analysis-pending-heading">Add Stocks First</p>
            </div>
          )}
        </ul>
      </div>

      {inputPopup && (
        <SwiftModal closeModal={() => setInputPopup(false)} top="10px">
          <div
            className="swift-input-modal-content"
            style={{ height: "350px", width: "450px" }}
          >
            <div className="custom__alert__close">
              <img src={Close} alt="X" onClick={() => setInputPopup(false)} />
            </div>

            <CustomPopupLiveSearch
              name="symbol"
              value={symbol}
              onInputChange={(name, value) => setSymbol(value)}
              filterArray={data.map((item) => item.symbol)}
            />

            <div
              className="swift-modal-apply-btn"
              style={{ flex: "auto", alignItems: "end" }}
            >
              <CustomButton
                text="Add"
                classname="swift-accounts-content-button"
                onClick={HandleAdd}
              />
            </div>
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
