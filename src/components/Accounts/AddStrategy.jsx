import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../../css/Accounts/AddStrategy.css";
import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import CustomError from "../CustomComponents/CustomError/CustomError";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { isEmpty } from "../../utils/Validation";
import SearchLive from "./SearchLive";
import ServerRequest from "../../utils/ServerRequest";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import BackButton from "../AccessManagement/BackButton";
import CustomLabel from "../CustomComponents/CustomLabel/CustomLabel";

const AddStrategyMain = () => {
  const location = useLocation();
  const email_id = location.state ? location.state.email_id : null;
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

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await ServerRequest({
            method: "get",
            URL: `/strategy/getone/?id=${id}`,
          });
          setFormValues(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [id]);

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
  const handleInputChange = async (name, value) => {
    // console.log(1);
    console.log("addstraegy", name, value);

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
      // console.log("name", name[13],name[28]);
      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/validatestock?stock=${value}`,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      if (data.data == false) {
        // alert(
        //   `${value}'s data is not sufficient for analysis, please choose another one`
        // );
        setShowalert(true);
        Alert({
          TitleText: "Error",
          Message: `${value}'s data is not sufficient for analysis, please choose another one`,
          BandColor: "#e51a4b",

          AutoClose: {
            Active: true,
            Line: true,
            LineColor: "#e51a4b",
            Time: 2,
          },
        });
        setTimeout(() => {
          setShowalert(false);
        }, 2000);

        // if(document.getElementsByClassName("custom__alert__box").length==0){
        //   setShowalert(false);
        // }
        handleDeleteUnderlying(parseInt(name[13]), parseInt(name[28]));
        return;
      }
    }
    setShowalert(false);
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

  const handleAddAssetClass = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      assetClasses: [...prevValues.assetClasses, { name: "", underlyings: [] }],
    }));
  };

  const handleAddUnderlying = (index) => {
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
  };

  const handleDeleteAssetClass = (index) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      assetClasses: prevValues.assetClasses.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteUnderlying = (classIndex, underlyingIndex) => {
    // console.log("hii", classIndex,underlyingIndex);
    // console.log("prev",formValues);
    setFormValues((prevValues) => {
      const updatedAssetClasses = prevValues.assetClasses.map(
        (assetClass, i) => {
          if (i === classIndex) {
            return {
              ...assetClass,
              underlyings: assetClass.underlyings.filter(
                (_, j) => j !== underlyingIndex
              ),
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

    // console.log("new",formValues)
  };

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

  const ValidateAll = () => {
    let hasError = false;
    if (isEmpty(formValues.strategyName)) {
      setStrategyNameError("cannot be empty");
      settotalError("error");

      hasError = true;
      return hasError;
    } else if (formValues.strategyName.length < 10) {
      setStrategyNameError("Strategyname should be atleast 10 characters");
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
    } else if (formValues.description.length < 50) {
      setDescError("Description should be atleast 50 characters");
      settotalError("error");

      hasError = true;
      return hasError;
    } else {
      setDescError("error");
    }

    let totalPercentageError = false;
    if(formValues.assetClasses.length == 0){
      settotalError("Add asset to strategy");
      hasError=true;
      return hasError;
    }

    formValues.assetClasses.forEach((assetClass, index) => {
      if (isEmpty(assetClass.name)) {
        hasError = true;
        return hasError;
      }

      assetClass.underlyings.forEach((underlying, underlyingIndex) => {
        if (isEmpty(underlying.stock)) {
          hasError = true;
          return hasError;
        }
        if (parseFloat(underlying.percentage) < 1) {
          settotalError("Minimum percentage for each stock should be 1");
          // console.log("hello");
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

    // if (totalPercentage !== 100) {
    //   // console.log("Total percentage is not 100. Please adjust.");
    //   settotalError("Total weight needs to added to 100");
    //   hasError = true;
    //   // return hasError;
    // } else {
    //   settotalError("error");
    // }

    // formValues.assetClasses.forEach((assetClass, index) => {
    //   if (isEmpty(assetClass.name)) {
    //     hasError = true;
    //     alert("name");

    //     return hasError;
    //   }

    //   assetClass.underlyings.forEach((underlying, underlyingIndex) => {
    //     if (isEmpty(underlying.stock)) {
    //       hasError = true;
    //       alert("stock");

    //       return hasError;
    //     }
    //   });
    // });

    // return hasError;
  };

  // const insertStocks = async (id) => {
  //   for (const assetClass of formValues.assetClasses) {
  //     for (const stock of assetClass.underlyings) {
  //       try {
  //         const data1 = await ServerRequest({
  //           method: "post",
  //           URL: `/strategy/insertdldata`,
  //           data: {
  //             stock: `${stock.stock}.L`,
  //             id: id
  //           },
  //         });
  //         if (data1.server_error) {
  //           alert("error insert");
  //         }

  //         if (data1.error) {
  //           alert("error1 insert");
  //         }
  //         // console.log(data1);
  //       } catch (error) {
  //         console.error( error);
  //       }
  //     }
  //   }
  // };
  const handleSubmit = async () => {
    if (ValidateAll()) return;

    console.log("Submitting form data:", formValues);

    const data = await ServerRequest({
      method: "post",
      URL: `/strategy/insert`,
      data: { ...formValues, email_id: email_id },
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }
    // console.log("for id",data.data);
    //  await insertStocks(data.data);

    navigate("/accounts/dashboard/strategy", {
      state: { id: data.data, email_id: email_id },
    });
  };
  const handleUpdate = async () => {
    console.log("call");
    if (ValidateAll()) return;

    const data = await ServerRequest({
      method: "delete",
      URL: `/strategy/`,
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
      URL: `/strategy/insert?strategy_id=${id}`,
      data: { ...formValues, email_id: email_id },
    });

    if (data1.server_error) {
      alert("error");
    }

    if (data1.error) {
      alert("error1");
    }
    // alert("data add");
    // await insertStocks(id);
    navigate("/accounts/dashboard/strategy", {
      state: { id: id, email_id: email_id },
    });
  };

  const [value1, setValue1] = useState();
  // setValue1(value);
  // console.log(value1);
  const handleChange = (e) => {
    let inputValue = e.target.value;

   handleInputChange("description", inputValue);
    setValue1(inputValue);
  };

  console.log(formValues.description)
  return loading ? (
    <>Loading</>
  ) : (
    <div className="swift-addstrategy-main">
      <Header email_id={email_id} />
      <div
        className={`swift-addstrategy-content ${
          showalert ? "blur-background" : ""
        }`}
      >
        <div className="swift-addstrategy-content-wrap">
          <BackButton />
          <div className="swift-addstrategy-header">Add/ Edit Strategy</div>
          <div className="swift-addstrategy-input">
            <CustomInput
              labelText="Strategy Name"
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
              style={{height:"100px"}}
            ></textarea>
            <CustomError
              errorText={descError}
              style={{
                visibility: descError !== "error" ? "visible" : "hidden",
              }}
            />
          </div>

          <CustomButton
            text="Add Asset Class"
            classname="swift-addstrategy-btn"
            onClick={handleAddAssetClass}
          />
          <div className="swift-addstrategy-assetclassdiv">
            {formValues.assetClasses.map((assetClass, classIndex) => (
              <div key={classIndex} className="swift-addstrategy-asset">
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
                  {assetClass.underlyings.map((underlying, underlyingIndex) => (
                    <div
                      key={underlyingIndex}
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
                          handleDeleteUnderlying(classIndex, underlyingIndex)
                        }
                        style={{
                          color: "rgba(1, 22, 39, 0.5)",
                        }}
                      >
                        Delete
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="swift-addstrategy-submit-btn">
          { formValues.assetClasses.length>0 && <div className="swift-addstrategy-total-div">
            <p>Total</p>
            <p>{totalPercentage}</p>
          </div>}
          <div className="swift-addstrategy-error-btn">
            <CustomError
              errorText={totalError}
              style={{
                visibility: totalError !== "error" ? "visible" : "hidden",
              }}
            />
            <CustomButton
              text="Submit"
              classname="swift-addstrategy-btn submitbtn"
              onClick={() => {
                console.log(id);
                if (id) handleUpdate();
                else handleSubmit();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StrategyCreated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const email_id = location.state ? location.state.email_id : null;
  const [dl_data, setDlData] = useState(null);
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
        const data = await fetchData(id);
        const sortedData = data.data.slice().sort((a, b) => {
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
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching and setting data:", error);
      }
    };

    if (id) {
      fetchDataAndSetState();
    }
  }, [id]);

  const clickHandler = () => {
    navigate("/accounts/dashboard/asset", {
      state: { email_id: email_id },
    });
  };

  console.log(dl_data);

  return (
    <div className="swift-addstrategy-main">
      <Header email_id={email_id} />
      <div className="swift-addstrategy-content">
        <div className="swift-addstrategy-content-wrap">
          <BackButton />
          <div className="swift-signup-status-main swift-strategy-created-main">
            <div className="swift-signup-status-info swift-strategy-info">
              <div className="swift-signup-status-info-1 swift-strategy-created">
                <div className="swift-strategy-created-head-text">
                  {/* <div>Status</div> */}
                  <div style={{ fontWeight: 800 }}>
                    Strategy created/updated
                  </div>
                </div>
                <div style={{ fontSize: "14px" }}>
                  We are adding the securities to our database and will be
                  running them through our deep learning models. The strategy
                  might take 24 hours to get activated.
                </div>
                <div style={{ fontSize: "14px" }}>
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
                        <th>Security</th>
                        <th>Date added</th>
                        <th>Status</th>
                        <th>Completed on</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dl_data &&
                        dl_data
                          .slice()
                          .sort((a, b) => {
                            if (a.date_completed && b.date_completed) {
                              return (
                                new Date(b.date_completed) -
                                new Date(a.date_completed)
                              );
                            } else if (a.date_completed) {
                              return -1;
                            } else if (b.date_completed) {
                              return 1;
                            } else {
                              return 0;
                            }
                          })
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{item.security}</td>
                              <td>{item.date_created}</td>
                              <td>{item.status}</td>
                              <td>
                                {!item.date_completed
                                  ? ""
                                  : new Date(
                                      item.date_completed
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
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
  );
};

export { AddStrategyMain, StrategyCreated };
