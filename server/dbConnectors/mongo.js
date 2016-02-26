
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;


/**
 * @class MDB
 * @constructor
 */
var MDB = function() {
    this.db = undefined;
    this.host = '127.0.0.1';
    this.port = 27017;
    this.name = 'mm';
};




MDB.prototype.connect = function (callback) {

    var self = this;
    if (this.db === undefined) {
        var mongoUri = process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            'mongodb://127.0.0.1/' + this.name;
        Db.connect(mongoUri, function (err, db) {
            if (err) return;
            this.db = db;
            if (typeof callback === 'function') callback();
        }.bind(this));

    }
    else {
        if (typeof callback === 'function') callback.apply(caller);
    }

};

MDB.prototype.getCollection= function(collection_name, callback) {
    if (this.db===undefined) this.connect(null,null, function () {
        this.db.collection(collection_name, function(error, my_collection) {
            if( error ) callback(error);
            else callback(null, my_collection);
        });
    },this);
    else {
        this.db.collection(collection_name, function(error, my_collection) {
            if( error ) callback(error);
            else callback(null, my_collection);
        });
    }
};



MDB.prototype.find = function(collection_name, id, callback) {
    this.getCollection(collection_name, function(error, my_collection) {
        if( error ) callback(error);
        else {
            my_collection.findOne({ "_id" : id},function(error, result) {    //removed cast to objectid
                if( error ) callback(error);
                else callback(null, result);
            });
        }
    });
};

MDB.prototype.findAll = function(collection_name, callback) {
    this.getCollection(collection_name, function(error, my_collection) {
        if( error ) callback(error);
        else {
            my_collection.find().toArray(function(error, result) {
                if( error ) callback(error);
                else callback(null, result);
            });
        }
    });
};

MDB.prototype.findByKey = function(collection_name, key, value, callback) {
    this.getCollection(collection_name, function(error, my_collection) {
        if( error ) callback(error);
        else {
            var q ={};
            q[key]=value;
            my_collection.findOne(q,function(error, result) {
                if( error ) callback(error);
                else callback(null, result);
            });
        }
    });
};

MDB.prototype.save = function(collection_name, doc, callback) {
    this.getCollection(collection_name,function(error, my_collection) {
        if (!error) {

            doc.saved_at = new Date();

            my_collection.save(doc, function () {
                if (typeof callback === 'function') callback(null, doc);
            });
        } else {
            if (typeof callback === 'function') callback(error)
        }
    });
};


MDB.prototype.newID = function() {
    return new ObjectID().toString();
};

module.exports = new MDB();