import express, { Router } from "express"
import { loadHtmlFile, sendEmail } from "../controller/emailApis"
import redis from "../core/redis"
import randomatic from "randomatic"

const emailRouter: Router = express.Router()

emailRouter.post("/subscribe", async (req, res, next) => {
    console.log(req.body)
    if (!req.body.email)
        res.status(400).send("Missing email field")
    else {
        if (await redis.get(`user/${req.body.email}`))
            res.status(409).send("The email has already been subscribed.")
        else {
            let html = await loadHtmlFile("statics/emailVerification.html")
            const key = randomatic("A0", 10)
            await redis.set(key, req.body.email as string)
            redis.set(`user/${req.body.email}`, 0)
            html = html.replace("verification_link", `${process.env.FRONTEND_URL}verification?key=${key}&expire=${Date.now() + 300000}`)
            sendEmail(process.env.GMAIL_USER ?? "", req.body.email as string, "Confirmation mail for Weather Report Subscription", html)
            res.status(200).send("OK")
        }
    }
})
emailRouter.post("/verify", async (req, res, next) => {
    if (!req.body.expire || !req.body.key)
        res.status(400).send('Missing body in the url')
    else {
        if (Number.parseInt(req.body.expire as string) < Date.now()) {
            console.log(`${Date.now()} is bigger than ${Number.parseInt(req.body.expire as string)}`)
            res.status(400).send("The verification link is expired")
        }
        else {
            console.log("Start verify the key in the redis db")
            const user = await redis.get(`${req.body.key}`)
            await redis.del(`${req.body.key}`)
            if (user) {
                redis.set(`user/${user}`, 1)
                res.status(200).send("OK")
            }
            else
                res.status(200).send("OK")
        }
    }
})
emailRouter.post("/unsubscribe", async (req, res, next) => {
    if (!req.body.email)
        res.status(400).send("Missing email field")
    else {
        const user = await redis.get(`user/${req.body.email}`)
        if (user) {
            await redis.del(`user/${req.body.email}`)
            res.status(200).send("OK")
        }
        else
            res.status(404).send("The email is not subscribed")
    }

})
export default emailRouter

