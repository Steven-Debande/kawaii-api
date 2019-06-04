"use strict";

const endpoints = require("../../package.json").endpoints;
const baseURL = process.argv.includes("--local") ? "localhost:5025" : "Your domain";

const { Router } = require("express");
const rateLimite = require("express-rate-limit");
const database = require("../extends/DatabaseManager");

const requests = rateLimite({
    windowMs: 1 * 60 *1000,
    max: 125,
    message: {
        status: 429,
        message: "Too many requests"
    }
});

const router = Router();

router.get(["/", "/v1"], (req, res) => {
    res.status(200).json({
        method: "GET",
        baseapi: `${baseURL}/api/v1/:endpoint`,
        endpoints: endpoints
    });
})
.get("/v1/:endpoint", requests, (req, res) => {
    if (!endpoints.includes(req.params.endpoint)) {
        return res.status(404).json({
            message: `"${req.params.endpoint}" invalid endpoint`
        });
    }
    const random = database.random(req.params.endpoint);
    res.status(200).json({
        url: `${baseURL}/v1/${random}`
    });
});

module.exports = router;
