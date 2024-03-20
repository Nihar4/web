import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../../css/Accounts/AddStrategy.css";
import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import CustomError from "../CustomComponents/CustomError/CustomError";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { isEmpty } from "../../utils/Validation";
import SearchLive from "./SearchLive";
import ServerRequest from "../../utils/ServerRequest";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AddStrategy = () => {
  console.log("here");
  const navigate = useNavigate();
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    strategyName: "",
    description: "",
    assetClasses: [],
  });
  const [strategyNameError, setStrategyNameError] = useState("error");
  const [descError, setDescError] = useState("error");
  const [totalError, settotalError] = useState("error");
  const [loading, setLoading] = useState(true);

  // // const { id } = useParams();
  // console.log(id);
  // if (id) setId(id);
  console.log(id);
  console.log(formValues);

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

  // console.log(formValues);

  const extractPropertyNameAndIndex = (path) => {
    const matches = path.match(/^(.+)\[(\d+)\]$/); // Match pattern like "propertyName[index]"
    if (matches) {
      const propertyName = matches[1];
      const index = parseInt(matches[2]);
      return { propertyName, index };
    } else {
      return { propertyName: path, index: null }; // If no index is found, set index to null
    }
  };

  const handleInputChange = (name, value) => {
    console.log(1);
    // Function to update nested properties in an object
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
  // const totalPercentage = 0;

  const ValidateAll = () => {
    let hasError = false;
    if (isEmpty(formValues.strategyName)) {
      setStrategyNameError("cannot be empty");
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
    } else {
      setDescError("error");
    }

    if (totalPercentage !== 100) {
      // console.log("Total percentage is not 100. Please adjust.");
      settotalError("Total weight needs to added to 100");
      hasError = true;
      // return hasError;
    } else {
      settotalError("error");
    }

    formValues.assetClasses.forEach((assetClass, index) => {
      // Validate asset class name
      if (isEmpty(assetClass.name)) {
        hasError = true;
        alert("name");
        // settotalError("error");

        return hasError;
      }

      // Validate underlyings
      assetClass.underlyings.forEach((underlying, underlyingIndex) => {
        // Validate stock name
        if (isEmpty(underlying.stock)) {
          hasError = true;
          alert("stock");
          // settotalError("error");

          return hasError;
        }
      });
    });

    return hasError;
  };
  const handleSubmit = async () => {
    if (ValidateAll()) return;

    console.log("Submitting form data:", formValues);

    const data = await ServerRequest({
      method: "post",
      URL: `/strategy/insert`,
      data: formValues,
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }
    // alert("data add");
    navigate("/accounts/dashboard/strategy");
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
      URL: `/strategy/insert`,
      data: formValues,
    });

    if (data1.server_error) {
      alert("error");
    }

    if (data1.error) {
      alert("error1");
    }
    // alert("data add");
    navigate("/accounts/dashboard/strategy");
  };

  return loading ? (
    <>Loading</>
  ) : (
    <div className="swift-addstrategy-main">
      <Header />
      <div className="swift-addstrategy-content">
        <div className="swift-addstrategy-content-wrap">
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
            <CustomInput
              labelText="Description"
              type="textarea"
              classnameInput="swift-addstrategy-description-input"
              name="description"
              styleInput={{ height: "100px" }}
              placeholder="Add a little description to what this strategy is all about"
              onInputChange={handleInputChange}
              value={formValues.description}
            />
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
                        type="text"
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

export default AddStrategy;
