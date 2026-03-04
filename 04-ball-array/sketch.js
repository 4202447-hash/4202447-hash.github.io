// Ball Obhect Notation Array

let balls = [];
let maxSize = 20

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
  for (let ball of balls) {
    ball.x += ball.dx;
    ball.y += ball.dy;
    fill(ball.color);
    circle(ball.x, ball.y, ball.radius);

    ball.x = ball.x  < 0 - ball.radius ? width : ball.x  > width + ball.radius ? 0 : ball.x;
    ball.y = ball.y  < 0 - ball.radius ? height : ball.y  > height + ball.radius ? 0 : ball.y;
  }

  console.log(maxSize)
}

function drawBall(_x, _y){
  let theBall = {
    x: _x,
    y: _y,
    dx: random(-5, 5),
    dy: random(-5, 5),
    radius: maxSize,
    color: color(random(255),random(255), random(255))
  };

  balls.push(theBall);
}

function mousePressed() {
  drawBall(mouseX, mouseY);
}

function mouseWheel(event) {
  if (event.deltaY < 0) {
    maxSize = min(maxSize += 1, 100);
  }
  else {
    maxSize = max(maxSize -= 1, 1);
  }
}