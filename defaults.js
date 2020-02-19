"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// JSON database
let mongoClient;
let db;
module.exports.set = (config) => {
    const mongo = require("mongodb").MongoClient;
    return new Promise((resolve, reject) => {
        mongo
            .connect(config.url)
            .then((client) => {
            mongoClient = client;
            return client.db(config.db);
        })
            .then((database) => {
            db = database;
            return database.collections();
        })
            .then((collections) => {
            const allCollections = collections.map((item) => item.name);
            if (!allCollections.includes(config.collection)) {
                return db.createCollection(config.collection);
            }
        })
            .catch((error) => {
            reject(error);
        })
            .finally(() => {
            if (mongoClient.isConnected()) {
                mongoClient.close();
            }
        });
    });
};
