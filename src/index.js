import React from "react";
import ReactDOM from "react-dom";
import Homepage from "./Homepage/Homepage.js";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import reducer from "../src/store/reducer";
import { createStore } from "redux";
import { Provider } from "react-redux"; 


const store = createStore(reducer);
function App() {
  return (
    <div className="App">
      <Homepage />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
