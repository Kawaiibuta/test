import {  initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB7seCnJU4kFGqh0tZtEKj7mvMAmI6vrHo",
    authDomain: "intern-b6fe6.firebaseapp.com",
    projectId: "intern-b6fe6",
    storageBucket: "intern-b6fe6.appspot.com",
    messagingSenderId: "900068023995",
    appId: "1:900068023995:web:2c32b51a269985cc3a939e"
  };
initializeApp(firebaseConfig)
const db = getFirestore()
export default db