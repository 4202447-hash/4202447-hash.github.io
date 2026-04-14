// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let walker;
let runner; 

class Walker{
  constructor(x, y, color, speed, size){
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;
    this.color = color;
    this.speed = speed;
    this.size = size;
  }

  move(){
    let choice = random(100);
    this.lastX = this.x;
    this.lastY = this.y;

    if (choice < 25) {
      this.x += this.speed;
    }
    else if (choice < 50){
      this.x -= this.speed;
    }
    else if (choice < 75){
      this.y += this.speed;
    }
    else{
      this.y -= this.speed;
    }
  }

  display(){
    fill(this.color);
    circle(this.x, this.y, this.size);
    stroke(this.color);
    line(this.lastX, this.lastY, this.x, this.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  walker = new Walker(width/2, height/2, color(255, 0, 0), 50, 5);
  runner = new Walker(width/2, height/2, color(0, 255, 0), 100, 5);
}

function draw() {
  walker.move();
  walker.display();

  runner.move();
  runner.display();
}
