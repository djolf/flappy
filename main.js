var mainState = {
    preload: function() {
        //game.load.image('bird', 'assets/bird.png');
        game.load.spritesheet('bird', 'assets/bird_spritemap2.png', 48, 48);
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.image('background', 'assets/background.png');
        game.load.audio('dead', 'assets/smb_mariodie.wav');
    },

    create: function() {
        game.stage.backgroundColor = '#71c5cf';
        this.background = game.add.sprite(0, 0, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.bird = game.add.sprite(100, 245, 'bird');
        this.bird.frame = 1;
        this.bird.animations.add('flap', [0, 1, 2], 10, true);
        this.bird.animations.play('flap');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.anchor.setTo(-0.2, 0.5);

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        game.input.mouse.capture = true;
        game.input.activePointer.leftButton.onDown.add(this.jump,this);


        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.labelScore = game.add.text(380, 0, "v0.2", { font: "10px Arial", fill: "#ffffff" });

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        this.jumpSound = game.add.audio('jump');
        this.deadSound = game.add.audio('dead');
    },

    update: function() {
        if (this.bird.angle < 20)
            this.bird.angle += 1;
        if (this.bird.y < 0 || this.bird.y > 450)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    jump: function() {
        if (this.bird.alive == false) {
            return;
        }
        this.jumpSound.play();
        game.add.tween(this.bird).to({ angle: -20 }, 100).start();
        this.bird.body.velocity.y = -350;
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * 60 + 10);
        }
        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitPipe: function() {
        if (this.bird.alive == false)
            return;
        this.bird.alive = false;
        this.bird.animations.stop();
        game.time.events.remove(this.timer);
        this.deadSound.play();
        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);

    }
};

var game = new Phaser.Game(400, 490);

game.state.add('main', mainState);

game.state.start('main');