import express, { Router, Request, Response, NextFunction } from "express"
import { createUser, getUserData, updateUserData } from "../controller/api";
import User from "../repository/userCollection";
import ApiError from "../entities/ApiError";
import { auth } from "../config/firebaseConfig";
const userRouter: Router = express.Router();
userRouter.use(express.json())
userRouter.post("/update-user-data/", (req: Request, res: Response, next: NextFunction) => {
    //This is middleware to check the format of the request body
    // If it cannot be parse into a User => Invalid format
    // This split the error handling process into TypeError (middleware handle) and ApiError (Router handle)
    let body = req.body;
    try {
        User.fromJson(body)
        next()

    } catch (error) {
        console.log(error)
        if (error instanceof Error)
            res.status(400).send(error.message)
        else
            res.status(400).send("Missing some field or fields are invalid")
    }
}, (req: Request, res: Response) => {
    try {
        var user = User.fromJson(req.body)
        auth.verifyIdToken(req.header("Authorization")!.split(" ")[1]).then((decodedToken) => {
            updateUserData(decodedToken.uid, user).then((value) => {
                res.send(value.toObject())
            }).catch((error) => {
                console.log(error)
                res.status(400).send((error as ApiError).message)
            })
        })

    }
    catch (error) {
        console.log(error)
        if (error instanceof Error)
            res.status(400).send(error.message)
    }
})

userRouter.get("/fetch-user-data/", (req: Request, res: Response) => {
    auth.verifyIdToken(req.header("Authorization")!.split(" ")[1]).then((decodedToken) => {
        getUserData(decodedToken.uid).then((value) => {
            res.send(value.toObject())
        }).catch((error) => {
            console.log(error)
            res.status(400).send((error as ApiError).message)
        })
    })

})
userRouter.post("/create-user", (req: Request, res: Response) => {
    auth.verifyIdToken(req.header("Authorization")!.split(" ")[1]).then((decodedToken) => {
        const data = req.body
        createUser(decodedToken.uid, User.fromJson(data)).then((value) => {
            return res.send(value.toObject())
        }).catch((error) => {
            console.log(error)
            if (error instanceof ApiError) { return res.status(400).send((error as ApiError).message); }
            return res.status(500).send("Unknown exception. "+ (error as Error).message)
        })
    })
})
export default userRouter