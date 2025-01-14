import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Tiptap from "./Tiptap";
import reportWebVitals from "./reportWebVitals";
// import App from "./Static";

ReactDOM.render(
  <React.StrictMode>
    <Tiptap />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
