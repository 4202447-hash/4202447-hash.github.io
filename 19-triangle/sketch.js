//sterpinski triangle
let intTri = [
  {x: 400, y: 100},
  {x: 100, y: 500},
  {x: 700, y: 500}
];

let theDepth = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  intTri = [
    {x: width/2, y: height * 0.1},
    {x: 500, y: height * 0.9},
    {x: width - 500, y: height * 0.9}
  ];

  background(0);

  sterpinski(intTri, theDepth);
}

function draw() {
}

function mousePressed(){
  theDepth ++;

  if (theDepth > 10){
    theDepth = 4;
  }

  background(0);

  sterpinski(intTri, theDepth);
}

function sterpinski(points, depth){
  stroke(255);
  
  if (depth < 0){
    return;
  }

  if (depth % 2 === 0){
    fill(0, 0, 255);
  }
  else if (depth % 3 === 0){
    fill(255, 0, 0);
  }
  else{
    fill(0, 255, 0);
  }

  triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y);

  //base case

  //top triangle
  sterpinski([points[0], midPoint(points[0], points[1]), midPoint(points[0], points[2])], depth - 1);

  //Bottom right
  sterpinski([points[2], midPoint(points[0], points[2]), midPoint(points[1], points[2])], depth - 1);

  //Bottom left
  sterpinski([points[1], midPoint(points[0], points[1]), midPoint(points[1], points[2])], depth - 1);
}

function midPoint(p1, p2){
  let midX = (p1.x + p2.x) / 2;
  let midY = (p1.y + p2.y) / 2;
  return {x: midX, y: midY};
}