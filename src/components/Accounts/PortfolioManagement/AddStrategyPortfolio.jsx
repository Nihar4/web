import React, { useEffect, useRef, useState } from "react";
import "../../../css/Accounts/AddStrategy.css";
import CustomInput from "../../CustomComponents/CustomInput/CustomInput";
import CustomError from "../../CustomComponents/CustomError/CustomError";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";
import { isEmpty } from "../../../utils/Validation";
import SearchLive from "../../CustomComponents/CustomLiveSearch/SearchLive";
import ServerRequest from "../../../utils/ServerRequest";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Alert } from "../../CustomComponents/CustomAlert/CustomAlert";
import BackButton from "../../AccessManagement/BackButton";
import CustomLabel from "../../CustomComponents/CustomLabel/CustomLabel";
import Pulse from "../../Loader/Pulse";
import moment from "moment-timezone";

const AddStrategyPortfolio = () => {
  const location = useLocation();
  // const email_id = location.state ? location.state.email_id : null;
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;
  // console.log("add strategy", email_id);

  const navigate = useNavigate();
  const { id } = useParams();
  // console.log("id", id);
  const [formValues, setFormValues] = useState({
    strategyName: "",
    description: "",
    assetClasses: [],
  });

  const [strategyNameError, setStrategyNameError] = useState("error");
  const [descError, setDescError] = useState("error");
  const [totalError, settotalError] = useState("error");
  const [loading, setLoading] = useState(true);
  const [longName, setLongName] = useState({});
  const [cash, setCash] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  const [saveBtn, setSaveBtn] = useState(true);
  const [oldStocks, setOldStocks] = useState([]);

  const fetchLongName = async (stock) => {
    const result = await ServerRequest({
      method: "get",
      URL: `/strategy/getlongname?stock=${stock}`,
    });
    // console.log(result.data);
    return result.data.longname;
  };

  const newStocks = formValues.assetClasses.reduce((acc, assetClass) => {
    const stocks = assetClass.underlyings.map(
      (underlying) => underlying?.stock
    );
    return acc.concat(stocks);
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await ServerRequest({
            method: "get",
            URL: `/strategy/portfolio/getone/?id=${id}`,
          });
          setFormValues(data.data);
          // console.log("form daa",data.data);
          const formData = data.data;

          for (const [assetIndex, asset] of formData.assetClasses.entries()) {
            for (const [
              underlyingIndex,
              underlying,
            ] of asset.underlyings.entries()) {
              // console.log("Stock:", underlying.stock);
              const longNameValue = await fetchLongName(underlying.stock);
              const name = `${underlying.stock.trim()}`;
              setLongName((prevLongName) => ({
                ...prevLongName,
                [name]: longNameValue,
              }));
            }
          }

          const Stocks = formData.assetClasses.reduce((acc, assetClass) => {
            const stocks = assetClass.underlyings.map(
              (underlying) => underlying.stock
            );
            return acc.concat(stocks);
          }, []);
          setOldStocks(Stocks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    fetchdata();
  }, [id]);

  useEffect(() => {
    const allSymbolsExist = newStocks.every((newStock) =>
      oldStocks.includes(newStock)
    );
    if (!allSymbolsExist && oldStocks.length != 0) {
      setSaveBtn(false);
    } else {
      setSaveBtn(true);
    }
  }, [newStocks, oldStocks]);

  const extractPropertyNameAndIndex = (path) => {
    const matches = path.match(/^(.+)\[(\d+)\]$/);
    if (matches) {
      const propertyName = matches[1];
      const index = parseInt(matches[2]);
      return { propertyName, index };
    } else {
      return { propertyName: path, index: null };
    }
  };

  const [showalert, setShowalert] = useState(false);

  const closeAlert = () => {
    setTimeout(() => {
      setShowalert(false);
    }, 100);
  };

  const handleInputChange = async (name, value) => {
    // console.log(1);
    // console.log("addstraegy", name, value);

    const updateNestedProperty = (obj, path, newValue) => {
      const keys = path.split(".");

      let current = obj;

      for (let i = 0; i < keys.length - 1; i++) {
        const { propertyName, index } = extractPropertyNameAndIndex(keys[i]);
        current = current[propertyName];
        current = current[index];
      }
      current[keys[keys.length - 1]] = newValue;
      return { ...obj };
    };

    if (name.slice(-5) == "stock") {
      console.log(name, value);
      const stockValue = value.split(",")[0];
      const longNameValue = value.split(",")[1];
      console.log(stockValue, longName);
      // console.log("name", name[13],name[28]);
      // const data = await ServerRequest({
      //   method: "get",
      //   URL: `/strategy/validatestock?stock=${stockValue}`,
      // });

      // if (data.server_error) {
      //   alert("error");
      // }

      // if (data.error) {
      //   alert("error1");
      // }

      // if (data.data == false) {
      //   setShowalert(true);
      //   Alert(
      //     {
      //       TitleText: "Error",
      //       Message: `${stockValue}'s data is not sufficient for analysis, please choose another one. Minimum data points is 500.`,
      //       BandColor: "#e51a4b",
      //       AutoClose: { Active: false, Time: 5 },
      //     },
      //     closeAlert
      //   );
      //   handleDeleteUnderlying(parseInt(name[13]), parseInt(name[28]));
      //   return;
      // }

      setShowalert(false);
      setLongName((prevLongName) => ({
        ...prevLongName,
        [stockValue]: longNameValue,
      }));

      if (name.includes(".")) {
        setFormValues((prevValues) =>
          updateNestedProperty(prevValues, name, stockValue)
        );
      } else {
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: stockValue,
        }));
      }
      return;
    }

    setShowalert(false);
    console.log(name, value);
    if (name.includes(".")) {
      setFormValues((prevValues) =>
        updateNestedProperty(prevValues, name, value)
      );
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
    // console.log("formvalues",formValues);
  };
  // console.log(longName);
  const handleAddAssetClass = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      assetClasses: [...prevValues.assetClasses, { name: "", underlyings: [] }],
    }));
    setTimeout(() => {
      const elements = document.getElementsByClassName(
        "swift-addstrategy-asset-1"
      );
      // console.log(elements.length);
      const lastElement = elements[elements.length - 1];

      if (lastElement) {
        lastElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const handleAddUnderlying = (index) => {
    // const ele = document.getElementById("scroll");
    // console.log(ele);
    // ele.scrollIntoView({ behavior: "smooth" });

    setFormValues((prevValues) => {
      const updatedAssetClasses = [...prevValues.assetClasses];
      updatedAssetClasses[index] = {
        ...updatedAssetClasses[index],
        underlyings: [
          ...updatedAssetClasses[index].underlyings,
          { stock: "", percentage: "" },
        ],
      };
      return {
        ...prevValues,
        assetClasses: updatedAssetClasses,
      };
    });

    setTimeout(() => {
      const elements = document.getElementsByClassName(
        "swift-addstrategy-asset2"
      );
      // console.log(elements.length);
      const lastElement = elements[index];
      // console.log(lastElement)
      // const lastUnderlying = lastElement[lastElement.length-1];

      if (lastElement) {
        lastElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const handleDeleteAssetClass = (index) => {
    setFormValues((prevValues) => {
      const updatedAssetClasses = prevValues.assetClasses.filter(
        (_, i) => i !== index
      );

      const updatedLongNames = { ...longName };
      prevValues.assetClasses[index].underlyings.forEach(
        (_, underlyingIndex) => {
          delete updatedLongNames[
            `${prevValues.assetClasses[index].underlyings[underlyingIndex].stock}`
          ];
        }
      );

      setLongName(updatedLongNames);

      return {
        ...prevValues,
        assetClasses: updatedAssetClasses,
      };
    });
  };

  const handleDeleteUnderlying = (classIndex, underlyingIndex) => {
    setFormValues((prevValues) => {
      const updatedAssetClasses = prevValues.assetClasses.map(
        (assetClass, i) => {
          if (i === classIndex) {
            const updatedUnderlyings = assetClass.underlyings.filter(
              (_, j) => j !== underlyingIndex
            );
            // const updatedLongNames = { ...longName };
            // delete updatedLongNames[
            //   `${assetClasses[index].underlyings[underlyingIndex].stock}`
            // ];
            // setLongName(updatedLongNames);
            return {
              ...assetClass,
              underlyings: updatedUnderlyings,
            };
          }
          return assetClass;
        }
      );
      return {
        ...prevValues,
        assetClasses: updatedAssetClasses,
      };
    });
  };

  useEffect(() => {
    const totalPercentage =
      formValues.assetClasses.length > 0
        ? formValues.assetClasses.reduce((total, assetClass) => {
            return (
              total +
              assetClass.underlyings.reduce((acc, underlying) => {
                const percentage = parseFloat(underlying.percentage) || 0;
                return acc + percentage;
              }, 0)
            );
          }, 0)
        : 0;

    const cash = 100 - totalPercentage > 0 ? 100 - totalPercentage : 0;
    setCash(cash);
    setTotalPercentage(totalPercentage + cash);
  }, [formValues]);

  const showError = (msg) => {
    Alert({
      TitleText: "Error",
      Message: msg,
      BandColor: "#e51a4b",

      AutoClose: {
        Active: true,
        Line: true,
        LineColor: "#e51a4b",
        Time: 2,
      },
    });
  };

  const ValidateAll = () => {
    let hasError = false;
    if (isEmpty(formValues.strategyName)) {
      setStrategyNameError("cannot be empty");
      settotalError("error");

      hasError = true;
      return hasError;
    } else if (formValues.strategyName.length < 5) {
      setStrategyNameError("Name should be atleast 5 characters");
      settotalError("error");

      hasError = true;
      return hasError;
    } else {
      setStrategyNameError("error");
    }

    if (isEmpty(formValues.description)) {
      setDescError("cannot be empty");
      settotalError("error");

      hasError = true;
      return hasError;
    } else if (formValues.description.length < 20) {
      setDescError("Description should be atleast 20 characters");
      settotalError("error");

      hasError = true;
      return hasError;
    } else {
      setDescError("error");
    }

    let totalPercentageError = false;
    if (formValues.assetClasses.length == 0) {
      settotalError("Add asset to portfolio");
      showError("Add asset to portfolio");
      hasError = true;
      return hasError;
    }

    formValues.assetClasses.forEach((assetClass, index) => {
      if (isEmpty(assetClass.name)) {
        hasError = true;
        showError("Asset Class name can not be empty");
        return hasError;
      }
      if (assetClass.underlyings.length == 0) {
        hasError = true;
        showError("Asset Class can not be empty");
        return hasError;
      }
      assetClass.underlyings.forEach((underlying, underlyingIndex) => {
        if (isEmpty(underlying.stock)) {
          showError("Stock can not be empty");
          hasError = true;
          return hasError;
        }
        if (
          parseFloat(underlying.percentage) < 1 ||
          isEmpty(underlying.percentage)
        ) {
          settotalError("Minimum percentage for each stock should be 1");
          showError("Minimum percentage for each stock should be 1");
          totalPercentageError = true;
        }
      });
    });

    if (totalPercentageError) {
      hasError = true;
    } else if (totalPercentage !== 100) {
      settotalError("Total weight needs to add up to 100");
      hasError = true;
    } else {
      settotalError("error");
    }

    return hasError;
  };

  function checkForDuplicateStocks() {
    const stockSet = new Set();
    for (const assetClass of formValues.assetClasses) {
      for (const underlying of assetClass.underlyings) {
        if (stockSet.has(underlying.stock)) {
          return underlying.stock;
        }
        stockSet.add(underlying.stock);
      }
    }
    return "";
  }

  const handleSubmit = async () => {
    if (ValidateAll()) return;
    const stock = checkForDuplicateStocks();
    if (stock != "") {
      Alert({
        TitleText: "Error",
        Message: `${stock} is multiple time`,
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
      return;
    }

    const data = await ServerRequest({
      method: "post",
      URL: `/strategy/portfolio/insert`,
      data: { ...formValues, email_id: email_id },
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    navigate("/accounts/dashboard/portfolio-management/strategy", {
      state: { id: data.data, email_id: email_id },
    });
  };

  const handleUpdate = async () => {
    if (ValidateAll()) return;
    const stock = checkForDuplicateStocks();
    if (stock != "") {
      Alert({
        TitleText: "Error",
        Message: `${stock} is multiple time`,
        BandColor: "#e51a4b",

        AutoClose: {
          Active: true,
          Line: true,
          LineColor: "#e51a4b",
          Time: 2,
        },
      });
      return;
    }

    const data = await ServerRequest({
      method: "delete",
      URL: `/strategy/portfolio`,
      data: { id: id },
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    const data1 = await ServerRequest({
      method: "post",
      URL: `/strategy/portfolio/insert?strategy_id=${id}`,
      data: { ...formValues, email_id: email_id },
    });

    if (data1.server_error) {
      alert("error");
    }

    if (data1.error) {
      alert("error1");
    }

    navigate("/accounts/dashboard/portfolio-management/strategy", {
      state: { id: id, email_id: email_id },
    });
  };

  const [value1, setValue1] = useState();
  // setValue1(value);
  // console.log(value1);
  const handleChange = (e) => {
    let inputValue;
    if (e.target.value.length > 500) {
      inputValue = e.target.value.slice(0, 500);
    } else {
      inputValue = e.target.value;
    }

    handleInputChange("description", inputValue);
    setValue1(inputValue);
  };

  return loading ? (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : (
    <>
      <div
        className={`background-div ${showalert ? "blur-background" : ""}`}
      ></div>
      <div className="swift-addstrategy-main">
        <div className={`swift-addstrategy-content ${showalert ? "" : ""}`}>
          <div className="swift-addstrategy-content-wrap" id="scroll">
            <BackButton />
            <div className="swift-addstrategy-header">Add/ Edit Portfolio</div>
            <div className="swift-addstrategy-input">
              <CustomInput
                labelText="Portfolio Name"
                type="text"
                classnameInput="swift-login-form-email-input swift-addstrategy-name-input"
                name="strategyName"
                placeholder="sample strategy"
                styleInput={{ height: "50px" }}
                onInputChange={handleInputChange}
                value={formValues.strategyName}
              />
              <CustomError
                errorText={strategyNameError}
                style={{
                  visibility:
                    strategyNameError !== "error" ? "visible" : "hidden",
                }}
              />
            </div>

            <div className="swift-addstrategy-input">
              {/* <CustomInput
              labelText="Description"
              type="textarea"
              classnameInput="swift-addstrategy-description-input"
              name="description"
              styleInput={{ height: "100px" }}
              placeholder="Add a little description to what this strategy is all about"
              onInputChange={handleInputChange}
              value={formValues.description}
            /> */}
              <CustomLabel labelText={"Description"} />
              <textarea
                className="swift-addstrategy-description-input"
                name="description"
                placeholder="Add a little description to what this strategy is all about"
                onChange={handleChange}
                value={formValues.description}
                style={{ height: "146px" }}
              ></textarea>
              <CustomError
                errorText={descError}
                style={{
                  visibility: descError !== "error" ? "visible" : "hidden",
                }}
              />
            </div>

            {/* <CustomButton
            text="Add Asset Class"
            classname="swift-addstrategy-btn"
            onClick={handleAddAssetClass}
          /> */}
            <div
              className="swift-custom-btn swift-addstrategy-btn"
              onClick={handleAddAssetClass}
            >
              Add Asset Class
            </div>
            <div className="swift-addstrategy-cash-row">
              <p>CASH</p>
              <p>{cash}</p>
            </div>
            <div className="swift-addstrategy-assetclassdiv">
              {formValues.assetClasses.map((assetClass, classIndex) => (
                <div
                  key={`${classIndex}${formValues.assetClasses.length}`}
                  className="swift-addstrategy-asset"
                >
                  <div className="swift-addstrategy-asset-1">
                    {/* <div className="swift-addstrategy-asset-left"> */}
                    <CustomInput
                      type="text"
                      classnameInput="swift-addstrategy-underlying-input"
                      name={`assetClasses[${classIndex}].name`}
                      placeholder="Asset Class Name"
                      value={formValues.assetClasses[classIndex].name}
                      onInputChange={handleInputChange}
                      styleInput={{
                        borderBottom: "none",
                        width: "26vw",
                        borderRadius: 0,
                      }}
                    />
                    {/* </div>  */}
                    <div className="swift-addstrategy-asset-right">
                      <p
                        className="swift-addstrategy-buttons"
                        onClick={() => handleAddUnderlying(classIndex)}
                      >
                        Add Underlying
                      </p>
                      <p
                        className="swift-addstrategy-buttons"
                        onClick={() => handleDeleteAssetClass(classIndex)}
                        style={{
                          color: "rgba(1, 22, 39, 0.5)",
                        }}
                      >
                        Delete
                      </p>
                    </div>
                  </div>
                  <div className="swift-addstrategy-asset2">
                    {assetClass.underlyings.map(
                      (underlying, underlyingIndex) => (
                        <div>
                          <div
                            key={
                              assetClass.name +
                              classIndex +
                              underlying.stock +
                              underlyingIndex
                            }
                            className="swift-addstrategy-underlying"
                          >
                            {/* <div className="swift-addstrategy-underlying-left"> */}
                            <SearchLive
                              name={`assetClasses[${classIndex}].underlyings[${underlyingIndex}].stock`}
                              value={
                                formValues.assetClasses[classIndex].underlyings[
                                  underlyingIndex
                                ].stock
                              }
                              onInputChange={handleInputChange}
                            />

                            <CustomInput
                              type="number"
                              classnameInput="swift-addstrategy-underlying-input"
                              name={`assetClasses[${classIndex}].underlyings[${underlyingIndex}].percentage`}
                              placeholder="Percentage"
                              value={
                                formValues.assetClasses[classIndex].underlyings[
                                  underlyingIndex
                                ].percentage
                              }
                              onInputChange={handleInputChange}
                              styleInput={{ width: "12vw", borderRadius: 0 }}
                            />
                            {/* </div> */}
                            <p
                              className="swift-addstrategy-buttons"
                              onClick={() =>
                                handleDeleteUnderlying(
                                  classIndex,
                                  underlyingIndex
                                )
                              }
                              style={{
                                color: "rgba(1, 22, 39, 0.5)",
                              }}
                            >
                              Delete
                            </p>
                          </div>
                          <div className="swift-addstrategy-longname">
                            {
                              longName[
                                formValues.assetClasses[classIndex].underlyings[
                                  underlyingIndex
                                ].stock.trim()
                              ]
                            }
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="swift-addstrategy-submit-btn">
            <div className="swift-addstrategy-total-div">
              <p>Total</p>
              <p>{totalPercentage}</p>
            </div>

            <div className="swift-addstrategy-error-btn">
              <CustomError
                errorText={totalError}
                style={{
                  visibility: totalError !== "error" ? "visible" : "hidden",
                }}
              />

              <div style={{ display: "flex", columnGap: "10px" }}>
                <CustomButton
                  text={"Submit"}
                  classname="swift-addstrategy-btn submitbtn"
                  onClick={() => {
                    if (id) handleUpdate();
                    else handleSubmit();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PortfolioStrategyCreated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  // const email_id = location.state ? location.state.email_id : null;
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;
  const [dl_data, setDlData] = useState(null);
  const [loading, setloading] = useState(true);
  console.log("strategy", email_id);

  const fetchData = async (id) => {
    try {
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/getdldta?id=${id}`,
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

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        setloading(true);
        const data = await fetchData(id);
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
        // setDlData(data.data);
        // console.log(data.data);
        setTimeout(() => {
          setloading(false);
        }, 3000);
      } catch (error) {
        console.error("Error fetching and setting data:", error);
      }
    };

    if (id) {
      fetchDataAndSetState();
    }
  }, [id]);

  const clickHandler = () => {
    navigate("/accounts/dashboard/portfolio-management", {
      state: { email_id: email_id },
    });
  };

  // console.log(dl_data);

  return (
    <div className="swift-addstrategy-main">
      <div className="swift-addstrategy-content">
        <div className="swift-addstrategy-content-wrap strategy-created-wrap">
          <BackButton />
          <div className="swift-signup-status-main swift-strategy-created-main">
            <div className="swift-signup-status-info swift-strategy-info strategy-created-info">
              <div
                className="swift-signup-status-info-1 swift-strategy-created strategy-created-content"
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <div className="swift-strategy-created-head-text">
                  <div style={{ fontWeight: 800 }}>
                    Portfolio created/updated
                  </div>
                </div>
              </div>
              <div className="swift-signup-status-info-2 open-dashboard-btn ">
                <CustomButton
                  text="Open Dashboard"
                  classname="swift-accounts-content-button"
                  onClick={clickHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AddStrategyPortfolio, PortfolioStrategyCreated };
