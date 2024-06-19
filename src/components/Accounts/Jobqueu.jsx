import React, { useEffect, useState } from "react";
import Header from "./Header";
import BackButton from "../AccessManagement/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import ServerRequest from "../../utils/ServerRequest";
import moment from "moment-timezone";
import Pulse from "../Loader/Pulse";

const Jobqueu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const email_id = location.state ? location.state.email_id : null;
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;
  const [dl_data, setDlData] = useState(null);
  const [loading, setloading] = useState(true);
  const previousPath = location.state?.previousPath;
  // console.log("strategy", email_id);

  const fetchData = async () => {
    try {
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/getjobqueue?email_id=${email_id}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      // throw error;
    }
  };

  const clickHandler = () => {
    if (previousPath) {
      if (
        previousPath === "/accounts/dashboard/asset" ||
        previousPath.startsWith("/accounts/dashboard/strategy") ||
        previousPath.startsWith("/accounts/dashboard/addstrategy")
      ) {
        // currentPage = "Multi-asset";
        navigate("/accounts/dashboard/asset", {
          state: { email_id: email_id },
        });
      } else if (
        previousPath === "/accounts/dashboard/edurekahedge" ||
        previousPath.startsWith("/accounts/dashboard/eureka/addstrategy") ||
        previousPath.startsWith("/accounts/dashboard/eureka/strategy")
      ) {
        navigate("/accounts/dashboard/edurekahedge", {
          state: { email_id: email_id },
        });
      } else {
        navigate("/accounts/dashboard/asset", {
          state: { email_id: email_id },
        });
      }
    } else {
      navigate(-1, {
        state: { email_id: email_id },
      });
    }
  };

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        setloading(true);
        const data = await fetchData(email_id);
        const sortedData = data.data.slice().sort((a, b) => {
          if (a.status === "Pending" && b.status !== "Pending") {
            return -1;
          } else if (a.status !== "Pending" && b.status === "Pending") {
            return 1;
          }

          const dateA = a.date_completed ? new Date(a.date_completed) : null;
          const dateB = b.date_completed ? new Date(b.date_completed) : null;

          if (dateA && dateB) {
            return dateB - dateA;
          } else if (dateA) {
            return -1;
          } else if (dateB) {
            return 1;
          } else {
            return 0;
          }
        });
        setDlData(sortedData);
        setTimeout(() => {
          setloading(false);
        }, 2000);
      } catch (error) {
        console.error("Error fetching and setting data:", error);
      }
    };

    if (email_id) {
      fetchDataAndSetState();
    }
  }, [email_id]);
  console.log(moment.tz.guess(true));

  return !loading ? (
    <div className="swift-addstrategy-main">
      <Header email_id={email_id} setloading={setloading} />
      <div className="swift-addstrategy-content">
        <div className="swift-addstrategy-content-wrap job-queue-wrap">
          {/* <BackButton /> */}
          <div className="swift-signup-status-main swift-strategy-created-main">
            <div className="swift-signup-status-info swift-strategy-info strategy-created-info">
              <div className="swift-signup-status-info-1 swift-strategy-created strategy-created-content">
                <div className="swift-strategy-created-head-text">
                  {/* <div>Status</div> */}
                  <div style={{ fontWeight: 800 }}>Job queue</div>
                </div>
                <div style={{ fontSize: "13px" }}>
                  Below is the list of jobs that are pending.Our system runs on
                  first come first serve basis regardless of account or strategy
                </div>
                <div style={{ fontSize: "13px" }}>
                  For anything else, kindly reach out to us on
                  <span style={{ fontWeight: 700 }}>
                    {" "}
                    help@swiftfolios.co.uk
                  </span>
                </div>
                <div className="table-wrapper">
                  <table className="swift-strategy-created-table">
                    <thead>
                      <tr>
                        <th>Strategy ID</th>
                        <th>Security</th>
                        <th>Date added</th>
                        <th>Status</th>
                        <th>Completed on</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dl_data &&
                        dl_data.map((item, index) => (
                          <tr key={index}>
                            <td>{item.strategy_id}</td>
                            <td>{item.security}</td>
                            <td>
                              {!item.date_created
                                ? ""
                                : moment
                                    .tz(
                                      new Date(item.date_created).toISOString(),
                                      moment.tz.guess()
                                    )
                                    .add(5, "hours")
                                    .add(30, "minutes")
                                    .format("DD-MM-YYYY HH:mm:ss")}
                            </td>
                            <td>{item.status}</td>
                            <td>
                              {!item.date_completed
                                ? ""
                                : moment
                                    .tz(
                                      new Date(
                                        item.date_completed
                                      ).toISOString(),
                                      moment.tz.guess()
                                    )
                                    .add(5, "hours")
                                    .add(30, "minutes")
                                    .format("DD-MM-YYYY HH:mm:ss")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="swift-signup-status-info-2 open-dashboard-btn ">
                <button
                  className="swift-signup-status-button"
                  onClick={clickHandler}
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  );
};

export default Jobqueu;
