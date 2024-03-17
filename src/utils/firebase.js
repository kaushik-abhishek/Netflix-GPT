// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwQk6ONorIrUW-oLHcvkkQ21MBA_4S3XA",
  authDomain: "netflixgpt-16634.firebaseapp.com",
  projectId: "netflixgpt-16634",
  storageBucket: "netflixgpt-16634.appspot.com",
  messagingSenderId: "709227755526",
  appId: "1:709227755526:web:40c64c29b96c1d8f16ab87",
  measurementId: "G-50M4N92DJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);