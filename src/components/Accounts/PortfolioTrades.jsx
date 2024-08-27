import React, { useEffect, useState } from "react";
import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../Loader/Pulse";
import moment from "moment";
import "../../css/Accounts/AddStrategy.css";
import { numberFormatMatrix } from "../../utils/utilsFunction";

const PortfolioTrades = ({ id }) => {
  const [tradeData, SetTradeData] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchTradeData = async (strategyID) => {
    try {
      setloading(true);
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/portfolio/trades?id=${strategyID}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      SetTradeData(data.data);
      setTimeout(() => {
        setloading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching Trade data:", error);
    }
  };

  useEffect(() => {
    if (id) fetchTradeData(id);
  }, [id]);

  return !loading ? (
    <div className="swift-portfolio-trades table-wrapper">
      {tradeData.length > 0 ? (
        <table className="swift-strategy-created-table">
          <thead>
            <tr>
              <th>Strategy ID</th>
              <th>Symbol</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Tentative Price</th>
              <th>Net Price</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tradeData &&
              tradeData.map((item, index) => (
                <tr key={index}>
                  <td>{item.strategy_id}</td>
                  <td>{item.symbol}</td>
                  <td>{item.category}</td>
                  <td>{numberFormatMatrix(item.quantity, 0)}</td>
                  <td>{numberFormatMatrix(item.tentativeprice, 2)}</td>
                  <td>{numberFormatMatrix(item.netprice, 2)}</td>
                  <td>{numberFormatMatrix(item.amount, 0)}</td>
                  <td>{item.type}</td>
                  <td>
                    {moment
                      .tz(new Date(item.date).toISOString(), moment.tz.guess())

                      .format("DD-MM-YYYY HH:mm:ss")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>No Trades Available</p>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  );
};

export default PortfolioTrades;
