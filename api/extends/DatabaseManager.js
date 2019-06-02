"use strict";

const DATABASE = require("enmap");
const { readdirSync } = require("fs");
const format = ["png", "jpeg", "jpg", "webp", "gif"];

class DatabaseManager {
    constructor() {
        this.database = new DATABASE({
            name: "path_img",
            dataDir: "./api/data/path_img/"
        });
    }

    async init(items) {
        await this.database.defer
        .catch((e) => {
            console.log(`[DatabaseManager]: Error Initialize Database "path_img" ${e.stack || e}`);
            process.exit(1);
        });
        console.log("[DatabaseManager]: Database \"path_img\" initialized");
        items.forEach((category) => {
            this.check(category);
        });
    }

    check(category) {
        if (!this.database.has(category)) {
            this.database.set(category, {
                path: []
            });
        }
        const folders = readdirSync(`./api/storage/${category}`);
        const data = this.database.get(category);
        let count = 0;

        folders.forEach((item) => {
            const extendFile = item.split(".")[1];
            if (!data.path.includes(`${category}/${item}`) && format.includes(extendFile)) {
              count++;
              data.path.push(`${category}/${item}`);
            }
        });
        this.database.set(category, data);
        console.log(`[DatabaseManager]: ${count} Images ${category} added`);
    }

    random(category) {
        if (!this.database.has(category)) {
            return console.log(`[DatabaseManager]: Error Database "path_img", [type: ${category}] not found`);
        }
        const items = this.database.get(category).path;
        const random = Math.floor(Math.random() * items.length);
        return items[random];
    }

}
module.exports = new DatabaseManager();
