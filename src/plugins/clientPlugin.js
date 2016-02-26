/*globals Phaser*/

var permanentStorage = window.localStorage;
var tempStorage = window.sessionStorage;



Phaser.Plugin.ClientPlugin = function (game, parent) {
    Phaser.Plugin.call(this, game, parent);
    if (!game.client) game.client = new Client();

};


Phaser.Plugin.ClientPlugin.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.ClientPlugin.prototype.constructor = Phaser.Plugin.ClientPlugin;


var Client = function () {

    return {

        doLogin:  function(email, pass, callback) {

            fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: email,
                    pass: pass,
                })
            })
                .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        callback(response.status)
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        console.log(data);
                        callback(null, data);
                    });
                }
            )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                    callback(err);
                });
        }



    }



};