
// Ball collision OOP demo

class Ball{
  constructor(x, y, dx, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx || random(-5, 5);
    this.dy = dy || random(-5, 5);
    this.radius = radius || random(25, 75);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  display(){
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, 2 *this.radius);
  }

  move(){
    this.x += this.dx;
    this.y += this.dy;
    
    //Check top or bottom for bounce
    if (this.x + this.radius >= width || this.x - this.radius <= 0){
      this.dx *= -1;
    }

    if (this.y + this.radius > height || this.y - this.radius < 0){
      this.dy *= -1;
    }
  }
  
  bounceOff(otherBall){
    let radiiSum = this.radius + otherBall.radius;
    let distanceApart = dist(this.x, this.y, otherBall.x, otherBall.y);
    if (radiiSum > distanceApart){
      //Collided
      this.r = 255;
      this.g = 0;
      this.b = 0;

      if (Math.sign(this.dx) !== Math.sign(otherBall.dx)){
        this.dx *= -1; 
        otherBall.dx *= -1;
      }

      else {
        if (abs(this.dx) > abs(otherBall.dx)){
          let smallerBall = this.radius > otherBall.radius ? this : otherBall;
          let biggerBall = this.radius > otherBall.radius ? otherBall : this;
          smallerBall.dx += Math.sign(smallerBall.dX) * biggerBall.dx;
          biggerBall.dx += Math.sign(biggerBall.dX) * smallerBall.dx;
        }
      }

      if (Math.sign(this.dy) !== Math.sign(otherBall.dy)){
        this.dy *= -1; 
        otherBall.dy *= -1;
      }
    }

    //otherBall.bounceOff(this.ball);
  }
}

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of ballArray){
    ball.display();
    ball.move();
    for (let otherBall of ballArray){
      if (otherBall !== ball){
        ball.bounceOff(otherBall);
      } 
    }
  }
}

function mousePressed(){
  let someBall = new Ball(mouseX, mouseY);
  ballArray.push(someBall);
}