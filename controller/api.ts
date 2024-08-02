import axios from "axios";
import ApiError from "../entities/ApiError";
import { Location } from "../repository/location";
import { Weather } from "../repository/weather";
import { ForeCast } from "../repository/forecast";
import redis from "../core/redis";

export async function searchCity(param: string): Promise<Array<Omit<Location, "tz_id">>> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_KEY}&q=${param}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return await axios.request(config)
        .then((response) => {
            return response.data as Array<Omit<Location, "tz_id">>
        })
        .catch((error) => {
            const data = error.response.data
            throw new ApiError(error.response.status, "Error on search City", data.message)
        })
}
export async function getWeatherToday(location: string): Promise<Weather> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${location}&days=${"1"}&aqi=no`,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const cachedLocation = await redis.get(`location/${location}`)
    return await axios.request(config)
        .then((response) => {
            if (cachedLocation)
                redis.set(`weather/${cachedLocation}`, JSON.stringify(response.data))
            else
                redis.set(`weather/${location}`, JSON.stringify(response.data))
            return response.data
        })
        .catch((error) => {
            const data = error.response.data
            throw new ApiError(error.response.status, "Error on get weather today", data.message)
        });
}

export async function getWeatherForecast(location: string, day: number): Promise<Array<Weather | { forecast: ForeCast }>> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}&q=${location}&days=${day}&aqi=no&alerts=no`,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const cachedLocation = await redis.get(`location/${location}`)

    return await axios.request(config)
        .then((response) => {
            if (cachedLocation)
                redis.set(`weather/${cachedLocation}`, JSON.stringify(response.data))
            else
                redis.set(`weather/${location}`, JSON.stringify(response.data))
            return response.data as Array<Weather | { forecast: ForeCast }>
        })
        .catch((error) => {
            const data = error.response.data
            throw new ApiError(error.response.status, "Error on get weather today", data.message)
        });
}