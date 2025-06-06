// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_-Ft2YIaOVls8GaNXZEqJ7eajrTHlycc",
  authDomain: "asep-2-8f6ab.firebaseapp.com",
  projectId: "asep-2-8f6ab",
  storageBucket: "asep-2-8f6ab.appspot.com", // fixed typo: should be "appspot.com"
  messagingSenderId: "1040832966708",
  appId: "1:1040832966708:web:b1f189e416a8d3a535da61",
  measurementId: "G-3KD0S1ZK8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // optional: always ask to pick account

// Export what you need in your components
export { auth, provider, signInWithPopup, signOut };
