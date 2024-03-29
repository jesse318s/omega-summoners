import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "mdb-ui-kit";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Reset from "./pages/Reset";
import store from "./store/index";
import { Provider } from "react-redux";

// stage and lobby (lazy loaded imports)
const Stage = lazy(() => import("./pages/Stage"));
const Lobby = lazy(() => import("./pages/Lobby"));

// variables for root to render elements
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* redux provider wrapper */}
    <Provider store={store}>
      {/* wrapper for routes that render components */}
      <BrowserRouter>
        {/* suspense for loading */}
        <Suspense fallback={<div className={"loading"}>Loading</div>}>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="app" element={<App />} />
            <Route path="reset" element={<Reset />} />
            <Route path="stage" element={<Stage />} />
            <Route path="lobby" element={<Lobby />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
