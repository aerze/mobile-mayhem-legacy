




function createUserDoc (username, password) {

    var user = {};
    user.username=username;
    user.password = passwordToHash(password);

    return user;

}






