const BackOfficeBodyRight = ({ currentpage }) => {
  return (
    (currentpage == "edit" || currentpage == "preview") && (
      <div className="swift-back-office-body-right">Right</div>
    )
  );
};

export default BackOfficeBodyRight;
