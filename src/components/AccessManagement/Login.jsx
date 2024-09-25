import React, { useEffect, useState } from "react";
import "../../css/AccessManagement/Login.css";

import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomError from "../CustomComponents/CustomError/CustomError";
import BackButton from "./BackButton";
import InfoBox from "./InfoBox";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ServerRequest from "../../utils/ServerRequest";
import { checkLength, isEmpty, validateEmail } from "../../utils/Validation";

const Login = () => {
  const location = useLocation();
  useEffect(() => {}, [location.pathname]);

  return (
    <div className="swift-login-main">
      {location.pathname === "/login" && <LoginMain />}
      {location.pathname === "/login/pin" && <LoginPin />}
      {location.pathname === "/login/reset" && <LoginReset />}
      {location.pathname === "/login/resetsuccessful" && (
        <LoginResetSuccessful />
      )}
    </div>
  );
};

const LoginMain = () => {
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

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  useEffect(() => {
    if (error) {
      navigate("/404");
    }
  }, [error]);

  const ValidateEmail = async () => {
    const email = formValues["email"];
    if (!validateEmail(email)) {
      return "Enter valid email";
    }

    const data = await ServerRequest({
      method: "get",
      URL: `/access/login/email-validation?email_id=${email}`,
    });

    if (data.server_error) {
      setError(true);
    }

    if (data.error) {
      return data.message;
    }

    formValues["data"] = data;
  };

  const handleGenerateOtp = async () => {
    if (formValues["email"] == "demo@altsinsight.com") {
      setEmailError("error");
      setOtpVisible(true);
      // setCountdown(30);
      // setTextVisible(true);
      setIsButtonDisabled(true);
      setIsNextButtonDisabled(false);
      return;
    }
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
    if (formValues["email"] == "demo@altsinsight.com") {
      if (formValues["otp"] == "128314") {
        localStorage.setItem("userData", formValues["email"]);
        navigate("/accounts/dashboard/asset", {
          state: { email_id: formValues["email"] },
        });
        return;
      } else {
        if (formValues.otp.length != 6) {
          setOtpError("OTP must be 6 length");
        } else {
          setOtpError("Incorrect OTP");
        }
        return;
      }
    }
    setOtpError("error");
    if (isNextButtonDisabled) return;

    if (!isEmpty(formValues["otp"]) && checkLength(formValues["otp"], 6)) {
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
        navigate("/login/pin", {
          state: { email: formValues["email"], user_data: formValues["data"] },
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
    <>
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
            styleDiv={{
              visibility: otpVisible ? "visible" : "hidden",
              paddingTop: "16px",
            }}
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
            fontWeight: "700",
          }}
        />
      </div>
    </>
  );
};

const LoginPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, user_data } = location.state;

  const [formValues, setFormValues] = useState({});
  const [pinerror, setPinError] = useState("error");

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      navigate("/404");
    }
  }, [error]);

  const handleSubmit = async (e) => {
    setPinError("error");

    if (!isEmpty(formValues["pin"]) && checkLength(formValues["pin"], 4)) {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/access/login/validate-pin`,
        data: { email_id: email, pin: String(formValues["pin"]) },
      });
      if (data1.error) {
        setPinError(data1.message);
      }
      if (data1.server_error) {
        setError(true);
      }
      if (data1.error == false) {
        localStorage.setItem("userData", email);
        navigate("/accounts/dashboard/asset", {
          state: { email_id: email },
        });
      }
    } else {
      setPinError("Pin should be 4 digit");
    }
  };
  function KeyUp1(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <>
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
            classnameInput="swift-login-form-pin-input1"
            name="pin"
            maxLength={4}
            placeholder="1234"
            onInputChange={handleInputChange}
            onKeyUp={KeyUp1}
          />

          <div className="swift-login-form-error">
            <CustomError
              errorText={pinerror}
              style={{
                visibility: pinerror != "error" ? "visible" : "hidden",
              }}
            />
            <Link Link to="/login/reset" state={{ email: email }}>
              <button className="swift-login-form-reset-pin">Reset PIN</button>
            </Link>
          </div>
        </div>

        <CustomButton
          text="Login"
          classname="swift-login-form-btn"
          onClick={handleSubmit}
          style={{
            background: "#000fff",
            color: "#fff",
            fontSize: "14px",
          }}
        />
      </div>
    </>
  );
};

const LoginReset = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email_id = state.email;

  const [formValues, setFormValues] = useState({});

  const [otperror, setOtpError] = useState("error");
  const [pinerror, setPinError] = useState("error");
  const [confirmpinerror, setConfirmPinError] = useState("error");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isResetButtonDisabled, setIsResetButtonDisabled] = useState(true);

  const [otpVisible, setOtpVisible] = useState(false);
  const [pinVisible, setPinVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      navigate("/404");
    }
  }, [error]);

  useEffect(() => {
    if (countdown === 0) {
      setTextVisible(false);
    }
  }, [countdown]);

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleGenerateOtp = async () => {
    const data1 = await ServerRequest({
      method: "post",
      URL: `/access/generate-otp`,
      data: { email_id: email_id },
    });

    if (data1.error) {
      alert(data1.message);
    }
    if (data1.server_error) {
      setError(true);
    }
    if (data1.error == false) {
      setOtpVisible(true);
      setCountdown(30);
      setTextVisible(true);
      setIsButtonDisabled(true);

      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        setIsButtonDisabled(false);
      }, 30000);
    }
  };

  const handleValidate = async () => {
    setOtpError("error");

    if (!isEmpty(formValues["otp"]) && checkLength(formValues["otp"], 6)) {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/access/validate-otp`,
        data: { email_id: email_id, otp: String(formValues["otp"]) },
      });
      if (data1.server_error) {
        alert(data1.message);
      }
      if (data1.error) {
        setOtpError(data1.message);
      }
      if (data1.error == false) {
        setPinVisible(true);
        setIsButtonDisabled(true);
        setTextVisible(false);
        setIsResetButtonDisabled(false);
      }
    } else {
      setOtpError("OTP should be 6 length");
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (isResetButtonDisabled) return;

    const pin = formValues["pin"];
    const confirmPin = formValues["confirmpin"];

    const isPinValid = checkLength(pin, 4);
    const isConfirmPinValid = checkLength(confirmPin, 4);

    setPinError(isPinValid ? "error" : "PIN should be at least 4 digits");

    if (isPinValid) {
      setConfirmPinError(
        isConfirmPinValid
          ? confirmPin !== pin
            ? "PIN does not match with the above input"
            : "error"
          : "PIN should be at least 4 digits"
      );
    } else {
      setConfirmPinError("error");
    }
    if (
      isResetButtonDisabled ||
      !isPinValid ||
      !isConfirmPinValid ||
      confirmPin !== pin
    ) {
      return;
    }

    const data1 = await ServerRequest({
      method: "put",
      URL: `/access/reset-pin`,
      data: { email_id: email_id, pin: String(pin) },
    });

    if (data1.server_error) {
      setError(true);
    } else if (data1.error) {
      setPinError(data1.message);
    } else {
      navigate("/login/resetsuccessful");
    }
  };

  function KeyUp1(e) {
    if (e.key === "Enter") {
      handleValidate();
    }
  }
  function KeyUp2(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }
  return (
    <>
      <div className="swift-login-form swift-reset-form">
        <div className="swift-reset-form-div-1">
          <div className="swift-login-form-heading">
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
          <div className="swift-login-form-reset">
            <p>Reset PIN</p>
          </div>
          <div className="swift-login-form-otp">
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
            classnameInput="swift-login-form-otp-input"
            name="otp"
            placeholder="123456"
            maxLength="6"
            onInputChange={handleInputChange}
            styleDiv={{ visibility: otpVisible ? "visible" : "hidden" }}
            onKeyUp={KeyUp1}
          />
          <CustomError
            errorText={otperror}
            style={{
              visibility: otperror != "error" ? "visible" : "hidden",
            }}
          />
          <CustomButton
            text="Validate"
            classname={"swift-login-form-validate-btn"}
            style={{
              visibility: otpVisible ? "visible" : "hidden",
              background: "#000fff",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={handleValidate}
          />
          <CustomInput
            labelText="PIN"
            type="number"
            name="pin"
            classnameInput="swift-login-form-pin-input"
            placeholder="1235"
            maxLength="4"
            onInputChange={handleInputChange}
            styleDiv={{ visibility: pinVisible ? "visible" : "hidden" }}
            onKeyUp={KeyUp2}
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
            classnameInput="swift-login-form-confirmpin-input"
            placeholder="1235"
            maxLength="4"
            onInputChange={handleInputChange}
            styleDiv={{
              marginTop: "9px",
              visibility: pinVisible ? "visible" : "hidden",
            }}
            onKeyUp={KeyUp2}
          />
          <CustomError
            errorText={confirmpinerror}
            style={{
              visibility: confirmpinerror != "error" ? "visible" : "hidden",
            }}
          />
        </div>

        <CustomButton
          text="Reset"
          classname="swift-login-form-btn"
          onClick={handleSubmit}
          disabled={isResetButtonDisabled}
          style={{
            cursor: isResetButtonDisabled ? "not-allowed" : "pointer",
            background: isResetButtonDisabled ? "#000fff59" : "#000fff",
            color: "#fff",
            fontSize: "14px",
          }}
        />
      </div>
    </>
  );
};

const LoginResetSuccessful = () => {
  const navigate = useNavigate();
  const handlerSubmit = () => {
    navigate("/login");
  };
  return (
    <>
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
        </div>
        <div className="swift-login-form-svg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M33.3961 18.6868C34.0063 19.297 34.0063 20.2863 33.3961 20.8965L22.9795 31.3131C22.3693 31.9233 21.3801 31.9233 20.7698 31.3131L16.6031 27.1465C15.993 26.5362 15.993 25.5471 16.6031 24.9369C17.2133 24.3267 18.2027 24.3267 18.8129 24.9369L21.8747 27.9985L31.1865 18.6868C31.7968 18.0766 32.7859 18.0766 33.3961 18.6868Z"
                fill="black"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24.8807 2.60417H25.1199C29.9291 2.60415 33.6978 2.60413 36.6385 2.99948C39.6482 3.40415 42.0235 4.24861 43.8876 6.1128C46.362 8.58723 47.0495 11.975 47.2795 16.5889C47.3224 17.4508 46.6585 18.1843 45.7966 18.2272C44.9347 18.2702 44.2012 17.6063 44.1582 16.7445C43.9326 12.2189 43.2607 9.90532 41.6778 8.32251C40.491 7.13571 38.8853 6.45469 36.222 6.09661C33.5137 5.73248 29.9549 5.72917 25.0003 5.72917C20.0457 5.72917 16.4869 5.73248 13.7786 6.09661C11.1153 6.45469 9.5096 7.13571 8.32283 8.32251C7.13603 9.50928 6.45501 11.1149 6.09693 13.7783C5.73281 16.4866 5.72949 20.0454 5.72949 25C5.72949 29.9546 5.73281 33.5133 6.09693 36.2217C6.45501 38.885 7.13603 40.4906 8.32283 41.6775C9.5096 42.8644 11.1153 43.5454 13.7786 43.9033C16.4869 44.2675 20.0457 44.2708 25.0003 44.2708C29.9549 44.2708 33.5137 44.2675 36.222 43.9033C38.8853 43.5454 40.491 42.8644 41.6778 41.6775C42.8647 40.4906 43.5457 38.885 43.9037 36.2217C44.2678 33.5133 44.2712 29.9546 44.2712 25C44.2712 24.1371 44.9707 23.4375 45.8337 23.4375C46.6966 23.4375 47.3962 24.1371 47.3962 25V25.1196C47.3962 29.9288 47.3962 33.6975 47.001 36.6381C46.5962 39.6479 45.7518 42.0231 43.8876 43.8873C42.0235 45.7515 39.6482 46.5958 36.6385 47.0006C33.6978 47.3958 29.9291 47.3958 25.1199 47.3958H24.8807C20.0716 47.3958 16.3028 47.3958 13.3622 47.0006C10.3523 46.5958 7.97731 45.7515 6.11312 43.8873C4.24893 42.0231 3.40447 39.6479 2.9998 36.6381C2.60445 33.6975 2.60447 29.9288 2.60449 25.1196V24.8804C2.60447 20.0713 2.60445 16.3025 2.9998 13.3619C3.40447 10.352 4.24893 7.97698 6.11312 6.1128C7.97731 4.24861 10.3523 3.40415 13.3622 2.99948C16.3028 2.60413 20.0716 2.60415 24.8807 2.60417Z"
                fill="black"
              />
            </svg>
          </div>
          <p>PIN reset has been successful</p>
        </div>

        {/* <Link to="/login" classname="swift-login-form-btn"> */}
        <CustomButton
          text="Login Again"
          classname="swift-login-form-btn"
          onClick={handlerSubmit}
          style={{
            background: "#000fff",
            color: "#fff",
            fontSize: "14px",
          }}
        />
        {/* </Link> */}
      </div>
    </>
  );
};

export default Login;
