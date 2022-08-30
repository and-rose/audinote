import firebase from "firebase/compat/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBlGHxBcMHmZi6R3qbAe5HKbZ5kSuuyuvY",
    authDomain: "audinote-178ed.firebaseapp.com",
    databaseURL: "https://audinote-178ed-default-rtdb.firebaseio.com",
    projectId: "audinote-178ed",
    storageBucket: "audinote-178ed.appspot.com",
    messagingSenderId: "212892198362",
    appId: "1:212892198362:web:b55a2b8d450701ee7f8ce3",
    measurementId: "G-JX8LVZ7FWF"
  };

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, firebaseApp, storage };
