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
  email_id,
  edithandler,
  deletehandler
}) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    // console.log("delete", id);

    // const data = await ServerRequest({
    //   method: "delete",
    //   URL: `/strategy/`,
    //   data: { id: id },
    // });

    // if (data.server_error) {
    //   alert("error");
    // }

    // if (data.error) {
    //   alert("error1");
    // }
    // setChange(Math.random());
    deletehandler(id);
  };

  const handleEdit = async () => {
    // console.log("delete", id);

    // navigate(`/accounts/dashboard/addstrategy/${id}`,{
    //   state: {email_id: email_id},
    // });
    // setChange(Math.random());
    edithandler(id);
  }
  
  return (
<div className={`swift-accounts-strategy ${isClicked ? 'swift-accounts-strategy-active' : ''}`}>
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
          <p>Strategy ID: {id}</p>
          <div>
          <p onClick={handleEdit}>Edit</p>
          <p onClick={handleDelete}>Delete</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Strategy;
