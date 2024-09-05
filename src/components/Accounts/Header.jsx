import React, { useEffect, useState } from "react";
import "../../css/Accounts/Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import Pulse from "../Loader/Pulse";
import CustomDropdown from "../CustomComponents/CustomDropdown/CustomDropdown";
import ServerRequest from "../../utils/ServerRequest";
import CustomStrategyDropdown from "../CustomComponents/CustomDropdown/CustomStrategyDropdown";

const Header = ({
  email_id,
  setloading,
  display = false,
  handleStrategyClick,
  setInitialStrategies,
  change,
}) => {
  const navigate = useNavigate();
  const [loader, setloader] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;
  let currentPage;
  const previousPath = location.state?.previousPath;
  const [Strategies, setStrategies] = useState([]);
  const [strategyNames, setStrategyNames] = useState([]);
  const [selectedIndex, setselectedIndex] = useState(0);

  const fetchAssetData = async () => {
    setloading(true);
    setloader(true);

    const data = await ServerRequest({
      method: "get",
      URL: `/strategy/get?email=${email_id}`,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    if (data.data.length > 0) {
      const uniqueIds = new Set();

      const filteredData = data.data.filter((item) => {
        if (uniqueIds.has(item.id)) {
          return false;
        } else {
          uniqueIds.add(item.id);
          return true;
        }
      });

      const strategiesArray = data.data.map((item) => ({
        id: item.id,
        strategyname: item.name,
        description: item.description,
        assetclass: [
          {
            name: item.asset_class_name,
            stock: item.stock,
            percentage: item.percentage,
            min_weight: item.min_weight,
            max_weight: item.max_weight,
          },
        ],
      }));

      const combinedStrategiesArray = strategiesArray.reduce((acc, curr) => {
        const existingStrategy = acc.find((item) => item.id === curr.id);

        if (existingStrategy) {
          curr.assetclass.forEach((asset) => {
            const existingAsset = existingStrategy.assetclass.find(
              (a) => a.name === asset.name
            );
            if (existingAsset) {
              existingAsset.stock += `, ${asset.stock}`;
              existingAsset.percentage += `, ${asset.percentage}`;
              existingAsset.min_weight += `, ${asset.min_weight}`;
              existingAsset.max_weight += `, ${asset.max_weight}`;
            } else {
              existingStrategy.assetclass.push(asset);
            }
          });
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);

      setStrategies(combinedStrategiesArray);
      const strategyNamesArray = combinedStrategiesArray.map(
        (strategy) => strategy.strategyname
      );
      setStrategyNames(strategyNamesArray);
      // setloading(false);
      setloader(false);
    }
  };

  const fetchHedgeData = async () => {
    setloading(true);
    setloader(true);

    const data = await ServerRequest({
      method: "get",
      URL: `/strategy/getEureka?email=${email_id}`,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    if (data) {
      const uniqueIds = new Set();

      const filteredData = data.data.filter((item) => {
        if (uniqueIds.has(item.id)) {
          return false;
        } else {
          uniqueIds.add(item.id);
          return true;
        }
      });

      const strategiesArray = data.data.map((item) => ({
        id: item.id,
        strategyname: item.name,
        description: item.description,
        assetclass: [
          {
            name: item.asset_class_name,
            stock: item.stock,
            percentage: item.percentage,
            min_weight: item.min_weight,
            max_weight: item.max_weight,
          },
        ],
      }));

      const combinedStrategiesArray = strategiesArray.reduce((acc, curr) => {
        const existingStrategy = acc.find((item) => item.id === curr.id);

        if (existingStrategy) {
          curr.assetclass.forEach((asset) => {
            const existingAsset = existingStrategy.assetclass.find(
              (a) => a.name === asset.name
            );
            if (existingAsset) {
              existingAsset.stock += `, ${asset.stock}`;
              existingAsset.percentage += `, ${asset.percentage}`;
              existingAsset.min_weight += `, ${asset.min_weight}`;
              existingAsset.max_weight += `, ${asset.max_weight}`;
            } else {
              existingStrategy.assetclass.push(asset);
            }
          });
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);

      setStrategies(combinedStrategiesArray);
      const strategyNamesArray = combinedStrategiesArray.map(
        (strategy) => strategy.strategyname
      );
      setStrategyNames(strategyNamesArray);
      setloading(false);
      setloader(false);
    }
  };

  const fetchPortfolioData = async () => {
    setloading(true);
    setloader(true);

    const data = await ServerRequest({
      method: "get",
      URL: `/strategy/portfolio/get?email=${email_id}`,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    if (data.data.length > 0) {
      const uniqueIds = new Set();

      const filteredData = data.data.filter((item) => {
        if (uniqueIds.has(item.id)) {
          return false;
        } else {
          uniqueIds.add(item.id);
          return true;
        }
      });

      const strategiesArray = data.data.map((item) => ({
        id: item.id,
        strategyname: item.name,
        description: item.description,
        assetclass: [
          {
            name: item.asset_class_name,
            stock: item.stock,
            percentage: item.percentage,
            // min_weight: item.min_weight,
            // max_weight: item.max_weight,
          },
        ],
      }));

      const combinedStrategiesArray = strategiesArray.reduce((acc, curr) => {
        const existingStrategy = acc.find((item) => item.id === curr.id);

        if (existingStrategy) {
          curr.assetclass.forEach((asset) => {
            const existingAsset = existingStrategy.assetclass.find(
              (a) => a.name === asset.name
            );
            if (existingAsset) {
              existingAsset.stock += `, ${asset.stock}`;
              existingAsset.percentage += `, ${asset.percentage}`;
              // existingAsset.min_weight += `, ${asset.min_weight}`;
              // existingAsset.max_weight += `, ${asset.max_weight}`;
            } else {
              existingStrategy.assetclass.push(asset);
            }
          });
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);

      setStrategies(combinedStrategiesArray);
      const strategyNamesArray = combinedStrategiesArray.map(
        (strategy) => strategy.strategyname
      );
      setStrategyNames(strategyNamesArray);
      // setloading(false);
      setloader(false);
    }
  };

  const handleclick = () => {
    window.location.href = `mailto:hello@swiftfolios.com`;
  };
  const logOutHandler = () => {
    setloader(true);
    setloading(true);
    localStorage.removeItem("userData");

    setTimeout(() => {
      window.history.pushState(null, null, window.location.href);
      window.history.pushState(null, null, "/login");
      window.history.replaceState(null, null, "/login");

      window.location.replace("/login");
    }, 3000);
    // setTimeout(() => {
    //   navigate("/login");
    // }, 3000);
  };
  const dashboardHandler = async (email_id) => {
    navigate("/accounts/dashboard/asset", {
      state: { email_id: email_id },
    });
    await fetchAssetData();
  };
  const jobqueueHandler = (email_id) => {
    navigate("/accounts/dashboard/jobqueue", {
      state: { email_id: email_id, previousPath: pathname },
    });
  };
  const edurekaHedgeHandler = async (email_id) => {
    navigate("/accounts/dashboard/edurekahedge", {
      state: { email_id: email_id },
    });
    await fetchHedgeData();
  };
  const portfolioHandler = async (email_id) => {
    navigate("/accounts/dashboard/portfolio-management", {
      state: { email_id: email_id },
    });
    await fetchPortfolioData();
  };

  if (pathname === "/accounts/dashboard/jobqueue" && previousPath) {
    if (
      previousPath === "/accounts/dashboard/asset" ||
      previousPath.startsWith("/accounts/dashboard/strategy") ||
      previousPath.startsWith("/accounts/dashboard/addstrategy")
    ) {
      currentPage = "Multi-asset";
    } else if (
      previousPath === "/accounts/dashboard/edurekahedge" ||
      previousPath.startsWith("/accounts/dashboard/eureka/addstrategy") ||
      previousPath.startsWith("/accounts/dashboard/eureka/strategy")
    ) {
      currentPage = "Hedged Strategies";
    } else if (previousPath === "/accounts/dashboard/portfolio-management") {
      currentPage = "Portfolio Management";
    } else {
      currentPage = "Multi-asset";
    }
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
    } else if (
      pathname === "/accounts/dashboard/portfolio-management" ||
      pathname.startsWith("/accounts/dashboard/portfolio-management") ||
      pathname.startsWith(
        "/accounts/dashboard/portfolio-management/addstrategy"
      )
    ) {
      currentPage = "Portfolio Management";
    } else {
      currentPage = "Multi-asset";
    }
  }

  useEffect(() => {
    if (display) {
      setselectedIndex(0);
      if (currentPage == "Multi-asset") {
        fetchAssetData();
      } else if (currentPage == "Portfolio Management") {
        fetchPortfolioData();
      } else {
        fetchHedgeData();
      }
    } else {
      setloader(false);
    }
  }, [change]);

  useEffect(() => {
    if (!loader && display) {
      setInitialStrategies(Strategies);
      // setTimeout(() => {
      handleStrategyClick(selectedIndex, Strategies);
      // }, 1000);
    }
  }, [Strategies, selectedIndex, loader]);

  // useEffect(() => {
  //   handleStrategyClick(selectedIndex);
  // }, [selectedIndex]);

  const onDropdownSelect = (option) => {
    if (option == "Multi-asset") {
      dashboardHandler(email_id);
    } else if (option == "Portfolio Management") {
      portfolioHandler(email_id);
    } else {
      edurekaHedgeHandler(email_id);
    }
  };

  const onDropdownStrategySelect = (option) => {
    const index = Strategies.findIndex(
      (strategy) => strategy.strategyname === option.strategyname
    );
    setselectedIndex(index);
  };

  return !loader ? (
    <div
      className="swift-accounts-header"
      // style={{ height: display ? "10%" : "5%" }}
    >
      <div className="swift-accounts-header-left">
        <p className="swift-accounts-heading">
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p>
        <CustomDropdown
          options={["Multi-asset", "Portfolio Management"]}
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
          default_value={currentPage}
        />

        {display && (
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
        )}

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
