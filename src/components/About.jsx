import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './About.css';

const About = () => {
  const fullText = `Hello! I’m Nayeem AL Nasip, an IT professional with a passion for cybersecurity, ethical hacking and secure web development.

This app serves as my personal companion on a journey fueled by discipline, focus and growth. It keeps me motivated, helps me track daily progress and build habits that pave the way to success.

By using this app, you can transform your goals into actionable steps and embrace a path of continuous self-improvement.

Let’s grow and succeed together!`;

  const [displayedText, setDisplayedText] = useState('');
  const typingSpeed = 40; // ms per character

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(intervalId);
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About Me</h1>
        <p className="typing-paragraph">
          {displayedText}
          {displayedText.length < fullText.length && <span className="typing-caret" />}
        </p>
        <Link to="/" className="back-btn" aria-label="Back to Dashboard">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default About;
