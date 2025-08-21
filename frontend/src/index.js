import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Hours from "./pages/Hours";
import Users from "./pages/Users";
import ShopList from "./pages/ShopList";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<Login/>}/>
            <Route path={"/home"} element={<Home/>}/>
            <Route path={"/hours"} element={<Hours/>}/>
            <Route path={"/users"} element={<Users/>}/>
            <Route path={"/shopList"} element={<ShopList/>}/>
        </Routes>
    </BrowserRouter>
);