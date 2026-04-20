//Connected nodes demo

let nodes = [];
const CONNECTIONLENGTH = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for (let node of nodes){
    node.update();
  }

  for (let node of nodes){
    node.display();
  }

  
  //mousePressed();
}


class MovingPoint{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.xTime = random(1000);
    this.yTime = random(1000);
    this.color = color(random(255), random(255), random(255), random(255));
    this.speed = random(5, 10);
    this.deltaTime = 0.05;
  }

  display(){
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius * 2);
  }

  update(){
    this.move();
    this.wrap();
    this.connect();
    this.adjustSize();
  }

  connect(){
    for (let otherNode of nodes){
      let distanceApart = dist(this.x, this.y, otherNode.x, otherNode.y);
      if (otherNode !== this && distanceApart < CONNECTIONLENGTH) {
        stroke(this.color);
        line(this.x, this.y, otherNode.x, otherNode.y);
      }
    }
  }

  adjustSize(){
    let mouseDist = dist(mouseX, mouseY, this.x, this.y);
    let theSize = map(mouseDist, 0, width, 15, 20);
    this.radius = theSize;
  }

  wrap(){
    if (this.x < 0){
      this.x += width;
    }
    if (this.x > width){
      this.x -= width;
    }
    if (this.y < 0){
      this.x += height;
    }
    if (this.y > height){
      this.x -= height;
    }
  }

  move(){
    let dx = map(noise(this.xTime), 0, 1, -this.speed, this.speed);
    let dy = map(noise(this.yTime), 0, 1, -this.speed, this.speed);

    //move point
    this.x += dx;
    this.y += dy;

    //Move on point
    this.xTime += this.deltaTime;
    this.yTime += this.deltaTime;
  }
}

function mousePressed() {
  let somePoint = new MovingPoint(mouseX, mouseY);
  nodes.push(somePoint);
}