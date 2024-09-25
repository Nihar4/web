import React from "react";
import { Link } from "react-router-dom";
import "./Error.css";

const Error = () => {
  return (
    <>
      <div className="app__notfound">
        <div className="notfound__content">
          <h2 className="notfound__heading">404</h2>
          <div className="notfound__title">
            <p>Oops, nothing here...</p>
          </div>
          <p>We can't seem to find the page you are looking for.</p>
          <p>Please visit the Homepage or Contact us for more information.</p>
          <div className="notfound__buttons">
            <button>
              {/* <Link to="/">Go to Home</Link> */}
              <a href="https://www.altsinsight.com/">Go to Home</a>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
