import { Db, MongoClient, Collection, BulkWriteResult } from "mongodb";
import stringHash from "string-hash"

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
      .then((dbCollections : Collection[]) => {
        const collections = Object.keys(config.collections)
        const defaults = collections.map(item => ({name:config.collections[item], defaults:require(`./database_defaults/${item}.json`).default}))
        return Promise.all(defaults.map((item) => {
          const collection = dbCollections.find(col => col.collectionName == item.name)
          if(Array.isArray(item.defaults)){
            return collection?.insertMany(item.defaults)
          } else {
            return collection?.insert(item.defaults)
          }
        }))
      })
      .then((result : BulkWriteResult[]) => {
        const errors = result.map(item => item.getWriteErrors())
        if(errors){
          throw "Error occured while writing defaults to collections"
        } else {
          resolve("Defaults Initialized")
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
