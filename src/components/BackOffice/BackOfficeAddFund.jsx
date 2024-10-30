import { useState } from "react";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import { isEmpty } from "../../utils/Validation";
import ServerRequest from "../../utils/ServerRequest";

const BackOfficeAddFund = ({
  setAddFundName,
  addFundName,
  setCurrentPage,
  setReset,
  currentpage,
  setSelectedFund,
}) => {
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const addFund = async () => {
    if (isEmpty(addFundName)) {
      setError("Name Can not be empty");
      return;
    }
    setLoading(true);
    try {
      const data1 = await ServerRequest({
        method: "post",
        URL: `/back-office/funds/add?email=${email_id}`,
        data: { name: addFundName },
      });
      setCurrentPage("created");
      setSelectedFund(data1.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setReset(Math.random());
      }, 1000);
    }
  };

  console.log(currentpage);

  return (
    <>
      {currentpage == "add" ? (
        <div className="swift-back-office-add-fund-wrapper">
          <CustomInputError
            labelText="Please enter strategy name below."
            classnameLabel="swift-back-office-input-label"
            classnameDiv="swift-back-office-input-div"
            classnameInput="swift-back-office-input-text"
            type="text"
            name="fundName"
            placeholder="Fund Name"
            onInputChange={(name, value) => setAddFundName(value)}
            value={addFundName}
            error={error}
          />
          <div className="swift-back-office-strategy-add-btn">
            <CustomButton
              text="Add Fund"
              classname="swift-accounts-content-button"
              style={{
                width: "115px",
                fontSize: "12px",
                height: "30px",
                padding: "0",
                marginTop: "10px",
              }}
              onClick={addFund}
            />
          </div>
        </div>
      ) : (
        <div className="swift-back-office-fund-created">
          <p>Fund created.</p>
          <p>Please edit the form to populate data and information.</p>
          <div className="swift-back-office-strategy-add-btn">
            <CustomButton
              text="Edit"
              classname="swift-accounts-content-button"
              onClick={() => setCurrentPage("edit")}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BackOfficeAddFund;
