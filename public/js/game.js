// create a new scene
let gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
  // player speed
  this.playerSpeed = 2.5;

  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 3;

  // enemy boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
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

  this.goal = this.add.sprite(gameW - 80, gameH / 2, 'goal');
  this.goal.setScale(0.6);

  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: {
      x: 80,
      y: 100,
      stepX: 80,
      stepY: 20,
    },
  });

  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

  // flip x and set speed
  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      enemy.flipX = true;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed =
        this.enemyMinSpeed +
        Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
      enemy.speed = dir * speed;
    },
    this
  );
};

//  update called up to 60fps
gameScene.update = function () {
  if (this.input.activePointer.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  }
  //  treasure overlap check
  let playerRect = this.player.getBounds();
  let treasureRect = this.goal.getBounds();
  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    // restart the scene
    return this.gameOver('winner');
  }

  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      // enemy movement
      enemy.y += enemy.speed;
      const enemyRect = enemy.getBounds();
      const shouldTurnDown = enemy.speed < 0 && enemy.y <= this.enemyMinY;
      const shouldTurnUp = enemy.speed > 0 && enemy.y >= this.enemyMaxY;
      if (shouldTurnDown || shouldTurnUp) enemy.speed *= -1;
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
        return this.gameOver('Failure');
      }
    },
    this
  );
};

gameScene.gameOver = function (condition) {
  console.log(condition);
  this.scene.manager.bootScene(this);
  return;
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
