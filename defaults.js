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
            const required = Object.values(config.collections);
            const inDatabase = collections.map(item => item.collectionName);
            const toCreate = required.filter(item => !inDatabase.includes(item));
            const alreadyCreatedNames = inDatabase.filter(item => required.includes(item));
            const alreadyCreatedCollections = collections.filter(collection => alreadyCreatedNames.includes(collection.collectionName));
            return Promise.all(toCreate.map(item => db.createCollection(item)).concat(alreadyCreatedCollections.map(item => Promise.resolve(item))));
        })
            .then((dbCollections) => {
            const collections = Object.keys(config.collections);
            const defaults = collections.map(item => ({ name: config.collections[item], defaults: require(`./database_defaults/${item}.json`).default }));
            return Promise.all(defaults.map((item) => {
                const collection = dbCollections.find(col => col.collectionName == item.name);
                if (Array.isArray(item.defaults)) {
                    return collection === null || collection === void 0 ? void 0 : collection.insertMany(item.defaults);
                }
                else {
                    return collection === null || collection === void 0 ? void 0 : collection.insert(item.defaults);
                }
            }));
        })
            .then((result) => {
            resolve("Defaults Initialized");
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
