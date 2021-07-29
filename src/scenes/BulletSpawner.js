import Phaser from 'phaser'

export default class BulletSpawner
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene, bulletkey = 'bomb')
	{
		this.scene = scene
		this.key = bulletkey

		this._group = this.scene.physics.add.group()
	}

	get group()
	{
		return this._group
	}

	spawn(x,y,v) {
		//const x = (playerX < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
        const bullet = this.group.create(x,y, this.key)
        bullet.setBounce(1)
        bullet.setCollideWorldBounds(true)
		bullet.setVelocity(v, 0)
		//bullet.setVelocity(Phaser.Math.Between(-200, 200), 20)
		
		return bullet
	}

}