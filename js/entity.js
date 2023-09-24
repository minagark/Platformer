class Entity {
    constructor(x, y, width, height, color, gravity) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.gravity = gravity;
    }

    collisionType(other) {
        let collides = false;
        let distX = other.x - this.x;
        let distY = other.y - this.y;

        if (distY > 0 && distY <= this.height && distX > -other.width && distX < this.width) {
            collides = "bottom"
        }
        else if (distY < 0 && distY >= -other.height && distX > -other.width && distX < this.width) {
            collides = "top"
        } 
        else if (distX > 0 && distX <= this.width && distY > -other.height && distY < this.height) {
            collides = "right"
        }
        else if (distX < 0 && distX >= -other.width && distY > -other.height && distY < this.height) {
            collides = "left"
        }
        else {
            collides = false
        }

        return collides;
    }
}

