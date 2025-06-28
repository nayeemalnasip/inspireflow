import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Signup.css";

const containerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -40, scale: 0.95, transition: { duration: 0.4, ease: "easeIn" } }
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: "0 0 12px #00ff00",
    transition: { yoyo: Infinity, duration: 0.6 }
  },
  tap: {
    scale: 0.95
  }
};

const inputVariants = {
  focus: {
    boxShadow: "0 0 12px #00ff00",
    borderColor: "#00ff00",
    transition: { duration: 0.3 }
  }
};

const Signup = ({ switchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Local signup logic (instead of Firebase signup)
    // In a real application, this would typically involve adding the user to your backend/database
    console.log("User signed up successfully:", { fullName, email, password });
    // For now, simulate a successful signup:
    alert("Signup successful!");
  };

  return (
    <motion.div
      className="frame"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2
        className="title flicker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        SIGN UP TO CONTROL PANEL
      </motion.h2>

      {error && <p className="error-msg shake">{error}</p>}

      <form onSubmit={handleSubmit} noValidate className="form-section">
        <motion.input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onFocus={() => setFocusedInput("fullName")}
          onBlur={() => setFocusedInput(null)}
          variants={inputVariants}
          animate={focusedInput === "fullName" ? "focus" : ""}
          required
        />
        <motion.input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
          variants={inputVariants}
          animate={focusedInput === "email" ? "focus" : ""}
          required
        />
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
          variants={inputVariants}
          animate={focusedInput === "password" ? "focus" : ""}
          required
        />
        <motion.input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setFocusedInput("confirmPassword")}
          onBlur={() => setFocusedInput(null)}
          variants={inputVariants}
          animate={focusedInput === "confirmPassword" ? "focus" : ""}
          required
        />
        <motion.button
          type="submit"
          className="btn-glow"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          SIGN UP
        </motion.button>
      </form>

      <p className="switch-text">
        Already have an account?{" "}
        <span onClick={switchToLogin} className="switch-link">
          Login
        </span>
      </p>
    </motion.div>
  );
};

export default Signup;
