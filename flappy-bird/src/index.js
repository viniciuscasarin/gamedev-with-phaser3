
import Phaser from "phaser";

const VELOCITY = 400
const FLAP_VELOCITY = 250

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: VELOCITY }
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

let bird = null

function create () {
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  bird = this.physics.add.sprite(config.width * 0.1, config.height / 2, 'bird').setOrigin(0, 0);

  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
}

function update (time, delta) { }

function flap () {
  bird.body.velocity.y = -FLAP_VELOCITY
}
