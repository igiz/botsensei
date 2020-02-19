import { Db, MongoClient } from "mongodb";

// JSON database
let mongoClient: MongoClient;
let db: Db;

module.exports.set = (config: DatabaseConfig) => {
  const mongo = require("mongodb").MongoClient;
  return new Promise((resolve, reject) => {
    mongo
      .connect(config.url)
      .then((client: MongoClient) => {
        mongoClient = client;
        return client.db(config.db);
      })
      .then((database: Db) => {
        db = database;
        return database.collections();
      })
      .then((collections: any) => {
        const allCollections = collections.map((item: any) => item.name);
        if (!allCollections.includes(config.collection)) {
          return db.createCollection(config.collection);
        }
      })
      .catch((error: any) => {
        reject(error);
      })
      .finally(() => {
        if (mongoClient.isConnected()) {
          mongoClient.close();
        }
      });
  });
};
