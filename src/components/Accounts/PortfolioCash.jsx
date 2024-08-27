import React, { useEffect, useState } from "react";
import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../Loader/Pulse";
import moment from "moment";
import "../../css/Accounts/AddStrategy.css";
import { numberFormatMatrix } from "../../utils/utilsFunction";

const PortfolioCash = ({ id }) => {
  const [cashData, SetCashData] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchTradeData = async (strategyID) => {
    try {
      setloading(true);
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/portfolio/cash?id=${strategyID}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      SetCashData(data.data);
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
      {cashData.length > 0 ? (
        <table className="swift-strategy-created-table">
          <thead>
            <tr>
              <th>Strategy ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {cashData &&
              cashData.map((item, index) => (
                <tr key={index}>
                  <td>{item.strategy_id}</td>
                  <td>{item.description}</td>
                  <td>{numberFormatMatrix(item.amount, 0)}</td>
                  <td>{numberFormatMatrix(item.balance, 0)}</td>
                  <td>
                    {moment
                      .tz(
                        new Date(item.datetime).toISOString(),
                        moment.tz.guess()
                      )

                      .format("DD-MM-YYYY HH:mm:ss")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>No Cash Available</p>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  );
};

export default PortfolioCash;
