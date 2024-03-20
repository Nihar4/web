import React from "react";
import "../../css/Accounts/Strategy.css";
import ServerRequest from "../../utils/ServerRequest";
import { useNavigate } from "react-router-dom";

const Strategy = ({
  heading,
  content,
  isClicked,
  onClick,
  style,
  id,
  setChange,
}) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    console.log("delete", id);

    const data = await ServerRequest({
      method: "delete",
      URL: `/strategy/`,
      data: { id: id },
    });

    if (data.server_error) {
      alert("error");
    }

    if (data.error) {
      alert("error1");
    }
    setChange(Math.random());
  };

  const handleEdit = async () => {
    // console.log("delete", id);

    return navigate(`/accounts/dashboard/addstrategy/${id}`);
    // setChange(Math.random());
  };

  // console.log("Rendering Strategy:", heading, isClicked);
  return (
    <div className="swift-accounts-strategy">
      <div
        className="swift-accounts-strategy-content"
        style={style}
        onClick={onClick}
      >
        <p style={{ fontWeight: 700, fontSize: 13 }}>{heading}</p>
        <p>{content}</p>
      </div>
      {isClicked && (
        <div className="swift-accounts-strategy-delete">
          <p onClick={handleEdit}>Edit</p>
          <p onClick={handleDelete}>Delete</p>
        </div>
      )}
    </div>
  );
};

export default Strategy;
