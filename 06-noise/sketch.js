// Perlin Noise Demo
// Ayman

let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  time+= 0.01;
  let x = noise(time);
  let y = noise(time + 2) * height;
  fill(0);
  circle( x* width, y, 75);
}

