// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGeszGExwkEMNCR0pz8io-xhAGq2FHZqg",
  authDomain: "chat-bot-pro-24a5b.firebaseapp.com",
  projectId: "chat-bot-pro-24a5b",
  storageBucket: "chat-bot-pro-24a5b.firebasestorage.app",
  messagingSenderId: "650503842803",
  appId: "1:650503842803:web:593bc28a0c05b06a3fc086",
  measurementId: "G-FQZHS5SWSG",
};

// Initialize Firebase
export const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
