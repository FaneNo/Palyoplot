import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./token";


import Home from "./pages/home";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Profile from "./pages/profile";
import History from "./pages/history";
import Navbar from "./components/Navbar";
import BottomNav from "./components/bottomNav";
import About from "./pages/about";
import Tutorial from "./pages/tutorial";
import AuthorizedNav from "./components/authorizedNav";
import { AuthProvider } from "./contexts/authContext";
import {jwtDecode} from "jwt-decode"
import api from "./api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./token";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";



function Logout() {
  //localStorage.clear();
  const { logout } = useContext(AuthContext);
  logout();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  //localStorage.clear();
  return <Registration />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthorizedNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<RegisterAndLogout />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={() => window.location.href = "http://127.0.0.1:8000/password-reset/"} />
          <Route path="/logout" element={<Logout />} />
          <Route 
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <BottomNav />
      </Router>
    </AuthProvider>
  );
}

export default App;