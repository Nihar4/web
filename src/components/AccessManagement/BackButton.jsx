import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AccessManagement/BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="swift-backbutton-div">
      <div className="swift-backbutton">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="18"
          viewBox="0 0 11 18"
          fill="none"
          onClick={goBack}
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.1484 16.7465L8.96607 17.9304L0 8.96597L8.96607 0L10.15 1.18393L2.36796 8.96597L10.1484 16.7465Z"
            fill="#011627"
            fill-opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default BackButton;
