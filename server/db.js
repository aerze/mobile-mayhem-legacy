var crypto = require('crypto');

var dbc = require('./dbConnectors/file');

dbc.connect(function(){},this);

exports.getUser = function (username, password,  callback) {

    dbc.findByKey("user_store", "username", username, function (error, result) {
        if (error) return callback(error);
        if (result == null) {  //create user
                var user = createUserDoc( username, password);
                saveUser(user,callback);
        }
        else {
            if (result.password === passwordToHash(password))   return callback(null, result);
            else  return callback("Invalid Password");
        }


    });
};


function passwordToHash(password) {

    var hash =  crypto
        .createHmac("md5",'S3Cre7*)0dE')
        .update(password)
        .digest('hex');
    return hash;
}


function createUserDoc (username, password) {

    var user = {};
    user.username=username;
    user.password = passwordToHash(password);

    return user;

}


function saveUser (user, callback) {

    dbc.save("user_store", user, callback);

}


