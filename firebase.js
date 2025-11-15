import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDilRX3cC45QIQvIlC70mB2N_gd0Pc7oAo",
  authDomain: "the-mmnger.firebaseapp.com",
  projectId: "the-mmnger",
  storageBucket: "the-mmnger.firebasestorage.app",
  messagingSenderId: "525558933868",
  appId: "1:525558933868:web:a9ded787b6350b72916b49"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
