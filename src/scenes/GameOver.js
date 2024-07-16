import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  /**
   *
   * @param {{leftScore: number, rightScore: number}} data
   */
  create(data) {
    let titleText = 'Game Over';
    if (data.leftScore > data.rightScore) {
      titleText = 'You Win!';
    }

    this.add.text(400,200,titleText,{
      fontFamily: '"Press Start 2P"',
      fontSize: 38
    }).setOrigin(0.5);
  }
}
