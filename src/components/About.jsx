import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const fullText = `Hello! I am Nayeem AL Nasip, an IT professional passionate about cybersecurity, ethical hacking, and secure web development.

This app is my personal companion on a journey of discipline, focus, and growth. It helps me stay motivated, track daily progress, and build habits that lead to success.

By using this app, you too can turn your goals into actionable steps and embrace continuous self-improvement.

Let's grow together!`;

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
        <a href="/" className="back-btn" aria-label="Back to Dashboard">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default About;
