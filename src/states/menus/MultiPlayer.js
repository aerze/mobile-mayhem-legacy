
var Multiplayer = function () {

};

Multiplayer.prototype = {

    preload: function () {
        this.stage.backgroundColor = '#b1d256';
        this.load.image('logo', 'assets/logo2.png');
    },

    create: function () {

        var halfWidth = this.game.width/ 2,
            halfHeight = this.game.height/ 2;

        this.mainGroup = this.add.group();
        this.logo = this.add.image(halfWidth, 300, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);

        var gameDiv = document.getElementById('gameContainer');

        var email = document.createElement("input");
        email.type = "text";
        email.className='login';
        email.placeholder = 'email';
        gameDiv.appendChild(email);

        var pass = document.createElement("input");
        pass.type = "password";
        pass.className='pass';
        pass.placeholder = 'password';
        gameDiv.appendChild(pass);

        var self=this;
        this.button_Login = this.add.button(halfWidth, this.game.height - 300, 'Login', 48, this.mainGroup);
        this.button_Login.customEvents.animComplete.add(function () {

            if(fieldsValid(email.value, pass.value) ) {



                this.game.client.doLogin(email.value, pass.value, function (err, res) {
                    if (err ) {
                        alert('Login Failed:' + (err.msg || 'Unknown Issue'));
                    }
                    else {
                        email.remove();
                        pass.remove();
                        self.game.state.start('Menu_RoomMenu');
                    }

                })


            }


        }, this);
        this.game.add.tween(this.button_Login).from( { y: -400,  }, 800, Phaser.Easing.Elastic.Out, true);

        this.button_Back = this.add.button(halfWidth, this.game.height - 100, 'Back', 48, this.mainGroup);
        this.button_Back.customEvents.animComplete.add(function () {
            if (email) email.remove();
            if (pass) pass.remove();
            this.state.start('Menu_MainMenu');
        }, this);
        this.game.add.tween(this.button_Back).from( { y: -200,  }, 800, Phaser.Easing.Elastic.Out, true);

    }
};

function fieldsValid(email, pass) {
    return email && pass;
}


module.exports = Multiplayer;