
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload,
    create,
    update
  }
};

const BIRD_VELOCITY = 400
const FLAP_VELOCITY = 250
const PIPE_VELOCITY = -200
const INITIAL_BIRD_X = config.width * 0.1
const INITIAL_BIRD_Y = config.height / 2
const PIPES_TO_RENDER = 10
const INITIAL_PIPE_X = config.width * 0.5
const PIPE_X_DELTA = {
  MIN: 200,
  MAX: 250
}
const PIPE_Y_DELTA = {
  MIN: 500,
  MAX: 510
}
const PIPE_Y_POSITION = {
  MIN: 20,
  MAX: config.height - 20
}

new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

let bird = null
let sky = null
let pipeGroup = null
let currentPipeHorizontalDistance = INITIAL_PIPE_X

function create () {
  sky = this.add.image(0, 0, 'sky').setOrigin(0, 0);
  sky.displayWidth = config.width;
  sky.displayHeight = config.height;
  
  bird = this.physics.add.sprite(INITIAL_BIRD_X, INITIAL_BIRD_Y, 'bird').setOrigin(0, 0);
  bird.body.gravity.y = BIRD_VELOCITY;

  pipeGroup = this.physics.add.group()

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipeGroup.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipeGroup.create(0, 0, 'pipe').setOrigin(0, 0);
    placePipe(upperPipe, lowerPipe)
  }

  pipeGroup.setVelocityX(PIPE_VELOCITY)

  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
}

function update (time, delta) { 
  if (bird.y >= config.height || bird.y <= 0) {
    restartBirdPosition()
  }

  recyclePipes()
}

function restartBirdPosition () {
  bird.x = INITIAL_BIRD_X
  bird.y =  INITIAL_BIRD_Y
  bird.body.velocity.y = 0
}

function flap () {
  bird.body.velocity.y = -FLAP_VELOCITY
}

function placePipe (upperPipe, lowerPipe) {
  const pipeVerticalDistance = Phaser.Math.Between(PIPE_Y_DELTA.MIN, PIPE_Y_DELTA.MAX)
  const pipeVerticalPosition = Phaser.Math.Between(PIPE_Y_POSITION.MIN, PIPE_Y_POSITION.MAX - pipeVerticalDistance)
  const pipeHorizontalDistance = Phaser.Math.Between(PIPE_X_DELTA.MIN, PIPE_X_DELTA.MAX)
  const pipeHorizontalPosition = getNextPipePosition() + pipeHorizontalDistance

  upperPipe.x = pipeHorizontalPosition
  upperPipe.y = pipeVerticalPosition

  lowerPipe.x = upperPipe.x
  lowerPipe.y = upperPipe.y + pipeVerticalDistance
}

function getNextPipePosition () {
  let lastPipeX = 0
  pipeGroup.getChildren().forEach(pipe => {
    lastPipeX = Math.max(pipe.x, lastPipeX)
  })

  return lastPipeX
}

function recyclePipes () {
  const tempPipes = []
  pipeGroup.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0) {
      tempPipes.push(pipe)
      if (tempPipes.length === 2) {
        placePipe(...tempPipes)
      }
    }
  })
}
