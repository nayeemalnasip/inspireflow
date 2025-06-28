// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function (local implementation)
  const login = (email, password) => {
    if (email === "test@example.com" && password === "password") {
      const loggedInUser = { email };
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  // Signup function (local implementation)
  const signup = (email, password) => {
    if (email && password) {
      // Simulate successful signup
      const newUser = { email };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return true;
    }
    return false;
  };

  // Logout function (local implementation)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Reset Password (local simulation)
  const resetPassword = (email) => {
    // Simulate password reset
    return email ? { success: true } : { success: false, error: "Invalid email" };
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
