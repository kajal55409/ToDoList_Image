import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAN_1x2QyhOe8EUdPaoknLCeWj0_DKRwk0",
  authDomain: "to-do-list-ebf23.firebaseapp.com",
  projectId: "to-do-list-ebf23",
  storageBucket: "to-do-list-ebf23.appspot.com",
  messagingSenderId: "695900051498",
  appId: "1:695900051498:web:3f66741416bb7f2da14b53",
  measurementId: "G-QM3BJ8HJY9",
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
