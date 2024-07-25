import express, {Router, Request, Response} from "express"

const userRouter:Router = express.Router();

userRouter.post("/update-user-data", (req: Request, res: Response) => {
    res.render("Update user data")
    //TODO: Addd logic
})

userRouter.get("/fetch-user-data", (req: Request, res: Response) => {
    res.send("Fetch user data")
    //TODO: Add logic
})
export default userRouter