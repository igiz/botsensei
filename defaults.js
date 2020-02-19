// JSON database

module.exports.set = (dbInfo) => {
    const mongo = require('mongodb').MongoClient;
    return new Promise((resolve, reject) => {

        mongo.connect(dbInfo.url)
        .then((client) => { return client.db(dbInfo.db) } )
        .then((database) => { return database.collections() })
        .then((collections) => {
            if (!collections.map(c => c.s.name).includes(dbInfo.collection)) {
                return db.createCollection(dbInfo.collection);
            }
        }).catch((error) => { reject(error)} );
    })
}