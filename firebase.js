import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqDWdoKZQypzvr84_Qfpl2-kXjLkgm8X0",
  authDomain: "charantours-c04f9.firebaseapp.com",
  projectId: "charantours-c04f9",
  storageBucket: "charantours-c04f9.firebasestorage.app",
  messagingSenderId: "739612302537",
  appId: "1:739612302537:web:877c8f7d2dab17b6858118",
  measurementId: "G-7N7QW1GLZ4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);