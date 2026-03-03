// Ball Obhect Notation Array

let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
  for (let ball of balls) {
    ball.x += ball.dx;
    ball.y += ball.dy;
    circle(ball.x, ball.y, ball.radius);
  }
}

function drawBall(){
  let theBall = {
    x: random(width),
    y: random(height),
    dx: random(-5, 5),
    dY: random(-5, 5),
    radius: random(5, 25)
  };

  balls.push(theBall);
}

function mousePressed() {
  drawBall();
}
