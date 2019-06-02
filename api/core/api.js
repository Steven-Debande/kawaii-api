"use strict";

const endpoints = require("../../package.json").endpoints;
const baseURL = process.argv.includes("--local") ? "localhost:5025" : "Your domain";

const { Router } = require("express");
const RateLimite = require("express-rate-limit");
const Database = require("../extends/DatabaseManager");

const requests = RateLimite({
    windowMs: 1 * 60 *1000,
    max: 125,
    message: {
        status: 429,
        message: "Too many requests"
    }
});

const router = Router();

router.get(["/", "/v1"], (req, res) => {
    const dataItems = {
        infos: {
            method: "GET",
            base_api: `${baseURL}/api/v1/:endpoint`,
            endpoints: endpoints
        }
    };
    res.status(200).json(dataItems);
})
.get("/v1/:endpoint", requests, (req, res) => {
    if (!endpoints.includes(req.params.endpoint)) {
        return res.status(404).json({
            message: `"${req.params.endpoint}" invalid endpoint`
        });
    }
    const random = Database.random(req.params.endpoint);
    res.status(200).json({
        url: `${baseURL}/v1/${random}`
    });
});

module.exports = router;
