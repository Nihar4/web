import React from "react";
import "../CustomError/CustomError.css";

const CustomError = ({ errorText, style, classname }) => {
  // const defaultStyle = {
  //   color: "#011627",
  //   fontFamily: "Open Sans",
  //   fontSize: "12px",
  //   fontStyle: "italic",
  //   fontWeight: 700,
  //   lineHeight: "normal",
  //   letterSpacing: "-0.65px",
  // };

  return (
    <p className={"swift-custom-error " + classname} style={style}>
      {errorText}
    </p>
  );
};

export default CustomError;
