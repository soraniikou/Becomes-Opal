 🌊 Becomes Opal — 感情リリース体験アプリ

> **tap to release your feelings**  
> タップするたびに、感情がオパールの光になって解き放たれる。

🔗 **Live Demo**: [https://becomes-opal.vercel.app](https://become-opal.vercel.app)  
📁 **Repository**: [soraniikou/Becomes-Opal](https://github.com/soraniikou/Becomes-Opal)

---

## ✨ 体験のイメージ

![Opal Visual](https://raw.githubusercontent.com/soraniikou/Becomes-Opal/main/opal1.png)

*暗闇の中に広がるオパールの光。タップするたびに感情が粒子として放たれ、深海の発光体のように揺れ続ける。*

---

## 💎 このアプリについて

**Becomes Opal** は、感情を光にリリースするためのビジュアル体験です。

言葉では表せないモヤモヤ、悲しさ、興奮、怒り——  
画面をタップするだけで、それらが青紫色の粒子となって広がり、  
やがて深いオパールの輝きに溶けていきます。

「手放す」という体験を、美しさとともに。

---

使い方

1. [アプリを開く](https://become-opal.vercel.app)
2. 画面に「**tap to release your feelings**」と表示されます
3. **タップ or クリック**するだけ
4. 感情が粒子とオパール光として広がります
5. 何度でも、好きなだけ

---

 技術構成

| ファイル | 役割 |
|---|---|
| `index.html` | エントリーポイント |
| `sketch.js` | p5.js によるビジュアル本体 |
| `p5.js` | Creative Coding ライブラリ |
| `p5.sound.min.js` | サウンド対応（将来拡張用） |
| `style.css` | 画面スタイル |
| `opal1.png` | ビジュアルリファレンス画像 |

**デプロイ**: Vercel  
**ホスティング**: GitHub Pages 対応

---

🌈 ビジュアルの仕組み

```
タップ
 └─ 25個のパーティクルが放射状に広がる
 └─ DeepOpal（深海発光体）が生成・浮遊
     └─ 青・紫・水色の多層グローが揺らめく
     └─ 色相が時間とともにゆっくり変化
     └─ 300フレーム後に静かにフェードアウト
```

カラーパレット: HSB モードによる `170〜260°` の青紫系スペクトル

---

 📄 sketch.js（コア）

```javascript
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
  for (let i = 0; i < 25; i++) particles.push(new Particle(mouseX, mouseY));
  deepGlows.push(new DeepOpal(mouseX, mouseY));
  if (deepGlows.length > 20) deepGlows.shift();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
```

---

 今後のアイデア

- [ ] タップの強さで粒子の勢いが変わる
- [ ] 感情の「種類」を選べるモード（怒り、悲しみ、喜び）
- [ ] 音との連動（呼吸音、波音）
- [ ] セッションの記録・可視化

---

💎 作者

soraniikou
感情と創造性の交差点で、光の体験をつくっています。

---

*感情は消えない。ただ、形を変えて宇宙に溶けていく。*
