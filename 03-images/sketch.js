// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let luigiPicture;

function preload(){
  luigiPicture = loadImage("luigi.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)
}

function draw() {
  background(220);

  image(luigiPicture, mouseX, mouseY, luigiPicture.width * 0.5, luigiPicture.height * 0.5, luigiPicture.width * 1, luigiPicture.height * 1);
}
