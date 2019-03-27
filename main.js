var mainState = {
  preload: function() {
    //game.load.image('bird', 'assets/bird.png');
    game.load.spritesheet('bird', 'assets/bird_spritemap2.png', 48, 48);
    game.load.image('pipe', 'assets/pipe.png');
    game.load.image('pipe_btm', 'assets/pipe_btm.png');
    game.load.image('pipe_top', 'assets/pipe_top.png');
    game.load.audio('jump', 'assets/jump.wav');
    game.load.image('background', 'assets/background2.png');
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
    game.input.onTap.add(this.jump, this);

    game.input.mouse.capture = true;
    game.input.activePointer.leftButton.onDown.add(this.jump,this);

    this.pipes = game.add.group();

    this.timer = game.time.events.loop(2000, this.addRowOfPipes, this);

    this.labelScore = game.add.text(480, 0, "v0.4", { font: "10px Arial", fill: "#ffffff" });

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

    this.jumpSound = game.add.audio('jump');
    this.deadSound = game.add.audio('dead');
  },

  update: function() {
    if (this.bird.angle < 20)
      this.bird.angle += 1;
    if (this.bird.y < 0 || this.bird.y > 700)
      this.hitPipe();

    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
  },

  jump: function() {
    if (this.bird.alive == false) {
      return;
    }
    this.jumpSound.play();
    game.add.tween(this.bird).to({ angle: -20 }, 100).start();
    this.bird.body.velocity.y = -300;
  },

  restartGame: function() {
    game.state.start('main');
  },

  addPipes: function(x,y) {
    var pipeTop = game.add.sprite(x,y, 'pipe_top');
    var pipeBtm = game.add.sprite(x,pipeTop.bottom + 150, 'pipe_btm');
    this.pipes.add(pipeTop);
    this.pipes.add(pipeBtm);
    
    game.physics.arcade.enable(pipeTop);
    pipeTop.body.velocity.x = -150;
    pipeTop.body.setSize(60,495);
    pipeTop.checkWorldBounds = true;
    pipeTop.outOfBoundsKill = true;
    
    game.physics.arcade.enable(pipeBtm);
    pipeBtm.body.velocity.x = -150;
    pipeBtm.body.setSize(60,495);
    pipeBtm.checkWorldBounds = true;
    pipeBtm.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    var hole = Math.floor(Math.random() * 5) + 1;
    this.addPipes(500, 0-hole*60);
    this.score += 1;
    this.labelScore.text = this.score;
  },

  hitPipe: function() {
    if (this.bird.alive == false)
      return;
    this.bird.alive = false;
    this.bird.animations.stop();
    // this.bird.body.allowGravity = false;
    // this.bird.body.velocity.y = 0;
    game.time.events.remove(this.timer);
    this.deadSound.play();
    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this);
  }
};

var game = new Phaser.Game(500, 711);

game.state.add('main', mainState);

game.state.start('main');