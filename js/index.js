//All these are global variables, probably better to not do this

const StartGame = function(ctx, WIDTH, HEIGHT, platforms, player) {
    Game = {};
    Game.ctx = ctx;
    Game.WIDTH = WIDTH;
    Game.HEIGHT = HEIGHT;
    Game.platforms = platforms;
    Game.player = player;
    Game.updateEverything = function() {
        //reset the screen
        let tempColor = ctx.fillStyle;
        ctx.fillStyle = "cyan";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = tempColor;
        //update and draw the player, anad draw each platform
        platforms.forEach(Game.drawEntity);
        Game.updatePlayer(player);
        Game.drawEntity(player);
    }

    Game.updatePlayer = function() {
        let p = player
        //updating the player's ability to jump
        
        //p.vx = 0;
        //p.vy = 0;
        p.ax = 0;
        if (p.pressingDown) /*p.vy = 10*/; //maybe charge some attack or smth
        
        p.vy += p.gravity;
    
        //is position valid? Collision detection should be its own function

        if (p.x + p.vx > WIDTH - p.width) {
            p.x = WIDTH - p.width;
            p.vx = 0;
        }
        if (p.x + p.vx < 0) {
            p.x = 0;
            p.vx = 0;
        }

        //if (p.y + p.vy > topOfGround) {p.y = topOfGround; p.vy = 0}
        //Checking if the player is on the ground, and stopping its movement, 
        if (p.y + p.vy > HEIGHT - p.height) {
            p.y = HEIGHT - p.height;
            p.vy = 0;
        }
        if (p.y + p.vy < 0) {
            p.y = 0;
            p.vy = 0;
        }

        if (p.pressingLeft) 
            p.ax = -2;
        if (p.pressingRight) 
            p.ax = 2;
        if (p.pressingRight && p.pressingLeft)
            p.ax = 0;
        
        //move player, clamping velocities
        p.vx += p.ax;
        if (p.vx > p.maxVx)
            p.vx = p.maxVx;
        if (p.vx < -p.maxVx)
            p.vx = -p.maxVx;
        p.x += p.vx;
        p.y += p.vy;

        p.onGround = false;
        if ( (p.y >= HEIGHT - p.height)  ) {
            p.onGround = true;
            p.y = HEIGHT - p.height;
            if (p.pressingUp) {
                p.vy = -8;
                console.log("JUMP");
            }
            else {
                p.vy = Math.min(0, p.vy)
            }
        }
        
        for (key in platforms) {
            if (p.collisionType(platforms[key]) == "bottom") {
                p.onGround = true;
                p.y = platforms[key].y - p.height;
                if (platforms[key].type == "bouncy") {
                    console.log("BOING")
                    p.vy = -12;
                } else if (platforms[key].type == "sticky" && p.pressingUp) {
                    p.vy = -4;
                    console.log("jump");
                } else if (p.pressingUp) {
                    p.vy = -8;
                    console.log("JUMP");
                } else {
                    p.vy = Math.min(0, p.vy);
                }
            }
            if (p.collisionType(platforms[key]) == "top" && platforms[key].type == "hard") {
                p.y = platforms[key].y + platforms[key].height;
                p.vy = 0
                console.log("BONK")
            }
        }
    
        //friction-ish: if 0 outside acceleration, slow down the player
        if (p.ax === 0) {
            if (p.vx > 0) {
                p.vx = Math.max(0, p.vx - 0.5);
            }
            if (p.vx < 0) {
                p.vx = Math.min(0, p.vx + 0.5);
            }
        }
    }

    Game.drawEntity = function(e) {
        let tempColor = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
        ctx.fillStyle = tempColor;
    }

    return Game;
}

window.onload = function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    var platforms = []
    const game_width = 800
    const game_height = 600
    var player = new Player(game_width/2, game_height/2, 20, 20, "blue", 0.5);
    var Game = StartGame(ctx, game_width, game_height, platforms, player)

    //---------------------------------
    //Level Construction
    for (let i = 0; i < 8; i++) {
        Game.platforms[i] = new Platform(100*i + 50, 550, 50, 5, "green", "normal");
    }
    for (let i = 8; i < 20; i++) {
        Game.platforms[i] = new Platform(50 + 50*(i-8), 550 - 50*(i-8), 50, 5, "green", "normal");
    }

    Game.platforms[20] = new Platform(300, 200, 50, 5, "gray", "hard")
    Game.platforms[21] = new Platform(250, 250, 50, 5, "purple", "sticky")
    Game.platforms[22] = new Platform(200, 300, 50, 5, "blue", "bouncy")
    //End of level construction
    //----------------------------------

    //start gameLoop
    setInterval(Game.updateEverything, 1000 / 60); // 60 FPS
}

//x, y, width, height, color

document.onkeydown = function (event) {
    if (event.key === "d" || event.key === "ArrowRight") //d or right arrow
        Game.player.pressingRight = true;
    else if (event.key === "s" || event.key === "ArrowDown") //s or down arrow
        Game.player.pressingDown = true;
    else if (event.key === "a" || event.key === "ArrowLeft") //a or left arrow
        Game.player.pressingLeft = true;
    else if (event.key === "w" || event.key === " " || event.key === "ArrowUp") //w or up arrow or space
        Game.player.pressingUp = true;
}

document.onkeyup = function (event) {
    if (event.key === "d" || event.key === "ArrowRight") //d or right arrow
        Game.player.pressingRight = false;
    else if (event.key === "s" || event.key === "ArrowDown") //s or down arrow
        Game.player.pressingDown = false;
    else if (event.key === "a" || event.key === "ArrowLeft") //a or left arrow
        Game.player.pressingLeft = false;
    else if (event.key === "w" || event.key === " " || event.key === "ArrowUp") //w or up arrow or space
        Game.player.pressingUp = false;
}