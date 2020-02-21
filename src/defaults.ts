import { Db, MongoClient, Collection } from "mongodb";

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
      .then((collections: Array<Collection>) => {
        const required: string[] = Object.values(config.collections);
        const inDatabase: string[] = collections.map(item => item.collectionName);
        const toCreate: string[] = required.filter(item => !inDatabase.includes(item));
        const alreadyCreatedNames: string[] = inDatabase.filter(item => required.includes(item))
        const alreadyCreatedCollections: Array<Collection> = collections.filter(collection => alreadyCreatedNames.includes(collection.collectionName));
        return Promise.all(toCreate.map(item => db.createCollection(item)).concat(alreadyCreatedCollections.map(item => Promise.resolve(item))))
      })
      .then((collections : Collection[]) => {
        const defaultQuestions = require('./database_defaults/questions.json').default
        const defaultRoles = require('./database_defaults/roles.json').default;
        const defaultSettings = require('./database_defaults/settings.json').default;
        resolve("done")
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
