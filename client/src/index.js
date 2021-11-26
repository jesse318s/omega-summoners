import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './home';
import Reset from './reset';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="app" element={<App />} />
      <Route path="reset" element={<Reset />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
