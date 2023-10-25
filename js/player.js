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
        this.jump_height = jump_height
    }

    update = function() {
        
    }
}