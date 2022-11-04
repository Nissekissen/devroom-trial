const { MongoClient } = require('mongodb');
const { mongodb } = require('../../config.json')

module.exports = {
    async createDB(name) {
        MongoClient.connect(mongodb.url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(name);
            db.close()
        });
    },
    async createCollection(dbName, name) {
        MongoClient.connect(mongodb.url, (err, db) => {
            if (err) throw err;
            let dbo = db.db(dbName);
            try {
            dbo.createCollection(name, (err, res) => {
                if (err) throw err;
                    db.close();
                });
            } catch (error) {
                return error
            } 
        });
    },
    async insertOne(dbName, collection, object) {
        MongoClient.connect(mongodb.url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection(collection).insertOne(object, (err, res) => {
                if (err) throw err;
                db.close();
            })
        });
    },
    async findOne(dbName, collection, query, callback) {
        MongoClient.connect(mongodb.url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection(collection).findOne(query).then(callback)
        });
    },
    async find(dbName, collection, query, callback) {
        MongoClient.connect(mongodb.url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection(collection).find(query).toArray().then(callback)
        });
    },
    async delete(dbName, collection, query) {
        MongoClient.connect(mongodb.url, (err, db) => {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection(collection).deleteOne(query);
        })
    }
}