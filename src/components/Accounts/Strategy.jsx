import React from "react";
import "../../css/Accounts/Strategy.css";

const Strategy = ({ heading, content, isClicked, onClick, style }) => {

  const handleDelete = () => {
    console.log("delete")
  }
  // console.log("Rendering Strategy:", heading, isClicked);
  return (
    <div className="swift-accounts-strategy">
      <div className="swift-accounts-strategy-content" style={style}  onClick={onClick}>
        <p style={{ fontWeight: 700, fontSize: 13 }}>{heading}</p>
        <p>{content}</p>
      </div>
      {isClicked && (
        <div className="swift-accounts-strategy-delete">
          <p onClick={handleDelete}>Delete</p>
        </div>
      )}
    </div>
  );
};

export default Strategy;
