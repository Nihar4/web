import React from "react";
import "../../../css/Accounts/Footer.css";

const handleclick = () => {
  window.location.href = `mailto:hello@swiftfolios.com`;
};

const Footer = () => {
  return (
    <div className="swift-accounts-footer">
      <div className="swift-accounts-footer-left">
        For information purposes only
      </div>
      <div className="swift-accounts-footer-right">
        <div className="swift-accounts-footer-logos">
          <div className="faq" onClick={handleclick}></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
