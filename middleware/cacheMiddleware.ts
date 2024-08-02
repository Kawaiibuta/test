import { NextFunction, Request, Response } from "express"
import redis from "../core/redis"
import { ForeCast } from "../repository/forecast"
import onFinished from "on-finished"
export const checkCachedWeather = async (req: Request, res: Response, next: NextFunction) => {
    const cachedLocation = await redis.get(`location/${req.query.location}`)
    let cachedWeather: string | null = null
    // Check if the location is search and saved in the location or not
    // If not, forward
    // If exist, check redis for the cached weather
    if(!cachedLocation)
        next()
    else
        cachedWeather = await redis.get(`weather/${cachedLocation}`)
    //Check the cached weather for the location
    if (!cachedWeather)
        next()

    else {
        //If the data is cached, parse it into JSON
        const data = JSON.parse(cachedWeather)
        //Check if it satisfy the request or not.
        //For example, the cached data only forecast 3 day but the request need 5 day forecast
        if (req.url.includes("weather-forecast") && !data.forecast || (data.forecast as ForeCast).forecastday.length != Number.parseInt(req.query.days as string ?? "5"))
            next()
        else {
            res.status(200).send(data)
        }
    }
}