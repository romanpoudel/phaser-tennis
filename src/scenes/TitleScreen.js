import Phaser from 'phaser';
import WebFontFile from './WebFontFile';
import { Game } from '../consts/SceneKeys';
import {PressStart2P} from '../consts/Fonts';
import * as AudioKeys from '../consts/AudioKeys';

export default class TitleScreen extends Phaser.Scene {
  preload() {
    const fonts = new WebFontFile(this.load, 'Press Start 2P');
    this.load.addFile(fonts);
  }

  create() {
    const title = this.add.text(400, 250, 'Old School Tennis', {
      fontSize: 38,
      fontFamily: PressStart2P,
    });
    title.setOrigin(0.5, 0.5);

    this.add
      .text(400, 350, 'Press Space to Start', {
        fontSize: 24,
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5, 0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.sound.play(AudioKeys.PongBeep);
      this.scene.start(Game);
    });
  }
}
