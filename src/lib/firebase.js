import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBO1Uq6OFz8piouLlPvKRHHRmmpKZAGH74",
  authDomain: "crispr-eye-care.firebaseapp.com",
  projectId: "crispr-eye-care",
  storageBucket: "crispr-eye-care.firebasestorage.app",
  messagingSenderId: "672088910476",
  appId: "1:672088910476:web:d0cb1e85281a4afa3769a9"
};

// Initialize Firebase and the Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
