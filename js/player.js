class Player extends Entity {
    constructor(x, y, width, height, color, gravity, jump_height) {
        super(x, y, width, height, color, gravity);
        this.vx = 0;
        this.vy = 0;
        this.maxVx= 4;
        this.ax = 0;
        this.ay = 0;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.onGround = false;
        this.jump_height = 8
    }

    update = function() {
        
    }
}

//if I make all of the update stuff in this player class, then any new features I
//want to add to the update function have be in this one too. And I have to pass in
//all the required information like Platforms, Enemies, and other entities