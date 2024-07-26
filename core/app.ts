import express, { Express, Request, Response } from 'express'
import cors from 'cors';
import { authMiddleware } from '../middleware/authMiddleware';
import userRouter from '../routers/userRouter';
export const app: Express = express();
app.use(cors({ origin: true, credentials: true }))
app.use((req: Request, res: Response, next: Function) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS',
    );
    next();
});

app.use(authMiddleware)
app.use("/", userRouter)
export default app
module.exports = app