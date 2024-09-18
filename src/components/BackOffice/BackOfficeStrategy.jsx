import React, { useState } from "react";
import "../../css/Accounts/Strategy.css";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";

const BackOfficeStrategy = ({
  strategies,
  setSelectedStrategy,
  setAddFund,
}) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState(
    strategies[0]?.id || null
  );

  const handleStrategyClick = (id) => {
    setSelectedStrategyId(id);
    setSelectedStrategy(id);
    setAddFund(false);
  };

  const handleDelete = (id) => {
    console.log("Delete ID:", id);
  };

  return (
    <div className="swift-back-office-strategy">
      <div className="swift-back-office-strategy-wrapper">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`swift-accounts-strategy ${
              selectedStrategyId === strategy.id
                ? "swift-accounts-strategy-active"
                : ""
            }`}
          >
            <div
              className="swift-accounts-strategy-content"
              onClick={() => handleStrategyClick(strategy.id)}
            >
              <p style={{ fontWeight: 700, fontSize: 13 }}>
                {strategy.heading}
              </p>
              <p
                style={{
                  whiteSpace: "normal",
                  paddingTop: "12px",
                  fontStyle: "italic",
                }}
              >
                Date Created: {strategy.createdDate}
              </p>
            </div>
            {selectedStrategyId === strategy.id && (
              <div className="swift-accounts-strategy-delete">
                <div>
                  <p onClick={() => handleDelete(strategy.id)}>Delete</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="swift-back-office-strategy-add-btn">
        <CustomButton
          text="Add Fund"
          classname="swift-accounts-content-button"
          onClick={() => setAddFund(true)}
        />
      </div>
    </div>
  );
};

export default BackOfficeStrategy;
