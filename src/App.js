// src/App.js

import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import About from './components/About';  // Add About Component
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AppContent() {
  const { user, login, signup } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');  // Redirect to Dashboard when logged in
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      navigate('/');  // Navigate to Dashboard after login
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSignup = async (email, password, fullName) => {
    const result = await signup(email, password);
    if (result && result.user) {
      await updateProfile(result.user, {
        displayName: fullName,
      });
      navigate('/');  // Navigate to Dashboard after signup
    } else {
      setError('Signup failed. Please try again');
    }
  };

  // If user is not logged in, show login/signup forms
  if (!user) {
    return isSignup ? (
      <Signup
        switchToLogin={() => setIsSignup(false)}
        handleSignup={handleSignup}
        error={error}
      />
    ) : (
      <Login
        switchToSignup={() => setIsSignup(true)}
        handleLogin={handleLogin}
        error={error}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />  {/* About page route */}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
