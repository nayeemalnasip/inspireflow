import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import "./Signup.css";


const Signup = ({ switchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const checkPasswordStrength = (pass) => {
    if (pass.length === 0) return "";
    if (pass.length < 6) return "Weak";
    if (pass.length < 12) return "Medium";
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(checkPasswordStrength(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Set display name to Firebase user
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Optional: Confirm update with log
      console.log("User created with name:", userCredential.user.displayName);

      alert("Signup successful!");

      // Reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength("");

    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-container">
      <motion.div
        className="frame"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="title flicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          SIGN UP TO CONTROL PANEL
        </motion.h2>

        {error && <p className="error-msg shake">{error}</p>}

        <form onSubmit={handleSubmit} className="form-section">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span className="password-toggle-btn" onClick={toggleShowPassword}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="eye-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00ff00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {showPassword ? (
                  <>
                    <path d="M17.94 17.94 6.06 6.06" />
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                  </>
                )}
              </svg>
            </span>
          </div>

          {passwordStrength && (
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
              {passwordStrength}
            </p>
          )}

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-glow" disabled={loading}>
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={switchToLogin} className="switch-link">
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
