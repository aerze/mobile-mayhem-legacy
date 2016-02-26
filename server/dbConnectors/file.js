var db = require('./data.json');
var fs = require('fs');

var maxId = db.maxId;



/**
 * @class DB
 * @constructor
 */
var DB = function() {
    this.db = db;
    this.name = 'mm';
};

function otoa (obj) {
    return Object.keys(obj).map(function (key) {return obj[key]});
}

function wrapCB(err, result ,callback  ) {
    process.nextTick(function() { callback(err,  result) });
}


DB.prototype.connect = function (callback) {
    process.nextTick(callback);
};

DB.prototype.getCollection= function(collection_name, callback) {
    var self = this;
    if(!this.db[collection_name]) this.db[collection_name]={};
    wrapCB(null, self.db[collection_name], callback);
};



DB.prototype.find = function(collection_name, id, callback) {
    this.getCollection(collection_name, function(error, my_collection) {
        if( error ) callback(error);
        else {
            wrapCB(null, JSON.parse(JSON.stringify(my_collection[id] || null )), callback );
        }
    });
};

DB.prototype.findAll = function(collection_name, callback) {
    this.getCollection(collection_name, function(error, my_collection) {
        if( error ) callback(error);
        else {
            wrapCB(null, otaa( my_collection), callback );
        }
    });
};


DB.prototype.findByKey = function(collection_name, key, value, callback) {
    this.getCollection(collection_name, function(error, my_collection) {
        var found=null;
        if( error ) callback(error);
        else {
            for (var docId in my_collection) {
               var doc=my_collection[docId];
               if (doc[key] && doc[key]==value) {
                  found=doc;
                  break;
               }
            }
            wrapCB(null, JSON.parse(JSON.stringify(found)), callback);

        }
    });
};

DB.prototype.save = function(collection_name, doc, callback) {
    this.getCollection(collection_name,function(error, my_collection) {
        if (!error) {

            if (!doc.id) doc.id=nextId();

            var myId = doc.id;
            doc.saved_at = new Date();

            my_collection[myId] = doc;

            fs.writeFile(__dirname + '/data.json', JSON.stringify(db,null,2));
            if (typeof callback === 'function') wrapCB(null, JSON.parse(JSON.stringify(doc)),callback);
        }
        else if (typeof callback === 'function') callback(error);
    });
};

function nextId(){
    db.maxId=++maxId;
    return maxId;
}


DB.prototype.newID = function() {
    return  nextId();
};

module.exports = new DB();