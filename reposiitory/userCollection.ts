import { DocumentSnapshot, Timestamp } from "firebase-admin/firestore";
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
        return new User(snapshot.id, data.name, data.dateOfBirth.toDate(), data.email);
    }
    toObject(containId = true): Object {
        if (containId)
            return { id: this.id, name: this.name, dateOfBirth: this.dateOfBirth.toISOString(), email: this.email }
        return { name: this.name, dateOfBirth: this.dateOfBirth.toISOString(), email: this.email }
    }
    static fromJson(json: any) {
        if (json.name && json.email && json.dateOfBirth) {
            const dOB = new Date(Date.parse(json.dateOfBirth))
            if (!(dOB instanceof Date) || isNaN(dOB.getTime()))
                throw new Error("Date of Birth is invalid")
            return new User(json.id ?? null, json.name, dOB, json.email)

        }
        throw new Error("Missing field")
    }
}
export default User
