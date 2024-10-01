import React, { useEffect, useRef, useState } from "react";
import "../../../css/Accounts/AddStrategy.css";
import CustomInput from "../../CustomComponents/CustomInput/CustomInput";
import CustomError from "../../CustomComponents/CustomError/CustomError";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";
import { isEmpty } from "../../../utils/Validation";
import ServerRequest from "../../../utils/ServerRequest";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../AccessManagement/BackButton";
import CustomLabel from "../../CustomComponents/CustomLabel/CustomLabel";
import Pulse from "../../Loader/Pulse";

const AddStrategyMain = () => {
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const navigate = useNavigate();
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });
  const [strategyNameError, setStrategyNameError] = useState("error");
  const [descError, setDescError] = useState("error");
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
          const formData = data.data;
          setFormValues(formData);
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

  const ValidateAll = () => {
    let hasError = false;
    if (isEmpty(formValues.name)) {
      setStrategyNameError("cannot be empty");

      hasError = true;
      return hasError;
    } else if (formValues.name.length < 5) {
      setStrategyNameError("Bucket Name should be atleast 5 characters");

      hasError = true;
      return hasError;
    } else {
      setStrategyNameError("error");
    }

    if (isEmpty(formValues.description)) {
      setDescError("cannot be empty");

      hasError = true;
      return hasError;
    } else if (formValues.description.length < 20) {
      setDescError("Description should be atleast 20 characters");

      hasError = true;
      return hasError;
    } else {
      setDescError("error");
    }

    return hasError;
  };

  const handleSubmit = async () => {
    if (ValidateAll()) return;

    const requestType = id ? "put" : "post";
    const requestURL = id ? `/strategy/update` : `/strategy/insert`;

    const data = await ServerRequest({
      method: requestType,
      URL: requestURL,
      data: { ...formValues, email_id: email_id, id: id },
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }

    navigate("/accounts/dashboard/strategy", {
      state: { id: data.data, email_id: email_id },
    });
  };

  const handleInputChange = async (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    let inputValue;
    if (e.target.value.length > 500) {
      inputValue = e.target.value.slice(0, 500);
    } else {
      inputValue = e.target.value;
    }

    handleInputChange("description", inputValue);
  };

  return loading ? (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : (
    <>
      <div className={`background-div `}></div>
      <div className="swift-addstrategy-main">
        <div className={`swift-addstrategy-content `}>
          <div className="swift-addstrategy-content-wrap" id="scroll">
            <BackButton />
            <div className="swift-addstrategy-header">Add/ Edit Bucket</div>
            <div className="swift-addstrategy-input">
              <CustomInput
                labelText="Bucket Name"
                type="text"
                classnameInput="swift-login-form-email-input swift-addstrategy-name-input"
                name="name"
                placeholder="sample Bucket"
                styleInput={{
                  height: "50px",
                  opacity: id ? "0.5" : "1.0",
                  cursor: id ? "not-allowed" : "normal",
                }}
                onInputChange={(name, value) => {
                  if (id) return;
                  handleInputChange(name, value);
                }}
                value={formValues.name}
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
              <CustomLabel labelText={"Description"} />
              <textarea
                className="swift-addstrategy-description-input"
                name="description"
                placeholder="Add a little description to what this bucket is all about"
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
          </div>
          <div
            className="swift-addstrategy-submit-btn"
            style={{ flexDirection: "row" }}
          >
            <CustomButton
              text={"Submit"}
              classname="swift-addstrategy-btn submitbtn"
              onClick={() => {
                handleSubmit();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const StrategyCreated = () => {
  const navigate = useNavigate();
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const clickHandler = () => {
    navigate("/accounts/dashboard/asset", {
      state: { email_id: email_id },
    });
  };

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
                  <div style={{ fontWeight: 800 }}>Bucket created/updated</div>
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

export { AddStrategyMain, StrategyCreated };
