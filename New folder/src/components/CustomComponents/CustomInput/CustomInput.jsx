import React, { useState } from "react";
import CustomLabel from "../CustomLabel/CustomLabel";
import CustomInputBox from "../CustomInputBox/CustomInputBox";
import "../CustomInput/CustomInput.css";

const CustomInput = ({
  labelText,
  type,
  name,
  placeholder,
  value,
  maxLength = 100,
  onInputChange,
  classnameDiv,
  classnameLabel,
  classnameInput,
  styleDiv = {},
  styleInput = {},
  styleLabel = {},
  onKeyUp,
}) => {
  // console.log(value, name);
  const [value1, setValue1] = useState(value);
  // setValue1(value);
  // console.log(value1);
  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type === "number" && maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    onInputChange && onInputChange(name, inputValue);
    setValue1(inputValue);
  };

  return (
    <div className={classnameDiv} style={styleDiv}>
      <CustomLabel
        className={classnameLabel}
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
        maxLength={maxLength}
        style={styleInput}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export default CustomInput;
