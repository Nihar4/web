import React, { useEffect, useState } from "react";
import "../../../css/Accounts/Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import Pulse from "../../Loader/Pulse";
import CustomDropdown from "../../CustomComponents/CustomDropdown/CustomDropdown";
import ServerRequest from "../../../utils/ServerRequest";
import CustomStrategyDropdown from "../../CustomComponents/CustomDropdown/CustomStrategyDropdown";
import ConfirmBox from "../../CustomComponents/ConfirmBox/ConfirmBox";

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOption, setDropdownOption] = useState("Regulated");
  const [path, setPath] = useState("Regulated");

  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const handleclick = () => {
    window.location.href = `mailto:hello@swiftfolios.com`;
  };

  const logOutHandler = () => {
    ConfirmBox({
      title: "Logout",
      description: (
        <>
          <>Are you sure you want to logout from this account ?</>
        </>
      ),
      properties: [
        {
          id: "2",
          label: "Yes",
          color: "#192b40",
          bgColor: "#ffffff",
          handleFunction: (callback) => {
            localStorage.removeItem("userData");

            setTimeout(() => {
              window.history.pushState(null, null, window.location.href);
              window.history.pushState(null, null, "/login");
              window.history.replaceState(null, null, "/login");

              window.location.replace("/login");
            }, 3000);

            callback();
          },
        },
      ],
      cancel: true,
    });
  };

  const onDropdownSelect = (option) => {
    if (option == "Regulated") {
      setDropdownOption("Regulated");
      setPath("Regulated");
      navigate("/accounts/dashboard/asset", {
        state: { email_id: email_id },
      });
    } else if (option == "portfolio") {
      setPath("portfolio");
      navigate("/accounts/dashboard/portfolio-management", {
        state: { email_id: email_id },
      });
    } else if (option == "jobqueue") {
      let currentPath = path;
      setPath("jobqueue");
      navigate("/accounts/dashboard/jobqueue", {
        state: { email_id: email_id, previousPath: currentPath },
      });
    }
  };

  return (
    <div className="swift-accounts-header">
      <div className="swift-accounts-header-left">
        <p className="swift-accounts-heading">
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p>
        <CustomDropdown
          options={["Regulated"]}
          style={{
            width: "220px",
            color: "var(--text-color)",
            fontSize: "var(--font-heading)",
            fontStyle: "normal",
            fontWeight: "var(--font-weight-heavy)",
            lineHeight: "normal",
            letterSpacing: "-0.7px",
            cursor: "pointer",
          }}
          onSelect={onDropdownSelect}
          default_value={dropdownOption}
        />

        {/* {display && (
          <CustomStrategyDropdown
            options={Strategies}
            style={{
              width: "auto",
              color: "var(--text-color)",
              fontSize: "var(--font-heading)",
              fontStyle: "normal",
              fontWeight: "var(--font-weight-heavy)",
              lineHeight: "normal",
              letterSpacing: "-0.7px",
              cursor: "pointer",
            }}
            onSelect={onDropdownStrategySelect}
            default_value={Strategies[selectedIndex]}
            email={email_id}
          />
        )} */}
        <p
          className="swift-accounts-heading-2"
          onClick={() => onDropdownSelect("portfolio")}
        >
          Portfolio Management
        </p>
      </div>
      <div className="swift-accounts-header-right">
        <div className="swift-accounts-header-details-2">
          <p
            className="swift-accounts-heading-2"
            onClick={() => onDropdownSelect("jobqueue")}
          >
            Job Queue
          </p>
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
  );
};

export default Header;
