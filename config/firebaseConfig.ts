import {  initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"
// Your web app's Firebase configuration
const fb = initializeApp()
const db = getFirestore(fb)
export default db