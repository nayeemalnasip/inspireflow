import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import About from './components/About';

function AppContent() {
  const { user } = useContext(AuthContext); // AuthContext থেকে user নেওয়া হচ্ছে
  const [isSignup, setIsSignup] = useState(false); // Signup এবং Login এর মধ্যে সুইচ করা

  if (!user) {
    return isSignup ? (
      <Signup switchToLogin={() => setIsSignup(false)} />
    ) : (
      <Login switchToSignup={() => setIsSignup(true)} />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider> {/* AuthProvider এর মাধ্যমে পুরো অ্যাপ্লিকেশনকেই wrapping করা */}
      <AppContent />
    </AuthProvider>
  );
}

export default App;
