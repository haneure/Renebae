// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjngcBKBs6tXOvaj0QvjOqa9xKFiCGNxc",
  authDomain: "renebae-f7b76.firebaseapp.com",
  projectId: "renebae-f7b76",
  storageBucket: "renebae-f7b76.appspot.com",
  messagingSenderId: "424231100104",
  appId: "1:424231100104:web:2c8439e52377dd61bb4ffd",
  measurementId: "G-0BX6BY0Y9G"
};

// Initialize Firebase
const firebaseInit = initializeApp(firebaseConfig);

export default firebaseInit;