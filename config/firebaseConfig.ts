import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"
import firebase_admin from 'firebase-admin'
import { getAuth } from "firebase-admin/auth"
// Your web app's Firebase configuration
const fb = initializeApp({
    credential: applicationDefault(),
    projectId: 'intern-b6fe6'
})
export const db = getFirestore(fb)
export const auth = getAuth(fb)