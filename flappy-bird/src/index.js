
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload,
    create,
    update
  }
};

const VELOCITY = 400
const FLAP_VELOCITY = 250
const INITIAL_BIRD_X = config.width * 0.1
const INITIAL_BIRD_Y = config.height / 2

new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

let bird = null
let upperPipe = null
let lowerPipe = null

function create () {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  
  bird = this.physics.add.sprite(INITIAL_BIRD_X, INITIAL_BIRD_Y, 'bird').setOrigin(0, 0);
  bird.body.gravity.y = VELOCITY;

  upperPipe = this.physics.add.sprite(500, 100, 'pipe').setOrigin(0, 1);
  lowerPipe = this.physics.add.sprite(500, upperPipe.y + 100, 'pipe').setOrigin(0, 0);

  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
}

function update (time, delta) { 
  if (bird.y >= config.height || bird.y <= 0) {
    restartBirdPosition()
  }
}

function restartBirdPosition () {
  bird.x = INITIAL_BIRD_X
  bird.y =  INITIAL_BIRD_Y
  bird.body.velocity.y = 0
}

function flap () {
  bird.body.velocity.y = -FLAP_VELOCITY
}
