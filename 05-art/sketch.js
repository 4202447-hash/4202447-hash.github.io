//Generative Art Demo

let tiles = [];
const THE_SIZE = 2;
let lastChange = 0;

function setup() {
  createCanvas(400, 400);


  for (let y = THE_SIZE/2; y < width; y += THE_SIZE) {
    for (let x = THE_SIZE/2; x < width; x += THE_SIZE) {
      tiles.push(spawnTile(x, y, THE_SIZE));
    }
  }

}

function draw() {
  background(220);

  for (let tile of tiles) {
    line(tile.x1, tile.y1, tile.x2, tile.y2);
  }

  if (millis() - lastChange > 100) {
    tiles = [];
    for (let y = THE_SIZE/2; y < width; y += THE_SIZE) {
      for (let x = THE_SIZE/2; x < width; x += THE_SIZE) {
        tiles.push(spawnTile(x, y, THE_SIZE));
      }
    }
  }
}

function spawnTile(x, y, tileSize) {
  let choice = random(100);
  let tile;
  if (choice < 50) {
    tile = {
      x1: x - tileSize/2,
      y1: y + tileSize/2,
      x2: x + tileSize/2,
      y2: y - tileSize/2
    };
    console.log("YOU GIOT LUCKY");
  }
  else {
    tile = {
      x1: x - tileSize/2,
      y1: y - tileSize/2,
      x2: x + tileSize/2,
      y2: y + tileSize/2
    };
  }
  return tile;
}

function mouseClicked() {
  tiles = [];
  for (let y = THE_SIZE/2; y < width; y += THE_SIZE) {
    for (let x = THE_SIZE/2; x < width; x += THE_SIZE) {
      tiles.push(spawnTile(x, y, THE_SIZE));
    }
  }
}