"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount, load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setIsHydrated(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };


  return (
    <AuthContext.Provider value={{ token, setToken, logout, isHydrated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
