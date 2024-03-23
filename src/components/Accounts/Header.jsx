import React from "react";
import "../../css/Accounts/Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({email_id}) => {

  const navigate = useNavigate();
  const handleclick = () => {
    window.location.href = `mailto:hello@swiftfolios.com`;
  }
  const logOutHandler = () => {
    navigate("/login");
  }
  const dashboardHandler = (email_id) => {
    navigate("/accounts/dashboard/asset", {
      state: { email_id: email_id },
    });
  }
  const jobqueueHandler = (email_id) => {
    navigate("/accounts/dashboard/jobqueue", {
      state: { email_id: email_id },
    });
  }

  return (
    <div className="swift-accounts-header">
      <div className="swift-accounts-header-left">
        <p className="swift-accounts-heading">
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p>
        
        <p className="swift-accounts-heading-2" onClick={() =>dashboardHandler(email_id)}>Dashboard</p>
        <p className="swift-accounts-heading-2"onClick={() => jobqueueHandler(email_id)}>Job Queue</p>
    
      </div>
      <div className="swift-accounts-header-right">
        <div className="swift-accounts-header-details-2">
          <div className="swift-accounts-header-user"><p>Logged in as {email_id}</p></div>
          <div className="swift-accounts-header-logout" onClick={logOutHandler}><p>Log Out</p></div>
          
          <div className="swift-accounts-header-logos">

            <div className="faq" onClick={handleclick}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
