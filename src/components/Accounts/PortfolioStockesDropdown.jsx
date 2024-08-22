import React, { useEffect, useState } from "react";
import "../../css/Accounts/StocksDropdown.css";
import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../Loader/Pulse";
import { numberFormatMatrix } from "../../utils/utilsFunction";
import CustomNumberInput from "../CustomComponents/CustomInput/CustomNumberInput";
import Select from "../../assets/icons/select-graph.svg";

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
  const [totalPropInvValue, setTotalPropInvValue] = useState(0);

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
      setloading(loader);

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
      setloading(false);
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
      }, 10 * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [id]);

  useEffect(() => {
    setPortfolio_Value(parseFloat(inflow || 0) + portfolio_value);
    setTotalPortfolioValue(parseFloat(inflow || 0) + portfolio_value);
  }, [inflow]);

  const getParaComponent = (value, green, red, percentage) => {
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
        {value + percentage}
      </p>
    );
  };

  return !loading ? (
    <>
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
              {getParaComponent(
                numberFormatMatrix(data.cashData.current_qty, 0),
                false,
                true,
                ""
              )}
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
          isOpen={isOpen}
          onToggle={onToggle}
          onStockSelect={onStockSelect}
          selectedStock={selectedStock}
          portfolio_value={TotalPortfolio_value}
          onUpdateTotalValue={updateTotalPropInvValue}
          getParaComponent={getParaComponent}
        />
      ))}
    </>
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
  isOpen,
  onToggle,
  onStockSelect,
  selectedStock,
  index,
  portfolio_value,
  onUpdateTotalValue,
  getParaComponent,
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

  const handleInputChangeQty = (symbol, value, price) => {
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
  };

  const handleInputChangeValue = (symbol, value, price) => {
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
        <div className="stocks-dropdown-header">
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
                isOpen[key] ? "up-arrow" : "down-arrow"
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
            {getParaComponent(
              numberFormatMatrix(data.total_real_gain, 0),
              false,
              true,
              ""
            )}
            {getParaComponent(
              numberFormatMatrix(data.total_unreal_gain, 0),
              false,
              true,
              ""
            )}
            {getParaComponent(
              numberFormatMatrix(
                data.total_real_gain + data.total_unreal_gain,
                0
              ),
              false,
              true,
              ""
            )}
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
            <p className="stocks-dropdown-option-change-1 portfolio-dropdown-column "></p>
          </div>
        </div>
      )}
      {isOpen[index] && (
        <div className="stocks-dropdown-options-container">
          <ul className="stocks-dropdown-options">
            {data.stocks.map((stock, index) => (
              <li key={index} style={{ borderBottom: "1px solid #f1f1f1" }}>
                <div className={`stocks-dropdown-option-details`}>
                  <div className="stocks-dropdown-option-up">
                    <div
                      className="stocks-dropdown-option-title"
                      style={{ width: "8%" }}
                    >
                      {stock.symbol}
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
                      {getParaComponent(
                        numberFormatMatrix(stock.real_gain, 0),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(stock.unreal_gain, 0),
                        false,
                        true,
                        ""
                      )}
                      {getParaComponent(
                        numberFormatMatrix(
                          stock.unreal_gain + stock.real_gain,
                          0
                        ),
                        false,
                        true,
                        ""
                      )}

                      <CustomNumberInput
                        labelText=""
                        type="text"
                        classnameDiv="stocks-dropdown-option-change-1 portfolio-dropdown-column"
                        name={stock.symbol}
                        placeholder=""
                        styleDiv={{ paddingLeft: "10px" }}
                        styleInput={{
                          margin: "0",
                          width: "100%",
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
                        type="text"
                        classnameDiv="stocks-dropdown-option-change-1 portfolio-dropdown-column"
                        name={stock.symbol}
                        placeholder=""
                        styleInput={{
                          margin: "0",
                          width: "100%",
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

                      {getParaComponent(
                        numberFormatMatrix(stock.percentage_change),
                        true,
                        true,
                        "%"
                      )}
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
                            onStockSelect(stock.symbol, stock.detailed_name)
                          }
                        />
                      </p>
                    </div>
                  </div>

                  <div className="stocks-dropdown-option-info">
                    <div className="stocks-dropdown-option-down">
                      {stock.detailed_name}
                    </div>
                  </div>
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
