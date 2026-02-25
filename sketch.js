let particles = [];
let deepGlows = [];
let frameTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  for (let i = 0; i < 12; i++) {
    deepGlows.push(new DeepOpal());
  }
}

function draw() {
  background(220, 30, 5, 0.05);
  frameTimer++;
  for (let g of deepGlows) {
    g.update();
    g.display();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) particles.splice(i, 1);
  }
  if (particles.length === 0) {
    push();
    fill(200, 20, 90, 0.3 + sin(frameCount * 0.02) * 0.15);
    textAlign(CENTER);
    textSize(13);
    textFont('Georgia');
    text("tap to release your feelings", width / 2, height / 2);
    pop();
  }
}

function mousePressed() {
  setTimeout(() => { new Audio('wasurete.m4a').play(); }, 8000);
  for (let i = 0; i < 25; i++) particles.push(new Particle(mouseX, mouseY));
  deepGlows.push(new DeepOpal(mouseX, mouseY));
  if (deepGlows.length > 20) deepGlows.shift();
}

class DeepOpal {
  constructor(x, y) {
    this.x = x ? x + random(-150, 150) : random(width);
    this.y = y ? y + random(-150, 150) : random(height);
    this.z = 0;
    this.targetZ = random(0.3, 0.9);
    this.zSpeed = random(0.0005, 0.002);
    this.baseHue = random([170, 185, 200, 215, 230, 245, 260]);
    this.size = random(40, 120);
    this.alpha = 0;
    this.phase = random(TWO_PI);
    this.arrived = false;
    this.fadeOut = false;
    this.fadeOutTimer = 0;
  }
  update() {
    if (!this.fadeOut) {
      this.z += this.zSpeed;
      this.alpha = this.z * 0.5;
      if (this.z >= this.targetZ) {
        this.arrived = true;
        this.fadeOutTimer++;
        if (this.fadeOutTimer > 300) this.fadeOut = true;
      }
    } else {
      this.alpha -= 0.001;
    }
    this.x += sin(frameCount * 0.008 + this.phase) * 0.3;
    this.y += cos(frameCount * 0.006 + this.phase) * 0.2;
  }
  display() {
    if (this.alpha <= 0) return;
    push();
    translate(this.x, this.y);
    let sc = 0.2 + this.z * 0.8;
    for (let layer = 3; layer >= 0; layer--) {
      let hue = (this.baseHue + frameCount * 0.3 + layer * 25 + sin(frameCount * 0.05) * 40) % 360;
      let layerSize = this.size * sc * (1 + layer * 0.4);
      let layerAlpha = this.alpha * (0.15 - layer * 0.03);
      fill(hue, 45, 80, max(0, layerAlpha));
      ellipse(0, 0, layerSize, layerSize * 0.7);
    }
    let coreHue = (this.baseHue + frameCount * 0.5) % 360;
    fill(coreHue, 20, 85, this.alpha * 0.8);
    let coreSize = this.size * sc * 0.3;
    ellipse(0, 0, coreSize, coreSize * 0.7);
    pop();
  }
  isDone() { return this.alpha <= 0; }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.3, 2.0));
    this.acc = createVector(0, 0.015);
    this.lifespan = 1.0;
    this.baseHue = random([170, 190, 205, 220, 235, 250]);
    this.size = random(4, 10);
    this.phase = random(TWO_PI);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 0.004;
  }
  display() {
    let hueValue = (this.baseHue + sin(frameCount * 0.05 + this.phase) * 40) % 360;
    fill(hueValue, 30, 85, this.lifespan * 0.3);
    ellipse(this.pos.x, this.pos.y, this.size * 2.5, this.size * 2.5);
    fill(hueValue, 20, 85, this.lifespan);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.05);
    rect(0, 0, this.size, this.size);
    pop();
  }
  isFinished() { return this.lifespan < 0; }
}

function touchStarted() {
  const audio = new Audio('wasurete.m4a');
audio.load();
setTimeout(() => { audio.play(); }, 8000);
  for (let i = 0; i < 25; i++) particles.push(new Particle(mouseX, mouseY));
  deepGlows.push(new DeepOpal(mouseX, mouseY));
  if (deepGlows.length > 20) deepGlows.shift();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
