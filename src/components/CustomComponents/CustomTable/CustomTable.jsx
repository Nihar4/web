import React from "react";

const CustomTable = () => {
  return (
    <div className="swift-uk-table-container ">
      {loading ? (
        <>
          <div className="swift-uk-table-loading">
            <Pulse />
            <p>Loading Transaction data...</p>
          </div>
        </>
      ) : (
        <>
          {transaction.length === 0 ? (
            <>
              <div className="swift-uk-table-empty">
                <OrderBook size={40} color={COLOR_VARS["SWIFT_COLOR4"]} />
                <div>
                  <p>No Transactions found</p>
                  <span>Looks like you have't made any Transactions</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <td>Input Time</td>
                    <td>ISIN</td>
                    <td>Scheme Type</td>
                    <td>Scheme Name</td>
                    <td>NAV</td>
                    <td>Type</td>
                    <td>Amount</td>
                    <td>Tentative Units</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  {transaction.map((h, index) => {
                    return (
                      <>
                        <tr
                          key={index}
                          className={
                            h.status === "UTR Pending" ? "yes_hover" : ""
                          }
                        >
                          <td>{formateDate(h["input_date"], true)}</td>

                          <td title={h["isin"]}>{h["isin"]}</td>
                          <td>{h["Scheme_Type"]}</td>
                          <td title={h.Scheme_Name}>{h["Scheme_Name"]}</td>
                          <td>{numberFormat(h.nav)}</td>
                          <td>{h["type"]}</td>
                          <td>{numberFormat(h["amount"])}</td>
                          <td>
                            {(Math.floor((h.amount / h.nav) * 100) / 100)
                              .toFixed(2)
                              .replace(/\.0+$/, "")}
                          </td>
                          <td>{h["status"]}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CustomTable;
