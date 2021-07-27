import Phaser from 'phaser'

//import LaserGroup from './LaserGroup'
import BulletSpawner from './BulletSpawner'

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const BULLET_KEY = 'bomb'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')

        this.gameOver = false
        this.laserGroup;
        this.bulletSpawner;
	}

    //// PRELOAD/////////////////////////////////////////////////////////////////////////////////
	preload()
    {
        this.load.image('sky', 'assets/sky.png')
        this.load.image('laser', 'assets/bomb.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')
        this.load.image(BULLET_KEY, 'assets/bomb.png')

        this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    )
    }

    //// CREATE /////////////////////////////////////////////////////////////////////////////////
    create() {
        this.cameras.main.setBackgroundColor(0x1d1923)
        this.add.image(400, 300, 'sky')

        const platforms = this.createPlatforms()
       
        
        this.player = this.createPlayer()
        this.cursors = this.input.keyboard.createCursorKeys()

        //this.laserGroup = new LaserGroup(this, BULLET_KEY)
        this.bulletSpawner = new BulletSpawner(this, BULLET_KEY)
        const bulletGroup = this.bulletSpawner.group
       
        const bulletDirect = 0

        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(bulletGroup, platforms)
    }

    //// CREATE PLAYER/////////////////////////////////////////////////////////////////////////////////
    createPlayer() {
        
        // const centerX = this.cameras.main.width /2;
        // const bottom = this.cameras.main.height -90;

        const player = this.physics.add.sprite(100, 300, DUDE_KEY)
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)
        // this.ship = this.add.image(centerX, bottom, DUDE_KEY)

        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'turn',
            frames: [{ key: DUDE_KEY, frame: 4 }],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })

        return player
    }

    //// UPDATE - Inputs/////////////////////////////////////////////////////////////////////////////////
    update() {
        if (this.gameOver) {
            return
        }
        //SHOOT = spacebar is down
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.shootLaser();
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160)
            this.player.anims.play('left', true)

            this.bulletDirect = -300
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)

            this.player.anims.play('right', true)

            this.bulletDirect = 300
        }
        else {
            this.player.setVelocityX(0)

            this.player.anims.play('turn')
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330)
        }
    }


    shootLaser() {
        //this.laserGroup.fireLaser(this.player.x, this.player.y - 20);

        this.bulletSpawner.spawn2(this.player.x, this.player.y, this.bulletDirect)
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup()
        
        //Ground floor
        platforms.create(400, 400, GROUND_KEY).setScale(2).refreshBody()
        // platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody()

        platforms.create(600, 300, GROUND_KEY)
        platforms.create(50, 250, GROUND_KEY)
        platforms.create(750, 220, GROUND_KEY)

        return platforms
    }
}
