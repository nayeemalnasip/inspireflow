// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_MQ37gFNVdcvhUJqm7eINRTEGV7G7BD4",
  authDomain: "inspireflow-60396.firebaseapp.com",
  projectId: "inspireflow-60396",
  storageBucket: "inspireflow-60396.firebasestorage.app",
  messagingSenderId: "266880951543",
  appId: "1:266880951543:web:45e98524716fe6fcd05ff2",
  measurementId: "G-L98Q81WN9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);  // Firebase Authentication instance

// Export auth for use in your application
export { auth };
