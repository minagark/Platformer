//All these are global variables, probably better to not do this

const StartGame = function(ctx, WIDTH, HEIGHT, platforms, player, FRAME_RATE, y_level) {
    Game = {};
    Game.ctx = ctx;
    Game.WIDTH = WIDTH;
    Game.HEIGHT = HEIGHT;
    Game.platforms = platforms;
    Game.player = player;
    Game.FRAME_RATE = FRAME_RATE;
    Game.y_level = y_level;

    Game.updateEverything = function() {
        //reset the screen
        let tempColor = ctx.fillStyle;
        ctx.fillStyle = "cyan";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = tempColor;
        Game.y_level = Game.player.y - 300;

        Game.platforms[Game.platforms.length - 1].y -= 0.2

        //update and draw the player, and draw each platform
        for (var i = 0; i < Game.platforms.length; i += 1) {
            Game.drawEntity(platforms[i], Game.y_level);
        }
        Game.updatePlayer(player);
        Game.drawEntity(player, Game.y_level);
    }

    Game.updatePlayer = function() {
        let p = player;
        p.ax = 0;
        //if (p.pressingDown); //maybe charge some attack or smth
        
        p.vy += p.gravity;

        if (p.x + p.vx > WIDTH - p.width) {
            p.x = WIDTH - p.width;
            p.vx = 0;
        }
        if (p.x + p.vx < 0) {
            p.x = 0;
            p.vx = 0;
        }

        //Checking if the player is on the ground, and stopping its movement,
        if (p.y + p.vy > HEIGHT - p.height) {
            p.y = HEIGHT - p.height;
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
                p.vy = -p.jump_height;
                console.log("JUMP");
            }
            else {
                p.vy = Math.min(0, p.vy)
            }
        }
        
        for (key in platforms) {
            if (p.collisionType(platforms[key]) == "bottom") {

                if (platforms[key].type == "lava") {
                    Game.lose()
                }

                p.onGround = true;
                if (p.vy > 0) { 
                    p.y = platforms[key].y - p.height; 
                }
                if (platforms[key].type == "bouncy") {
                    console.log("BOING")
                    p.vy = -p.jump_height * 3/2;
                } else if (platforms[key].type == "sticky" && p.pressingUp) {
                    p.vy = -p.jump_height / 3 * 2;
                    console.log("smol jump");
                } else if (p.pressingUp) {
                    p.vy = -p.jump_height;
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

    Game.drawEntity = function(e, y_level) {
        let tempColor = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y - y_level, e.width, e.height);
        ctx.fillStyle = tempColor;
    }

    Game.populatePlatforms = function() {
        const platform_options = [["green", "normal"], ["blue", "bouncy"], ["purple", "sticky"], ["gray", "hard"]];
        for (let y_offset = 0; y_offset < HEIGHT * 10; y_offset += HEIGHT) {
            //slowly gets harder and harder
            vertical_density = Math.round(12 * Math.exp(-y_offset / (HEIGHT * 5))); 
            horizontal_density = Math.round(6 * Math.exp(-y_offset / (HEIGHT * 5)));
            // vertical_density = 12;
            // horizontal_density = 6;


            vertical_interval = HEIGHT / vertical_density;
            horizontal_interval = WIDTH / horizontal_density;
            for (let x = 0; x < WIDTH; x += horizontal_interval) {
                for (let y = 0; y < HEIGHT; y += vertical_interval) {
                    let i = Math.floor(Math.random() * 4)
                    color = platform_options[i][0];
                    type = platform_options[i][1];
                    // color = "green"
                    // type = "normal"
                    Game.createAndAddRandomPlatform(x, y - y_offset, horizontal_interval, vertical_interval, 50, 5, color, type);
                }
            }
        }
    }

    Game.createAndAddRandomPlatform = function (startX, startY, x_interval, y_interval, width, height, color, type) {
        x = Math.random() * x_interval + startX;
        y = Math.random() * y_interval + startY;
        Game.platforms.push(new Platform(x, y, width, height, color, type));
    }

    Game.lose = function() {
        clearInterval(intervalID)
        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, 800, 600)
    }

    return Game;
}

window.onload = function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    var platforms = []
    const GAME_WIDTH = 800
    const GAME_HEIGHT = 600
    //let's say the goal of the game is to get to 6000 height, so 10 screens worth of stuff
    //after each screen (600 pixels), the platforms get less and less populated, until the end is very hard
    //randomly generated every time
    const FRAME_RATE = 60
    var player = new Player(GAME_WIDTH/2, GAME_HEIGHT/2, 15, 15, "blue", 0.5, 8);
    var Game = StartGame(ctx, GAME_WIDTH, GAME_HEIGHT, platforms, player, FRAME_RATE, 0);

    //---------------------------------
    //Level Construction
    // for (let i = 0; i < 8; i++) {
    //     Game.platforms[i] = new Platform(100*i + 50, 550, 50, 5, "green", "normal");
    // }
    // for (let i = 8; i < 20; i++) {
    //     Game.platforms[i] = new Platform(50 + 50*(i-8), 550 - 50*(i-8), 50, 5, "green", "normal");
    // }

    // Game.platforms[20] = new Platform(300, 200, 50, 5, "gray", "hard");
    // Game.platforms[21] = new Platform(250, 250, 50, 5, "purple", "sticky");
    // Game.platforms[22] = new Platform(200, 300, 50, 5, "blue", "bouncy");
    Game.populatePlatforms();
    Game.platforms.push(new Platform(0, 600, 800, 20, "red", "lava"))
    //End of level construction
    //----------------------------------

    //start gameLoop
    intervalID = setInterval(Game.updateEverything, 1000 / Game.FRAME_RATE); // 60 FPS
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