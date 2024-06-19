import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function Auth({ children }) {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setRedirect(false);
    } else {
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/404" />;
  }

  return children;
}

export default Auth;
