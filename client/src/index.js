import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'mdb-ui-kit';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/home';
import Reset from './components/reset';

ReactDOM.render(
  <BrowserRouter>
    {/* routes for rendering components */}
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