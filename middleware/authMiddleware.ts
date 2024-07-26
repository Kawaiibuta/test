import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseConfig";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    //TODO: Add logic to check authentication of the request
    const token = req.header("Authorization")
    if (!(token && token.split(" ")[1]))
        res.status(401).send("Missing token")
    else auth.verifyIdToken(token!.split(" ")[1]).then((decodedToken) => next()).catch((error) => {
        console.log(error)
        res.status(401).send((error as FirebaseAuthError).message)
    })
}