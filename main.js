var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function IceChancellor(game, spritesheet) {
    this.actions = {left: new Animation(spritesheet[0], 64, 64, 4, 0.08, 16, true, 2),
            up: new Animation(spritesheet[1], 64, 64, 4, 0.08, 16, true, 2),
            down: new Animation(spritesheet[2], 64, 64, 4, 0.08, 16, true, 2),
            death: new Animation(spritesheet[3], 64, 64, 4, 0.08, 16, false, 2)};
    this.animation = this.actions.left;
    this.x = 800;
    this.y = 450;
    this.speed = -150;
    this.game = game;
    this.ctx = game.ctx;
    this.demoTime = 0;
}

IceChancellor.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

IceChancellor.prototype.update = function () {
    this.demoTime += this.game.clockTick;
    if (this.demoTime < 1.5) {
        this.animation = this.actions.left;
        this.x += this.game.clockTick * this.speed;
    } else if (this.demoTime > 1.5 && this.demoTime < 3) {
        this.animation = this.actions.up;
        this.y += this.game.clockTick * this.speed / 1.5;
    } else if (this.demoTime > 3 && this.demoTime < 4.5) {
        this.animation = this.actions.left;
        this.x += this.game.clockTick * this.speed;
    } else if (this.demoTime > 4.5 && this.demoTime < 6) {
        this.animation = this.actions.down;
        this.y += this.game.clockTick * this.speed / 1.5 * -1;
    } else if (this.demoTime > 6 && this.demoTime < 7.5) {
        this.animation = this.actions.left;
        this.x += this.game.clockTick * this.speed;
    } else if (this.demoTime > 7.5 && this.demoTime < 9) {
        this.animation = this.actions.death;
    } else {
        this.x += this.game.clockTick * this.speed;
    }
    if (this.x < -230) {
        this.actions.death.elapsedTime = 0;
        this.demoTime = 0;
        this.x = 800;
    }
}


AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/wizardup.png");
AM.queueDownload("./img/wizardleft.png");
AM.queueDownload("./img/wizarddown.png");
AM.queueDownload("./img/wizarddeath.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new IceChancellor(gameEngine, 
        [ AM.getAsset("./img/wizardleft.png"), 
        AM.getAsset("./img/wizardup.png"),
        AM.getAsset("./img/wizarddown.png"), 
        AM.getAsset("./img/wizarddeath.png") ]));
    
    console.log("All Done!");
});