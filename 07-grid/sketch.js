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

  let randomAmount = random(4, 16);

  for (let y = 0; y < randomAmount; y++) {
    let aGrid = [];
    for (let x = 0; x < randomAmount; x++) {
      aGrid.push(random(1));
    }
    newGrid.push(aGrid);
  }

  squareSize = height/randomAmount;
  squareDimension = randomAmount;
}

function draw() {
  background(220);
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