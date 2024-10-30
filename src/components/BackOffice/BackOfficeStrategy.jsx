import React, { useState } from "react";
import "../../css/Accounts/Strategy.css";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";

const BackOfficeStrategy = ({
  funds,
  setSelectedFund,
  setCurrentPage,
  selectedfund,
}) => {
  const handleStrategyClick = (id) => {
    setSelectedFund(id);
    setCurrentPage("preview");
  };

  const handleDelete = (id) => {
    console.log("Delete ID:", id);
  };

  return (
    <div className="swift-back-office-strategy">
      <div className="swift-back-office-strategy-wrapper">
        {funds.map((strategy) => (
          <div
            key={strategy.id}
            className={`swift-accounts-strategy ${
              selectedfund == strategy.id
                ? "swift-accounts-strategy-active"
                : ""
            }`}
          >
            <div
              className="swift-accounts-strategy-content"
              onClick={() => handleStrategyClick(strategy.id)}
            >
              <p style={{ fontWeight: 700, fontSize: 13 }}>
                {strategy.fund_name}
              </p>
              <p className="swift-back-office-strategy-date">
                Date Created: {strategy.date_time}
              </p>
            </div>
            {selectedfund == strategy.id && (
              <div className="swift-accounts-strategy-delete">
                <div>
                  <p onClick={() => handleDelete(strategy.id)}>Delete</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {funds.length == 0 && <p>Add Funds</p>}
      </div>
      <div className="swift-back-office-strategy-add-btn">
        <CustomButton
          text="Add Fund"
          classname="swift-accounts-content-button"
          onClick={() => setCurrentPage("add")}
        />
      </div>
    </div>
  );
};

export default BackOfficeStrategy;
