import React from "react";
import ReactDOM from "react-dom";
import Homepage from "./Homepage/Homepage.js";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Homepage />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
