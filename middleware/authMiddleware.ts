import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    //TODO: Add logic to check authentication of 
    next()
}