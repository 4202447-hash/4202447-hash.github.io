// Rainbow Runner
// Ayman Faisal
// 3/2/2026
//
// Extra for Experts:
// - My project includes the use of spritesheets, to make animations, classes, and I made the camera follow the player
  
//Controls: WASD To move, Shift to roll, hold shift to sprint, M1 to punch, space to jump


//Constants
const GRAVITATIONALFORCE = 0.3;
const FRICTIONALFORCE = 0.5;
const FOOTOFFSET = 2;
const LAYER1SPEED = 0.1;
const LAYER2SPEED = 0.2;
const LAYER3SPEED = 0.3;
const BACKGROUNDY = 300;
const CAMERABOXWIDTH = 200;
const CAMERAMOVEAMOUNT = 3;
const NOBLOCK = 0;

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
let currentStage;
let screenShake = 0;
let mapScale = 1.7;

//For stages and stage creator
let internalStages = {}
let userStages = {}
let gameMode = "menu"
let currentEditingStage = null

//UI Containers 
//Main Menu
let mainMenuContainer;
let stageManager;

//Stage editor
let sidebarX;
let sidebarY;
let sidebarW = 150;
let sidebarH;
let sideBar;
let saveButton;

//General
let returnToMainMenu;

//Variables specific for certain functions to run
let fadeAmount = 0;
let fade = "none";
let fadeRate = 10;

let stage1;

//Animations and sprites
let playerButtonSheet;
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
let mushroomButtonImg;
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
let gateImg;

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
  playerButtonSheet = loadImage("Character/buttonImg.png");

  //Mushroom animations
  mushroomAttack = loadImage("Mushroom/Mushroom-Attack.png");
  mushroomDie = loadImage("Mushroom/Mushroom-Die.png");
  mushroomIdle = loadImage("Mushroom/Mushroom-Idle.png");
  mushroomRun = loadImage("Mushroom/Mushroom-Run.png");
  mushroomStun = loadImage("Mushroom/Mushroom-Stun.png");
  mushroomGotHit = loadImage("Mushroom/Mushroom-Hit.png");
  mushroomButtonImg = loadImage("Mushroom/mushroomBtn.png")

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
  gateImg = loadImage("PropsTextures/portal.png")

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

  //Stages
  stage1 = loadJSON("Myotherstage.json");
}

//list of images
let imageTable = {};

//Platform tables
let deadGrassPlatform;
let stonePlatform;
let dirtStage;
let deadGrassStage;
let stoneStage;

//These variables are for the stage creater(grid part of the project)

//Block presets
let eraser = "eraser"
let deadGrassLeft;
let deadGrassRight;
let deadGrassMid;
let deadGrassPLeft;
let deadGrassPRight;
let deadGrassPMid
let stonePL
let stonePR
let stoneP
let dirtLeft;
let dirtRight;
let dirtMid;
let spike;
let mushroomBtn;
let playerObject;
let crateBtn;
let gateBtn;
let gateInput;

//Grid configs
let mapGrid = [];
let cellSize = 24;
let totalCols = 50;
let totalRows = 50;
let createdStages = [];
let selected = "none"
let blocksPlaced = [];
let blocksUndone = [];
let lastUndo = 0;
let lastRedo = 0;
let lastSizeChange = 0;
let objectLibrary;
let rows = 1;
let cols = 1;
let canPlace = true


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  rectMode(CENTER);
  imageMode(CENTER);
  noSmooth();

  groundLevel = height - floorHeight;
  mapGrid = createGrid(totalCols, totalRows)
  sidebarX = width * 0.05;
  sidebarY = height * 0.25;
  sidebarH = height / 2;

  initializeTables();

  //Load stages the player has made
  let savedData = localStorage.getItem("platformer_userStages")
  if (savedData) {
    userStages = JSON.parse(savedData)
  }
  else {
    userStages = {}
    localStorage.setItem("platformer_userStages", "{}")
  }

  player = new Player(width/2, height/2)
  entities.push(player)

  setUpGUI();
  createMenuUI();
  stageManagerUI();
}

function draw() {
  background(245, 245, 220);

  scale(mapScale);
  drawBackground();
  checkDevModePre();

  if (gameMode !== "menu" ) {
    push();

    //Shake screen at screenShake pixels randomly in any direction
    let screenShakeX = 0;
    let screenShakeY = 0;

    //Shake screen if screenshake is above 0.1 (screenshake is the magnitude)

    translate(cameraX + screenShakeX, cameraY + screenShakeY);

    checkDevModePost();
  
    updateAll();
    pop();

    if (gameMode === "editor") {
      drawTexts();
    }
    

    handleFade();
  }
}

function drawTexts(){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = Math.floor(worldX/cellSize);
  let gridY = Math.floor(worldY/cellSize);

    //In game position
    let drawY = gridY * cellSize + cellSize/2;
    let drawX = gridX * cellSize + cellSize/2;

    stroke(255, 255, 255)
    textSize(22)

    text(drawX, width * 0.03, height * 0.05)
    text(drawX, width * 0.03, height * 0.1)
  
    //It seems like a magic number because I expect half way to be *0.5, but its not acting that way? (0.25)
    text((currentEditingStage), width * 0.25, height * 0.05)
}

//Inputs
function keyPressed() {
  

  if (key === "e") {
    selected = eraser
  }

  if (gameMode === "editor") {
    return;
  }

  if (key === " ") {
    player.jump();
    player.inputBuffers.jump = millis();
    player.pressedS = 0;
  }

  if (key === "w") {
    player.jump();
    player.inputBuffers.jump = millis();
    player.pressedS = 0;
  }

  if (keyCode === SHIFT) {
    player.roll();
    player.inputBuffers.roll = millis();
    player.pressedS = 0;
  }

  //For looking down
  if (key === "s" && player.grounded) {
    player.phaseCurrentPlatform();
    player.pressedS = millis();
  }

  if (key === "f") {
    player.block();
  }
}

//When the S key is released, fix camera
function keyReleased() {
  if (key === "s") {
    player.pressedS = 0;
  }
}

//When mouse is pressed attack
function mousePressed() {
  if (gameMode === "editor") {
    return;
  }

  player.hit();
  player.inputBuffers.punch = millis();
}

function mouseReleased(){
  canPlace = true
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
    this.moveSpeed = moveSpeed || 3;
    this.moveDir = 0;
    this.speed;

    //Animations
    this.currentFrame = 0;
    this.totalImage = 0;
    this.xCrop = 0;
    this.lastFrameTime = 0;
    this.timeSinceLand = 0;

    //Stats and equips
    this.currentWeapon = "punch";
    this.rangeX = 30;
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
    this.type = "player"

    //Animations
    this.frameWidth = 128;
    this.frameHeight = 35;
    this.currentSheet = 0;

    //Attacks and cooldowns
    this.currentHit = 1;
    this.hitCD = 300;
    this.blockCooldown = 1000;
    this.lastBlock = 0;

    //Animation Sheets
    this.runningSheet = "playerRunningSheet";
    this.idleSheet = "playerIdleSheet";
    this.rollingSheet = "playerrollingSheet";
    this.jumpSheet = "playerJumpSheet";
    this.punch1 = "playerPunch1";
    this.punch2 = "playerPunch2";
    this.punch3 = "playerPunch3";
    this.sprintingSheet = "playerSprintSheet";
    this.punchUp = "playerUpwardPunch";
    this.ledgeClimb = "playerLedgeSheet";
    this.downSlam = "playerDownSlam";
    this.blockAnim = "playerBlock";

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
    //The magic numbers here are generally derived from croppign the image and checking its lengths on a image editor
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
        spriteSpeed: 2,
        yOffset: 18,
        charHeight: 35,
        startFrame: 0,
        oneTime: true,
      }
    };
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
      abs(this.xVel) <= 6) {
      if (this.moveDir !== 0) {
        this.speed = this.actionState === "sprinting" ? 5 : this.moveSpeed;
        let accel = this.speed;
        this.directionFacing = this.moveDir === 1 ? "right" : "left";

        //Make sure decay of xVel doesn"t cause speed to drop below walk speed (for roll walking)
        if (abs(this.xVel) > accel) {
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
      this.yVel += GRAVITATIONALFORCE;
    }

    this.y += this.yVel;
    this.x = this.x + this.xVel;

    //Apply friction if not rolling, 1/4 in air
    if ((this.moveDir === 0 || this.moveSpeed === 0) && this.actionState !== "rolling") {
      let currentFriction = this.grounded
        ? FRICTIONALFORCE
        : FRICTIONALFORCE / 4;

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
    else if (this.grounded && this.xVel === 0 && this.yVel === 0) {
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

    if (this.actionState === "blocking" || millis() - this.lastHitTaken < 500) {
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
  }

  //Check input buffers (tries to run the input until its possible to give quicker game feel)
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

    //Make origin at player"s current position to flip player image when neccesary
    push();
    translate(this.x, this.y);

    if (this.directionFacing === "left") {
      scale(-1, 1); // Flip horizontally
    }

    //If it is the correct frame to advance frames advance
    if (frameCount % anim.spriteSpeed === 0) {
      let lastFrame = this.currentFrame;
      this.currentFrame = (this.currentFrame + 1) % anim.totalFrames;

      //If animation shouldn"t loop, and isn"t one time, hold last frame
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
      drawingContext.filter = "brightness(10) contrast(2)"; 
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
      imageTable[this.currentSheet],
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
      this.yVel = Math.max(5, this.yVel + 5);
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
    if (millis() - this.lastBlock < this.blockCooldown) {
      return;
    }

    if (this.actionState.startsWith(this.currentWeapon) || millis() - this.lastHitTaken < 500) {
      return;
    }
    this.lastBlock = millis();
    this.lastActionState === this.actionState;
    this.actionState = "blocking";
  }

  //Function which respawns player at last grounded area, should be different from full reset which returns player to last checkpoint
  respawn() {
    this.x = this.lastCheckpointX;
    this.y = this.lastCheckpointY - 5;
    this.xVel = 0;
    this.yVel = 0;
  }

  showGUI() {
    let startingHeight = height * 0.7;
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
  constructor(x, y, startPos, endPos, direction) {
    super(x, y);

    //Settings
    this.imageScale = 1.5;
    this.sizeY = 16 * this.imageScale;
    this.sizeX = 16 * this.imageScale; 
    this.normalSize = 20 * this.imageScale; 
    this.attackSize = this.sizeX + 25;
    this.active = true;
    this.moveSpeed = 2;
    this.attackCooldown = 1500;
    this.health = 5;
    this.directionFacing = direction || "right";
    this.type = "mushroom"

    //Variables specific to entity for enemy AI
    this.startPos = startPos;
    this.endPos = endPos;
    this.hasTarget = false;
    this.hitItems = [];
    this.alrHit = [];
    this.lastAttack;

    this.moveDir = -1;


    //Animations
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.currentSheet = 0;

    this.hit = "mushroomAttack";
    this.die = "mushroomDie";
    this.stunned = "mushroomStun";
    this.idle = "mushroomIdle";
    this.run = "mushroomRun";
    this.gotHit = "mushroomGotHit";

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
        totalFrames: 1,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 1,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        oneTime: true
      },

      attackWind: {
        sheet: this.hit,
        totalFrames: 4,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 6,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        oneTime: true,
      },

      attack: {
        sheet: this.hit,
        totalFrames: 4,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 6,
        yOffset: 0,
        charHeight: 64,
        startFrame: 4,
      },

      attackRecover: {
        sheet: this.hit,
        totalFrames: 2,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 6,
        yOffset: 0,
        charHeight: 64,
        startFrame: 8,
        oneTime: true
      },

      gotHit: {
        sheet: this.gotHit,
        totalFrames: 5,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 4,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        oneTime: true,
      },

      running: {
        sheet: this.run,
        totalFrames: 8,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 5,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        shouldLoop: true
      },

      dead: {
        sheet: this.die,
        totalFrames: 15,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 5,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
      },

      stun: {
        sheet: this.stunned,
        totalFrames: 18,
        imageWidth: 80,
        imageHeight: 64,
        spriteSpeed: 12,
        yOffset: 0,
        charHeight: 64,
        startFrame: 0,
        oneTime: true
      }
    };
  }

  applyForces() {
    //Movement

    //If there is nothing ahead of us turn around
    let lookAhead = this.directionFacing === "right" ? -5 : 5;
    let floorCheckX = this.x + lookAhead;
    let floorCheckY = this.bottom + 10;

    //Check if there is a valid path in front of you
    if (!checkIfPath(floorCheckX, floorCheckY) && this.grounded) {
      let oppositeX = this.x - lookAhead;

      //if there is a valid path in the opposite side turn around
      if (checkIfPath(oppositeX, floorCheckY)) {
        this.directionFacing = this.directionFacing === "left" ? "right" : "left";
        this.moveDir *= -1;
      }
    }

    if (this.moveDir !== 0 && this.moveSpeed !== 0) {
      this.speed = this.moveSpeed;
      let accel = this.speed;

      this.moveDir = this.directionFacing === "right" ? -1 : 1;

      this.xVel = this.moveDir * accel;
    }
    
    //Apply gravity
    if (!this.grounded && this.actionState) {
      this.yVel += GRAVITATIONALFORCE;
    }

    this.y += this.yVel;
    this.x = this.x + this.xVel;

    //Apply friction if not rolling, 1/4 in air
    if ((this.moveDir === 0 || this.moveSpeed === 0) && this.actionState !== "rolling") {
      let currentFriction = this.grounded
        ? FRICTIONALFORCE
        : FRICTIONALFORCE / 4;

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

  display() {
    //Identify current anim and define variables
    let anim = this.sprites[this.actionState];

    this.frameWidth = this.sprites[this.actionState].imageWidth;
    this.frameHeight = this.sprites[this.actionState].imageHeight;
    this.xCrop = (this.currentFrame + anim.startFrame) * this.frameWidth;
    this.currentSheet = anim.sheet;
    this.totalImage = anim.totalFrames;

    //Make origin at Mushrooms"s current position to flip player image when neccesary
    push();
    translate(this.x, this.y);

    if (this.directionFacing === "left") {
      scale(-1, 1); // Flip horizontally
    }

    //If it is the correct frame to advance frames advance
    if (frameCount % anim.spriteSpeed === 0) {
      let lastFrame = this.currentFrame;
      this.currentFrame = (this.currentFrame + 1) % anim.totalFrames;

      if (this.actionState === "attack" && this.currentFrame === 0) {
        setTimeout(() => {
          if (this.actionState === "attack") {
            this.actionState = "attackRecover";
          }
            
        }, 250);
      }

      //If animation shouldn"t loop, and isn"t one time, hold last frame
      if (this.currentFrame === 0 && !anim.shouldLoop && !anim.oneTime) {
        this.currentFrame = lastFrame;
      }

      //If animation is onetime, return to idle after finished, also deal with attack stages
      else if (this.currentFrame === 0 && !anim.shouldLoop && anim.oneTime) {

        //If we are in the attack wind stage, go to attack, and launch
        if (this.actionState === "attackWind") {
          this.actionState = "attack";
          this.xVel = this.directionFacing === "right" ? -7 : 7;
          this.yVel = -3;
          this.lastAttack = millis();
          this.sizeX = this.attackSize;
        }

        //if we are in the recovery stage of the attack, return to idle and reset settings
        else if (this.actionState === "attackRecover") {
          this.sizeX = this.normalSize;
          setTimeout(() => {
            this.moveSpeed = 2;
          }, 500);
          this.actionState = "idle";
        }

        else if (this.actionState === "stun") {
          this.moveSpeed = 2;
          this.actionState = "idle";
        }

        //Whenever we get hit, check if we are still alive
        else if (this.actionState === "gotHit") {
          if (this.health <= 0) {
            this.actionState = "dead";
            this.active = false;
          }
          else {
            this.actionState = "idle";
          }
        }
        
        //Return to idle if no conditions met
        else{
          this.lastActionState = this.actionState;
          this.actionState = "idle";
        }

        
      }
    }

    //Vertical offset which adjusts to the different animations (avoid changing)
    let verticalOffset = anim.charHeight * this.imageScale * this.yScale / 2;

    if (this.actionState === "attack") {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255,0 ,0);
    }

    image(
      imageTable[this.currentSheet],
      this.actionState === "attack" ? 25 : 0,
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

  handleState() {
    //Skip if currently in an action state
    if (
      this.actionState === "attack" || 
      this.actionState === "gotHit" ||
      this.actionState === "attackWind" ||
      this.actionState === "attackRecover" ||
      this.actionState === "stun" || !this.active
    ) {
      return;
    }
    if (abs(this.xVel) > 0.1) {
      this.actionState = "running" ;
      
    }
    else if (this.actionState === "running") {
      this.actionState = "idle";
    }
  }

  //Update mushroom
  update() {
    this.handleState();

    //Reset animation frame
    if (this.actionState !== this.lastActionState) {
      this.currentFrame = 0;
      this.lastActionState = this.actionState;
    }
  }

  //What to do when hit
  onHit() {
    this.currentFrame = 0;
    this.actionState = "gotHit";
    this.moveSpeed = 0;
    this.health -= 1;
    this.sizeX = this.normalSize;
    this.xVel = player.x < this.x ? this.xVel + 3 : this.xVel - 3;
  }

  checkCollision(item) {
    if (!this.active) {
      return;
    }

    //For collisions
    this.top = this.y - this.sizeY / 2;
    this.bottom = this.y + this.sizeY / 2;
    this.left = this.x - this.sizeX / 2;
    this.right = this.x + this.sizeX / 2;

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
      itemBottom > this.top + FOOTOFFSET &&
      itemTop < this.bottom - FOOTOFFSET
    ) {
      //If item runs into left of object
      if (
        itemRight > this.left &&
        itemLeft < this.left 
      ) {
        return true;
      }

      //If item runs into right of object
      if (
        itemLeft < this.right &&
        itemRight > this.right 
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

  applyHit() {
    //Player dodges it if mushroom is currently attacking and player is rolling
    if (!this.active || player.actionState === "rolling" && this.actionState === "attack") {
      return;
    }

    //If player is blocking get stunned
    if (player.actionState === "blocking" && this.directionFacing === player.directionFacing && this.actionState === "attack") {
      this.actionState = "stun";
      this.moveSpeed = 0;
      this.xVel = player.x < this.x ? this.xVel + 12 : this.xVel - 12;
      this.sizeX = this.normalSize;
    }

    //Dont damage when stunned
    if (this.actionState === "stun") {
      return;
    }

    //Player hit on touch
    if (this.checkCollision(player)) {
      if (millis() - player.lastHitTaken < 1000) {
        return;
      }

      player.gotHit();

      if (this.x < player.x) {
        if (!player.grounded) {
          player.xVel = 5;
        }
        else {
          player.xVel = 6;
        }
      }

      else {
        if (!player.grounded) {
          player.xVel = -5;
        }
        else {
          player.xVel = -6;
        }
      }

      player.yVel = player.grounded ? -3 : -5; 
      screenShake = 8;
    }
  }

  runAI(){
    //If being hit return
    if (this.actionState === "gotHit" ||
      this.actionState === "stunned" ||
      this.actionState === "attackWind" ||
      this.actionState === "attack" ||
      this.actionState === "attackRecover" ||
      !this.active) {
      return;
    }

    //First check if the player is directly in front or behind, and if they are attack them
    if (abs(this.x - player.x) < 100 && player.y + player.sizeY/2 > this.y - this.sizeY/2  ) {
      if (millis() - this.lastAttack < 1500) {
        return;
      }

      this.moveSpeed = 0;

      //If player is behind mushroom
      if (player.x > this.x) {
        this.directionFacing = "left";
        this.moveDir = -1;
      }
      else if (player.x < this.x ) {
        this.directionFacing = "right";
        this.moveDir = 1;
      }

      this.actionState = "attackWind";
    }
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
    this.type = "block"
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

          let currentImage = imageTable[this.img];

          //If we are tiling with several images to have corner blocks set current image to appropriate block
          if (Array.isArray(currentImage)) {
            currentImage = x === 0 ? currentImage[0] : x + displasizeYX >= this.sizeX ? currentImage[2] : currentImage[1];
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
      return;
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
  checkCollision(item) {
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
      !item.grounded && this.canClimb &&
      !this.bottomBlock
    ) {
      
      //Skip ledge climb if this function is being applied to a hurt block
      if (this instanceof HurtBlock) {
        return true;
      }

      this.snapToLedge(item, "right");
    }

    //Left
    if (
      item.xVel >= 0 &&
      abs(itemRight - this.left) < 5 &&
      abs(handY - this.top) < 15 &&
      item.directionFacing === "right" &&
      !item.attackStates.includes(item.actionState) &&
      millis() - item.lastLedgeClimb > 500 &&
      !item.grounded && this.canClimb &&
      !this.bottomBlock
    ) {

      if (this instanceof HurtBlock) {
        return true;
      }

      this.snapToLedge(item, "left");
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
        
        if (item instanceof Player) {
          item.actionState = "landing";
        }
        
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

      //Only set yVel to 0 if we"re not going up
      if (item.yVel > 0) {
        item.yVel = 0;
        item.currentPlatform = this;
        item.phasingBottom = false;
      }

      item.grounded = true;
      return true;
    }

    if (
      itemBottom > this.top + FOOTOFFSET &&
      itemTop < this.bottom - FOOTOFFSET && item.actionState !== "ledgeClimb"
    ) {
      //If item runs into left of object
      if (
        itemRight > this.left &&
        itemLeft < this.left 
      ) {
        item.x = this.left - item.sizeX / 2;

        if (item instanceof Mushroom && item.grounded) {
          item.directionFacing = item.directionFacing === "right" ? "left" : "right";
        }

        return true;
      }

      //If item runs into right of object
      if (
        itemLeft < this.right &&
        itemRight > this.right
      ) {
        item.x = this.right + item.sizeX / 2;

        if (item instanceof Mushroom && item.grounded) {
          item.directionFacing = item.directionFacing === "left" ? "right" : "left";
        }

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

    this.type = "hurtBlock"
  }

  checkCollision(item) {
    if (super.checkCollision(item)){

      if (item instanceof Player) {
        item.respawn();
        item.gotHit();
      }

      //This doesn"t actually work right now as the platform collision function does not return true if it hits a mushroom (need fix)
      if (item instanceof Mushroom) {
        item.health = 0;
        item.onHit();
      }
    }
  }

}

class BackgroundImage{
  constructor(x, y, width, height, destructable) {
    this.x = x;
    this.y = y;
    this.sizeX = width;
    this.sizeY = height;
    this.destructable = destructable;
  }

  display() {
    image(this.x, this.y, this.sizeX, this.sizeY,)
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
      this.yVel += GRAVITATIONALFORCE;
    }
    else {
      this.rotationSpeed = 0
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

class BreakableObject {
  constructor(x, y, sizeX, sizeY, mainImg, health) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.img = mainImg
    this.health = health;
    this.chunks = [];
    this.active = true;
    this.type = "breakableObject"

    this.top = this.y - this.sizeY / 2;
    this.bottom = this.y + this.sizeY / 2;
    this.left = this.x - this.sizeX / 2;
    this.right = this.x + this.sizeX / 2;

  }

  //What happens when this object is hit
  onHit() {
    if (!this.active) {
      return;
    }

    this.health -= 1;

    if (this.health <= 0) {

      for (let i = 0; i < 25; i++) {
        this.chunks.push(new Debris (this.x, this.y, imageTable[this.img], this.sizeX, this.sizeY, true));
      }
    }

    else {
      for (let i = 0; i < 5; i++) {
        this.chunks.push(new Debris (this.x, this.y, imageTable[this.img], this.sizeX, this.sizeY, false));
      }
    }
  }

  //Displays object
  display() {
    if (this.active) {
      image(imageTable[this.img], this.x, this.y, this.sizeX, this.sizeY);
    }

    for (let i = this.chunks.length - 1; i >= 0; i--) {
      this.chunks[i].update();
      this.chunks[i].display();
    }

    if (this.health <= 0 ) {
      this.active = false;
    }
  }

  //Checks collisions
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

      //Only set yVel to 0 if we"re not going up
      if (item.yVel > 0) {
        item.yVel = 0;
        item.currentPlatform = this;
        item.phasingBottom = false;
      }

      item.grounded = true;
    }

    if (
      itemBottom > this.top + FOOTOFFSET &&
      itemTop < this.bottom - FOOTOFFSET
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
    this.type = "gate"

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
      itemBottom > this.top + FOOTOFFSET &&
      itemTop < this.bottom - FOOTOFFSET
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

  //What happens when the gate is touched
  isTouched() {
    if (this.touched()) {
      fade = "out";
      setTimeout(() => {
        player.yVel = 0;
        player.x = this.toX;
        player.y = this.toY;

        let nextStage = createdStages[this.to] || userStages[this.to]
        loadStage(nextStage)
      }, 
      500);
    }
  }

  display(){
    if (gameMode !== "editor") {
      return
    }

    fill(255)
    rect(this.x, this.y, this.sizeX, this.sizeY)
    text(this.to, this.x, this.y)
  }
}

function checkDevModePost() {
  if (gameMode === "editor") {
    //Show transparent block to show where your block position is (position in the drawloop needs to be here)
    if (selected[selected.length - 1] === "block" || selected[selected.length - 1] === "hurtBlock" || selected[selected.length - 1] === "platform" || selected[selected.length - 1] === "breakableObject") {
      displayBlock();
    }
    else if (selected[selected.length - 1] === "player") {
      displayPlayer();
    }

    else if (selected[selected.length - 1] === "gate") {
      displayGate();
    }

    else if (selected[selected.length - 1] === "mushroom") {
      displayMushroom();
    }

    else if (selected === "eraser"){
      displayEraser();
    }

    //Check inputs
    if (keyIsDown(90) && keyIsDown(17)) {
      undo();
    }
   
    if (keyIsDown(89) && keyIsDown(17)) {
      redo();
    }

    //Grow rows by one at max of ten if ctrl + shift + period is pressed (like font shortcut in google docs)
    if (keyIsDown(17) && keyIsDown(16) && keyIsDown(190)) {
      changeSize("rows", 1)
    }

    //Shrink if ctrl + shift + comma
    if (keyIsDown(17) && keyIsDown(16) && keyIsDown(188)) {
      changeSize("rows", -1)
    }

    //Ctrl + alt + . to grow cols by 1
    if (keyIsDown(18) && keyIsDown(17) && keyIsDown(190)) {
      changeSize("cols", 1)
    }

    //Ctrl + alt + , to short cols by 1
    if (keyIsDown(18) && keyIsDown(17) && keyIsDown(188)) {
      changeSize("cols", -1)
    }

  }

  drawGrid(totalRows, totalCols)
}

function checkDevModePre() {
  let sHoldTime = player.pressedS > 0 ? millis() - player.pressedS : 0;

  if (gameMode === "playing"){
    //Follow player with camera
    let targetX = width / 2 - player.x - 250 ;
    let targetY = height / 2 - player.y - 100; 


    if (sHoldTime > 500 && player.grounded) {
      let lookDownShift = 75; 
      targetY -= lookDownShift;
    }

    let currentLerp = sHoldTime > 500 ? 0.05 : 0.2;

    //Lerp camera to target
    cameraX = lerp(cameraX, targetX, 0.1);
    cameraY = lerp(cameraY, targetY, currentLerp);
  }
  else if (gameMode === "editor"){
    //Allow player to move around world with WASD
    moveCamera();

    //Display sidebar if in devmode
    sideBar.position(width * 0.05, height * 0.25);

    //If the mouse is pressed place your objects
    if (mouseIsPressed) {
      placeObject();
    }

  }
}

//Update all entities
//Helper function to loop through entities and platforms and check collisions
function updateAll() {
  for (let x = 0; x < totalRows; x++) {
    for (let y = 0; y < totalCols; y++) {
      let item = mapGrid[x][y]
      if (entities.includes(mapGrid[x][y] && gameMode === "playing")){
          item.update()
          item.applyForces();

          if (item !== player){
            item.applyHit();
            item.runAI();
          }
        }
        
      if (item) {
        if (item instanceof Platform) {
          for (let entity of entities) {
            item.checkCollision(entity);
          }
          for (let object of brObjects) {
            for (let chunk of object.chunks) {
              item.checkCollision(chunk);
            }
          }
        }

        else if (item instanceof Gate && !gameMode !== "editor") {
          item.isTouched();
        }

        if (typeof item !== "string" && typeof item !== "number" && item) {
          item.display();
        }
      }
    }
  }
}

//Resizes the canvas with the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//function to draw a parallex background 
function drawBackground() {
  if (gameMode === "menu"){
    image(backgroundLayer1, width/2, height/2, width, height); 
    image(backgroundLayerLight, width/2, height/2, width/2, height); 
  }
  else {
    //adjust respective layers speed to change speed at which image moves
    let bgX = cameraX * LAYER1SPEED % width;

    image(backgroundLayer1, bgX, BACKGROUNDY, width/2, height);
    image(backgroundLayer1, bgX + width/2, BACKGROUNDY , width/2, height);
    image(backgroundLayer1, bgX + width, BACKGROUNDY , width/2, height);
    image(backgroundLayer1, bgX - width/2, BACKGROUNDY , width/2, height);
    image(backgroundLayer1, bgX - width, BACKGROUNDY , width/2, height);

    //The aditional offset is because the light is slightly off where I want it
    let offset = height * 0.04;

    image(backgroundLayerLight, bgX, BACKGROUNDY + offset, width/2, height);
    image(backgroundLayerLight, bgX + width/2, BACKGROUNDY + offset , width/2, height);
    image(backgroundLayerLight, bgX + width, BACKGROUNDY + offset , width/2, height);
    image(backgroundLayerLight, bgX - width/2, BACKGROUNDY + offset , width/2, height);
    image(backgroundLayerLight, bgX - width, BACKGROUNDY + offset , width/2, height);

    bgX = cameraX * LAYER2SPEED % width;
    image(backgroundLayer2, bgX, BACKGROUNDY, width/2, height);
    image(backgroundLayer2, bgX + width/2, BACKGROUNDY , width/2, height);
    image(backgroundLayer2, bgX + width, BACKGROUNDY , width/2, height);
    image(backgroundLayer2, bgX - width/2, BACKGROUNDY , width/2, height);
    image(backgroundLayer2, bgX - width, BACKGROUNDY , width/2, height);

    bgX = cameraX * LAYER3SPEED % width;
    image(backgroundLayer3, bgX, BACKGROUNDY, width/2, height);
    image(backgroundLayer3, bgX + width/2, BACKGROUNDY , width/2, height);
    image(backgroundLayer3, bgX + width, BACKGROUNDY , width/2, height);
    image(backgroundLayer3, bgX - width/2, BACKGROUNDY , width/2, height);
    image(backgroundLayer3, bgX - width, BACKGROUNDY , width/2, height);


  }
  
}

//Gets item in an area (for a hitbox type function)
function getItemsInArea(x, y, sizeX, sizeY, self) {
  let items = [];
  let squareLeft = x - sizeX/2;
  let squareRight = x + sizeX/2;
  let squareTop = y - sizeY/2;
  let squareBottom = y + sizeY/2;

  //Loop through breakable objects and entities and return what has been hit

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

//Checks if there is a platform in a given location
function checkIfPath(x, y) {
  for (let plat of platforms) {
    if (
      x >= plat.left && 
      x <= plat.right && 
      y >= plat.top && 
      y <= plat.bottom
    ) {
      return true; // Point is inside a platform
    }
  }

  return false; // Point is in the air
}

function handleFade() {
  //If we are fading out, fade in once done
  if (fade === "out") {
    fadeAmount += fadeRate;
    if (fadeAmount >= 255) {
      fade = "in";
    }
  }

  //if we are fading in, return to none once done
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

//Grid based game portion of assignment

//Creates our grid
function createGrid(cols, rows) {
  let grid  = [];

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++){
      grid[i][j] = 0; //Unoccupied
    }
  }
  return grid;
}

function drawGrid(cols, rows){
  push();
  noFill();
  stroke(255, 255, 255, 15)
  strokeWeight(2)

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++){
      rect(12 + x * cellSize, 12 + y* cellSize, cellSize, cellSize)
    }
  }

  pop();
}

function dev() {
  //Clear everything
  gameMode = "editor" 

  sideBar.show();
  sideBar.style("display", "grid");

  saveButton.show();
}

function displayBlock(givenX, givenY) {
  //The reason things like worldX is used is to make up for the difference between where the mouse is on the screen
  // and where the mouse is in the world relative to where the camera is looking
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  let baseGridX = Math.floor(worldX/cellSize);
  let baseGridY = Math.floor(worldY/cellSize);

  for (let x = 0; x < rows; x++) {
    for(let y = 0; y < cols; y++) {
      let gridX = baseGridX + x
      let gridY = baseGridY + y

      if (mapGrid[gridX] === undefined || mapGrid[gridX][gridY] === undefined) {
        continue;
      }

      tint(255, 127);

      let displayImage = imageTable[selected[4]];
      let drawX = gridX * cellSize + cellSize/2;
      let drawY;
      if (selected[selected.length - 1] === "platform") {
        drawY = gridY * cellSize;
      }
      else {
        drawY = gridY * cellSize + cellSize/2;
      }

      image(displayImage, drawX, drawY, selected[0], selected[1]);
      noTint();
    }
  }
}

function displayGate(){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  let baseGridX = Math.floor(worldX/cellSize);
  let baseGridY = Math.floor(worldY/cellSize);

  for (let x = 0; x < rows; x++) {
    for(let y = 0; y < cols; y++) {
      tint(255, 127);

      let gridX = baseGridX + x
      let gridY = baseGridY + y

      if (mapGrid[gridX] === undefined || mapGrid[gridX][gridY] === undefined) {
        continue;
      }

      let drawX = gridX * cellSize + cellSize/2;
      let drawY;

      if (selected[selected.length - 1] === "platform") {
        drawY = gridY * cellSize;
      }
      else {
        drawY = gridY * cellSize + cellSize/2;
      }

      rect(drawX, drawY, 24, 24)
      noTint();
    }
  }
}

function displayPlayer() {
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = Math.floor(worldX/cellSize);
  let gridY = Math.floor(worldY/cellSize);

  if (!mapGrid[gridX]) {
    return;
  }

  let drawX = gridX * cellSize + cellSize/2;
  let drawY = gridY * cellSize + cellSize/2;

  tint(255, 127);

  image(
    imageTable[player.idleSheet],
    drawX,
    drawY,
    player.frameWidth * player.imageScale * player.xScale,
    player.frameHeight * player.imageScale * player.yScale,
    0,
    player.sprites.idle.yOffset,
    player.frameWidth,
    player.sprites.idle.charHeight
  );
  
  noTint();
}

function displayMushroom() {
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let baseGridX = Math.floor(worldX/cellSize);
  let baseGridY = Math.floor(worldY/cellSize) - 2;

  for (let x = 0; x < rows; x++) {
    for(let y = 0; y < cols; y++) {
      if (y % 2 !== 0) continue;
      let gridY = baseGridY + y
      let gridX = baseGridX + x

      if (mapGrid[gridX] === undefined || mapGrid[gridX][gridY] === undefined) {
        continue;
      }
      
      tint(255, 127);
      
      let drawX = gridX * cellSize + cellSize/2;
      let drawY = gridY * cellSize + cellSize;
      image(
        mushroomIdle,
        drawX,
        drawY,
        80 * 1.5,
        64 * 1.5,
        0,
        0,
        80,
        64
      );
      noTint();
    }
  }
}

function handleDeletes(gridX, gridY){
  console.log(mapGrid[gridX][gridY])
  if (mapGrid[gridX][gridY]  === player) {
    deleteArea(gridX, gridY - 1, 1, 3);
  }
  else if (mapGrid[gridX][gridY]  === "player1") {
    deleteArea(gridX, gridY, 1, 3)
  }
  else if (mapGrid[gridX][gridY]  === "player2") {
    deleteArea(gridX, gridY - 2, 1, 3)
  }
  else if (mapGrid[gridX][gridY] instanceof Mushroom) {
    deleteArea(gridX, gridY, 1, 2);
  }
  else if (mapGrid[gridX][gridY] === "mushroom") {
    deleteArea(gridX, gridY - 1, 1, 2);
  }
  else {
    mapGrid[gridX][gridY] = NOBLOCK
  }
}

function placeBlock (givenX, givenY, givenSelected) {
  //Get the position of the actual world relative to the camera
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  let usedSelected = givenSelected || selected

  //Position on grid
  let gridX = givenX || Math.floor(worldX/cellSize);
  let gridY = givenY || Math.floor(worldY/cellSize);

  //Return early if no spot there
  if (!mapGrid[gridX] || mapGrid[gridX][gridY] === undefined) {
    return;
  }

  handleDeletes(gridX, gridY)

  let drawY;
  let drawX = gridX * cellSize + cellSize/2;
  if (usedSelected[usedSelected.length - 1] === "platform") {
    drawY = gridY * cellSize;
  }
  else {
    drawY = gridY * cellSize + cellSize/2;
  }
  

  //We have to arrays containing two types of block data. the "platforms array" uses the old system which was made outside of the grid system
  //The mapgrid array is using the new system 
  let platform;
  if (usedSelected[usedSelected.length - 1] === "block" || usedSelected[usedSelected.length - 1] === "platform" ) {
    platform = new Platform(drawX, drawY, usedSelected[0], usedSelected[1], usedSelected[2], usedSelected[3], usedSelected[4], usedSelected[5], usedSelected[6], usedSelected[7], usedSelected[8], usedSelected[9]);
  }

  else if (usedSelected[usedSelected.length - 1] === "breakableObject"){
    platform = new BreakableObject(drawX, drawY, usedSelected[0], usedSelected[1], usedSelected[4], usedSelected[9])
  }

  //Push platform to list of blocks placed if it isn"t literally the same block already there
  if (platform && platform.img !== mapGrid[gridX][gridY].img) {
    blocksPlaced.push([gridX, gridY, usedSelected]);
    mapGrid[gridX][gridY] = platform;
  }
}

function displayEraser(){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = Math.floor(worldX/cellSize);
  let gridY = Math.floor(worldY/cellSize);

  //Return early if no spot there
  if (!mapGrid[gridX] || mapGrid[gridX][gridY] === undefined) {
    return;
  }

  let drawY = gridY * cellSize + cellSize/2;
  let drawX = gridX * cellSize + cellSize/2;

  fill(255, 0, 0, 30)
  rect(drawX, drawY, 24, 24)
  noFill();
}

function deleteBlock(givenX, givenY){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = givenX || Math.floor(worldX/cellSize);
  let gridY = givenY || Math.floor(worldY/cellSize);

  //Return early if no spot there
  if (!mapGrid[gridX] || !mapGrid[gridX][gridY]) {
    return;
  }

  let item = mapGrid[gridX][gridY]
  console.log(mapGrid[gridX][gridY])
  blocksPlaced.push(["erase", item, gridX, gridY])

  handleDeletes(gridX, gridY)
  mapGrid[gridX][gridY] = NOBLOCK
}

function placeGate(givenX, givenY, givenDest, givenToX, givenToY){
  //Get the position of the actual world relative to the camera
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = givenX || Math.floor(worldX/cellSize);
  let gridY = givenY || Math.floor(worldY/cellSize);

  //Return early if no spot there
  if (!mapGrid[gridX] || mapGrid[gridX][gridY] === undefined) {
    return;
  }

  handleDeletes(gridX, gridY)

  let drawY = gridY * cellSize + cellSize/2;
  let drawX = gridX * cellSize + cellSize/2;
  

  let destination
  let toX
  let toY
  if (destination === null || destination === "") return;

  if (!givenDest){
    if (!canPlace) {
      return
    }
    console.log("Hello")
    destination = prompt("Where does your gate lead to (Enter a valid stage name you have created)")
    toX = Number(prompt("When coming out the otherside where should your player end up X (should be a number)"))
    toY = Number(prompt("When coming out the otherside where should you player up Y (should be a number)"))
    
  }

  else {
    destination = givenDest
    toX = givenToX
    toY = givenToY
  }
  
  canPlace = false

  let gate = new Gate(drawX, drawY, currentEditingStage, destination, 24, 24, toX, toY);

  //Push platform to list of blocks placed if it isn"t literally the same block already there
  blocksPlaced.push([gridX, gridY, gateBtn, destination, toX, toY]);
  mapGrid[gridX][gridY] = gate;
}

function placeMultipleObjects(type){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;
  let baseGridX = Math.floor(worldX/cellSize);
  let baseGridY = Math.floor(worldY/cellSize);

  let placementFunctions = {
    "block": placeBlock,
    "hurtBlock": placeHurtBlock,
    "mushroom": placeMushroom
  }

  let targetFunction = placementFunctions[type]

  if (type === "mushroom" && targetFunction) {
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++){
        if (y % 2 !== 0) {
          continue
        }
        targetFunction(baseGridX + x, baseGridY + y, )
      }
    }  
  }

  else if (targetFunction && type !== "mushroom"){
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++){
        targetFunction(baseGridX + x, baseGridY + y, )
      }
    }  
  }
}

function placeHurtBlock(givenX, givenY, givenSelected) {
  //Get the position of the actual world relative to the camera
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  
  let gridX = Math.floor(worldX/cellSize);
  let gridY = Math.floor(worldY/cellSize);

  //if no position on grid return
  if (!mapGrid[gridX]) {
    return;
  }

  let usedSelected = givenSelected || selected

  handleDeletes(gridX, gridY)

  let drawX = gridX * cellSize + cellSize/2;
  let drawY = gridY * cellSize + cellSize/2;
  
  let hurtBlock = new HurtBlock(drawX, drawY, selected[0], selected[1], selected[2], selected[3], selected[4], selected[5], selected[6], selected[7], selected[8], selected[9]);
  
  if (hurtBlock.img !== mapGrid[gridX][gridY].img) {
    blocksPlaced.push([gridX, gridY, usedSelected]);
    mapGrid[gridX][gridY] = hurtBlock;
  }
}

function placePlayer(givenX, givenY){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = givenX || Math.floor(worldX/cellSize);
  let gridY = givenY || Math.floor(worldY/cellSize);

  //if no position on grid return
  if (!mapGrid[gridX]) {
    return;
  }

  let drawX = gridX * cellSize + cellSize/2;
  let drawY = gridY * cellSize + cellSize/2;

  //Get rid of the player object if it already exists
  for (let x = 0; x < totalRows; x++) {
    for (let y = 0; y < totalCols; y++) {
      if (mapGrid[x][y] instanceof Player || mapGrid[[x][y] === "player1" || mapGrid[x][y] === "player2"]) {
        mapGrid[x][y] = NOBLOCK;
      }
    }
  }

  //Set block above and below as identifiers of player 
  mapGrid[gridX][gridY - 1] = "player1"
  mapGrid[gridX][gridY + 1] = "player2"
  
  //Set center block to player object so we can loop through it
  mapGrid[gridX][gridY] = player;

  //Get rid of the player from blockspalced table if there is one
  for (let i = blocksPlaced.length - 1; i >= 0; i--) {
    if (!blocksPlaced[i]) {
      return
    }
    let type = blocksPlaced[i][2]
    //The last item in the type array is the actual type of object it is
    if (type[type.length - 1] === "player") {
      blocksPlaced.splice(i, 1)
    } 
  }

  blocksPlaced.push([gridX, gridY, playerObject])
  player.x = drawX;
  player.y = drawY;
}

function placeMushroom(givenX, givenY){
  let worldX = mouseX/mapScale - cameraX;
  let worldY = mouseY/mapScale - cameraY;

  //Position on grid
  let gridX = givenX || Math.floor(worldX/cellSize);
  let gridY = givenY || Math.floor(worldY/cellSize);

  //if no position on grid return
  if (!mapGrid[gridX]) {
    return;
  }

  let drawX = gridX * cellSize + cellSize/2;
  let drawY = gridY * cellSize + cellSize/2;

  let currentCell = mapGrid[gridX][gridY]
  let aboveCell = mapGrid[gridX][gridY - 1]

  let mushroom = new Mushroom(drawX, drawY, drawX + 100, drawX - 100, 0);
  
  handleDeletes(gridX, gridY - 1);

  //If not already a mushroom there place mushroom
  blocksPlaced.push([gridX, gridY, selected]);
  mapGrid[gridX][gridY - 1] = mushroom;
  mapGrid[gridX][gridY] = "mushroom";
}

function placeObject() {
  if (gameMode === "editor") {

    if (
    mouseX >= sidebarX &&
    mouseX <= sidebarX + sidebarW &&
    mouseY >= sidebarY &&
    mouseY <= sidebarY + sidebarH + 100) {
    return
  }

    //Check what type of object this is
    if (selected[selected.length - 1] === "block" || selected[selected.length - 1] === "platform" || selected[selected.length - 1] === "breakableObject") {
      placeMultipleObjects("block");
    }

    else if (selected[selected.length - 1] === "player") {
      placePlayer();
    }

    else if (selected[selected.length - 1] === "hurtBlock") {
      placeMultipleObjects("hurtBlock")
    }

    else if (selected[selected.length - 1] === "mushroom") {
      placeMultipleObjects("mushroom")
    }

    else if (selected[selected.length - 1] === "gate") {
      placeGate()
    }

    else if (selected === "eraser") {
      deleteBlock()
    }
  }
}

function moveCamera() {
  if (keyIsDown(65)) {
    cameraX += CAMERAMOVEAMOUNT;
  }
  if (keyIsDown(68)) {
    cameraX -= CAMERAMOVEAMOUNT;
  }
  if (keyIsDown(87)) {
    cameraY += CAMERAMOVEAMOUNT;
  }
  if (keyIsDown(83)) {
    cameraY -= CAMERAMOVEAMOUNT;
  }
}

//Utility functions for stage building (undo, copy and paste ect)
function undo(){
  let lastBlock = blocksPlaced[blocksPlaced.length - 1]

  //Return if blocksPlaced is empty
  if (!blocksPlaced[0] || millis() - lastUndo < 60) {
    return;
  }

  //Different handling if this is for a delete
  if (lastBlock[0] === "erase") {
    console.log(lastBlock)
    let item = lastBlock[1]
    let x = lastBlock[2]
    let y = lastBlock[3]
    
    if (item === "player1") {
      placePlayer(x, y + 1)
    }

    else if (item === "player2") {
      placePlayer(x, y - 1)
    }

    else if (item instanceof Player){
      placePlayer(x, y)
    }

    else if (item === "mushroom") {
      placeMushroom(x, y)
    }

    else if (item instanceof Mushroom) {
      placeMushroom(x, y +1)
    }

    else {
      mapGrid[x][y] = item;
    }
    
    blocksPlaced.pop()
    blocksUndone.push(["erase", item, x, y])
    lastUndo = millis()
    return
  }

  let x = lastBlock[0]
  let y = lastBlock[1]
  let type = lastBlock[2]
  let items = ["block", "hurtBlock", "breakableObject", "gate", "platform"]
  if (type[type.length - 1] === "mushroom") {
    mapGrid[x][y] = NOBLOCK;
    mapGrid[x][y - 1] = NOBLOCK;

    lastUndo = millis();
    blocksUndone.push(blocksPlaced.pop())
  }

  else if (type[type.length - 1] === "player") {
    lastUndo = millis();
    mapGrid[x][y] = NOBLOCK;
    mapGrid[x][y - 1] = NOBLOCK;
    mapGrid[x][y + 1] = NOBLOCK;
    blocksUndone.push(blocksPlaced.pop())
  }

  else if (items.includes(type[type.length - 1])) {
    lastUndo = millis();
    mapGrid[x][y] = NOBLOCK;
    blocksUndone.push(blocksPlaced.pop())
  }
}

function redo() {
  let lastBlock = blocksUndone[blocksUndone.length - 1]

  if (!blocksUndone[0] || millis() - lastRedo < 150) {
    return;
  }

  if (lastBlock && lastBlock[0] === "erase") {
    console.log(lastBlock)
    let item = lastBlock[1]
    let x = lastBlock[2]
    let y = lastBlock[3]

    handleDeletes(x, y)
    blocksPlaced.push(blocksUndone.pop())
    lastRedo = millis()
    return
  }

  let x = lastBlock[0]
  let y = lastBlock[1]
  let type = lastBlock[2]
  let destination = lastBlock[3]
  let toX = lastBlock[4]
  let toY = lastBlock[5]

  console.log(lastBlock)

  //Place block back accordingly
  if (type[type.length - 1] === "mushroom") {
    placeMushroom(x, y)
  }

  else if (type[type.length - 1] === "block" || type[type.length - 1] === "platform" || type[type.length - 1] === "breakableObject") {
    placeBlock(x, y, type)
  }

  else if (type[type.length - 1] === "hurtBlock") {
    placeHurtBlock(x, y, type)
  }

  else if (type[type.length - 1] === "player") {
    placePlayer(x, y)
  }

  else if (type[type.length - 1] === "gate"){
    placeGate(x, y, destination, toX, toY)
  }

  lastRedo = millis();
  blocksUndone.pop()
}

function changeSize(rowsOrCols, change){
  if (millis() - lastSizeChange < 150) {
    return;
  }


  if (rowsOrCols === "rows") {
    rows += change 
    rows = Math.min(Math.max(rows, 1), 10)
  }

  else if (rowsOrCols === "cols"){
    cols += change
   cols = Math.min(Math.max(cols, 1), 10)
  }
  
  lastSizeChange = millis()
}

function deleteArea(xStart, yStart, rows, cols) {
  for (let x = xStart; x < rows + xStart; x++ ) {
    for (let y = yStart; y < cols + yStart; y++) {
      mapGrid[x][y] = NOBLOCK;
    }
  }
}

function initializeTables() {
  //Initialize decal tables for platforms
  deadGrassPlatform = [deadGrassPlatformL, deadGrassPlatformM, deadGrassPlatformR];
  stonePlatform = [stonePlatformL, stonePlatformM, stonePlatformR];
  dirtStage = [dirtStageL, dirtStageM, dirtStageR];
  deadGrassStage = [deadGrassStageL, deadGrassStageM, deadGrassStageR];
  stoneStage = [stoneStageL, stoneStageM, stoneStageR];

  //Initalize image table so I can seperate text referance and actual image for JSON saving
  imageTable = {
  // Player Animations
    playerIdleSheet, playerrollingSheet, playerJumpSheet, playerRunningSheet,
    playerPunch1, playerPunch2, playerPunch3, playerSprintSheet,
    playerUpwardPunch, playerLedgeSheet, playerDownSlam, playerBlock, playerButtonSheet,

    // Mushroom animations
    mushroomAttack, mushroomDie, mushroomIdle, mushroomRun, 
    mushroomStun, mushroomGotHit,mushroomButtonImg,

    // Props and textures
    deadGrassTexture, belowGrass, deadGrassPlatformM, deadGrassPlatformL,
    deadGrassPlatformR, stonePlatformL, stonePlatformM, stonePlatformR,
    dirtStageL, dirtStageR, dirtStageM, deadGrassStageL,
    deadGrassStageM, deadGrassStageR, spikeUp, stoneStageL,
    stoneStageR, stoneStageM, gateImg,

    //Tables
    deadGrassPlatform, stonePlatform, dirtStage, deadGrassStage, stoneStage,


    // Breakable objects
    crate,

    // Background
    backgroundLayer1, backgroundLayer2, backgroundLayer3, backgroundLayerLight,

    // GUI
    redHeart, blueHeart, greenHeart, yellowHeart, emptyHeart
  };
  
  //Initialzie blocks for dev mode and stage maker
  deadGrassLeft = [24, 24, false, "grey", "deadGrassStageL", 24, 24, true, false, false, "block"];
  deadGrassMid = [24, 24, false, "grey", "deadGrassStageM", 24, 24, true, false, false, "block"];
  deadGrassRight = [24, 24, false, "grey", "deadGrassStageR", 24, 24, true, false, false, "block"];
  dirtLeft = [24, 24, false, "brown", "dirtStageL", 24, 24, true, true, false, "block"];
  dirtRight = [24, 24, false, "brown", "dirtStageR", 24, 24, true, true, false, "block"];
  dirtMid = [24, 24, false, "brown", "dirtStageM", 24, 24, true, true, false, "block"];
  playerObject = [100, 100, null, null, "playerButtonSheet", null, null, null, null, null, "player"];
  spike = [24, 24, false, "grey", "spikeUp", 24, 24, true, false, false, "hurtBlock"];
  mushroomBtn = [100, 100, null, null, "mushroomButtonImg", null, null, null, null, null, "mushroom"];
  deadGrassPLeft = [24, 9, true, "grey", "deadGrassPlatformL", 24, 9, true, false, false, "platform"]
  deadGrassPRight = [24, 9, true, "grey", "deadGrassPlatformR", 24, 9, true, false, false, "platform"]
  deadGrassPMid = [24, 9, true, "grey", "deadGrassPlatformM", 24, 9, true, false, false, "platform"]
  stonePL = [24, 9, true, "grey", "stonePlatformL", 24, 9, true, false, false, "platform"]
  stonePR = [24, 9, true, "grey", "stonePlatformR", 24, 9, true, false, false, "platform"]
  stoneP = [24, 9, true, "grey", "stonePlatformM", 24, 9, true, false, false, "platform"]
  crateBtn = [24, 24, false, "grey", "crate", 24, 24, true, false, 3, "breakableObject"]
  gateBtn = [24, 24, false, "grey", "gateImg", 24, 24, true, false, false, "gate"]

  //Make table containing all object presets
  objectLibrary = [
    deadGrassLeft,
    deadGrassMid,
    deadGrassRight,
    dirtLeft,
    dirtRight,
    dirtMid,
    playerObject,
    spike,
    mushroomBtn,
    deadGrassPLeft,
    deadGrassPMid,
    deadGrassPRight,
    stonePL,
    stoneP,
    stonePR,
    crateBtn,
    gateBtn
  ];
}

function setUpGUI() {
  //Setting up our sidebar for the devmode
  sideBar = createDiv("");
  sideBar.position(sidebarX, sidebarY);
  sideBar.size(sidebarW, sidebarH);
  sideBar.style("background", "rgba(40, 0, 0, 0.95)");
  sideBar.style("overflow-y", "auto"); //Makes it scrollable
  sideBar.style("display", "grid"); //Make invisible for now
  sideBar.style("flex-direction", "column");
  sideBar.style("padding", "10px");
  sideBar.style("justify-content", "center");
  sideBar.style("gap", "25px");
  sideBar.style("border", "1px solid white");
  sideBar.hide();

  saveButton = createButton("SAVE")
  saveButton.style("font-family", "Courier New", "monospace"); //Switch to pixel art font once downloaded
  saveButton.style("font-weight", "bold");
  saveButton.style('font-size', "25px")
  saveButton.position(sidebarX, height * 0.8)
  saveButton.size(sidebarW, 50)
  saveButton.style("background", "rgba(40, 0, 0, 0.95)");
  saveButton.style("color", "white");
  saveButton.style("border", "1px solid white");
  saveButton.hide();

  saveButton.mousePressed(() => {
    //Save a structured clone of whatever the current map is to user stages
    if (userStages[currentEditingStage] ){
      userStages[currentEditingStage] = structuredClone(mapGrid)
      localStorage.setItem("platformer_userStages", JSON.stringify(userStages));
    }
  });

  for (let object of objectLibrary) {
    button = createButton("");
    button.parent(sideBar);
    button.size(100, 100);
    button.style("background-color", "transparent");
    
    //Get the corresponding image for our button and convert to form which the button can use
    let imageItem = imageTable[object[4]];
    let convertedData = imageItem.canvas.toDataURL();

    //Add image
    button.style("background-image", `url(${convertedData})`);
    button.style("background-size", "cover");
    button.style("image-rendering", "pixelated");

    button.mousePressed(function () {
      selected = object;
    });
  }
}
function loadStage(stage){
  currentStage = stage
  let newMap = createGrid(totalRows, totalCols)

  //Clear old stuff
  entities = []

  for (let x = 0; x < totalRows; x++){
    for (let y = 0; y < totalCols; y++){
      let item = stage[x][y]
      if (item.type === "block" || item.type === "platform") {
        newMap[x][y] = new Platform(
          item.x, 
          item.y, 
          item.sizeX, 
          item.sizeY, 
          item.oneWay, 
          item.color, 
          item.img, 
          item.tilesizeX, 
          item.tilesizeY, 
          item.canClimb, 
          item.bottomBlock, 
          item.cantCollide, 
          item.type
        );
      }

      if (item.type === "player") {
        let savedPlayer = new Player(
          item.x,
          item.y
        );
        player = savedPlayer
        newMap[x][y] = player
        newMap[x][y - 1] = "player1"
        newMap[x][y + 1] = "player2"
        entities.push(savedPlayer)
      }

      if (typeof item === "string") {
        newMap[x][y] = item;
      }

      if (item.type === "breakableObject") {
        newMap[x][y] = new BreakableObject(item.x, item.y, item.sizeX, item.sizeY, item.img, item.health)
      }

      if (item.type === "gate") {
        newMap[x][y] = new Gate(item.x, item.y, item.from, item.to, item.sizeX, item.sizeY, item.toX, item.toY)
      }

      if (item.type === "mushroom") {
        let shroom = new Mushroom(item.x, item.y, item.startPos, item.endPos, item.directionFacing)
        newMap[x][y] = shroom
      }
    }
  }

  console.log(newMap)
  return newMap
}

function createMenuUI(){
  //Create main menu container
  mainMenuContainer = (createDiv("").id("menu"))

  //Position on bottom left
  mainMenuContainer.style("position", "absolute");
  mainMenuContainer.style("bottom", "100px");
  mainMenuContainer.style("left", "75px");
  mainMenuContainer.style("display", "flex");
  mainMenuContainer.style("flex-direction", "column"); // Stack vertically
  mainMenuContainer.style("gap", "50px");

  //Button to continue from wherever player last left off in campaign/main game
  let continueBtn = createButton("CONTINUE")
  continueBtn.parent(mainMenuContainer)
  styleMenuButton(continueBtn)
  
  //Continue player from wherever their last stage was when pressed (or from save point in the future)
  continueBtn.mousePressed(() => {
    loadCampaign();
  })

  //Dev button or to make a stage
  let devButton = createButton("DEVELOP")
  devButton.parent(mainMenuContainer)
  styleMenuButton(devButton)

  //Open stage manager when pressed
  devButton.mousePressed(() => {
    stageManager.show();
  })
}

//Function to give main menu buttons consistent look
function styleMenuButton(btn) {
  //Bg customizations
  btn.style("padding", "10px 20px");
  btn.style("font-size", "75px");
  btn.style("cursor", "pointer");
  btn.style("background", "none");
  btn.style("border", "none");

  //Text customizations
  btn.style("font-family", "Courier New", "monospace"); //Switch to pixel art font once downloaded
  btn.style("font-weight", "bold");

  //Makes the button ease into changes for tween effect
  btn.style("transition", "transform 0.2s ease-out, color 0.2s");

  //Make hover anims
  btn.mouseOver(() => {
    btn.style("color", "#273C75")
    btn.style("transform", "scale(1.2)")
  })

  //Reset 
  btn.mouseOut(() => {
    btn.style("color", "#000000")
    btn.style("transform", "scale(1)")
  })
}

function stageManagerUI(){
  stageManager = createDiv("").id("stageManager")
  stageManager.style("position", "absolute");
  stageManager.style("top", "50%");
  stageManager.style("left", "50%");

  //Centers the div relative to its parent
  stageManager.style("transform", "translate(-50%, -50%)");

  //Customizations
  stageManager.style("background", "#290e4e61")
  stageManager.style("border", "5px solid black")
  stageManager.style("border-color", "#000000")
  stageManager.style("padding", "20px")
  stageManager.style("text-align", "center")
  stageManager.style("font-family", "Courier New", "monospace");
  stageManager.style("font-size", "50px")

  //Hide until dev button pressed
  stageManager.hide()
  buildStageItem(stageManager)
}

//Goal is to make a list of stages with various buttons to interact with stages
function buildStageItem(parent){
  parent.html('') //Crucial to clear old list

  //Title
  createElement("h3", "STAGES").parent(parent);

  //Creat scrollable box to contain our stagest

  let scrollBox = createDiv("").parent(parent)
  scrollBox.style("max-height", "300px")
  scrollBox.style("overflow-y", "auto");
  scrollBox.style("padding-right", "10px");
  scrollBox.style("padding-bottom", "15px");

  //Loop through all our existing stages and make a tab for them
  for (let stage in userStages) {
    let entry = createDiv("").parent(scrollBox);
    entry.style("display", "flex");
    entry.style("justify-content","space-between")
    entry.style("align-items", "center");
    entry.style("border", "5px solid black")
    entry.style("padding", "5px");
    
    //label
    createElement("span", stage).parent(entry);

    //Where are buttons are held
    let buttonGroup = createDiv("").parent(entry)
    buttonGroup.style("padding", "5px");
    buttonGroup.style("display", "flex");

    //Load map and play
    let playButton = createButton("▶").parent(buttonGroup);
    playButton.style("color", "white");
    playButton.style("background", "#004f1e");
    playButton.mousePressed(() => {
      loadUserStage(stage, "playing");
    })

    //Delete and save data
    let deleteButton = createButton("✘").parent(buttonGroup);
    deleteButton.style("color", "white");
    deleteButton.style("background", "#004f1e");
    deleteButton.mousePressed(() => {
      if (confirm(`Delete stage "${stage}"?`)){
        delete userStages[stage];
        localStorage.setItem("platformer_userStages", JSON.stringify(userStages));
      }
    })

    //Load map and edit
    let develop = createButton("✎").parent(buttonGroup);
    develop.style("color", "white");
    develop.style("background", "#004f1e");
    develop.mousePressed(() => {
      loadUserStage(stage, "editor");
    })
  }

  //Bottom area(creat new stage)
  createP("---").parent(parent);

  let newArea = createDiv("").parent(parent);
  newArea.style("display", "flex");
  newArea.style("justify-content", "center");
  newArea.style("gap", "10px");

  //Label
  createElement("span", "NEW").parent(newArea);

  //When pressed make a new stage input and enter it into save history
  let createBtn = createButton("CREATE").parent(newArea);
  createBtn.mousePressed(() => {
    let name = prompt("Enter stage name");
    if (name && !userStages[name]) {
      let emptyGrid = createGrid(totalRows, totalCols);
      userStages[name] = emptyGrid

      localStorage.setItem("platformer_userStages", JSON.stringify(userStages));
      loadUserStage(name, "editor"); 
    }
    else {
      alert("Stage with that name already exists");
    }
  });

  //Close button
  let exitButton = createButton("X").parent(parent);
  exitButton.style("margin-top", "10px");
  exitButton.mousePressed(() => {
    stageManager.hide();
  });
}

function loadUserStage(stageName, mode){  
  //If stage doesn't exist return
  if (!userStages[stageName]){
    return
  };

  currentEditingStage = (mode === "editor" ? stageName : null);
  mainMenuContainer.hide();
  stageManager.hide();
  gameMode = mode

  let deadStage = structuredClone(userStages[stageName])
  
  if (gameMode === "editor") {
    mapGrid = loadStage(deadStage)
    dev()
  }

  else {
    mapGrid = loadStage(deadStage)
  }

}