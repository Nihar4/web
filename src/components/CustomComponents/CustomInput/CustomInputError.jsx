import React, { useEffect, useState } from "react";
import CustomLabel from "../CustomLabel/CustomLabel";
import CustomInputBox from "../CustomInputBox/CustomInputBox";
import "../CustomInput/CustomInput.css";
import CustomError from "../CustomError/CustomError";

const CustomInputError = ({
  labelText,
  type,
  name,
  placeholder,
  value,
  maxLength = 100,
  onInputChange,
  onClick,
  classnameDiv,
  classnameLabel,
  classnameInput,
  styleDiv = {},
  styleInput = {},
  styleLabel = {},
  onKeyUp,
  error,
}) => {
  const [value1, setValue1] = useState(value);

  useEffect(() => {
    setValue1(value);
  }, [value]);

  // setValue1(value);
  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type === "number" && maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    if (type === "number") {
      inputValue = parseFloat(inputValue);
    }
    onInputChange && onInputChange(name, inputValue);
    setValue1(inputValue);
  };

  return (
    <div className={classnameDiv} style={styleDiv}>
      <CustomLabel
        classname={classnameLabel}
        labelText={labelText}
        style={{ styleLabel }}
      />
      <CustomInputBox
        type={type}
        value={value1}
        name={name}
        classname={classnameInput}
        placeholder={placeholder}
        onChange={handleChange}
        onClick={onClick}
        maxLength={maxLength}
        style={styleInput}
        onKeyUp={onKeyUp}
      />
      <CustomError errorText={error === "" ? "error" : error} />
    </div>
  );
};

export default CustomInputError;
