// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIygXogN1RtGgJl2OwVoBcbwz8Yggm6TM",
  authDomain: "rfahmi-id.firebaseapp.com",
  databaseURL: "https://rfahmi-id.firebaseio.com",
  projectId: "rfahmi-id",
  storageBucket: "rfahmi-id.appspot.com",
  messagingSenderId: "572854027072",
  appId: "1:572854027072:web:fae74107a82b19d40cb0a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { app, firestore };

