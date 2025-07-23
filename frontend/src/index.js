import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Hours from "./pages/components/Hours";
import Users from "./pages/Users";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Login/>}/>
            <Route path={"/home"} element={<Home/>}/>
            <Route path={"/hours"} element={<Hours/>}/>
            <Route path={"/users"} element={<Users/>}/>
        </Routes>
    </BrowserRouter>
);