import db from "../config/firebaseConfig"
import User from "../reposiitory/userCollection"

export async function getUserData(id: string): Promise<User | ApiError> {
    //TODO: retrieve data from firestore 
    const userSnapshot = await db.collection("users").doc(id).get()
    if (!userSnapshot.exists) {
        throw new ApiError("Non-exist Entity", "The requested user is not existed")
    }
    return User.fromFirestore(userSnapshot)
}
export async function updateUserData(data: User): Promise<User | ApiError> {

    if (!data.id)
        throw new ApiError("No ID", "The data doesn't contain id")
    const userRef = await db.collection("users").doc(data.id)
    var userSnapshot = await userRef.get();
    if (!userSnapshot.exists)
        throw new ApiError("Non-exist Entity", "The requested user is not existed")
    return await userRef.update({...data.toObject()}).then((value) => {
        return data
    }).catch((reason) => {
        console.log(reason)
        throw new ApiError("API error", reason)
    })
}