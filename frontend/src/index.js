import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Login/>}/>
            <Route path={"/home"}  element={<Home/>}/>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);