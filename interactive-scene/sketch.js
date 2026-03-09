// Rainbow Runner
// Ayman Faisal
// 3/2/2026
//
// Extra for Experts:
// - My project includes the use of spritesheets, to make animations, classes, and I made the camera follow the player
  
//Controls: WASD To move, Shift to roll, hold shift to sprint, M1 to punch, space to jump


//Constants
const gravitationalForce = 0.3;
const frictionalForce = 0.5;
const footOffset = 2;
const layer1Speed = 0.1;
const layer2Speed = 0.2;
const layer3Speed = 0.3;
const backgroundY = 200


//Important Globals and arrays
let cameraX = 0;
let cameraY = 0;
let floorHeight = 48;
let groundLevel;
let player;
let platforms = [];
let entities = [];
let brObjects = [];
let stages;
let currentStage = 0;
let screenShake = 0;

//Animations and sprites
let playerIdleSheet;
let playerrollingSheet;
let playerJumpSheet;
let playerRunningSheet;
let playerPunch1;
let playerPunch2;
let playerPunch3;
let playerSprintSheet;
let playerUpwardPunch;
let playerLedgeSheet;
let playerDownSlam;

//Props and textures
let deadGrassTexture;
let belowGrass;
let backgroundLayer1;
let backgroundLayer2;
let backgroundLayer3;
let backgroundLayerLight;
let deadGrassPlatformM;
let deadGrassPlatformL;
let deadGrassPlatformR;
let stonePlatformL;
let stonePlatformR;
let stonePlatformM;
let dirtStageL;
let dirtStageM;
let dirtStageR;
let deadGrassStageL;
let deadGrassStageM;
let deadGrassStageR;
let spikeUp;

//Breakable objects
let crate;


function preload() {
  //Animations
  playerIdleSheet = loadImage("Character/idle.png");
  playerrollingSheet = loadImage("Character/rolling.png");
  playerJumpSheet = loadImage("Character/jump.png");
  playerRunningSheet = loadImage("Character/running.png");
  playerPunch1 = loadImage("Character/punch_1.png");
  playerPunch2 = loadImage("Character/punch_2.png");
  playerPunch3 = loadImage("Character/punch_3.png");
  playerSprintSheet = loadImage("Character/sprint.png");
  playerUpwardPunch = loadImage("Character/upPunch.png");
  playerLedgeSheet = loadImage("Character/ledgeClimb.png");
  playerDownSlam = loadImage("Character/down.png");

  //Props and textures
  deadGrassTexture = loadImage("PropsTextures/deadGrass.png");
  belowGrass = loadImage("PropsTextures/belowGrass.png");
  deadGrassPlatformM = loadImage("PropsTextures/DGP.png");
  deadGrassPlatformL = loadImage("PropsTextures/DGPL.png");
  deadGrassPlatformR = loadImage("PropsTextures/DGPR.png");
  stonePlatformL = loadImage("PropsTextures/stoneLeft.png");
  stonePlatformM = loadImage("PropsTextures/stoneMiddle.png");
  stonePlatformR = loadImage("PropsTextures/stoneRight.png");
  dirtStageL = loadImage("PropsTextures/dirtLeft.png");
  dirtStageR = loadImage("PropsTextures/dirtRight.png");
  dirtStageM = loadImage("PropsTextures/dirtMiddle.png");
  deadGrassStageL = loadImage("PropsTextures/DGSL.png");
  deadGrassStageM = loadImage("PropsTextures/DGS.png");
  deadGrassStageR = loadImage("PropsTextures/DGSR.png");
  spikeUp = loadImage("PropsTextures/spikeUp.png");

  //Breakable objects
  crate = loadImage("BreakableObjects/Crate.png");

  //Background
  backgroundLayer1 = loadImage("PropsTextures/bgL1.png");
  backgroundLayer2 = loadImage("PropsTextures/bgL2.png");
  backgroundLayer3 = loadImage("PropsTextures/bgL3.png");
  backgroundLayerLight = loadImage("PropsTextures/bgLLight.png");
}

//Platform tables
let deadGrassPlatform;
let stonePlatform;
let dirtStage;
let deadGrassStage;

//Humanoid class which includes anything all player/playerlike entities
class Humanoid {
  constructor(
    x,
    y,
    sizeOfX,
    sizeOfY,
    facing,
    currentAction,
    rollCD,
    strengthOfroll,
    moveSpeed,
    givenScale
  ) {

    //States and stats
    this.imageScale = givenScale || 2;
    this.x = x || width / 2;
    this.y = y || height / 2;
    this.xVel = 0;
    this.yVel = 0;
    this.sizeY = sizeOfY * this.imageScale || 35 * this.imageScale;
    this.sizeX = sizeOfX * this.imageScale || 15 * this.imageScale;
    this.grounded = false;
    this.directionFacing = facing || "right";
    this.actionState = currentAction || "idle";
    this.lastActionState = "idle";
    this.xScale = 1;
    this.yScale = 1;
    this.currentPlatform;
    this.phasingBottom = false;
    this.lastHitTaken = 0;

    //roll
    this.rollCooldown = rollCD || 1000;
    this.lastroll = 0;
    this.rollStrength = strengthOfroll || 9;
    this.lengthOfroll = 300;

    //Movement
    this.jumpStrength = 7;
    this.speed = moveSpeed || 3;
    this.moveDir = 0;

    //Animations
    this.currentFrame = 0;
    this.totalImage = 0;
    this.xCrop = 0;
    this.lastFrameTime = 0;
    this.timeSinceLand = 0;

    //Stats and equips
    this.currentWeapon = "punch";
    this.rangeX = 20;
    this.rangeY = 10;

    //Table of non conflict states
    this.states = [
      "jumpLaunch",
      "jumpFall",
      "punch1",
      "punch2",
      "punch3",
      "ledgeClimb",
      "ledgeClimb",
      "rolling",
      "punchUp",
    ];

    this.attackStates = ["punch1", "punch2", "punch3"];

    //Timers
    this.lastLedgeClimb = 0;
  }

  //Function to apply forces
  applyForces() {
    //Return if currently on a ledge
    if (
      this.actionState === "ledgeClimb" ||
      this.actionState === "ledgeClimb"
    ) {
      this.yVel = 0;
      this.xVel = 0;
      return;
    }

    //Movement
    if (
      this.actionState !== "rolling" &&
      !this.actionState.startsWith("punch") &&
      abs(this.xVel) <= 6
    ) {
      if (this.moveDir !== 0) {
        this.speed = this.actionState === "sprinting" ? 5 : 3;
        let accel = this.speed;
        this.directionFacing = this.moveDir === 1 ? "right" : "left";

        //Make sure decay of xVel doesn't cause speed to drop below walk speed (for roll walking)
        if (abs(this.xVel) > accel) {
          //this.xVel -= Math.sign(this.xVel) * 0.1;
          let resultSpeed = Math.max(abs(this.xVel), accel);
          this.xVel = resultSpeed * Math.sign(this.xVel);
        }
      
        //Slowly change direction if moveDir & xVel direction !== match
        if (
          Math.sign(this.xVel) !== this.moveDir &&
          this.actionState === "sprinting"
        ) {
          let turnPower = 0.4;
          this.xVel += this.moveDir * turnPower;
          this.lastActionState = this.actionState;
          if (abs(this.xVel) > 3) {
            this.actionState = "sprinting";
          }

          //Otherwise treat speed as normal
        }
        else {
          this.xVel = this.moveDir * accel;
        }
      }
    }

    //Apply gravity
    if (!this.grounded && this.actionState) {
      this.yVel += gravitationalForce;
    }

    this.y += this.yVel;

    // Apply bounds
    // let nextX = this.x + this.xVel;

    // if (nextX >= this.sizeX / 2 && nextX <= width - this.sizeX / 2) {
    //   this.x = nextX;
    // }

    let nextX = this.x + this.xVel;
    this.x = nextX;

    //Apply friction if not rolling, 1/4 in air
    if (this.moveDir === 0 && this.actionState !== "rolling") {
      let currentFriction = this.grounded
        ? frictionalForce
        : frictionalForce / 4;

      if (abs(this.xVel) <= currentFriction) {
        this.xVel = 0;
      }
      else {
        this.xVel -= (this.xVel > 0 ? 1 : -1) * currentFriction;
      }
    }

    //Reset ground state
    this.grounded = false;
  }

  handleState() {
    //Skip if currently in an action state
    if (
      this.actionState === "rolling" ||
      this.actionState.startsWith("punch") ||
      this.actionState === "ledgeClimb"
    ) {
      return;
    }

    //Movement/Velocity related state handling
    if (!this.grounded && this.yVel > 0.5 && this.actionState !== "downSlam") {
      this.lastActionState = this.actionState;
      this.actionState = "jumpFall";

      //Elongate player depending on velocity for speed effect
      this.yScale = Math.min(1.2, 1 + this.yVel * 0.005);
      this.xScale = Math.max(0.8, 1 - this.yVel * 0.005);
    }
    else if (this.grounded && this.actionState === "landing") {
      //Return player to normal scale
      this.yScale = 1;
      this.xScale = 1;

      //Return player to normal state after landing
      if (millis() - this.timeSinceLand > 100) {
        this.lastActionState = this.actionState;
        this.actionState = "idle";
      }
    }
    else if (this.grounded && this.xVel === 0) {
      this.lastActionState = this.actionState;
      this.actionState = "idle";
    }
    else if (this.grounded && abs(this.xVel) > 1) {
      if (keyIsDown(SHIFT) && this.actionState !== "rolling") {
        this.lastActionState = this.actionState;
        this.actionState = "sprinting";
      }
      else {
        this.lastActionState = this.actionState;
        this.actionState = "running";
      }
    }
  }

  //Allows entity to jump
  jump() {
    if (this.states.includes(this.actionState)) {
      return;
    }

    if (this.grounded) {
      this.yVel -= this.jumpStrength;
      this.grounded = false;
      this.lastActionState = this.actionState;
      this.actionState = "jumpLaunch";
    }
  }

  //Allows entity to roll
  roll() {
    if (
      millis() - this.lastroll < this.rollCooldown ||
      this.actionState === "ledgeClimb"
    ) {
      return;
    }

    this.lastActionState = this.actionState;
    this.actionState = "rolling";
    this.lastroll = millis();

    this.yVel = 0;

    if (!this.grounded) {
      this.yVel -= 1;
    }

    if (this.directionFacing === "right") {
      this.xVel = Math.min(this.xVel + this.rollStrength, 6);
    }
    else if (this.directionFacing === "left") {
      this.xVel = Math.max(this.xVel - this.rollStrength, -6);
    }
  }

  //Visual effect for when he gets hit
  gotHit() {
    if (millis() - this.lastHitTaken < 150) {
      return;
    }

    this.lastHitTaken = millis();
  }

  phaseCurrentPlatform() {
    if (this.actionState !== "ledgeClimb" && this.grounded) {
      this.phasingBottom = true;
    }
  }
}

//Player class for specific to player functions
class Player extends Humanoid {
  constructor(x, y) {
    super(x, y);

    //Player specific variables
    this.playerControlled = true;
    this.lastHit = 0;
    this.lastCheckpointX = y;
    this.lastCheckpointY = x;
    this.hitItems = [];
    this.alrHit = [];
    this.pressedS = 9999999999;

    //Animations
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.currentSheet = 0;

    //Attacks
    this.currentHit = 1;
    this.hitCD = 300;

    //Animation Sheets
    this.runningSheet = playerRunningSheet;
    this.idleSheet = playerIdleSheet;
    this.rollingSheet = playerrollingSheet;
    this.jumpSheet = playerJumpSheet;
    this.punch1 = playerPunch1;
    this.punch2 = playerPunch2;
    this.punch3 = playerPunch3;
    this.sprintingSheet = playerSprintSheet;
    this.punchUp = playerUpwardPunch;
    this.ledgeClimb = playerLedgeSheet;
    this.downSlam = playerDownSlam;

    //Input buffering
    this.bufferThreshold = 150;
    this.inputBuffers = {
      punch: 0,
      jump: 0,
      roll: 0,
    };

    //Table of spritesheets
    this.sprites = {
      idle: {
        sheet: this.idleSheet,
        totalFrames: 5,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 6,
        yOffset: 18,
        charHeight: 35,
        startFrame: 0,
        shouldLoop: true,
      },

      rolling: {
        sheet: this.rollingSheet,
        totalFrames: 9,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 2,
        yOffset: 28,
        charHeight: 36,
        startFrame: 0,
        oneTime: true,
      },

      jumpLaunch: {
        sheet: this.jumpSheet,
        totalFrames: 4,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 2,
        yOffset: 25,
        charHeight: 40,
        startFrame: 0,
      },

      jumpFall: {
        sheet: this.jumpSheet,
        totalFrames: 1,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 6,
        yOffset: 26,
        charHeight: 36,
        startFrame: 6,
      },

      landing: {
        sheet: this.jumpSheet,
        totalFrames: 2,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 12,
        yOffset: 28,
        charHeight: 36,
        startFrame: 9,
      },

      running: {
        sheet: this.runningSheet,
        totalFrames: 6,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 6,
        yOffset: 26,
        charHeight: 36,
        startFrame: 0,
        shouldLoop: true,
      },

      punch1: {
        sheet: this.punch1,
        totalFrames: 4,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 4,
        yOffset: 26,
        charHeight: 36,
        startFrame: 0,
        oneTime: true,
      },

      punch2: {
        sheet: this.punch2,
        totalFrames: 4,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 4,
        yOffset: 26,
        charHeight: 36,
        startFrame: 0,
        oneTime: true,
      },

      punch3: {
        sheet: this.punch3,
        totalFrames: 4,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 4,
        yOffset: 26,
        charHeight: 36,
        startFrame: 0,
        oneTime: true,
      },

      sprinting: {
        sheet: this.sprintingSheet,
        totalFrames: 6,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 6,
        yOffset: 26,
        charHeight: 36,
        startFrame: 0,
        shouldLoop: true,
      },

      punchUp: {
        sheet: this.punchUp,
        totalFrames: 4,
        imageWidth: 128,
        imageHeight: 47,
        spriteSpeed: 4,
        yOffset: 17,
        charHeight: 47,
        startFrame: 0,
        oneTime: true,
      },

      // ledgeClimb: {
      //   sheet: this.ledgeClimb,
      //   totalFrames: 1,
      //   imageWidth: 128,
      //   imageHeight: 39,
      //   spriteSpeed: 30,
      //   yOffset: 20,
      //   charHeight: 39,
      //   startFrame: 0,
      //   shouldLoop: false,
      // },

      ledgeClimb: {
        sheet: this.ledgeClimb,
        totalFrames: 6,
        imageWidth: 128,
        imageHeight: 61,
        spriteSpeed: 3,
        yOffset: 0,
        charHeight: 61,
        startFrame: 8,
        oneTime: true,
      },

      downSlam: {
        sheet: this.downSlam,
        totalFrames: 3,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 3,
        yOffset: 26,
        charHeight: 40,
        startFrame: 0,
        shouldLoop: true
      }
    };
  }

  //Run every frame to update state/anims/inputs
  update() {
    
    //Reset animation frame
    if (this.actionState !== this.lastActionState) {
      this.currentFrame = 0;
      this.lastActionState = this.actionState;
    }

    //Check for movement inputs
    if (keyIsDown(65) && !keyIsDown(68)) {
      this.moveDir = -1;
    }
    else if (keyIsDown(68) && !keyIsDown(65)) {
      this.moveDir = 1;
    }
    else {
      this.moveDir = 0;
    }

    //reset roll state after lengthOfroll amount of time
    if (
      this.actionState === "rolling" &&
      millis() - this.lastroll > this.lengthOfroll
    ) {
      this.lastActionState = this.actionState;
      this.actionState = "idle";
    }

    //Run other functions
    this.checkInputBuffs();
    this.handleState();

    //If attacking run hitbox chcks
    let facing = this.directionFacing === "left" ? -1 : 1;

    if (this.actionState.startsWith(this.currentWeapon)){
      if (this.actionState.includes("Up")) {
        this.hitItems = getItemsInArea(this.x, this.y - 60, this.rangeX, this.rangeY, this);
      }

      else {
        this.hitItems = getItemsInArea(this.x + 36 * facing, this.y, this.rangeX, this.rangeY, this);
      }
    }

    if (this.actionState === "downSlam") {
      this.hitItems = getItemsInArea(this.x, this.y + 40, this.rangeX, this.rangeY, this);
    }

    let pushedBack = false;

    if (this.hitItems) {
      for (let item of this.hitItems) {
        if (!this.alrHit.includes(item) && item.active){
          this.alrHit.push(item);
          item.onHit();
          screenShake = 4;
          if (this.actionState.startsWith(this.currentWeapon) && !pushedBack){
            this.xVel += this.directionFacing === "right" ? -2 : 2;
            pushedBack = true
          }

          if (this.actionState === "downSlam") {
            this.yVel = -8;
            this.actionState = "jumpLaunch";
          }
        }
      }
    }
  }

  //Check input buffers
  checkInputBuffs() {
    if (millis() - this.inputBuffers.jump < this.bufferThreshold) {
      this.jump();
    }

    if (millis() - this.inputBuffers.roll < this.bufferThreshold) {
      this.roll();
    }

    if (millis() - this.inputBuffers.punch < this.bufferThreshold) {
      this.hit();
    }
  }

  //Display appropriate anim based off current state
  display() {
    //Identify current anim and define variables
    let anim = this.sprites[this.actionState];

    this.frameWidth = this.sprites[this.actionState].imageWidth;
    this.frameHeight = this.sprites[this.actionState].imageHeight;
    this.xCrop = (this.currentFrame + anim.startFrame) * this.frameWidth;
    this.currentSheet = anim.sheet;
    this.totalImage = anim.totalFrames;

    //Make origin at player's current position to flip player image when neccesary
    push();
    translate(this.x, this.y);

    if (this.directionFacing === "left") {
      scale(-1, 1); // Flip horizontally
    }

    //If it is the correct frame to advance frames advance
    if (frameCount % anim.spriteSpeed === 0) {
      let lastFrame = this.currentFrame;
      this.currentFrame = (this.currentFrame + 1) % anim.totalFrames;

      //If animation shouldn't loop, and isn't one time, hold last frame
      if (this.currentFrame === 0 && !anim.shouldLoop && !anim.oneTime) {
        this.currentFrame = lastFrame;
      }

      //If animation is onetime, return to idle after finished
      else if (this.currentFrame === 0 && !anim.shouldLoop && anim.oneTime) {
        if (this.actionState === "ledgeClimb") {
          this.y -= this.sizeY * 0.7;

          let moveForward = 15;
          this.x +=
            this.directionFacing === "left" ? -moveForward : moveForward;

          this.grounded = true;
          this.yVel = 0;
          this.lastLedgeClimb = millis();
        }
        this.lastActionState = this.actionState;
        this.actionState = "idle";
      }
    }

    let verticalOffset = anim.charHeight * this.imageScale * this.yScale / 2;
    let aNew = this.currentSheet;

    if (millis() - this.lastHitTaken < 150) {
      drawingContext.filter = 'brightness(10) contrast(2)'; 
    }

    if (this.actionState === "rolling") {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = color(0, 0, 255);
    }

    if (this.actionState.startsWith("punch")) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255,0 ,0);
    }

    if (this.actionState.startsWith("downSlam")) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255,100 ,0);
    }

    image(
      this.currentSheet,
      0,
      this.lastActionState === "ledgeClimb"
        ? 0
        : -verticalOffset + this.sizeY / 2,
      this.frameWidth * this.imageScale * this.xScale,
      this.frameHeight * this.imageScale * this.yScale,
      this.xCrop,
      anim.yOffset,
      this.frameWidth,
      anim.charHeight
    );
    

    //Reset
    pop();
  }
  
  //Function to hit, used for any M1 attack
  hit() {
    if (
      millis() - this.lastHit < this.hitCD ||
      this.actionState === "rolling" ||
      this.actionState === "ledgeClimb"
    ) {
      return;
    }

    //Upwards punch
    if (this.currentHit === 4) {
      this.currentHit = 1;
    }

    this.xVel *= 0.2;

    this.lastHit = millis();

    if (keyIsDown(87)) {
      this.actionState = this.currentWeapon + "Up";
      this.currentHit = 1;
      
    }

    else if (keyIsDown(83) && !this.grounded && this.actionState !== "downSlam") {
      this.actionState = "downSlam";
      this.currentHit = 1;
      this.yVel += 5;
    }

    else {
      this.actionState = this.currentWeapon + str(this.currentHit);
      this.currentHit += 1;
    }

    this.alrHit = [];

  }

  respawn() {
    console.log(this.lastCheckpointX, this.lastCheckpointY);
    this.x = this.lastCheckpointX;
    this.y = this.lastCheckpointY - 5;
    this.xVel = 0;
    this.yVel = 0;
  }
}

//Platform class
class Platform {
  constructor(xPos, yPos, sizeX, sizeY, oneWay, theColor, theImage, tileX, tileY, canClimb, bottomBlock) {
    this.x = xPos;
    this.y = yPos;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.oneWay = oneWay;
    this.color = theColor ? theColor: "white";
    this.img = theImage;
    this.tilesizeX = tileX;
    this.tilesizeY = tileY;
    this.canClimb = canClimb;
    this.bottomBlock = bottomBlock;
  }

  //Display platform with texture or fallback as rectangle
  display() {
    if (this.img) {
      let displasizeYX = this.tilesizeX ? this.tilesizeX: 150;
      let displasizeYY = this.tilesizeY ? this.tilesizeY : 150;
      
      push(); //save current settings
      imageMode(CORNER); //Return to image mode corner because tiling is too hard for me with center

      
      for (let x = 0; x < this.sizeX; x += displasizeYX) {
        for (let y = 0; y < this.sizeY; y += displasizeYY){

          let currentImage = this.img;
          if (Array.isArray(this.img)) {
            currentImage = x === 0 ? this.img[0] : x + displasizeYX >= this.sizeX ? this.img[2] : this.img[1];
          }


          let dW = Math.min(displasizeYX, this.sizeX - x); 
          let dH = Math.min(displasizeYY, this.sizeY - y);
          
          let sourceW = map(dW, 0, displasizeYX, 0, currentImage.width);
          let sourceH = map(dH, 0, displasizeYY, 0, currentImage.height);

          image(
            currentImage,
            this.x - this.sizeX / 2 + x,  //Since we are on image mode center we need to re,
            this.y - this.sizeY / 2 + y,
            dW, dH,
            0, 0,
            sourceW,
            sourceH
          );
        }
      }
      pop(); //Return to old settings
    }
    else{
      fill(this.color) ;
      rect(this.x, this.y, this.sizeX, this.sizeY);
    }
    
  }

  snapToLedge(item, side) {
    this.lastActionState = this.actionState;
    item.actionState = "ledgeClimb";
    item.xVel = 0;
    item.yVel = 0;
    item.currentPlatform = this;


    item.y = this.top + item.sizeY * 0.25 - 4;

    item.x =
      side === "left"
        ? this.left - item.sizeX / 2 + 5
        : this.right + item.sizeX / 2 - 5;
    item.directionFacing = side === "left" ? "right" : "left";
  }

  //Check collisions with given item
  checkcollision(item) {
    let itemBottom = item.y + item.sizeY / 2;
    let itemLeft = item.x - item.sizeX / 2;
    let itemRight = item.x + item.sizeX / 2;
    let itemTop = item.y - item.sizeY / 2;
    let handY = item.y - item.sizeY / 4;
    let headY = item.y - item.sizeY / 2;
    let itemHit = false;

    this.top = this.y - this.sizeY / 2;
    this.bottom = this.y + this.sizeY / 2;
    this.left = this.x - this.sizeX / 2;
    this.right = this.x + this.sizeX / 2;

    //Ledge grab checks

    //Right
    if (
      abs(itemLeft - this.right) < 5 &&
      abs(handY - this.top) < 15 &&
      item.directionFacing === "left" &&
      item.actionState !== "rolling" &&
      !item.attackStates.includes(item.actionState) &&
      millis() - item.lastLedgeClimb > 500 &&
      !item.grounded && this.canClimb
    ) {
      
      //Skip ledge climb if this function is being applied to a hurt block
      if (this instanceof HurtBlock) {
        return true;
      }

      this.snapToLedge(item, "right");
      console.log("Grabbed ledge");
    }

    //Left
    if (
      item.xVel >= 0 &&
      abs(itemRight - this.left) < 5 &&
      abs(handY - this.top) < 15 &&
      item.directionFacing === "right" &&
      item.actionState !== "rolling" &&
      !item.attackStates.includes(item.actionState) &&
      millis() - item.lastLedgeClimb > 500 &&
      !item.grounded && this.canClimb
    ) {

      console.log("Grabbed left");

      if (this instanceof HurtBlock) {
        return true;
      }

      this.snapToLedge(item, "left");
      console.log("Grabbed ledge");
    }

    //Floor check
    if (
      itemRight > this.left  &&
      itemLeft < this.right &&
      itemBottom >= this.top &&
      itemBottom <= this.top + max(5, item.yVel + 2)
    ) {

      if (this.bottomBlock || item.phasingBottom === true && item.currentPlatform === this && this.oneWay) {
        return ;
      }

      if (item.yVel > 0.2) {
        this.lastActionState = this.actionState;
        item.actionState = "landing";
        item.timeSinceLand = millis();
        itemHit = true;
        item.phasingBottom = false;
      }

      if (!(this instanceof HurtBlock)) {
        item.lastCheckpointX = item.x;
        item.lastCheckpointY = item.y;
      }


      item.currentPlatform = this;
      item.y = this.top - item.sizeY / 2;

      if (item instanceof Debris && item.yVel > 0.5) {
        item.yVel *= -0.4;
        item.xVel *= 0.6;  
      }

      //Only set yVel to 0 if we're not going up
      if (item.yVel > 0) {
        item.yVel = 0;
        item.currentPlatform = this;
        item.phasingBottom = false;
      }

      item.grounded = true;
    }

    if (
      itemBottom > this.top + footOffset &&
      itemTop < this.bottom - footOffset
    ) {
      //If item runs into left of object
      if (
        item.xVel >= 0 &&
        itemRight > this.left &&
        itemLeft < this.left &&
        item.xVel > 0
      ) {
        item.x = this.left - item.sizeX / 2;
        item.xVel = 0;
        return true;
      }

      //If item runs into right of object
      if (
        item.xVel <= 0 &&
        itemLeft < this.right &&
        itemRight > this.right &&
        item.xVel < 0
      ) {
        item.x = this.right + item.sizeX / 2;
        item.xVel = 0;
        return true;
      }

      //If item headbumps object
      if (
        !this.oneWay &&
        itemRight > this.left &&
        itemLeft < this.right &&
        itemTop <= this.bottom &&
        itemTop >= this.top
      ) {
        item.y = this.bottom + item.sizeY / 2;
        console.log("hit two way platform");
        item.yVel = 0;
        itemHit = true;
      }
    }
    return itemHit;
  }
}

class HurtBlock extends Platform{
  constructor(xPos, yPos, sizeX, sizeY, oneWay, theColor, theImage, tileX, tileY) {
    super(xPos, yPos, sizeX, sizeY, oneWay, theColor, theImage, tileX, tileY);
  }

  checkcollision(item) {
    if (super.checkcollision(item)){
      item.gotHit();

      if (item instanceof Player) {
        item.respawn();
      }
    }
  }

}

//Takes small parts of a given image and shoots them outwards like debris
class Debris{
  constructor(x, y, ogImg, width, height, broken) {
    this.y = y + random(-20, 20);

    //Useless variables only so collision functions dont crash
    this.actionState = "Debris";
    this.actionStates = [];
    this.directionFacing = "None";
    this.lastLedgeClimb = 0;
    this.phasingBottom = false;

    this.grounded = false;

    //Which part of the image to take
    let imgX = floor(random(0, ogImg.width - 20));
    let imgY = floor(random(0, ogImg.width - 20));
    this.sizeX = !broken ? floor(random(width/8, width/4)) : floor(random(width/7, width/4));
    this.sizeY = !broken ? floor(random(height/12, height/6)) : floor(height/8, height/4);


    //Create a new canvas inside the existing canvas so we can rotate, bounce, and move the chunk independently
    this.newCanvas = createGraphics(this.sizeX, this.sizeY);

    //Takes a chunk out of our existing canvas (the image we are using), and pastes it into the new canvas
    this.newCanvas.copy(ogImg, imgX, imgY, this.sizeX, this.sizeY, 0, 0, this.sizeX, this.sizeY);

    //The physics we will apply to make it look like debris
    this.xVel = random(-5, 5);

    if (broken) {
      this.x = x;
    }
    else {
      this.x = this.xVel > 0 ? x + width/2 - 10 : x - width/2+ 10;
    }

    this.yVel = random(-2, -1);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.1, 0.1);
  }

  //Update position and apply physics
  update() {
    this.x += this.xVel;
    this.xVel *= 0.95;
    this.angle += this.rotationSpeed;
    
    if (!this.grounded) {
      this.yVel += gravitationalForce;
    }
    else {
      [
        this.rotationSpeed = 0
      ];
    }

    this.grounded = false;
    this.y += this.yVel;
  }

  //Display new canvas
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    image(this.newCanvas, 0, 0);
    pop();
  }
}

class breakableObject {
  constructor(x, y, sizeX, sizeY, mainImg, health) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.img = mainImg;
    this.health = health;
    this.chunks = [];
    this.active = true;

    this.top = this.y - this.sizeY / 2;
    this.bottom = this.y + this.sizeY / 2;
    this.left = this.x - this.sizeX / 2;
    this.right = this.x + this.sizeX / 2;

  }

  onHit() {
    if (!this.active) {
      return;
    }

    this.health -= 1;

    if (this.health <= 0) {

      for (let i = 0; i < 25; i++) {
        this.chunks.push(new Debris (this.x, this.y, this.img, this.sizeX, this.sizeY, true));
      }
    }

    else {
      for (let i = 0; i < 5; i++) {
        this.chunks.push(new Debris (this.x, this.y, this.img, this.sizeX, this.sizeY, false));
      }
    }
  }

  display() {
    if (this.active) {
      image(this.img, this.x, this.y, this.sizeX, this.sizeY);
    }

    for (let i = this.chunks.length - 1; i >= 0; i--) {
      this.chunks[i].update();
      this.chunks[i].display();
    }

    if (this.health <= 0 ) {
      this.active = false;
    }
  }

  checkCollision(item) {
    if (!this.active) {
      return;
    }

    let itemBottom = item.y + item.sizeY / 2;
    let itemLeft = item.x - item.sizeX / 2;
    let itemRight = item.x + item.sizeX / 2;
    let itemTop = item.y - item.sizeY / 2;

    if (
      itemRight > this.left  &&
      itemLeft < this.right &&
      itemBottom >= this.top &&
      itemBottom <= this.top + max(5, item.yVel + 2)
    ) {

      if (item.yVel > 0.2) {
        this.lastActionState = this.actionState;
        item.actionState = "landing";
        item.timeSinceLand = millis();
        item.phasingBottom = false;
      }

      if (!(this instanceof HurtBlock)) {
        item.lastCheckpointX = item.x;
        item.lastCheckpointY = item.y;
      }

      
      item.currentPlatform = this;
      item.y = this.top - item.sizeY / 2;

      //Only set yVel to 0 if we're not going up
      if (item.yVel > 0) {
        item.yVel = 0;
        item.currentPlatform = this;
        item.phasingBottom = false;
      }

      item.grounded = true;
    }

    if (
      itemBottom > this.top + footOffset &&
      itemTop < this.bottom - footOffset
    ) {
      //If item runs into left of object
      if (
        item.xVel >= 0 &&
        itemRight > this.left &&
        itemLeft < this.left &&
        item.xVel > 0
      ) {
        item.x = this.left - item.sizeX / 2;
        item.xVel = 0;
        return;
      }

      //If item runs into right of object
      if (
        item.xVel <= 0 &&
        itemLeft < this.right &&
        itemRight > this.right &&
        item.xVel < 0
      ) {
        item.x = this.right + item.sizeX / 2;
        item.xVel = 0;
        return;
      }

      //If item headbumps object
      if (
        !this.oneWay &&
        itemRight > this.left &&
        itemLeft < this.right &&
        itemTop <= this.bottom &&
        itemTop >= this.top
      ) {
        item.y = this.bottom + item.sizeY / 2;
        console.log("hit two way platform");
        item.yVel = 0;
      }
    }
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  groundLevel = height - floorHeight;


  rectMode(CENTER);
  imageMode(CENTER);
  noSmooth();

  console.log("Image Width: " + playerIdleSheet.width);
  console.log("Image Height: " + playerIdleSheet.height);

  deadGrassPlatform = [deadGrassPlatformL, deadGrassPlatformM, deadGrassPlatformR];
  stonePlatform = [stonePlatformL, stonePlatformM, stonePlatformR];
  dirtStage = [dirtStageL, dirtStageM, dirtStageR];
  deadGrassStage = [deadGrassStageL, deadGrassStageM, deadGrassStageR];

  stages = { testStage:
    {
      spawPointX: width/2,
      spawnPointY: height/2
    }
  };

  testStage();
  
  player = new Player(width / 2, groundLevel - 250);

  otherPlayer = new Player(stages[currentStage].xPos, stages[currentStage].yPos);
  entities.push(player);

  console.log(platforms);
}

function draw() {
  background(245, 245, 220);

  scale(1.5);
  drawBackground();
  let sHoldTime = player.pressedS > 0 ? millis() - player.pressedS : 0;

  player.update();
  applyAllPhysics();
  checkAllcollisions();

  //Follow player with camera
  let targetX = width / 2 - player.x - 250 ;
  let targetY = height / 2 - player.y; 

  if (sHoldTime > 500 && player.grounded) {
    let lookDownShift = 75; 
    targetY -= lookDownShift;
  }

  let currentLerp = sHoldTime > 500 ? 0.05 : 0.2;

  cameraX = lerp(cameraX, targetX, 0.4);
  cameraY = lerp(cameraY, targetY, currentLerp);

  push();

  let screenShakeX = 0;
  let screenShakeY = 0;
  
  if (screenShake > 0.1) {
    screenShakeX = random(-screenShake, screenShake);
    screenShakeY = random(-screenShake, screenShake);
    screenShake *= 0.8;
  }
  else {
    screenShake = 0;
  }

  translate(cameraX + screenShakeX, cameraY + screenShakeY);

  //Draw
  drawAllPlatforms();
  drawAllEntities();
  drawAllBreakableObjects();

  pop();
}

//Inputs
function keyPressed() {
  if (key === " ") {
    player.jump();
    player.inputBuffers.jump = millis();
    player.pressedS = 0;
  }

  if (keyCode === SHIFT) {
    player.roll();
    player.inputBuffers.roll = millis();
    player.pressedS = 0;
  }

  if (key === 's' && player.grounded) {
    player.phaseCurrentPlatform();
    player.pressedS = millis();
  }
}

function keyReleased() {
  if (key === 's') {
    player.pressedS = 0;
  }
}

function mousePressed() {
  player.hit();
  player.inputBuffers.punch = millis();
  player.pressedS = 0;
}

//Helper function to draw small tower of oneway collision platforms
function makeTower(x, y, amount) {
  let spacing = 80; 
  for (let i = 0; i < amount; i++) {
    let floorY = y - i * spacing;
    platforms.push(new Platform(x, floorY, 96, 9, true, "blue", stonePlatform, 24, 9, true));
  }
}

//Helper function to loop through entities and platforms and check collisions
function checkAllcollisions() {
  for (let platform of platforms) {
    for (let person of entities) {
      platform.checkcollision(person);
    }
  }

  for (let object of brObjects) {
    for (let person of entities) {
      object.checkCollision(person);
    }
  }

  for (let platform of platforms) {
    for (let object of brObjects) {
      for (let chunk of object.chunks) {
        platform.checkcollision(chunk);
      }
    }
  }
}

function drawAllPlatforms() {
  for (let platform of platforms) {
    platform.display();
  }
}

function drawAllEntities() {
  for (let entity of entities) {
    entity.display();
  }
}

function drawAllBreakableObjects() {
  for (let object of brObjects) {
    object.display();
  }
}

//Helper function to apply physics of all characters
function applyAllPhysics() {
  for (let entity of entities) {
    entity.applyForces();
  }
}

//Resizes the canvas with the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//Unused function to draw a parallex background 
function drawBackground() {
  let bgX = cameraX * layer1Speed % width;

  image(backgroundLayer1, bgX, backgroundY, width/2, height);
  image(backgroundLayer1, bgX + width/2, backgroundY , width/2, height);
  image(backgroundLayer1, bgX + width, backgroundY , width/2, height);
  image(backgroundLayer1, bgX - width/2, backgroundY , width/2, height);
  image(backgroundLayer1, bgX - width, backgroundY , width/2, height);

  image(backgroundLayerLight, bgX, backgroundY + 200, width/2, height);
  image(backgroundLayerLight, bgX + width/2, backgroundY + 200 , width/2, height);
  image(backgroundLayerLight, bgX + width, backgroundY + 200 , width/2, height);
  image(backgroundLayerLight, bgX - width/2, backgroundY + 200 , width/2, height);
  image(backgroundLayerLight, bgX - width, backgroundY + 200 , width/2, height);

  bgX = cameraX * layer2Speed % width;
  image(backgroundLayer2, bgX, backgroundY, width/2, height);
  image(backgroundLayer2, bgX + width/2, backgroundY , width/2, height);
  image(backgroundLayer2, bgX + width, backgroundY , width/2, height);
  image(backgroundLayer2, bgX - width/2, backgroundY , width/2, height);
  image(backgroundLayer2, bgX - width, backgroundY , width/2, height);

  bgX = cameraX * layer3Speed % width;
  image(backgroundLayer3, bgX, backgroundY, width/2, height);
  image(backgroundLayer3, bgX + width/2, backgroundY , width/2, height);
  image(backgroundLayer3, bgX + width, backgroundY , width/2, height);
  image(backgroundLayer3, bgX - width/2, backgroundY , width/2, height);
  image(backgroundLayer3, bgX - width, backgroundY , width/2, height);


}

//Function to create a stage based off blocks wide/tall rather than pixels
function createStage(x, y, blocksWide, blocksTall) {
  let dirtH = 24 * (blocksTall - 1);
  let grassH = 24; 

  platforms.push(new Platform(x, y, 24 * blocksWide, dirtH, false, "brown", dirtStage, 48, 48, false, true));
  platforms.push(new Platform(x, y - dirtH / 2 - grassH / 2, grassH * blocksWide, 24, false, "brown", deadGrassStage, 48, 48, true)); 
}

//Create a spike pit based off blockswide
function createSpikePit(x, y, blocksWide) {
  platforms.push(new HurtBlock(x, y, 16 * blocksWide, 32, false, "red", spikeUp, 16, 32));
}

function createPlatform(x, y, blocksWide, theTexture) {
  platforms.push(new Platform(x, y, 24 * blocksWide, 9, true, "blue", theTexture, 24, 9, true));
}

function createBreakableObject(x, y, blocksWide, blocksTall, health) {
  brObjects.push(new breakableObject(x, y, 24 * blocksWide, 24 * blocksTall, crate, health));
}

//Stage setups
function testStage() {
  currentStage = "testStage";
  //Left island
  createStage(width / 2 - 600, groundLevel , 10, 30);
  createStage(width / 2 - 300, groundLevel , 10, 20);

  //Way to right cluster
  makeTower(width / 2 - 25, groundLevel - 330, 4);
  
  //Random stage generator
  for (let i = 900; i < 10000; i += random(300, 500)) {

    createStage(width / 2 - i, groundLevel - random(150, 200), 12, random(10, 16));
  }

  //Death block underneath
  createSpikePit(width/2, groundLevel + 500, 800);

  //Right cluster
  createStage(width / 2 + 600, groundLevel, 10, 35);
  createStage(width / 2 + 355, groundLevel , 14, 50);
  createStage(width / 2 + 800, groundLevel , 14, 50);
  createSpikePit(width / 2 + 577, groundLevel - 37 * 12, 7 );

  //Main floor
  createStage(width / 2, groundLevel - 50, 24, 7);

  //Platform
  createPlatform(width / 2 + 1500 , groundLevel - 600, 15, deadGrassPlatform);

  //Breakable object
  for (let i = width/2; i < 3000; i += 48) {
    createBreakableObject(i, groundLevel - 168, 2, 2, 1);
  }
  
}

function getItemsInArea(x, y, sizeX, sizeY, self) {
  let items = [];
  let squareLeft = x - sizeX/2;
  let squareRight = x + sizeX/2;
  let squareTop = y - sizeY/2;
  let squareBottom = y + sizeY/2;

  //createPlatform(x, y, 1, deadGrassPlatform)

  for (let entity of entities) {
    if (entity === self) {
      continue;
    }

    let top = entity.y - entity.sizeY / 2;
    let bottom = entity.y + entity.sizeY / 2;
    let left = entity.x - entity.sizeX / 2;
    let right = entity.x + entity.sizeX / 2;
    
    let isOutside = left > squareRight || right < squareLeft || top > squareBottom || bottom < squareTop; 

    if (!isOutside) {
      items.push(entity);
    }
  }

  for (let object of brObjects) {
    

    let top = object.y - object.sizeY / 2;
    let bottom = object.y + object.sizeY / 2;
    let left = object.x - object.sizeX / 2;
    let right = object.x + object.sizeX / 2;
    
    let isOutside = left > squareRight || right < squareLeft || top > squareBottom || bottom < squareTop; 

    if (!isOutside) {
      items.push(object);
    }
  }

  return items;
}
let thing = 0;