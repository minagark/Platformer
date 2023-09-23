
class Platform extends Entity {
    constructor(x, y, width, height, color, type) {
        super(x, y, width, height, color, 0);
        this.type = type; //bouncy, (purple) sticky, phasing (partially transparent), smth else; make this a String
    }
}
