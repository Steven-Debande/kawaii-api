"use strict";

const app = require("./app");
const { createServer } = require("http");
const endpoints = require("./package.json").endpoints;
const Database = require("./api/extends/DatabaseManager");

Database.init(endpoints);

createServer(app).listen(5025, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("[Server]: Server initialized and Started");
});
