import express, { Express, Request, Response } from 'express'

const app: Express = express();

app.use((req: Request, res: Response, next: Function) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST'
    );
    next();
});
export default app