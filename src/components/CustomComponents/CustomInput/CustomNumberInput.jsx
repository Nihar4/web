import React, { useEffect, useState } from "react";
import CustomLabel from "../CustomLabel/CustomLabel";
import CustomInputBox from "../CustomInputBox/CustomInputBox";
import "../CustomInput/CustomInput.css";
import {
  numberFormatMatrix,
  parseFormattedNumber,
} from "../../../utils/utilsFunction";

const CustomNumberInput = ({
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
}) => {
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    setFormattedValue(numberFormatMatrix(value, 0));
  }, [value]);

  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (type === "number" && maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    const unformattedValue = parseFormattedNumber(inputValue);
    const formatted = numberFormatMatrix(unformattedValue, 0);

    onInputChange && onInputChange(name, unformattedValue);
    setFormattedValue(formatted);
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
        value={formattedValue}
        name={name}
        classname={classnameInput}
        placeholder={placeholder}
        onChange={handleChange}
        onClick={onClick}
        maxLength={maxLength}
        style={styleInput}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export default CustomNumberInput;
