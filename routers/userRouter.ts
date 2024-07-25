import express, { Router, Request, Response, NextFunction } from "express"
import { getUserData, updateUserData } from "../controller/api";
import User from "../reposiitory/userCollection";
import ApiError from "../entities/ApiError";
const userRouter: Router = express.Router();
userRouter.use(express.json())
userRouter.post("/update-user-data", (req: Request, res: Response, next: NextFunction) => {
    //This is middleware to check the format of the request body
    // If it cannot be parse into a User => Invalid format
    // This split the error handling process into TypeError (middleware handle) and ApiError (Router handle)
    let body = req.body;
    try {
        User.fromJson(body)
    } catch (error) {
        if(error instanceof Error)
            res.status(400).send(error.message)
        else
            res.status(400).send("Missing some field or fields are invalid")
    }
    next()
}, (req: Request, res: Response) => {
    try {
        var user = User.fromJson(req.body)
        updateUserData(user).then((value) => {
            res.send(value.toObject())
        }).catch((error) => {
            res.status(400).send((error as ApiError).message)
        })
    }
    catch (error) {
        if(error instanceof Error)
            res.status(400).send(error.message)
    }
})

userRouter.get("/fetch-user-data/:id", (req: Request, res: Response) => {
    getUserData(req.params.id).then((value) => {
        res.send(value.toObject)
    }).catch((error) => {
        res.status(400).send((error as ApiError).message)
    })
})
export default userRouter