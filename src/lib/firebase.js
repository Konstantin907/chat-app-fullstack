// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-c54fb.firebaseapp.com",
  projectId: "reactchat-c54fb",
  storageBucket: "reactchat-c54fb.appspot.com",
  messagingSenderId: "1088357880775",
  appId: "1:1088357880775:web:30d5efbaba9e0649cbffe2",
  measurementId: "G-7MY0BTCHLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()