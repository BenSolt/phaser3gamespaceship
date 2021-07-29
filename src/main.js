import Phaser from 'phaser'

//import HelloWorldScene from './scenes/HelloWorldScene'
import GameShip from './scenes/GameShip';
import GameFlappy from './scenes/GameFlappy';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 }
		}
	},

	scene:[GameFlappy]
	//scene:[GameShip]
	// scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
