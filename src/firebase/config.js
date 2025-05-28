import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzPk250f2xxt-o3VWVkGNEzMFJkYKk8PI",
  authDomain: "swim-test-app.firebaseapp.com",
  projectId: "swim-test-app",
  storageBucket: "swim-test-app.firebasestorage.app",
  messagingSenderId: "546910485794",
  appId: "1:546910485794:web:4ff86efa8c824fd92d797b",
  measurementId: "G-1MWPHVP4Q2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);