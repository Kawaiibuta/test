import { Timestamp } from "firebase-admin/firestore"
import { db } from "../config/firebaseConfig"
import ApiError from "../entities/ApiError"
import User from "../repository/userCollection"
import { FirebaseError } from "firebase/app"
export async function createUser(id: string, data: User): Promise<User> {
    const userRef = db.collection("users").doc(id)
    try {
        const result = await userRef.set({ ...data.toObject(), dateOfBirth: Timestamp.fromDate(data.dateOfBirth) })
        data.id = id
        return data
    }
    catch (error) {
        if (error instanceof FirebaseError)
            throw new ApiError("Firebase error", (error as FirebaseError).message)
        throw new ApiError("Unhandled error", (error as Error).message)
    }
}
export async function getUserData(id: string): Promise<User> {
    //TODO: retrieve data from firestore 
    const userSnapshot = await db.collection("users").doc(id).get()
    if (!userSnapshot.exists) {
        throw new ApiError("Non-exist Entity", "The requested user is not existed")
    }
    return User.fromFirestore(userSnapshot)
}
export async function updateUserData(id: string, data: User): Promise<User> {
    console.log("Start update user" + id)
    const userRef = await db.collection("users").doc(id)
    var userSnapshot = await userRef.get();
    if (!userSnapshot.exists)
        throw new ApiError("Non-exist Entity", "The requested user is not existed")
    return await userRef.update({ ...data.toObject(), dateOfBirth: Timestamp.fromDate(data.dateOfBirth) }).then((value) => {
        data.id = id
        return data
    }).catch((reason) => {
        console.log(reason)
        throw new ApiError("FirebaseError", reason)
    })
}