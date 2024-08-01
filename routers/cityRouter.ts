import axios from "axios";
import express, { Router } from "express";
import { searchCity } from "../controller/api";
import ApiError from "../entities/ApiError";

const cityRouter: Router = express.Router()

cityRouter.get("", async (req, res) => {
    if (!req.query.param)
        res.json([])
    try {
        const result = await searchCity(req.query.param as string)
        res.status(200).send(result)
    }
    catch (error) {
        if (error instanceof ApiError)
            res.status(error.status).json(error.toJSON())
        else
            res.status(500).send((error as Error).message)
    }
})
export default cityRouter