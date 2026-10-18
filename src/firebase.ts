import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBPXZvp2aHloA3063wU8wcky6SK42l8a00",
  authDomain: "omoide-sugoroku.firebaseapp.com",
  databaseURL: "https://omoide-sugoroku-default-rtdb.firebaseio.com",
  projectId: "omoide-sugoroku",
  storageBucket: "omoide-sugoroku.firebasestorage.app",
  messagingSenderId: "711894091561",
  appId: "1:711894091561:web:daecc7559b451d8e8b1938",
  measurementId: "G-G71QFFXK04",
};

const app = initializeApp(firebaseConfig);


export const database = getDatabase(app);
export const auth = getAuth(app);