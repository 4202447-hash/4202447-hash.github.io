// 2d rectangular grid demo

const CELL_SIZE = 100;
const TILE = 0;
const WALL = 1;
const PLAYER = 9;
let rows;
let cols;
let grid;

//Textures
let grass;
let brick;

function preload() {
  brick = loadImage("brick.jpg");
  grass = loadImage("clover.jpg");
}

let thePlayer = {
  x: 3,
  y: 0,
  lastX: 0,
  lastY: 0
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  grid = generateRandomGrid(cols, rows);

  grid[thePlayer.y][thePlayer.x] = PLAYER;
}

function draw() {
  background(220);
  displayGrid();
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  //self
  toggleCell(x, y);
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  else if (key === "e") {
    grid = generateEmptyGrid(cols, rows);
  }

  else if (key === "s") {
    movePlayer(thePlayer.x, thePlayer.y + 1);
  }

  else if (key === "w") {
    movePlayer(thePlayer.x,thePlayer.y - 1);
  }

  else if (key === "a") {
    movePlayer(thePlayer.x - 1, thePlayer.y);
  }

  else if (key === "d") {
    movePlayer(thePlayer.x + 1, thePlayer.y);
  }

  grid[thePlayer.y][thePlayer.x] = PLAYER;
}

function toggleCell(x, y) {
  //make sure the cell you're toggling is in the grid
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (grid[y][x] === TILE) {
      grid[y][x] = WALL;
    }
    else if (grid[y][x] === WALL) {
      grid[y][x] = TILE;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === TILE) {
        image(grass, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === WALL) {
        image(brick, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === 9) {
        fill("red");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(TILE);
      }
      else {
        newGrid[y].push(WALL);
      }
    }
  }

  newGrid[thePlayer.y][thePlayer.x] = PLAYER
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(TILE);
    }
  }
  return newGrid;
}

function movePlayer(x, y){
  if ((y >= rows || y < 0 || x >= cols || x < 0) || grid[y][x] === WALL) {
    return;
  }

  thePlayer.lastX = thePlayer.x;
  thePlayer.lastY = thePlayer.y;

  thePlayer.x = x;
  thePlayer.y = y;

  grid[thePlayer.lastY][thePlayer.lastX] = TILE;
}