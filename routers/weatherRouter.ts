import axios from "axios";
import express, { Express, Router } from "express"
import { getWeatherForecast, getWeatherToday, searchCity } from "../controller/api";
import ApiError from "../entities/ApiError";
import { validateWeatherRequest } from "../middleware/validateRequest";
import { checkCachedWeather } from "../middleware/cacheMiddleware";

const weatherRouter: Router = express.Router()

//Middleware for check location before calling to the main API
//The first middleware check for the location query and save the request to Redis
//The second middleware check for cached data
weatherRouter.use(validateWeatherRequest)
weatherRouter.use(checkCachedWeather)
weatherRouter.get("/weather-today", async (req, res) => {
    try {
        const weatherToday = await getWeatherToday(req.query.location as string)
        if (req.query.detail != "True")
            res.status(200).json({
                location: weatherToday.location,
                condition: weatherToday.current.condition,
                temp_c: weatherToday.current.temp_c,
                wind_kph: weatherToday.current.wind_kph,
                humidity: weatherToday.current.humidity
            })
        else
            res.status(200).json(weatherToday)
    }
    catch (error) {
        if (error instanceof ApiError)
            res.status(error.status).json(error.toJSON())
        else
            res.status(500).send((error as Error).message)
    }
})
weatherRouter.get("/weather-forecast", async (req, res) => {
    try {
        const result = await getWeatherForecast(req.query.location as string, req.query.day ? Number.parseInt(req.query.days as string) : 5)
        res.status(200).send(result)
    } catch (error) {
        if (error instanceof ApiError)
            res.status(error.status).json(error.toJSON())
        else
            res.status(500).send((error as Error).message)
    }
})
export default weatherRouter;

