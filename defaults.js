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
            .then((collections) => {
            const defaultQuestions = require('./database_defaults/questions.json').default;
            const defaultRoles = require('./database_defaults/roles.json').default;
            const defaultSettings = require('./database_defaults/settings.json').default;
            resolve("done");
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
