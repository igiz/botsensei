// JSON database

module.exports.initDefaults = (connectionInfo) => {

    const mongo = require('mongodb').MongoClient;
    mongo.connect(connectionInfo.url, (error, client) => {
        if (!error) {
            try {
                const database = client.db(connectionInfo.database);
                database.collection
            } finally {
                client.close();
            }
        } else {
            throw "Unable to connect to the database"
        }
    })
}