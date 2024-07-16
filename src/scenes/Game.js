import Phaser from 'phaser';
import { GameBackground } from '../consts/SceneKeys';
import * as Colors from '../consts/Colors';

export default class Game extends Phaser.Scene {
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.leftScore = 0;
    this.rightScore = 0;
  }

  create() {
    this.scene.run(GameBackground);
    this.scene.sendToBack(GameBackground);
    this.physics.world.setBounds(-100, 0, 1000, 500);
    this.ball = this.add.circle(400, 250, 10, Colors.White);
    this.physics.add.existing(this.ball);
    //to make the ball use circle physics
    this.ball.body.setCircle(10);
    this.ball.body.setBounce(1, 1);

    this.ball.body.setCollideWorldBounds(true, 1, 1);
    // this.resetBall();

    this.paddleLeft = this.add.rectangle(30, 250, 30, 100, Colors.White);
    this.physics.add.existing(this.paddleLeft, true);

    this.paddleRight = this.add.rectangle(750, 250, 30, 100, Colors.White);
    this.physics.add.existing(this.paddleRight, true);

    this.physics.add.collider(this.ball, this.paddleLeft);
    this.physics.add.collider(this.ball, this.paddleRight);

    //score
    const scoreStyle = { fontSize: 48, fontFamily: '"Press Start 2P"' };
    this.leftScoreLabel = this.add
      .text(300, 125, '0', scoreStyle)
      .setOrigin(0.5);
    this.rightScoreLabel = this.add
      .text(500, 375, '0', scoreStyle)
      .setOrigin(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.time.delayedCall(1500, () => {
      this.resetBall();
    });
  }

  update() {
    this.processPlayerInput();

    this.updateAI();

    this.checkScore();
  }

  processPlayerInput() {
    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      this.paddleLeft.body.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      this.paddleLeft.body.updateFromGameObject();
    }
  }

  updateAI() {
    const diff = this.ball.y - this.paddleRight.y;
    if (Math.abs(diff) < 10) {
      return;
    }
    const aiSpeed = 3;
    if (diff < 0) {
      //ball is above paddle
      this.paddleRightVelocity.y = -aiSpeed;
      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10;
      }
    } else if (diff > 0) {
      //ball is below paddle
      this.paddleRightVelocity.y = aiSpeed;
      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = 10;
      }
    }
    this.paddleRight.y += this.paddleRightVelocity.y;
    this.paddleRight.body.updateFromGameObject();
  }

  checkScore() {
    if (this.ball.x < -30) {
      //scored on the left side
      this.resetBall();
      this.incrementRightScore();
    } else if (this.ball.x > 830) {
      //scored on the right side
      this.resetBall();
      this.incrementLeftScore();
    }

    const maxScore = 7;
    if (this.leftScore >= maxScore) {
      //left player wins
      console.log('Player won');
    } else if (this.rightScore >= maxScore) {
      //AI wins
      console.log('AI won');
    }
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore;
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.rightScoreLabel.text = this.rightScore;
  }

  resetBall() {
    this.ball.setPosition(400, 250);
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 200);
    this.ball.body.setVelocity(vec.x, vec.y);
  }
}
