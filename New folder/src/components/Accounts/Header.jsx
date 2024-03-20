import React from "react";
import "../../css/Accounts/Header.css";

const Header = () => {
  return (
    <div className="swift-accounts-header">
      <div className="swift-accounts-header-left">
        <p className="swift-accounts-heading">
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p>
        <div className="swift-accounts-heading-right">
          <p>Accounts</p>
          <p>Education</p>
        </div>
      </div>
      <div className="swift-accounts-header-right">
        <div className="swift-accounts-header-details-1">
          <p style={{ fontWeight: 700 }}>Overview</p>
          <p>Performance</p>
          <p>History</p>
          <p>Account Details</p>
        </div>
        <div className="swift-accounts-header-details-2">
          <div className="swift-accounts-header-user">Welcome back, Mike</div>
          <div className="swift-accounts-header-logos">
            <div className="notification">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M12.4998 3.125C9.89044 3.125 7.7752 5.27748 7.7752 7.93269C7.7752 8.93322 7.96294 9.74184 7.40836 11.5384C7.20417 12.1999 6.37419 13.5423 5.49841 14.8522C4.54821 16.2734 5.54315 18.2292 7.25275 18.2292C10.7507 18.2292 14.2487 18.2292 17.7468 18.2292C19.4563 18.2292 20.4512 16.2734 19.501 14.8522C18.6253 13.5423 17.7953 12.1999 17.5911 11.5384C17.0365 9.74184 17.2243 8.93322 17.2243 7.93269C17.2243 5.27748 15.109 3.125 12.4998 3.125ZM12.4998 3.125V1.5625M15.6248 18.2292V18.75C15.6248 20.821 14.2256 21.875 12.4998 21.875C10.7738 21.875 9.37473 20.821 9.37473 18.75V18.2292"
                  stroke="#011627"
                  stroke-opacity="0.7"
                  stroke-width="1.25"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div className="faq"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
