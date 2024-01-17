import React from "react";
import "../CustomInputBox/CustomInputBox.css";

const CustomInputBox = ({
  type,
  value,
  placeholder,
  onChange,
  style,
  name,
  maxLength,
  classname,
  onKeyUp
}) => {
  return (
    <input
      style={style}
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={"swift-custom-input-box " + classname}
      onKeyUp={onKeyUp}
    />
  );
};

export default CustomInputBox;
