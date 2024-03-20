import React from "react";
import "../../css/AccessManagement/InfoBox.css";

const InfoBox = () => {
  return (
    <div className="swift-signup-main-info-wrapper">
      <div>
        <div className="swift-signup-main-info-heading">
          Taking advantage of the AI revolution
        </div>
      </div>
      <div className="swift-signup-main-info-content">
        <div className="swift-signup-main-info-1">
          <p>
            Use our proprietary developed Recurrent Neural Network <b>(RNN)</b>{" "}
            deep learning model using{" "}
            <b>Google Machine Learning Architecture</b> to assist your Tactical
            Asset Allocation.
          </p>
          <p>
            The model simulates a human brain without biases to <b>predict</b>{" "}
            probable future price action and <b>optimise</b> asset allocation
            while our systems does the heavy lifting work of{" "}
            <b>best execution</b>. Additionally, the decision to switch{" "}
            <b>off</b> and <b>switch on</b> use of the model is fully on you.
          </p>
          <p>
            Use of ETFs to express asset allocation views will also help negate
            the well recognised <b>Negative Manager Selection</b> Effect.
            (overall likely underperformance caused by use of active funds)
          </p>
          <p>
            Better still, use ESG ETFs to promote responsible capitalism while
            not compromising on returns.
          </p>
        </div>

        <div className="swift-signup-main-info-2">
          <p>
            Fully regulated, our Machine Learning execution systems have
            in-built safety parameters which do now allow deviation which might
            have detrimental consequences.
            <div className="safe">Safe</div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
