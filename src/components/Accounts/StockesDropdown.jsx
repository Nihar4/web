import React, { useState } from "react";
import "../../css/Accounts/SrocksDropdown.css";

const StockesDropdown = ({ heading, options, isOpen, onToggle }) => {
  const totalSaa = options.reduce(
    (sum, option) => sum + parseFloat(option.saa || 0),
    0
  );
  const totalTaa = options.reduce(
    (sum, option) => sum + parseFloat(option.taa || 0),
    0
  );
  const totalActwt = options.reduce(
    (sum, option) => sum + parseFloat(option.actwt || 0),
    0
  );
  return (
    <div className="stocks-dropdown-main">
      <div className="stocks-dropdown-header">
        <div className="stocks-dropdown-header-left">
          <div className="stocks-dropdown-heading" onClick={onToggle}>
            {heading}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            className={`stock-dropdown-icon ${
              isOpen ? "up-arrow" : "down-arrow"
            }`}
            onClick={onToggle}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M8.125 1.25C7.95924 1.25 7.80027 1.31585 7.68306 1.43306C7.56585 1.55027 7.5 1.70924 7.5 1.875V6.875C7.5 7.04076 7.56585 7.19973 7.68306 7.31694C7.80027 7.43415 7.95924 7.5 8.125 7.5H13.125C13.2908 7.5 13.4497 7.43415 13.5669 7.31694C13.6842 7.19973 13.75 7.04076 13.75 6.875C13.75 5.38316 13.1574 3.95242 12.1025 2.89752C11.0476 1.84263 9.61684 1.25 8.125 1.25ZM8.75 6.25V2.54375C9.68513 2.67851 10.5515 3.11236 11.2196 3.78043C11.8876 4.44849 12.3215 5.31487 12.4563 6.25H8.75Z"
              fill="#011627"
              fill-opacity="0.7"
            />
            <path
              d="M13.0125 8.78752C12.935 8.7598 12.8527 8.74768 12.7705 8.75185C12.6882 8.75602 12.6076 8.77641 12.5333 8.81184C12.4589 8.84727 12.3923 8.89704 12.3373 8.95829C12.2822 9.01955 12.2398 9.09107 12.2125 9.16877C11.9309 9.96497 11.4521 10.6768 10.8209 11.238C10.1898 11.7991 9.42675 12.1913 8.60306 12.3778C7.77936 12.5643 6.92184 12.5392 6.1105 12.3047C5.29915 12.0702 4.56043 11.634 3.96324 11.0368C3.36605 10.4396 2.92987 9.70089 2.69537 8.88954C2.46088 8.0782 2.43572 7.22068 2.62224 6.39699C2.80877 5.57329 3.2009 4.81026 3.76204 4.17909C4.32319 3.54792 5.03508 3.06917 5.83128 2.78752C5.98792 2.73281 6.11642 2.61813 6.1885 2.46868C6.26059 2.31924 6.27035 2.14728 6.21565 1.99064C6.16095 1.834 6.04626 1.7055 5.89682 1.63342C5.74738 1.56133 5.57542 1.55156 5.41878 1.60627C4.42318 1.958 3.53292 2.55624 2.8311 3.34515C2.12927 4.13406 1.63877 5.08792 1.40535 6.11771C1.17194 7.14749 1.20323 8.21962 1.4963 9.23404C1.78937 10.2485 2.33468 11.1721 3.08132 11.9187C3.82795 12.6654 4.75158 13.2107 5.766 13.5037C6.78042 13.7968 7.85255 13.8281 8.88233 13.5947C9.91212 13.3613 10.866 12.8708 11.6549 12.1689C12.4438 11.4671 13.042 10.5769 13.3938 9.58127C13.4478 9.42543 13.4381 9.25454 13.3667 9.10585C13.2953 8.95716 13.168 8.84274 13.0125 8.78752Z"
              fill="#011627"
              fill-opacity="0.7"
            />
          </svg>
        </div>
        <div className="stocks-dropdown-header-right">
          <p>{totalSaa.toFixed(1)}%</p>
          <p>{totalTaa.toFixed(1)}%</p>
          <p>{totalActwt.toFixed(1)}%</p>
        </div>
      </div>
      {isOpen && (
        <div className="stocks-dropdown-options-container">
          <ul className="stocks-dropdown-options">
            {options.map((option, index) => (
              <li key={index}>
                <div className="stocks-dropdown-option-details">
                  <div className="stocks-dropdown-option-left">
                    <div className="stocks-dropdown-option-up">
                      <div className="stocks-dropdown-option-title">
                        {option.title}
                      </div>
                      <div className="stocks-dropdown-option-change">
                        <p className="stocks-dropdown-option-change-1">
                          {option.company === ""}
                        </p>
                        <p className="stocks-dropdown-option-change-2">
                          {option.change}
                        </p>
                      </div>
                    </div>
                    <div className="stocks-dropdown-option-down">
                      {option.info}
                    </div>
                  </div>
                  <div className="stocks-dropdown-option-info">
                    <p>{option.saa}</p>
                    <p>{option.taa}</p>
                    <p>{option.actwt}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StockesDropdown;
