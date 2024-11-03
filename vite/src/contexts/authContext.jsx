// authContext.js
import React, { createContext, useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import api from "../api";
//import * as jwtDecode  from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsLoggedIn(false);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsLoggedIn(true);
      } else {
        logout();
      }
    } catch (error) {
      console.log(error);
      logout();
    }
  };

  function parseJwt(token) {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = '';
  
    try {
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  
    return JSON.parse(jsonPayload);
  }
  

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      const decoded = parseJwt(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        refreshToken();
      } else {
        setIsLoggedIn(true);
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
