import Phaser from 'phaser'

class Laser extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y) {
        super(scene, x, y, 'laser')
    }
    
    fire(x,y) {
        this.body.reset(x,y)
        this.setActive(true)
        this.setVisible(true)
        this.setVelocityX(-900)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if(this.y <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export default class LaserGroup extends Phaser.Scene

{
	constructor(scene)
	{
        
		//super('hello-world')
        super(scene.physics.world, scene)

        this.createMultiple({
            classType: Laser,
            frameQuantity: 30,
            active: false,
            visible: false,
            key: 'laser'
        })
     
	}

	preload()
    {

        this.load.image('laser', 'assets/bomb.png')
    }

    create()
    {
        this.add.image(400, 300, 'laser')
    }

    // fireLaser(x, y) {
    //     const laser = this.getFirstDead(createIfNull: false)
    //     if (laser) {
    //         laser.fire(x,y)
    //     }
    // }
}
