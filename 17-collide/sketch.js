//Collide 2D
let hit;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  rect(200, 200, 100, 150);
  circle(mouseX, mouseY, 100);

  hit = collideRectCircle(200, 200, 100, 150, mouseX, mouseY, 100);
  if (hit){
    stroke(255, 0, 0);
  }
  else {
    stroke(0);
  }
}