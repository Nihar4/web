import React from "react";
import "../../css/AccessManagement/Signup.css";
import { useNavigate } from "react-router-dom";

const StrategyCreated = () => {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate("/accounts/dashboard");
  };
  return (
    <div className="swift-signup-status-main">
      <div className="swift-signup-status-info">
        <div className="swift-signup-status-info-1">
          <div>
            <div>Status</div>
            <div style={{ fontWeight: 800 }}>Strategy created</div>
          </div>
          <div>
            We are adding the securities to our database and will be running
            them through our deep learning models. The strategy might take 24
            hours to get activated.
          </div>
          <div>
            For anything else, kindly reach out to us on
            <span style={{ fontWeight: 700 }}>help@swiftfolios.co.uk</span>
          </div>
        </div>
        <div className="swift-signup-status-info-2 open-dashboard-btn">
          <button className="swift-signup-status-button" onClick={clickHandler}>
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyCreated;
