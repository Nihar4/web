import React, { useState } from "react";
import BackOfficeStrategy from "./BackOfficeStrategy";
import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import CustomError from "../CustomComponents/CustomError/CustomError";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";

const BackOfficeMainHeader = () => {
  return (
    <div className="swift-back-office-main-header">
      <div className="swift-back-office-main-header-left">
        <p style={{ fontWeight: "700" }}>Get in touch with the team</p>
        <p style={{ fontStyle: "italic" }}>Fund last viewed on 3rd July 2020</p>
        <p>
          Firm Assets <span style={{ fontWeight: "700" }}>$2.6 Bn</span>
        </p>
        <p>
          Strategy Assets <span style={{ fontWeight: "700" }}>$2.6 Bn</span>
        </p>
      </div>
      <div className="swift-back-office-main-header-right">
        <div style={{ display: "flex" }}>
          <p>Copy Fund Profile Link</p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="20" height="20" fill="url(#pattern0_4143_556)" />
            <defs>
              <pattern
                id="pattern0_4143_556"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use href="#image0_4143_556" transform="scale(0.0078125)" />
              </pattern>
              <image
                id="image0_4143_556"
                width="128"
                height="128"
                href="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>
        <p>Edit</p>
        <p>Preview</p>
      </div>
    </div>
  );
};
const BackOfficeBodyLeft = () => {
  return <div className="swift-back-office-body-left">Left</div>;
};
const BackOfficeBodyRight = () => {
  return <div className="swift-back-office-body-right">Right</div>;
};

const BackOfficeDashboardMain = () => {
  const [selectedStrategy, setSelectedStrategy] = useState();
  const [addFund, setAddFund] = useState(false);
  const [addFundName, setAddFundName] = useState("");
  const [fundCreated, setFundCreated] = useState(false);

  const strategies = [
    { id: 1, heading: "Strategy 1", createdDate: "2024-09-17" },
    { id: 2, heading: "Strategy 2", createdDate: "2024-09-15" },
    { id: 3, heading: "Strategy 3", createdDate: "2024-09-10" },
  ];

  return (
    <div className="swift-back-office-main-wrapper">
      <BackOfficeStrategy
        strategies={strategies}
        setSelectedStrategy={setSelectedStrategy}
        setAddFund={setAddFund}
      />

      <div className="swift-back-office-main-content">
        {!addFund && <BackOfficeMainHeader />}
        <div className="swift-back-office-body-wrapper">
          {!addFund ? (
            <>
              <BackOfficeBodyLeft />
              <BackOfficeBodyRight />
            </>
          ) : (
            <div className="swift-back-office-add-fund-wrapper">
              {!fundCreated ? (
                <>
                  <CustomInputError
                    labelText="Please enter strategy name below."
                    classnameLabel="swift-back-office-input-label"
                    classnameDiv="swift-back-office-input-div"
                    classnameInput="swift-back-office-input-text"
                    type="text"
                    name="fundName"
                    placeholder="Fund Name"
                    onInputChange={(name, value) => setAddFundName(value)}
                    value={addFundName}
                    error={"error"}
                  />
                  <div className="swift-back-office-strategy-add-btn">
                    <CustomButton
                      text="Add Fund"
                      classname="swift-accounts-content-button"
                      style={{
                        width: "115px",
                        fontSize: "12px",
                        height: "30px",
                        padding: "0",
                      }}
                      onClick={() => setFundCreated(true)}
                    />
                  </div>
                </>
              ) : (
                <div className="swift-back-office-fund-created">
                  <p>Fund created.</p>
                  <p>Please edit the form to populate data and information.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackOfficeDashboardMain;
