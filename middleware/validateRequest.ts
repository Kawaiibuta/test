import { NextFunction, Request, Response } from "express"
import { searchCity } from "../controller/api"
import ApiError from "../entities/ApiError"
import redis from "../core/redis"

export const validateWeatherRequest = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.location)
        res.status(400).send("Missing param query in url.")
    else {
        try {

            const result = await searchCity(req.query.location as string)
            if (result.length == 0)
                res.status(400).send("Cannot find the city near your location.")
            else {
                const saveResult = await redis.set(`location/${req.query.location!}`, result[0].url)
                next()
            }
        } catch (error) {
            if (error instanceof ApiError)
                res.status(error.status).json(error.toJSON())
            else
                res.status(500).send((error as Error).message)
        }
    }

}
