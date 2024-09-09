import React, { useEffect, useState } from "react";
import "../../css/Accounts/StocksDropdown.css";
import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../Loader/Pulse";
import { numberFormatMatrix } from "../../utils/utilsFunction";
import CustomNumberInput from "../CustomComponents/CustomInput/CustomNumberInput";
import Select from "../../assets/icons/select-graph.svg";
import SwiftModal from "../CustomComponents/SwiftModal/SwiftModal";
import Close from "../../assets/crossicon.svg";
import Edit from "../../assets/icons/edit.svg";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import ConfirmBox from "../CustomComponents/ConfirmBox/ConfirmBox";

const PortfolioStockesDropdown = ({
  isOpen,
  onToggle,
  id,
  onStockSelect,
  selectedStock,
  inflow,
  setPortfolio_Value,
  setTotalsum,
}) => {
  const [data, setData] = useState({});
  const [loading, setloading] = useState(true);

  const [portfolio_value, setPortfolioValue] = useState(0);
  const [TotalPortfolio_value, setTotalPortfolioValue] = useState(0);

  const [allPropInvValue, setAllPropInvValue] = useState({});
  const [allPropQtyValue, setAllPropQtyValue] = useState({});

  const [totalPropInvValue, setTotalPropInvValue] = useState(0);
  const [change, setChange] = useState(0);

  const [inputPopup, setInputPopup] = useState(false);
  const [cashInputValue, setCashInputValue] = useState(0);

  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const updateTotalPropInvValue = (totalValue, index) => {
    setAllPropInvValue((prev) => ({
      ...prev,
      [index]: totalValue,
    }));

    setTotalPropInvValue((prev) => {
      const updatedAllPropInvValue = {
        ...allPropInvValue,
        [index]: totalValue,
      };

      const total = Object.values(updatedAllPropInvValue).reduce(
        (acc, curr) => acc + curr,
        0
      );

      return total;
    });
  };

  const fetchData = async (id, loader) => {
    try {
      if (loader) setTotalsum(0);
      setloading(loader ? true : false);

      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/stockAllData?id=${id}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      setData(data.data);
      setPortfolioValue(data.data.portfolio_value);
      setTotalPortfolioValue(data.data.portfolio_value + parseFloat(inflow));
      setPortfolio_Value(data.data.portfolio_value + parseFloat(inflow));
      if (loader) setTotalsum(data.data.totalPredictedPercentage);
      setTimeout(() => {
        setloading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    let interval;

    if (id) {
      fetchData(id, true);

      interval = setInterval(() => {
        fetchData(id, false);
      }, 1 * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [id, change]);

  useEffect(() => {
    setPortfolio_Value(parseFloat(inflow || 0) + portfolio_value);
    setTotalPortfolioValue(parseFloat(inflow || 0) + portfolio_value);
  }, [inflow]);

  const getParaComponent = (
    value,
    green,
    red,
    percentage,
    fontSize,
    newLine
  ) => {
    const sanitizedValue = String(value).replace(/,/g, "");

    return (
      <p
        className={`stocks-dropdown-option-change-1 portfolio-dropdown-column ${
          parseFloat(sanitizedValue) >= 0
            ? green
              ? "green-text"
              : ""
            : red
            ? "red-text"
            : ""
        }`}
      >
        {value}
        {newLine && (
          <span>
            <br />
          </span>
        )}
        {percentage && <span style={{ fontSize: fontSize }}>{percentage}</span>}
      </p>
    );
  };

  const handlerApply = async () => {
    try {
      setloading(true);
      const data = await ServerRequest({
        method: "post",
        URL: `/strategy/portfolio/cash`,
        data: { cash: cashInputValue, id: id, email: email_id },
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      setInputPopup(false);
      setCashInputValue(0);

      setTimeout(() => {
        setChange(Math.random());
      }, 1000);
    } catch (error) {
      console.error("Error updating data:", error);
      setloading(false);
    }
  };

  const showConfirmBox = () => {
    let totalQty = 0;
    for (const [symbol, quantity] of Object.entries(allPropQtyValue)) {
      totalQty += quantity;
    }
    if (totalQty == 0) {
      Alert({
        TitleText: "Warning",
        Message: "Quantity can not be 0",
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
      return;
    }
    ConfirmBox({
      title: "Process Trade",
      description: (
        <>
          <>Are you sure you want to process this trade ?</>
        </>
      ),
      properties: [
        {
          id: "2",
          label: "Yes",
          color: "#192b40",
          bgColor: "#ffffff",
          handleFunction: (callback) => {
            handleProcessTrade();
            callback();
          },
        },
      ],
      cancel: true,
    });
  };

  const handleProcessTrade = async () => {
    try {
      setloading(true);
      const data = await ServerRequest({
        method: "post",
        URL: `/strategy/portfolio/process/trades`,
        data: { qty: allPropQtyValue, id: id, email: email_id },
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      setAllPropQtyValue({});
      setAllPropInvValue({});
      setTotalPropInvValue(0);

      setTimeout(() => {
        setChange(Math.random());
      }, 1000);
    } catch (error) {
      console.error("Error updating data:", error);
      setloading(false);
    }
  };

  return !loading ? (
    <div className="swift-portfolio-management-wrapper">
      <div className="swift-portfolio-management-dropdown-wrapper">
        <div>
          <div className={`stocks-dropdown-option-details`}>
            <div className="stocks-dropdown-option-up">
              <div
                className="stocks-dropdown-option-title"
                style={{ width: "8%" }}
              >
                {data.cashData.symbol}
              </div>
              <div
                className="stocks-dropdown-option-change"
                style={{ width: "92%" }}
              >
                {getParaComponent(
                  numberFormatMatrix(data.cashData.percentage),
                  false,
                  true,
                  "%"
                )}
                {getParaComponent(
                  numberFormatMatrix(data.cashData.currentPrice),
                  false,
                  true,
                  ""
                )}
                {getParaComponent(
                  numberFormatMatrix(
                    (data.cashData.percentage * TotalPortfolio_value) / 100,
                    0
                  ),
                  false,
                  true,
                  ""
                )}

                <p
                  className={`stocks-dropdown-option-change-1 portfolio-dropdown-column ${
                    parseFloat(data.cashData.current_qty) < 0 ? "red-text" : ""
                  }`}
                >
                  {numberFormatMatrix(data.cashData.current_qty, 0)}
                  <img
                    src={Edit}
                    onClick={() => {
                      setCashInputValue(0);
                      setInputPopup(true);
                    }}
                  />
                </p>

                {getParaComponent(
                  numberFormatMatrix(data.cashData.current_qty + inflow, 0),
                  false,
                  true,
                  ""
                )}
                {getParaComponent(
                  numberFormatMatrix(
                    ((data.cashData.current_qty + inflow) /
                      TotalPortfolio_value) *
                      100
                  ),
                  false,
                  true,
                  "%"
                )}
                {getParaComponent(
                  numberFormatMatrix(
                    ((data.cashData.current_qty + inflow) /
                      TotalPortfolio_value) *
                      100 -
                      data.cashData.percentage
                  ),
                  false,
                  true,
                  "%"
                )}

                {getParaComponent(numberFormatMatrix(1), false, true, "")}

                {getParaComponent(
                  numberFormatMatrix(data.cashData.current_qty, 0),
                  false,
                  true,
                  ""
                )}
                {getParaComponent(
                  numberFormatMatrix(
                    ((data.cashData.current_qty + inflow) /
                      data.cashData.current_qty -
                      1) *
                      100
                  ),
                  false,
                  true,
                  "%"
                )}
                {getParaComponent(numberFormatMatrix(0), false, true, "%")}
                {getParaComponent(numberFormatMatrix(0), false, true, "%")}
                {getParaComponent("--", false, false, "")}
                {getParaComponent("--", false, false, "")}

                {getParaComponent(
                  numberFormatMatrix(
                    data.cashData.current_qty + inflow - totalPropInvValue,
                    0
                  ),
                  false,
                  true,
                  ""
                )}
                {getParaComponent(
                  numberFormatMatrix(
                    ((data.cashData.current_qty +
                      inflow +
                      parseFloat(-totalPropInvValue || 0)) /
                      TotalPortfolio_value) *
                      100
                  ),
                  false,
                  true,
                  "%"
                )}

                {getParaComponent("--", false, false, "")}
                {getParaComponent("", false, false, "")}
              </div>
            </div>
          </div>
        </div>
        {data.data.map((item, index) => (
          <Dropdown
            key={index}
            index={index}
            loading={loading}
            data={item}
            cashData={data.cashData}
            inflow={inflow}
            isOpen={isOpen}
            onToggle={onToggle}
            onStockSelect={onStockSelect}
            selectedStock={selectedStock}
            portfolio_value={TotalPortfolio_value}
            allPropInvValue={allPropInvValue}
            onUpdateTotalValue={updateTotalPropInvValue}
            getParaComponent={getParaComponent}
            setAllPropQtyValue={setAllPropQtyValue}
          />
        ))}
      </div>

      <div className="swift-portfolio-process-trade-btn">
        <CustomButton
          text="Process Trade"
          classname="swift-accounts-content-button"
          onClick={showConfirmBox}
        />
      </div>

      {inputPopup && (
        <SwiftModal closeModal={() => setInputPopup(false)} top="10px">
          <div className="swift-input-modal-content">
            <div className="custom__alert__close">
              <img src={Close} alt="X" onClick={() => setInputPopup(false)} />
            </div>

            <CustomNumberInput
              labelText="Cash"
              type="number"
              classnameDiv="swift-modal-cash-input"
              name={"cashInput"}
              placeholder=""
              styleDiv={{ paddingLeft: "10px" }}
              styleInput={{
                // margin: "0",
                width: "100%",
                padding: "10px",
                fontSize: "12px",
                // border: "none",
                // borderBottom: "1px solid #f0f0f0",
                // backgroundColor: "#f1f1f1",
              }}
              onInputChange={(symbol, value) =>
                setCashInputValue(value ? value : 0)
              }
              onClick={(e) => e.stopPropagation()}
              value={cashInputValue}
            />

            <div className="swift-modal-apply-btn">
              <CustomButton
                text="Apply"
                classname="swift-accounts-content-button"
                onClick={handlerApply}
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

const Dropdown = ({
  loading,
  key,
  data: item,
  cashData,
  inflow,
  isOpen,
  onToggle,
  onStockSelect,
  selectedStock,
  index,
  portfolio_value,
  onUpdateTotalValue,
  getParaComponent,
  allPropInvValue,
  setAllPropQtyValue,
}) => {
  const [propInvQty, setPropInvQty] = useState({});
  const [propInvValue, setPropInvValue] = useState({});
  const [totalEffWeight, setTotalEffWeight] = useState(0);

  const [data, setData] = useState(item);

  useEffect(() => {
    let total_percentage = 0;
    let total_current_value = 0;
    let total_current_weight = 0;
    let total_inv_value = 0;
    let total_today_cont = 0;
    let final_return = 0;
    let total_target_qty = 0;
    let total_curr_qty = 0;
    let total_active_weight = 0;
    let total_real_gain = 0;
    let total_unreal_gain = 0;

    const updatedStocks = item.stocks.map((stock, index) => {
      let target_qty =
        (portfolio_value * stock.percentage) / 100 / stock.regularMarketPrice;

      let current_weight = (stock.current_value / portfolio_value) * 100;

      let active_weight = current_weight - stock.percentage;

      let today_cont =
        (stock.regularMarketChangePercent * current_weight) / 100;

      total_percentage += parseFloat(stock.percentage);
      total_current_value += stock.current_value;
      total_current_weight += current_weight;
      total_inv_value += stock.inv_value;
      total_today_cont += today_cont;
      total_target_qty += target_qty;
      total_curr_qty += stock.current_qty;
      total_active_weight += active_weight;
      total_real_gain += stock.real_gain;
      total_unreal_gain += stock.unreal_gain;

      return {
        ...stock,
        target_qty,
        current_weight,
        active_weight,
        today_cont,
      };
    });

    final_return = (total_current_value / total_inv_value - 1) * 100;

    setData((prevData) => ({
      ...prevData,
      stocks: updatedStocks,
      total_current_value,
      total_current_weight,
      total_inv_value,
      total_percentage,
      total_today_cont,
      final_return,
      total_target_qty,
      total_curr_qty,
      total_active_weight,
      total_real_gain,
      total_unreal_gain,
    }));
  }, [portfolio_value, index, item]);

  useEffect(() => {
    const totalValue = Object.values(propInvValue).reduce(
      (acc, val) => acc + parseFloat(val),
      0
    );

    if (cashData.current_qty + inflow - totalValue < 0) {
      setPropInvQty({});
      setPropInvValue({});
      onUpdateTotalValue(0, index);
    }
  }, [inflow]);

  const handleInputChangeQty = (symbol, value, price) => {
    const newValue = {
      ...propInvValue,
      [symbol]: parseFloat(value * price).toFixed(0),
    };

    const totalValue = Object.values(newValue).reduce(
      (acc, val) => acc + parseFloat(val),
      0
    );

    const updatedAllPropInvValue = {
      ...allPropInvValue,
      [index]: totalValue,
    };

    const total = Object.values(updatedAllPropInvValue).reduce(
      (acc, curr) => acc + curr,
      0
    );

    const cashInvValue = cashData.current_qty + inflow - total;

    if (cashInvValue < 0) {
      Alert({
        TitleText: "Warning",
        Message: "You do not have enough cash available",
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
      return;
    }

    setPropInvQty((prev) => ({
      ...prev,
      [symbol]: value,
    }));
    setPropInvValue((prev) => {
      const newValue = {
        ...prev,
        [symbol]: parseFloat(value * price).toFixed(0),
      };

      const totalValue = Object.values(newValue).reduce(
        (acc, val) => acc + parseFloat(val),
        0
      );

      onUpdateTotalValue(totalValue, index);

      return newValue;
    });
    setAllPropQtyValue((prev) => ({
      ...prev,
      [symbol]: value,
    }));
  };

  const handleInputChangeValue = (symbol, value, price) => {
    const newValue = {
      ...propInvValue,
      [symbol]: parseFloat(value).toFixed(0),
    };

    const totalValue = Object.values(newValue).reduce(
      (acc, val) => acc + parseFloat(val),
      0
    );

    const updatedAllPropInvValue = {
      ...allPropInvValue,
      [index]: totalValue,
    };

    const total = Object.values(updatedAllPropInvValue).reduce(
      (acc, curr) => acc + curr,
      0
    );

    const cashInvValue = cashData.current_qty + inflow - total;

    if (cashInvValue < 0) {
      Alert({
        TitleText: "Warning",
        Message: "You do not have enough cash available",
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
      return;
    }

    setPropInvValue((prev) => {
      const newValue = {
        ...prev,
        [symbol]: parseFloat(value).toFixed(0),
      };

      const totalValue = Object.values(newValue).reduce(
        (acc, val) => acc + parseFloat(val),
        0
      );

      onUpdateTotalValue(totalValue, index);

      return newValue;
    });
    setPropInvQty((prev) => ({
      ...prev,
      [symbol]: Math.floor(value / price),
    }));
    setAllPropQtyValue((prev) => ({
      ...prev,
      [symbol]: Math.floor(value / price),
    }));
  };

  useEffect(() => {
    let totalWeight = 0;
    data.stocks.forEach((stock) => {
      let weight =
        ((stock.current_value + parseFloat(propInvValue[stock.symbol] || 0)) /
          portfolio_value) *
        100;

      totalWeight += weight;
    });
    setTotalEffWeight(totalWeight);
  }, [propInvValue, data.stocks]);

  return !loading ? (
    <div className="stocks-dropdown-main">
      {data.name !== "eureka" && (
        <div
          className="stocks-dropdown-header"
          style={{ alignItems: "flex-start" }}
        >
          <div
            className="stocks-dropdown-header-left"
            style={{ width: "8%", marginRight: "10px" }}
          >
            <div
              className="stocks-dropdown-heading"
              onClick={() => onToggle(index)}
            >
              {data.name}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              className={`stock-dropdown-icon ${
                isOpen[index] ? "up-arrow" : "down-arrow"
              }`}
              onClick={() => onToggle(index)}
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
          <div
            className="stocks-dropdown-header-right"
            style={{
              width: "92%",
              justifyContent: "space-between",
              columnGap: "0px",
              paddingRight: "10px",
              // marginRight: "10px",
            }}
          >
            {getParaComponent(
              numberFormatMatrix(data.total_percentage),
              false,
              true,
              "%"
            )}
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
            {getParaComponent(
              numberFormatMatrix(data.total_target_qty, 0),
              false,
              true,
              ""
            )}
            {getParaComponent(
              numberFormatMatrix(data.total_curr_qty, 0),
              false,
              true,
              ""
            )}
            {getParaComponent(
              numberFormatMatrix(data.total_current_value, 0),
              false,
              true,
              ""
            )}
            {getParaComponent(
              numberFormatMatrix(data.total_current_weight),
              false,
              true,
              "%"
            )}

            {getParaComponent(
              numberFormatMatrix(data.total_active_weight),
              false,
              true,
              "%"
            )}
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
            {getParaComponent(
              numberFormatMatrix(data.total_inv_value, 0),
              false,
              true,
              ""
            )}
            {getParaComponent(
              numberFormatMatrix(data.final_return),
              false,
              true,
              "%"
            )}
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
            {getParaComponent(
              numberFormatMatrix(data.total_today_cont),
              false,
              true,
              "%"
            )}

            <p
              className={`stocks-dropdown-option-change-1 portfolio-dropdown-column ${
                parseFloat(data.total_real_gain + data.total_unreal_gain) < 0
                  ? "red-text"
                  : ""
              }`}
            >
              {numberFormatMatrix(
                data.total_real_gain + data.total_unreal_gain,
                0
              )}
              <br></br>
              <span style={{ fontSize: "10px" }}>
                ({numberFormatMatrix(data.total_real_gain, 0)} ,{" "}
                {numberFormatMatrix(data.total_unreal_gain, 0)})
              </span>
            </p>

            {/* {getParaComponent(
              numberFormatMatrix(
                data.total_real_gain + data.total_unreal_gain,
                0
              ),
              false,
              true,
              ` (${numberFormatMatrix(
                data.total_real_gain,
                0
              )} , ${numberFormatMatrix(data.total_unreal_gain, 0)})`,
              "10px",
              true
            )} */}

            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
            {getParaComponent(
              numberFormatMatrix(totalEffWeight),
              false,
              true,
              "%"
            )}
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
          </div>
        </div>
      )}
      {isOpen[index] && (
        <div className="stocks-dropdown-options-container">
          <ul className="stocks-dropdown-options">
            {data.stocks.map((stock, index) => (
              <li key={index}>
                <div className={`stocks-dropdown-option-details`}>
                  <div className="stocks-dropdown-option-up">
                    <div
                      className="stocks-dropdown-option-title"
                      style={{ width: "8%" }}
                    >
                      {stock.symbol}
                      <p className="stocks-dropdown-option-down">
                        {stock.detailed_name}
                      </p>
                    </div>
                    <div
                      className="stocks-dropdown-option-change"
                      style={{ width: "92%" }}
                    >
                      {getParaComponent(
                        numberFormatMatrix(stock.percentage),
                        false,
                        true,
                        "%"
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.regularMarketPrice),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.target_qty, 0),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.current_qty, 0),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.current_value, 0),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.current_weight),
                        false,
                        true,
                        "%"
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.active_weight),
                        false,
                        true,
                        "%"
                      )}

                      {getParaComponent(
                        numberFormatMatrix(stock.inv_prive),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.inv_value, 0),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.total_return),
                        true,
                        true,
                        "%"
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.regularMarketChangePercent),
                        true,
                        true,
                        "%"
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.today_cont),
                        true,
                        true,
                        "%"
                      )}

                      <p
                        className={`stocks-dropdown-option-change-1 portfolio-dropdown-column ${
                          parseFloat(stock.real_gain + stock.unreal_gain) < 0
                            ? "red-text"
                            : ""
                        }`}
                      >
                        {numberFormatMatrix(
                          stock.real_gain + stock.unreal_gain,
                          0
                        )}
                        <br></br>
                        <span style={{ fontSize: "10px" }}>
                          ({numberFormatMatrix(stock.real_gain, 0)} ,{" "}
                          {numberFormatMatrix(stock.unreal_gain, 0)})
                        </span>
                      </p>

                      {/* {getParaComponent(
                        numberFormatMatrix(
                          stock.real_gain + stock.unreal_gain,
                          0
                        ),
                        false,
                        true
                      )} */}

                      <CustomNumberInput
                        labelText=""
                        type="number"
                        classnameDiv="stocks-dropdown-option-change-1 portfolio-dropdown-column"
                        name={stock.symbol}
                        placeholder=""
                        styleDiv={{ paddingLeft: "10px" }}
                        styleInput={{
                          margin: "0",
                          width: "95%",
                          padding: "5px 5px",
                          fontSize: "12px",
                          border: "none",
                          // borderBottom: "1px solid #f0f0f0",
                          backgroundColor: "#f1f1f1",
                        }}
                        onInputChange={(symbol, value) =>
                          handleInputChangeQty(
                            symbol,
                            value ? value : 0,
                            stock.regularMarketPrice
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        value={propInvQty[stock.symbol]}
                      />
                      <CustomNumberInput
                        labelText=""
                        type="number"
                        classnameDiv="stocks-dropdown-option-change-1 portfolio-dropdown-column"
                        name={stock.symbol}
                        placeholder=""
                        styleInput={{
                          margin: "0",
                          width: "95%",
                          padding: "5px 5px",
                          fontSize: "12px",
                          border: "none",
                          // borderBottom: "1px solid #f0f0f0",
                          backgroundColor: "#f1f1f1",
                        }}
                        onInputChange={(symbol, value) =>
                          handleInputChangeValue(
                            symbol,
                            value ? value : 0,
                            stock.regularMarketPrice
                          )
                        }
                        onClick={(e) => e.stopPropagation()}
                        value={propInvValue[stock.symbol]}
                      />

                      {getParaComponent(
                        numberFormatMatrix(
                          ((stock.current_value +
                            parseFloat(propInvValue[stock.symbol] || 0)) /
                            portfolio_value) *
                            100
                        ),
                        false,
                        true,
                        "%"
                      )}

                      {/* {getParaComponent(
                        numberFormatMatrix(stock.percentage_change),
                        true,
                        true,
                        "%"
                      )} */}
                      {getParaComponent(
                        numberFormatMatrix(stock.predict_percentage * 100),
                        true,
                        true,
                        "%"
                      )}
                      <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column ">
                        <img
                          src={Select}
                          onClick={() =>
                            onStockSelect(
                              stock.symbol,
                              stock.detailed_name,
                              stock.predict_percentage * 100
                            )
                          }
                        />
                      </p>
                    </div>
                  </div>

                  {/* <div className="stocks-dropdown-option-info stocks-portfolio-dropdown-option-info">
                    <div
                      className="stocks-dropdown-option-down"
                      style={{ width: "8%" }}
                    >
                      {stock.detailed_name}
                    </div>

                    <div
                      className="stocks-dropdown-option-change"
                      style={{ width: "92%" }}
                    >
                      {Array.from({ length: 12 }).map((_, index) =>
                        getParaComponent("", false, false, "")
                      )}
                      <p
                        className={`stocks-dropdown-option-change-1 portfolio-dropdown-column ${
                          parseFloat(stock.real_gain + stock.unreal_gain) < 0
                            ? "red-text"
                            : ""
                        }`}
                        style={{ fontSize: "10px" }}
                      >
                        ({numberFormatMatrix(stock.real_gain, 0)} ,{" "}
                        {numberFormatMatrix(stock.unreal_gain, 0)})
                      </p>
                      {Array.from({ length: 5 }).map((_, index) =>
                        getParaComponent("", false, false, "")
                      )}
                    </div>
                  </div> */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <Pulse />
    </div>
  );
};

export default PortfolioStockesDropdown;
