import React from "react";
import "../CustomButton/CustomButton.css";

const CustomButton = ({ style, text, classname, onClick,disabled }) => {
  // const defaultStyle = {
  //   borderRadius: "45px",
  //   background: "#000FFF",
  //   color: "#FFF",
  //   fontFamily: "Open Sans",
  //   fontSize: "18px",
  //   fontStyle: "normal",
  //   fontWeight: 700,
  //   lineHeight: "normal",
  //   letterSpacing: "-1px",
  //   border: "none",
  // };
  

  return (
    <button
      className={"swift-custom-btn " + classname}
      style={style}
      onClick={onClick ? onClick : null}
    >
      {text}
    </button>
  );
};

export default CustomButton;
