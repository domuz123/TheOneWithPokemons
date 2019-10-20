import React from "react";
import "./Modal.css";

const modal = props => (
  <div>
    <div
      className="Modal1"
      style={{
        transform: props.showed ? "translateY(0)" : "translateY(-100vh)",
        opacity: props.showed ? "1" : "0"
      }}
    >
      {props.children}
    </div>
  </div>
);

export default modal;
