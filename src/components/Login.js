import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Login.css';

const Login = ({ switchToSignup }) => {
  const [hovered, setHovered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [inputFocus, setInputFocus] = useState({ email: false, password: false });

  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Login submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill both fields');
      triggerShake();
      return;
    }
    // Implement the login functionality here (for example, using a local authentication method)
    if (email !== "test@example.com" || password !== "password") {
      setError('Invalid email or password');
      triggerShake();
    } else {
      // Proceed with login success
      console.log("Logged in successfully!");
    }
  };

  // Forgot password submit handler
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setResetMsg('');
    if (!resetEmail.trim()) {
      setResetMsg('Please enter your email address.');
      return;
    }
    setResetMsg('Password reset email sent! Check your inbox.');
  };

  return (
    <div className="bg-container">
      <motion.div
        className={`frame ${shake ? 'shake' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ scale: 0.95, opacity: 0.7 }}
        animate={{
          scale: hovered ? 1.05 : 0.95,
          opacity: hovered ? 1 : 0.7,
          borderImageSlice: 1,
          borderImageSource: hovered
            ? 'linear-gradient(270deg, #00ff00, #00ffaa, #00ff00)'
            : 'linear-gradient(270deg, #003300, #003300)',
          transition: { duration: 0.5 },
        }}
        style={{ borderWidth: '3px', borderStyle: 'solid' }}
      >
        <motion.h2
          className="title flicker"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          {forgotMode ? 'Reset Password' : 'LOGIN TO CONTROL PANEL'}
        </motion.h2>

        {/* Error & Reset messages */}
        {!forgotMode && error && hovered && (
          <motion.p
            className="error-msg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        {forgotMode && resetMsg && (
          <motion.p
            className="reset-msg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ color: resetMsg.startsWith('Error') ? 'red' : 'lime' }}
          >
            {resetMsg}
          </motion.p>
        )}

        <AnimatePresence>
          {!forgotMode && hovered && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="form-section"
            >
              <motion.input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                onFocus={() => setInputFocus({ ...inputFocus, email: true })}
                onBlur={() => setInputFocus({ ...inputFocus, email: false })}
                className={inputFocus.email ? 'input-glow' : ''}
              />
              <motion.input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setInputFocus({ ...inputFocus, password: true })}
                onBlur={() => setInputFocus({ ...inputFocus, password: false })}
                className={inputFocus.password ? 'input-glow' : ''}
              />
              <motion.button
                type="submit"
                className="btn-glow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                LOGIN
              </motion.button>
            </motion.form>
          )}

          {forgotMode && hovered && (
            <motion.form
              onSubmit={handleResetSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="form-section"
            >
              <motion.input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoFocus
                className="input-glow"
              />
              <motion.button
                type="submit"
                className="btn-glow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Reset Link
              </motion.button>
              <motion.button
                type="button"
                className="btn-glow"
                style={{ marginTop: '12px', backgroundColor: '#444' }}
                onClick={() => {
                  setForgotMode(false);
                  setResetMsg('');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Login
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {!forgotMode && (
          <motion.p
            className="switch-text"
            style={{ opacity: hovered ? 1 : 0.3, marginTop: '18px' }}
            transition={{ duration: 0.3 }}
          >
            Forgot your password?{' '}
            <span
              onClick={() => {
                setForgotMode(true);
                setError('');
              }}
              style={{ cursor: 'pointer', color: '#33ff33', textDecoration: 'underline' }}
            >
              Reset here
            </span>
          </motion.p>
        )}

        <motion.p
          className="switch-text"
          style={{ opacity: hovered ? 1 : 0.3, marginTop: '12px' }}
          transition={{ duration: 0.3 }}
        >
          Don’t have an account?{' '}
          <span
            onClick={switchToSignup}
            style={{ cursor: 'pointer', color: '#33ff33', textDecoration: 'underline' }}
          >
            Sign up
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
