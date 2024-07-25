import { DocumentSnapshot } from "firebase-admin/firestore";
class User {
    id: string | undefined;
    name: string;
    dateOfBirth: Date;
    email: string;
    constructor(id: string | undefined = undefined, name: string, dateOfBirth: Date, email: string) {
        this.id = id;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
    }
    static fromFirestore(
        snapshot: DocumentSnapshot,
    ): User {
        const data = snapshot.data()!;
        return new User(data.id, data.name, data.dataOfBirth, data.email);
    }
    toObject(): Object {
        throw new Error("Method not implemented.");
    }
}
export default User
