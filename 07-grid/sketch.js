// 2d grid demo
//learning 2d array

let theGrid = [
  [1, 0, 0, 0],
  [1, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 1]
];

let newGrid = [];

let squareDimension;
let squareSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  squareSize = height/squareDimension;

  let randomAmount = random(4, 32);
  let otherRandomAmount = random(4, 32);

  randomizeGrid(randomAmount, otherRandomAmount);

  squareSize = height/randomAmount;
  squareDimension = randomAmount;
}

function randomizeGrid(cols, rows) {
  for (let y = 0; y < cols; y++) {
    let aGrid = [];
    for (let x = 0; x < rows; x++) {
      aGrid.push(random(1));
    }
    newGrid.push(aGrid);
  }
}

function draw() {
  showGrid();

}

function showGrid() {
  for (let y = 0; y < squareDimension; y++) {
    for (let x = 0; x < squareDimension; x++) {
      if (newGrid[y][x] < 0.5) {
        fill("black");
      }
      else if (newGrid[y][x] > 0.5) {
        fill("white");
      }
      square(x * squareSize, y * squareSize, squareSize);
    }
  }
}

function mousePressed() {
  changeCell();
}

function changeCell() {
  let x = Math.floor(mouseX/squareSize);
  let y = Math.floor(mouseY/squareSize);

  console.log(x, y);
  if (newGrid[y][x] > 0.5) {
    newGrid[y][x] = 0.4;
  }

  else{
    newGrid[y][x] = 0.6;
  }
}