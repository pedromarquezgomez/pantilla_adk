// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh32X4xwU9lMP2uH-yJOERza2B9cm5EF4",
  authDomain: "hosteler-ia.firebaseapp.com",
  projectId: "hosteler-ia",
  storageBucket: "hosteler-ia.firebasestorage.app",
  messagingSenderId: "171179711118",
  appId: "1:171179711118:web:e41d62f13d525a20d9c7df",
  measurementId: "G-9NBTNPE1RS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 