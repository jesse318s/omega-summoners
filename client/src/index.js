import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "mdb-ui-kit";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Reset from "./pages/Reset";
import Stage1 from "./pages/Stage1";
import Lobby1 from "./pages/Lobby1";
import index from "./store/index";
import { Provider } from "react-redux";

ReactDOM.render(
  // redux provider wrapper
  <Provider store={index}>
    {/* wrapper for routes that render components */}
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="app" element={<App />} />
        <Route path="reset" element={<Reset />} />
        <Route path="stage1" element={<Stage1 />} />
        <Route path="lobby1" element={<Lobby1 />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
