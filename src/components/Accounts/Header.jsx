import React from "react";
import "../../css/Accounts/Header.css";

const Header = ({email_id}) => {

  const handleclick = () => {
    window.location.href = `mailto:hello@swiftfolios.com`;
  }
  return (
    <div className="swift-accounts-header">
      <div className="swift-accounts-header-left">
        <p className="swift-accounts-heading">
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p>
    
      </div>
      <div className="swift-accounts-header-right">
        <div className="swift-accounts-header-details-2">
          <div className="swift-accounts-header-user"><p>Logged in as {email_id}</p></div>
          <div className="swift-accounts-header-logos">

            <div className="faq" onClick={handleclick}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
