import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXxOtbH924GGULZ-M5AtIO09cOceV92kI",
  authDomain: "twirl-and-taali.firebaseapp.com",
  projectId: "twirl-and-taali",
  storageBucket: "twirl-and-taali.firebasestorage.app",
  messagingSenderId: "759747805761",
  appId: "1:759747805761:web:3ad60090a5208b7c6a7cc0",
  measurementId: "G-RW1WJND51W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
