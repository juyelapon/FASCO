import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fasco-a4597.firebaseapp.com",
  projectId: "fasco-a4597",
  storageBucket: "fasco-a4597.firebasestorage.app",
  messagingSenderId: "451181227887",
  appId: "1:451181227887:web:7d10ffd867705748e2c29a",
  measurementId: "G-N3WGKWBD9E"
};

export const app = initializeApp(firebaseConfig);