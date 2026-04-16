//Fireworks OOP demo
let particles = []
let PPC = 100;

class Particle{
  constructor(x, y, angle, dx, dy, radius,){
    this.x = x;
    this.y = y;
    this.dx = dx || random(-20, 20);
    this.dy = dy || random(-20, 20);
    this.radius = radius || 10;
    this.r = random(100, 255);
    this.g = random(50, 100);
    this.b = random(0, 255);
    this.transparency = 255;
  }

  move(){
    this.x += this.dx;
    this.y += this.dy;
  }

  display(){
    noStroke();
    fill(this.r, this.g, this.b, this.transparency);
    circle(this.x, this.y, this.radius * 2);
  }

  update(){
    this.move();
    this.display();

    this.r -= 1;
    this.g += 1;
    this.b += random(-1, 1);
    this.transparency -= 3;
    this.dy += 0.5

    if (this.transparency < 0) {
      particles = particles.filter(part => part !== this);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  for (let particle of particles){
    particle.update();
  }

  mousePressed();
}

function mousePressed(){
  for (let x = 0; x < PPC; x++){
    particles.push(new Particle(mouseX, mouseY));
  }
}