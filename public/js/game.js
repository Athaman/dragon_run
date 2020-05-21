// create a new scene
let gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
  // player speed
  this.playerSpeed = 2.5;
};

//  load assets
gameScene.preload = function () {
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('enemy', 'assets/dragon.png');
  this.load.image('goal', 'assets/treasure.png');
};

// create, called once after preload
gameScene.create = function () {
  //  create bg sprit
  let bg = this.add.sprite(0, 0, 'background');
  // bg.setOrigin(0, 0); changes the sprit origin to 0 0... probably confusing
  // bg.setPosition(320, 180); works fine but magic numbers, if you change dimensions later you may forget to update

  // to avoid magic numbers (in case you change the screen dimensions later)
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;
  bg.setPosition(gameW / 2, gameH / 2);

  this.player = this.add.sprite(40, gameH / 2, 'player');
  // player.depth = -1 will place the player behind the background
  // one argument will apply to both dimensions
  this.player.setScale(0.5);

  // this.enemy = this.add.sprite(250, 180, 'enemy');
  // this.enemy.setScale(2);
  // this.enemy.setAngle(45);
  // rotation works around the origin so you can set 0,0 origin and spin it like a disco
  // enemy.setRotation(Math.PI / 4);
};

//  update called up to 60fps
gameScene.update = function () {
  if (this.input.activePointer.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  }
};

// set the config of the game
let config = {
  type: Phaser.AUTO, // Phaser will use webgl if available or fall back to canvas
  width: 640,
  height: 360,
  scene: gameScene,
};

//  create a new game, pass the config
let game = new Phaser.Game(config);
