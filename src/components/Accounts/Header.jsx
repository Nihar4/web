import React, { useEffect, useState } from "react";
import "../../css/Accounts/Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import Pulse from "../Loader/Pulse";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";

const Header = ({ email_id, setloading }) => {
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  let currentPage;
  const previousPath = location.state?.previousPath;
  // console.log(previousPath);

  const handleclick = () => {
    window.location.href = `mailto:hello@swiftfolios.com`;
  };
  const logOutHandler = () => {
    setloader(true);
    setloading(true);
    localStorage.removeItem('userData'); 

    setTimeout(() => {
      window.location.replace("/login");               
    }, 3000);
    // setTimeout(() => {
    //   navigate("/login");
    // }, 3000);
  };
  const dashboardHandler = (email_id) => {
    navigate("/accounts/dashboard/asset", {
      state: { email_id: email_id },
    });
  };
  const jobqueueHandler = (email_id) => {
    navigate("/accounts/dashboard/jobqueue", {
      state: { email_id: email_id ,previousPath:pathname},
    });
  };
  const edurekaHedgeHandler = (email_id) => {
    navigate("/accounts/dashboard/edurekahedge", {
      state: { email_id: email_id },
    });
  };


  // if (
  //   pathname == "/accounts/dashboard/asset" ||
  //   pathname.startsWith("/accounts/dashboard/strategy") ||
  //   pathname.startsWith("/accounts/dashboard/addstrategy")
  // ) {
  //   // console.log("hii")
  //   currentPage = "Multi-asset";
  // } else if (
  //   pathname == "/accounts/dashboard/edurekahedge" ||
  //   pathname.startsWith("/accounts/dashboard/eureka/addstrategy") ||
  //   pathname.startsWith("/accounts/dashboard/eureka/strategy")
  // ) {
  //   // console.log("hello")
  //   currentPage = "Hedged Strategies";
  // } else {
  //   currentPage = "Multi-asset";
  // }
  // console.log('path',pathname );

  if (pathname === "/accounts/dashboard/jobqueue" && previousPath) {
  
  } else {
    if (
      pathname === "/accounts/dashboard/asset" ||
      pathname.startsWith("/accounts/dashboard/strategy") ||
      pathname.startsWith("/accounts/dashboard/addstrategy")
    ) {
      currentPage = "Multi-asset";
    } else if (
      pathname === "/accounts/dashboard/edurekahedge" ||
      pathname.startsWith("/accounts/dashboard/eureka/addstrategy") ||
      pathname.startsWith("/accounts/dashboard/eureka/strategy")
    ) {
      currentPage = "Hedged Strategies";
    } else {
      currentPage = "Multi-asset";
    }
  }

  const onDropdownSelect = (option) => {
    if (option == "Multi-asset") {
      dashboardHandler(email_id);
    } else {
      edurekaHedgeHandler(email_id);
    }
  };

  return !loader ? (
    <div className="swift-accounts-header">
      <div className="swift-accounts-header-left">
        <p className="swift-accounts-heading">
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p>
        <CustomDropdown
          options={["Multi-asset", "Hedged Strategies"]}
          style={{
            width: "176px",
            color: "var(--text-color)",
            fontSize: "var(--font-heading)",
            fontStyle: "normal",
            fontWeight: "var(--font-weight-heavy)",
            lineHeight: "normal",
            letterSpacing: "-0.7px",
            cursor: "pointer",
          }}
          onSelect={onDropdownSelect}
          default_value={currentPage}
        />
        {/* <p className="swift-accounts-heading-2" onClick={() =>dashboardHandler(email_id)}>Dashboard</p> */}
        <p
          className="swift-accounts-heading-2"
          onClick={() => jobqueueHandler(email_id)}
        >
          Job Queue
        </p>
        {/* <p className="swift-accounts-heading-2"onClick={() => edurekaHedgeHandler(email_id)}>Hedged Strategy Optimisation</p> */}
      </div>
      <div className="swift-accounts-header-right">
        <div className="swift-accounts-header-details-2">
          <div className="swift-accounts-header-user">
            <p>Logged in as {email_id}</p>
          </div>
          <div className="swift-accounts-header-logout" onClick={logOutHandler}>
            <p>Log Out</p>
          </div>

          <div className="swift-accounts-header-logos">
            <div className="faq" onClick={handleclick}></div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <Pulse />
    </div>
  );
};

export default Header;
