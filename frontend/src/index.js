import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Hours from "./pages/hours/Hours";
import Users from "./pages/users/Users";
import ShopList from "./pages/shopList/ShopList";

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