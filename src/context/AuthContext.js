import React, { createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth"; // Firebase auth functions
import { auth } from "../firebase"; // Firebase auth instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth স্টেট চেঞ্জ হলে শোনার জন্য
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase সাইন আপ ফাংশন
  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return true;
    } catch (error) {
      console.error("Signup error:", error.message);
      return false;
    }
  };

  // Firebase লগইন ফাংশন
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return true;
    } catch (error) {
      console.error("Login error:", error.message);
      return false;
    }
  };

  // Firebase লগআউট ফাংশন
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // Firebase পাসওয়ার্ড রিসেট ফাংশন
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Password reset email sent!" };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
