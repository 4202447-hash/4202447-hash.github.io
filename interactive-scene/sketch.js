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
const backgroundY = 300;
const cameraBoxWith = 200;


//Important Globals and arrays
let cameraX = -250;
let cameraY = 0;
let floorHeight = 48;
let groundLevel;
let player;
let platforms = [];
let entities = [];
let brObjects = [];
let gates = [];
let stages;
let currentStage = 0;
let screenShake = 0;

//Variables specific for certain functions to run
let fadeAmount = 0;
let fade = "none";
let fadeRate = 10;

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
let playerBlock;
let mushroomIdle;
let mushroomAttack;
let mushroomDie;
let mushroomRun;
let mushroomStun;
let mushroomGotHit;

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
let stoneStageL;
let stoneStageM;
let stoneStageR;
let dirtStageL;
let dirtStageM;
let dirtStageR;
let deadGrassStageL;
let deadGrassStageM;
let deadGrassStageR;
let spikeUp;

//GUI
let redHeart;
let blueHeart;
let greenHeart;
let yellowHeart;
let emptyHeart;

let hearts;

//Breakable objects
let crate;


function preload() {
  //Player Animations
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
  playerBlock = loadImage("Character/block.png");

  //Mushroom animations
  mushroomAttack = loadImage("Mushroom/Mushroom-Attack.png")
  mushroomDie = loadImage("Mushroom/Mushroom-Die.png")
  mushroomIdle = loadImage("Mushroom/Mushroom-Idle.png")
  mushroomRun = loadImage("Mushroom/Mushroom-Run.png")
  mushroomStun = loadImage("Mushroom/Mushroom-Stun.png")
  mushroomGotHit = loadImage("Mushroom/Mushroom-Hit.png")

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
  stoneStageL = loadImage("PropsTextures/stoneStageLeft.png");
  stoneStageR = loadImage("PropsTextures/stoneStageRight.png");
  stoneStageM = loadImage("PropsTextures/stoneStageMiddle.png");

  //Breakable objects
  crate = loadImage("BreakableObjects/Crate.png");

  //Background
  backgroundLayer1 = loadImage("PropsTextures/bgL1.png");
  backgroundLayer2 = loadImage("PropsTextures/bgL2.png");
  backgroundLayer3 = loadImage("PropsTextures/bgL3.png");
  backgroundLayerLight = loadImage("PropsTextures/bgLLight.png");

  //GUI
  redHeart = loadImage("GUI/redHeart.png");
  blueHeart = loadImage("GUI/blueHeart.png");
  greenHeart = loadImage("GUI/greenHeart.png");
  yellowHeart = loadImage("GUI/yellowHeart.png");
  emptyHeart = loadImage("GUI/emptyHeart.png");
}

//Platform tables
let deadGrassPlatform;
let stonePlatform;
let dirtStage;
let deadGrassStage;
let stoneStage;

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
    this.rangeX = 25;
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
    this.x = this.x + this.xVel;

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
    this.pressedS = 0;

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
    this.blockAnim = playerBlock;

    //Hearts and huds
    this.redHeartActive = true;
    this.blueHeartActive = true;
    this.greenHeartActive = true;
    this.yellowHeartActive = true;

    this.redBar = 50;
    this.blueBar = 10;
    this.greenBar = 80;
    this.yellowBar = 65;

    //Input buffering
    //Stores inputs so we can keep trying to run them for 150ms
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
      },

      blocking: {
        sheet: this.blockAnim,
        totalFrames: 3,
        imageWidth: 128,
        imageHeight: 35,
        spriteSpeed: 6,
        yOffset: 18,
        charHeight: 35,
        startFrame: 0,
        oneTime: true,
      }
    };
  }

  //Handles state to match with landing, sprinting ect
  handleState() {
    //Skip if currently in an action state
    if (
      this.actionState === "rolling" ||
      this.actionState.startsWith("punch") ||
      this.actionState === "ledgeClimb" ||
      this.actionState === "blocking"
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

    //If grounded and standing still Idle
    else if (this.grounded && this.xVel === 0) {
      this.lastActionState = this.actionState;
      this.actionState = "idle";
    }

    //if grounded and moving and holding shift then sprinting
    else if (this.grounded && abs(this.xVel) > 1) {
      if (keyIsDown(SHIFT) && this.actionState !== "rolling") {
        this.lastActionState = this.actionState;
        this.actionState = "sprinting";
      }

      //If moving running
      else {
        this.lastActionState = this.actionState;
        this.actionState = "running";
      }
    }
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

    if (this.actionState === "blocking") {
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
      this.hitItems = getItemsInArea(this.x, this.y + 45, this.rangeX, this.rangeY, this);
    }

    //Variable to remember if we have already applied opposite velocity when hitting person
    let pushedBack = false;

    //Run on hit for things hit and shake screen
    if (this.hitItems.length) {
      for (let item of this.hitItems) {
        if (!this.alrHit.includes(item) && item.active){
          this.alrHit.push(item);
          item.onHit();
          screenShake = 4;
          if (this.actionState.startsWith(this.currentWeapon) && !pushedBack){
            this.xVel += this.directionFacing === "right" ? -2 : 2;
            pushedBack = true;
          }

          //Pogos the player up if they destroy an object/hit a entity below them
          if (this.actionState === "downSlam") {
            this.yVel = -8;
            this.actionState = "jumpLaunch";
          }
        }
      }
    }

    //console.log(this.actionState);
  }

  //Check input buffers (tries to run the input)
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

    //Vertical offset which adjusts to the different animations (avoid changing)
    let verticalOffset = anim.charHeight * this.imageScale * this.yScale / 2;

    if (millis() - this.lastHitTaken < 150) {
      drawingContext.filter = 'brightness(10) contrast(2)'; 
    }

    if (this.actionState === "rolling") {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = color(0, 0, 255);
    }

    if (this.actionState === "blocking") {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = color(240,230,140);
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

    this.redBar = Math.min(this.redBar + 1, 100) ;

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

    //Down Slam
    else if (keyIsDown(83) && !this.grounded && this.actionState !== "downSlam") {
      this.actionState = "downSlam";
      this.currentHit = 1;
      this.yVel = Math.max(5, this.yVel + 5)
    }

    //Normal punch
    else {
      this.actionState = this.currentWeapon + str(this.currentHit);
      this.currentHit += 1;
    }

    //Reset things that are already hit
    this.alrHit = [];

  }

  //Function to block
  block() {
    this.lastActionState === this.actionState;
    this.actionState = "blocking";
  }

  //Function which respawns player at last grounded area, should be different from full reset which returns player to last checkpoint
  respawn() {
    console.log(this.lastCheckpointX, this.lastCheckpointY);
    this.x = this.lastCheckpointX;
    this.y = this.lastCheckpointY - 5;
    this.xVel = 0;
    this.yVel = 0;
  }

  showGUI() {
    let startingHeight = 775;
    let startingWidth = 30;
    let backgroundBarWidth = 170;
    let barOffset = 90;
    let healthOffset = 5;

    push();
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = color(0, 0, 0);

    //Red
    let redWith = map(this.redBar, 0, 100, 0, 180);

    noStroke();
    fill(220, 0, 0);
    rect(startingWidth + redWith/2 - healthOffset, height - startingHeight, redWith, 15);

    stroke(0);
    fill(0);
    noFill();
    rect(startingWidth + barOffset, height - startingHeight, backgroundBarWidth, 16);

    image(redHeart, startingWidth, height - startingHeight, 32, 32);

    //Blue
    let blueWidth = map(this.blueBar, 0, 100, 0, 180);

    noStroke();
    fill(0, 0, 220);
    rect(startingWidth + blueWidth/2 - healthOffset, height - startingHeight - 50, blueWidth, 15);

    stroke(0);
    fill(0);
    noFill();
    rect(startingWidth + barOffset, height - startingHeight - 50, backgroundBarWidth, 16);

    image(blueHeart, startingWidth, height - startingHeight - 50, 32, 32);

    //Yellow
    let yellowWidth = map(this.yellowBar, 0, 100, 0, 180);

    fill(219, 231, 62);
    rect(startingWidth + yellowWidth/2 - healthOffset, height - startingHeight - 100, yellowWidth, 15);

    stroke(0);
    fill(0);
    noFill();
    rect(startingWidth + barOffset, height - startingHeight - 100, backgroundBarWidth, 16);

    image(yellowHeart, startingWidth, height - startingHeight - 100, 32, 32);

    //Green
    let greenWidth = map(this.greenBar, 0, 100, 0, 180);

    fill(0, 120, 36);
    rect(startingWidth + greenWidth/2 - healthOffset, height - startingHeight - 150, greenWidth, 15);

    stroke(0);
    fill(0);
    noFill();
    rect(startingWidth + barOffset, height - startingHeight - 150, backgroundBarWidth, 16);

    image(greenHeart, startingWidth, height - startingHeight - 150, 32, 32);

    pop();
  }
}

class Mushroom extends Humanoid {
  constructor(x, y, startPos, endPos) {
    super(x, y);

    //Settings
    this.imageScale = 1.5
    this.sizeY = 27 * this.imageScale
    this.sizeX = 20 * this.imageScale 
    this.active = true

    //Variables specific to entity for enemy AI
    this.startPos = startPos;
    this.endPos = endPos;
    this.hasTarget = false

    //Animations
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.currentSheet = 0;

    this.hit = mushroomAttack
    this.die = mushroomDie
    this.stunned = mushroomStun
    this.idle = mushroomIdle
    this.run = mushroomRun
    this.gotHit = mushroomGotHit
    this.sprites = {
      idle: {
        sheet: this.idle,
        totalFrames: 7,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 6,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        shouldLoop: true,
      },

      landing: {
        sheet: this.idle,
        totalFrames: 7,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 6,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        shouldLoop: true,
      },

      attack: {
        sheet: this.hit,
        totalFrames: 10,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 2,
        yOffset: 0,
        charHeight: 36,
        startFrame: 0,
        oneTime: true,
      },

      gotHit: {
        sheet: this.gotHit,
        totalFrames: 5,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 5,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        oneTime: true,
      },
    }
  }

  display() {
     console.log(this.actionState)
    //Identify current anim and define variables
    let anim = this.sprites[this.actionState];

    this.frameWidth = this.sprites[this.actionState].imageWidth;
    this.frameHeight = this.sprites[this.actionState].imageHeight;
    this.xCrop = (this.currentFrame + anim.startFrame) * this.frameWidth;
    this.currentSheet = anim.sheet;
    this.totalImage = anim.totalFrames;

    //Make origin at Mushrooms's current position to flip player image when neccesary
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
        this.lastActionState = this.actionState;
        this.actionState = "idle";
      }
    }

    //Vertical offset which adjusts to the different animations (avoid changing)
    let verticalOffset = anim.charHeight * this.imageScale * this.yScale / 2;

    if (this.actionState === "attack") {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255,0 ,0);
    }

    image(
      this.currentSheet,
      0,
      -verticalOffset + this.sizeY / 2,
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

  update() {
    //Reset animation frame
    if (this.actionState !== this.lastActionState) {
      this.currentFrame = 0;
      this.lastActionState = this.actionState;
    }

    //If attacking run hitbox chcks
    let facing = this.directionFacing === "left" ? -1 : 1;

    if (this.actionState === "attack"){
      this.hitItems = getItemsInArea(this.x + 36 * facing, this.y, this.rangeX, this.rangeY, this);
    }

    //Variable to remember if we have already applied opposite velocity when hitting person
    let pushedBack = false;

    //Run on hit for things hit and shake screen
    if (this.hitItems.length) {
      for (let item of this.hitItems) {
        if (!this.alrHit.includes(item) && item.active){
          this.alrHit.push(item);
          item.onHit();
          screenShake = 4;
          if (this.actionState ==="attack" && !pushedBack){
            this.xVel += this.directionFacing === "right" ? -2 : 2;
            pushedBack = true;
          }
        }
      }
    }
  }

  onHit() {
    this.currentFrame = 0
    this.actionState = "gotHit"

    this.xVel = player.x < this.x ? this.xVel + 3 : this.xVel - 3
  }
}

//Platform class
class Platform {
  constructor(xPos, yPos, sizeX, sizeY, oneWay, theColor, theImage, tileX, tileY, canClimb, bottomBlock, cantCollide) {
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
    this.cantCollide = cantCollide;
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

          //If we are tiling with several images to have corner blocks set current image to appropriate block
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
      //If no image just make rectangle
      fill(this.color) ;
      rect(this.x, this.y, this.sizeX, this.sizeY);
    }
    
  }

  //Snaps an item to a ledge with a side
  snapToLedge(item, side) {
    if (item instanceof Mushroom) {
      return
    }
    
    this.lastActionState = this.actionState;
    item.actionState = "ledgeClimb";
    item.xVel = 0;
    item.yVel = 0;
    item.currentPlatform = this;

    //set items yPos to have top quarter in position - an offset
    item.y = this.top + item.sizeY * 0.25 - 4;

    //Stick item to appropriate edge based off side +- offset
    item.x =
      side === "left"
        ? this.left - item.sizeX / 2 + 5
        : this.right + item.sizeX / 2 - 5;
    item.directionFacing = side === "left" ? "right" : "left";
  }

  //Check collisions with given item
  checkcollision(item) {
    if (this.cantCollide) {
      return;
    }

    let itemBottom = item.y + item.sizeY / 2;
    let itemLeft = item.x - item.sizeX / 2;
    let itemRight = item.x + item.sizeX / 2;
    let itemTop = item.y - item.sizeY / 2;
    let handY = item.y - item.sizeY / 4 - 1;
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
      return true;
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

      if (item instanceof Player) {
        item.respawn();
        item.gotHit();
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

    this.yVel = random(-5, -4);
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
        item.yVel = 0;
      }
    }
  }
}

class Gate {
  constructor(x, y, from, to, sizeX, sizeY, toX, toY) {
    this.x = x;
    this.y = y;
    this.from = from;
    this.to = to;
    this.toX = toX;
    this.toY = toY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.top = this.y - this.sizeY / 2;
    this.bottom = this.y + this.sizeY / 2;
    this.left = this.x - this.sizeX / 2;
    this.right = this.x + this.sizeX / 2;
  }

  touched(){
    let item = player;
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
      return true;
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
        return true;
      }

      //If item runs into right of object
      if (
        item.xVel <= 0 &&
        itemLeft < this.right &&
        itemRight > this.right &&
        item.xVel < 0
      ) {
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
        return true;
      }
    }
  }

  isTouched() {
    if (this.touched()) {
      fade = "out";
      setTimeout(() => {
        player.yVel = 0;
        clearStage();
        console.log(this.to);
        window[this.to]();
        player.x = this.toX;
        player.y = this.toY;
      }, 
      500);
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
  stoneStage = [stoneStageL, stoneStageM, stoneStageR];

  stages = { testStage:
    {
      spawPointX: width/2,
      spawnPointY: height/2
    }
  };

  player = new Player(width / 2 , groundLevel - 250);
  stage1();
  
  entities.push(player);

  console.log(platforms);
}

function draw() {
  background(245, 245, 220);

  scale(1.7);
  drawBackground();

  //Variable to see how long S has been held
  let sHoldTime = player.pressedS > 0 ? millis() - player.pressedS : 0;

  //Run all non draw related functions
  player.update();
  applyAllPhysics();
  checkAllcollisions();

  //Follow player with camera
  let targetX = width / 2 - player.x - 250 ;
  let targetY = height / 2 - player.y - 100; 


  if (sHoldTime > 500 && player.grounded) {
    let lookDownShift = 75; 
    targetY -= lookDownShift;
  }

  let currentLerp = sHoldTime > 500 ? 0.05 : 0.2;

  //Lerp camera to target ONLY if we are not in the process of fading the screen black 
  cameraX = lerp(cameraX, targetX, 0.1);
  cameraY = lerp(cameraY, targetY, currentLerp);

  push();

  //Shake screen at screenShake pixels randomly in any direction
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
  checkGates();
  pop();

  player.showGUI();

  handleFade();
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

  if (key === "f") {
    player.block();
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

function checkGates() {
  for (let gate of gates) {
    gate.isTouched();
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

  //The aditional offset is because the light is slightly off where I want it
  let offset = height * 0.04;

  image(backgroundLayerLight, bgX, backgroundY + offset, width/2, height);
  image(backgroundLayerLight, bgX + width/2, backgroundY + offset , width/2, height);
  image(backgroundLayerLight, bgX + width, backgroundY + offset , width/2, height);
  image(backgroundLayerLight, bgX - width/2, backgroundY + offset , width/2, height);
  image(backgroundLayerLight, bgX - width, backgroundY + offset , width/2, height);

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
function createStage(x, y, blocksWide, blocksTall, cantCollide, stage) {
  let dirtH = 24 * (blocksTall - 1);
  let grassH = 24; 

  if (!stage) {
    stage = deadGrassStage;
  }

  platforms.push(new Platform(x, y, 24 * blocksWide, dirtH, false, "brown", dirtStage, 48, 48, true, true, cantCollide));
  platforms.push(new Platform(x, y - dirtH / 2 - grassH / 2, grassH * blocksWide, 24, false, "brown", stage, 48, 48, true, false, cantCollide)); 
}

//Create a spike pit based off blockswide
function createSpikePit(x, y, blocksWide) {
  platforms.push(new HurtBlock(x, y, 16 * blocksWide, 32, false, "red", spikeUp, 16, 32));
}

//Creates platform
function createPlatform(x, y, blocksWide, theTexture) {
  platforms.push(new Platform(x, y, 24 * blocksWide, 9, true, "blue", theTexture, 24, 9, true));
}

//Creates breakable object
function createBreakableObject(x, y, blocksWide, blocksTall, health) {
  brObjects.push(new breakableObject(x, y, 24 * blocksWide, 24 * blocksTall, crate, health));
}

//Gets item in an area (for a hitbox type function)
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

//Clears all entities and platforms other then players
function clearStage() {
  entities = [player];
  platforms =  [];
  brObjects = [];
}

function handleFade() {
  if (fade === "out") {
    fadeAmount += fadeRate;
    if (fadeAmount >= 255) {
      fade = "in";
    }
  }
  else if (fade === "in") {
    fadeAmount -= fadeRate;
    if (fadeAmount <= 0) {
      fade = "none";
    }
  }

  //Draw the rectangle for the fade
  if (fadeAmount > 0) {
    push();
    fill(0, fadeAmount);
    noStroke();
    rect(width/2, height/2, width, height);
    pop();
  }
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


function stage1() {
  currentStage = "stage1";

  //Death block underneath
  createSpikePit(width/2, groundLevel + 100, 242);

  entities.push(new Mushroom(width/2, height/2, 0, 0))

  //Right cluster
  createStage(width / 2 + 355, groundLevel , 20, 10);
  createStage(width / 2 + 890, groundLevel , 12, 16);
  createStage(width / 2 + 1400, groundLevel , 12, 16);
  createStage(width / 2 + 1800, groundLevel + 12 * 64 , 12, 80);
  createStage(width / 2 + 2175, groundLevel + 12 * 64 , 12, 80);
 
  //Gate to stage2 along with barrier in the way
  brObjects.push(new breakableObject(width/2 + 1965, groundLevel - 175, 48, 48, crate, 3));
  brObjects.push(new breakableObject(width/2 + 2012, groundLevel - 175, 48, 48, crate, 3));
  gates.push(new Gate(width / 2 + 2000, groundLevel + 250, "stage1", "stage2", 125, 10, width/2 + 2000, groundLevel + 400));


  //Right wall
  createStage(width / 2 + 2300, groundLevel + 12 * 64 , 12, 95);
  createStage(width / 2 + 2400, groundLevel + 12 * 64 , 24, 100);
  createStage(width / 2 + 2450, groundLevel + 12 * 64 , 12, 105);

  //Spawn floor
  createStage(width / 2 - 250, groundLevel - 50, 4, 6);
  createStage(width / 2 - 100, groundLevel + 150, 34, 20);

  //Left wall/Barrier
  createStage(width / 2 - 700, groundLevel, 10, 50);
  createStage(width / 2 - 450, groundLevel, 10, 40);
  createStage(width / 2 - 600, groundLevel, 10, 35);
  createStage(width / 2 - 800, groundLevel, 10, 30);
  createStage(width / 2 - 400, groundLevel, 10, 32);

  //Platform
  createPlatform(width / 2 + 1500 , groundLevel - 600, 15, deadGrassPlatform);
}

function stage2() {
  //Hillstone type backdrop
  createStage(width / 2 + 2175, groundLevel + 12 * 64 , 12, 80, true);

  //Stage bumps
  createStage(width / 2 + 1950, groundLevel + 800, 6, 6);

  //Floor that you land on
  createStage(width / 2 + 2200, groundLevel + 1000, 34, 20);
  
  //Pillars that surround you as you drop
  createStage(width / 2 + 1800, groundLevel + 12 * 64 , 12, 80, false, stoneStage);
  createStage(width / 2 + 1500, groundLevel + 12 * 64 , 16, 80, false, stoneStage);
  createStage(width / 2 + 1250, groundLevel + 12 * 64 , 8, 80, false, stoneStage);

  //Background rock hills for effect
  createStage(width / 2 + 1200, groundLevel + 12 * 64 , 26, 40, false, stoneStage);
  createStage(width / 2 + 1700, groundLevel + 12 * 64 , 10, 15, false, stoneStage);
  createStage(width / 2 + 1250, groundLevel + 12 * 64 , 6, 35, false, stoneStage);
}