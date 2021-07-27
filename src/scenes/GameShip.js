import Phaser from 'phaser'

import BulletSpawner from './BulletSpawner'
import ScoreLabel from '../ui/ScoreLabel';

const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const BULLET_KEY = 'bomb'
const STAR_KEY = 'star'

export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')

        this.scoreLabel = undefined
        this.bulletSpawner;

        this.gameOver = false
      
	}

    //// PRELOAD/////////////////////////////////////////////////////////////////////////////////
	preload()
    {
        this.load.image('sky', 'assets/sky.png')
        this.load.image('laser', 'assets/bomb.png')
        this.load.image(GROUND_KEY, 'assets/platform.png')
        this.load.image(BULLET_KEY, 'assets/bomb.png')
        this.load.image(STAR_KEY, 'assets/star.png')

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
        this.stars = this.createStars()

        this.scoreLabel = this.createScoreLabel(16, 16, 0)

        this.bulletSpawner = new BulletSpawner(this, BULLET_KEY)
        const bulletGroup = this.bulletSpawner.group

        this.physics.add.collider(this.player, platforms)

    // BULLETS/////////////////////////
        this.physics.add.collider(bulletGroup, platforms)
        this.physics.add.overlap(this.stars, bulletGroup, this.collectStar, null, this)

    // STARS///////////////////////////////
        this.physics.add.collider(this.stars, platforms)
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    
        this.cursors = this.input.keyboard.createCursorKeys()
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



    collectStar(player, star) {
        star.disableBody(true, true)

        // add # points when collect stars
        this.scoreLabel.add(10)

        if (this.stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true)
            })
        }
    }

    createScoreLabel(x, y, score) {
        const style = { fontSize: '32px', fill: '#000' }
        const label = new ScoreLabel(this, x, y, score, style)

        this.add.existing(label)

        return label
    }

    createStars() {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        stars.children.iterate((c) => {

            const child = (/** @type {Phaser.Physics.Arcade.Sprite} */ (c))
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        return stars
    }
}
