// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


//Constants
let gravitationalForce = 0.3;
let frictionalForce = 0.5;
let footOffset = 2;
let cameraX = 0;
let cameraY = 0;
let floorHeight = 250;
let groundLevel = height - floorHeight;

//Globals
let player;
let platforms = [];
let entities = [];

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

function preload() {
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
}

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
    this.imageScale = givenScale || 2;
    this.X = x || width / 2;
    this.Y = y || height / 2;
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
    
    console.log(this.moveDir, this.actionState, this.xVel, this.directionFacing);
    //Movement
    
    
    if (
      this.actionState !== "rolling" &&
      !this.actionState.startsWith("punch") &&
      abs(this.xVel) <= 6
    ) {
      if (this.moveDir !== 0) {
        //Let accell be walkspeed or half as much as walk speed in air
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
    if (!this.grounded && this.actionState !== "rolling") {
      this.yVel += gravitationalForce;
    }

    this.Y += this.yVel;

    //Apply bounds
    let nextX = this.X + this.xVel;

    if (nextX >= this.sizeX / 2 && nextX <= width - this.sizeX / 2) {
      this.X = nextX;
    }

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
    if (!this.grounded && this.yVel > 0.5) {
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

    if (this.directionFacing === "right") {
      this.xVel = Math.min(this.xVel + this.rollStrength, 6);
    }
    else if (this.directionFacing === "left") {
      this.xVel = Math.max(this.xVel - this.rollStrength, -6);
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
      millis() - this.lastroll > this.lengthOfroll //|| (this.moveDir !== Math.sign(this.xVel))
    ) {
      this.lastActionState = this.actionState;
      this.actionState = "idle";
    }

    //Run other functions
    this.checkInputBuffs();
    this.handleState();
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
    translate(this.X, this.Y);

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
          this.Y -= this.sizeY * 0.7;

          let moveForward = 15;
          this.X +=
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
      return;
    }
    else {
      this.actionState = this.currentWeapon + str(this.currentHit);
      this.currentHit += 1;
    }
  }
}

//Platform class
class Platform {
  constructor(xPos, yPos, xSize, ySize, oneWay) {
    this.X = xPos;
    this.Y = yPos;
    this.sizeX = xSize;
    this.sizeY = ySize;
    this.oneWay = oneWay;
  }

  //Display platform with texture or fallback as rectangle
  display() {
    rect(this.X, this.Y, this.sizeX, this.sizeY);
  }

  snapToLedge(item, side) {
    this.lastActionState = this.actionState;
    item.actionState = "ledgeClimb";
    item.xVel = 0;
    item.yVel = 0;
    item.Y = this.top + item.sizeY / 3 - 13;
    item.X =
      side === "left"
        ? this.left - item.sizeX / 2 + 5
        : this.right + item.sizeX / 2 - 5;
    item.directionFacing = side === "left" ? "right" : "left";
  }

  //Check collisions with given item
  checkcollision(item) {
    let itemBottom = item.Y + item.sizeY / 2;
    let itemLeft = item.X - item.sizeX / 2;
    let itemRight = item.X + item.sizeX / 2;
    let itemTop = item.Y - item.sizeY / 2;
    let handY = item.Y - item.sizeY / 4;

    this.top = this.Y - this.sizeY / 2;
    this.bottom = this.Y + this.sizeY / 2;
    this.left = this.X - this.sizeX / 2;
    this.right = this.X + this.sizeX / 2;

    //Ledge grab checks

    //Right
    if (
      item.xVel <= 0 &&
      abs(itemLeft - this.right) < 10 &&
      abs(handY - this.top) < 15 &&
      item.directionFacing === "left" &&
      item.actionState !== "rolling" &&
      !item.attackStates.includes(item.actionState) &&
      millis() - item.lastLedgeClimb > 1000
    ) {
      this.snapToLedge(item, "right");
      console.log("Grabbed ledge");
    }

    //Left
    if (
      item.xVel >= 0 &&
      abs(itemRight - this.left) < 10 &&
      abs(handY - this.top) < 15 &&
      item.directionFacing === "right" &&
      item.actionState !== "rolling" &&
      !item.attackStates.includes(item.actionState) &&
      millis() - item.lastLedgeClimb > 1000
    ) {
      this.snapToLedge(item, "left");
      console.log("Grabbed ledge");
    }
    if (
      itemRight > this.left &&
      itemLeft < this.right &&
      itemBottom >= this.top &&
      itemBottom <= this.bottom + item.yVel
    ) {
      if (item.yVel > 0.2) {
        this.lastActionState = this.actionState;
        item.actionState = "landing";
        item.timeSinceLand = millis();
      }

      item.Y = this.top - item.sizeY / 2;

      //Only set yVel to 0 if we're not going up
      if (item.yVel > 0) {
        item.yVel = 0;
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
        item.X = this.left - item.sizeX / 2;
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
        item.X = this.right + item.sizeX / 2;
        item.xVel = 0;
        return;
      }

      if (
        !this.oneWay &&
        itemRight > this.left &&
        itemLeft < this.right &&
        itemTop <= this.bottom &&
        itemTop >= this.top
      ) {
        item.Y = this.bottom + item.sizeY / 2;
        console.log("hit two way platform");
        item.yVel = 0;
      }
    }
  }
}

//Helper function to draw small tower of oneway collision platforms
function makeTower() {
  for (let i = groundLevel - 80; i > 0; i -= 80) {
    platforms.push(new Platform(20, i, 100, 10, true));
  }
}

//Helper function to loop through entities and platforms and check collisions
function checkAllcollisions() {
  for (let platform of platforms) {
    for (let person of entities) {
      platform.checkcollision(person);
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

function applyAllPhysics() {
  for (let entity of entities) {
    entity.applyForces();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  imageMode(CENTER);
  noSmooth();

  width = 1000;
  height = 1000;

  console.log("Image Width: " + playerIdleSheet.width);
  console.log("Image Height: " + playerIdleSheet.height);

  platforms.push(
    new Platform(
      width / 2,
      height - floorHeight / 2,
      width * 2,
      floorHeight
    )
  );

  makeTower();

  platforms.push(new Platform(250, groundLevel - 120, 100, 10, false));

  platforms.push(new Platform(400, groundLevel - 80, 100, 10));

  player = new Player(width / 2, groundLevel - 100);
  entities.push(player);

  console.log(platforms);
}

function draw() {
  scale(1.25);

  background(220);
  player.update();
  applyAllPhysics();
  checkAllcollisions();

  //Follow player with camera
  let targetX = width / 2 - player.X * 1.25;
  let targetY = height / 2 - player.Y;

  cameraX = lerp(cameraX, targetX, 0.4);
  cameraY = lerp(cameraY, targetY, 0.4);

  push();
  translate(cameraX, cameraY);

  //Draw
  drawAllPlatforms();
  drawAllEntities();

  pop();
}

//Inputs
function keyPressed() {
  if (key === " ") {
    player.jump();
    player.inputBuffers.jump = millis();
  }

  if (keyCode === SHIFT) {
    player.roll();
    player.inputBuffers.roll = millis();
  }
}

function mousePressed() {
  player.hit();
  player.inputBuffers.punch = millis();
}
