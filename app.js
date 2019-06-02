"use strict";

const endpoints = require("./package.json").endpoints;

const CORE_API = require("./api/core/api");

const morgan = require("morgan");
const express = require("express");
const { urlencoded, json } = require("body-parser");

const app = express();

app.enable("trust proxy")
.use(morgan("dev"))
.use("/api", CORE_API)
.use(urlencoded({
    extended: false
}))
.use(json());
endpoints.forEach((item) => {
    app.use(`/v1/${item}`, express.static(`api/storage/${item}`));
});

module.exports = app;
