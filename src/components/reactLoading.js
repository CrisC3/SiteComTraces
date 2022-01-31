import React from "react";
import ReactLoading from "react-loading";

function DisplayLoading({ children, type, color }) {
  return (
    <ReactLoading type={type} color={color} height={"5%"} width={"5%"}>
      {children}
    </ReactLoading>
  );
}

export default DisplayLoading;
