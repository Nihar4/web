import React, { useEffect, useState } from "react";
import "../../css/AccessManagement/Signup.css";
import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomError from "../CustomComponents/CustomError/CustomError";
import BackButton from "./BackButton";
import InfoBox from "./InfoBox";
import { useLocation, useNavigate } from "react-router-dom";
import ServerRequest from "../../utils/ServerRequest";
const {
  isEmpty,
  validateEmail,
  checkLength,
} = require("../../utils/Validation");

const Signup = () => {
  const location = useLocation();
  useEffect(() => {}, [location.pathname]);

  return (
    <>
      {location.pathname === "/signup/status" && <SignupStatus />}
      {location.pathname !== "/signup/status" && (
        <div className="swift-login-main">
          {location.pathname === "/signup" && <SignupMain />}
          {location.pathname === "/signup/pin" && <SignupPin />}
        </div>
      )}
    </>
  );
};

const SignupMain = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({});

  const [otperror, setOtpError] = useState("error");
  const [emailerror, setEmailError] = useState("error");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

  const [otpVisible, setOtpVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      navigate("/404");
    }
  }, [error]);

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const ValidateEmail = async () => {
    const email = formValues["email"];

    if (isEmpty(email)) {
      return "Email can not be empty";
    }

    if (!validateEmail(email)) {
      return "Email is not valid";
    }

    const data = await ServerRequest({
      method: "post",
      URL: `/access/signup/email-validation`,
      data: { email_id: formValues["email"] },
    });

    if (data.server_error) {
      setError(true);
    }
    if (data.error) {
      return data.message;
    }
  };

  const handleGenerateOtp = async () => {
    const error = await ValidateEmail();
    if (!error) {
      setEmailError("error");
      setOtpVisible(true);
      setCountdown(30);
      setTextVisible(true);
      setIsButtonDisabled(true);
      setIsNextButtonDisabled(false);

      const data1 = await ServerRequest({
        method: "post",
        URL: `/access/generate-otp`,
        data: { email_id: formValues["email"] },
      });
      if (data1.server_error) {
        setError(true);
      }

      if (data1.error) {
        alert(data1.message);
      }

      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        setIsButtonDisabled(false);
      }, 30000);
    } else {
      setEmailError(error);
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      setTextVisible(false);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    if (isNextButtonDisabled) return;
    setOtpError("error");
    if (formValues["otp"] && checkLength(formValues["otp"], 6)) {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/access/validate-otp`,
        data: { email_id: formValues["email"], otp: String(formValues["otp"]) },
      });
      if (data1.server_error) {
        setError(true);
      }
      if (data1.error) {
        setOtpError(data1.message);
      }
      if (data1.error == false)
        navigate("/signup/pin", {
          state: { email: formValues["email"] },
        });
    } else {
      setOtpError("OTP should be 6 length");
    }
  };
  function KeyUp1(e) {
    if (e.key === "Enter") {
      handleGenerateOtp();
    }
  }
  function KeyUp2(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="swift-login-form">
      <div className="swift-login-form-div-1">
        <div className="swift-login-loginform-heading">
          <div className="swift-login-form-logo">
            <a href="/" className="logo">
              <div className="logo"></div>
            </a>
            <p>
              <a href="/">
                <i style={{ fontWeight: 400 }}>swift</i>
                folios
              </a>
            </p>
          </div>

          <BackButton />
        </div>

        <CustomInput
          labelText="Email"
          type="email"
          classnameInput="swift-login-form-email-input"
          name="email"
          placeholder="abc@gmail.com"
          onInputChange={handleInputChange}
          onKeyUp={KeyUp1}
        />
        <CustomError
          errorText={emailerror}
          style={{
            visibility: emailerror != "error" ? "visible" : "hidden",
          }}
        />

        <div className="swift-login-loginform-otp">
          <button
            className="swift-login-form-generate"
            onClick={handleGenerateOtp}
            disabled={isButtonDisabled}
            style={{ cursor: isButtonDisabled ? "not-allowed" : "pointer" }}
          >
            Generate OTP
          </button>
          <p
            className="swift-login-form-wait"
            style={{ visibility: textVisible ? "visible" : "hidden" }}
          >
            Wait for {countdown}s to generate again
          </p>
        </div>

        <CustomInput
          labelText="One Time Password"
          type="number"
          classnameInput="swift-login-form-pin-input1"
          name="otp"
          placeholder="123456"
          maxLength="6"
          errormsg="OTP should be atleast 6 digits "
          onInputChange={handleInputChange}
          styleDiv={{ visibility: otpVisible ? "visible" : "hidden" }}
          onKeyUp={KeyUp2}
        />
        <CustomError
          errorText={otperror}
          style={{ visibility: otperror != "error" ? "visible" : "hidden" }}
        />
      </div>

      <CustomButton
        text="Next"
        classname="swift-login-form-btn"
        onClick={handleSubmit}
        disabled={isNextButtonDisabled}
        style={{
          cursor: isNextButtonDisabled ? "not-allowed" : "pointer",
          background: isNextButtonDisabled ? "#000fff59" : "#000fff",
          // background: isNextButtonDisabled ? "#F1F1F1" : "#000fff",
          color: "#fff",
          fontSize: "14px",
        }}
      />
    </div>
  );
};

const SignupPin = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({});

  const [pinerror, setPinError] = useState("error");
  const [confirmpinerror, setConfirmPinError] = useState("error");

  const location = useLocation();
  const { email } = location.state;

  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      navigate("/404");
    }
  }, [error]);

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setPinError("error");
    setConfirmPinError("error");
    if (formValues["pin"] && checkLength(formValues["pin"], 4)) {
      setPinError("error");
      if (
        formValues["confirmpin"] &&
        checkLength(formValues["confirmpin"], 4)
      ) {
        setConfirmPinError("error");
        if (formValues["confirmpin"] != formValues["pin"]) {
          setConfirmPinError("PIN does not match ");
        } else {
          const data1 = await ServerRequest({
            method: "get",
            URL: `/access/signup/set-pin?email_id=${email}&pin=${String(
              formValues["pin"]
            )}`,
          });

          if (data1.server_error) {
            setError(true);
          }
          if (data1.error) {
            setConfirmPinError(data1.message);
          }
          if (data1.error == false) {
            formValues["user_data"] = data1.data;
            navigate("/signup/status", {
              state: { user_data: formValues["user_data"] },
            });
          }
          // navigate("/signup/status");
        }
      } else {
        setConfirmPinError("PIN should be atleast 4 digits");
      }
    } else {
      setPinError("PIN should be atleast 4 digits");
    }
  };
  function KeyUp1(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="swift-login-form">
      <div className="swift-login-form-div-1">
        <div className="swift-login-loginform-heading">
          <div className="swift-login-form-logo">
            <a href="/" className="logo">
              <div className="logo"></div>
            </a>
            <p>
              <a href="/">
                <i style={{ fontWeight: 400 }}>swift</i>
                folios
              </a>
            </p>
          </div>
          <BackButton />
        </div>

        <CustomInput
          labelText="PIN"
          type="number"
          name="pin"
          classnameInput="swift-login-form-pin-input1"
          placeholder="1235"
          maxLength="4"
          onInputChange={handleInputChange}
          onKeyUp={KeyUp1}
        />
        <CustomError
          errorText={pinerror}
          style={{
            visibility: pinerror != "error" ? "visible" : "hidden",
          }}
        />
        <CustomInput
          labelText="Confirm PIN"
          type="number"
          name="confirmpin"
          classnameInput="swift-login-form-pin-input1"
          placeholder="1235"
          maxLength="4"
          onInputChange={handleInputChange}
          styleDiv={{
            marginTop: "15px",
          }}
          onKeyUp={KeyUp1}
        />
        <CustomError
          errorText={confirmpinerror}
          style={{
            visibility: confirmpinerror != "error" ? "visible" : "hidden",
          }}
        />
      </div>

      <CustomButton
        text="Sign-up"
        classname="swift-login-form-btn"
        onClick={handleSubmit}
        style={{
          background: "#000fff",
          color: "#fff",
          fontSize: "14px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

const SignupStatus = () => {
  // const navigate = useNavigate();
  const clickHandler = () => {
    window.location.href = "https://www.altsinsight.com/";
  };
  return (
    <div className="swift-signup-status-main">
      <div className="swift-signup-status-heading">
        {/* <p>
          <i style={{ fontWeight: 400 }}>swift</i>
          folios
        </p> */}
        <div className="swift-login-form-logo">
          <a href="/" className="logo">
            <div className="logo"></div>
          </a>
          <p>
            <a href="/">
              <i style={{ fontWeight: 400 }}>swift</i>
              folios
            </a>
          </p>
        </div>
      </div>
      <div className="swift-signup-status-info">
        <div className="swift-signup-status-info-1">
          <div>
            <div>Account status</div>
            <div style={{ fontWeight: 800 }}>Pending Approval</div>
            <div style={{ fontWeight: 800 }}>
              We are trying to get you onboarded as soon as possible.
            </div>
          </div>
          <div>
            Please be on the look our for any email from us which might indicate
            additional steps that you need to complete. Otherwise, we should get
            you over the line in 3 working days.
          </div>
          <div>
            For anything else, kindly reach out to us on{" "}
            <span style={{ fontWeight: 700 }}>accounts@swiftfolios.co.uk</span>
          </div>
        </div>
        <div className="swift-signup-status-info-2">
          <button className="swift-signup-status-button" onClick={clickHandler}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
