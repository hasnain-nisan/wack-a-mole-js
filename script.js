let canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);
let isGameStart = false;

let timeToNextMole = 0;
let moleInterval = 500;
let lastTime = 0;

let molee = null;
let moles = [];
class Mole {
    constructor(){
        this.spriteWidth = 250;
        this.spriteHeight = 188;
        this.sizeModifier = Math.random() * 0.6 + 1;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = getRandom(window.innerHeight * .6, window.innerHeight) - this.height / 2;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './spritesheet.png';
        this.frame = 0;
        this.maxFrame = 78;
        this.circle = {x:this.x, y:this.y, radius:this.width*.2}
        this.mole = {x:this.x - (this.width/9.5), y:this.y - (this.height/5), width:this.width *.2, height:this.height*.3}
        this.getHit = false;
    }
    update(){
        if(this.frame > this.maxFrame){
            this.frame = 0;
            this.markedForDeletion = true;
        }
        if(Math.random() > 0.6){
            if(!this.getHit)
            this.frame++;
        }
        if(this.gameHit){
            setTimeout(() => {
                
            }, 1000);
        }
    }
    draw(){
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.width*.2, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.strokeRect(this.x - (this.width/9.5), this.y - (this.height/5), this.width *.2, this.height*.3)
        if(this.getHit){
            if(Math.random() > 0.5){
                ctx.save();
                ctx.globalAlpha = Math.random();
                ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x - (this.width/2), this.y - (this.height/2), this.width, this.height)
                ctx.restore();
            } else {
                ctx.save();
                ctx.globalAlpha = 1;
                ctx.drawImage(
                  this.image,
                  this.spriteWidth * this.frame,
                  0,
                  this.spriteWidth,
                  this.spriteHeight,
                  this.x - this.width / 2,
                  this.y - this.height / 2,
                  this.width,
                  this.height
                );
                ctx.restore();
            }
        } else {
            ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x - (this.width/2), this.y - (this.height/2), this.width, this.height)
        }
    }
}

let circles = [];
class Circle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = (Math.random() * 20 + 10)
        this.maxRadius = Math.random() * 20 + 20;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.markedForDeletion = false;
        this.directionX = getRandom(-1.2, 1.2);
        this.directionY = getRandom(-1.2, 1.2);
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        this.x += this.directionX;
        this.y += this.directionY;
        if(this.radius > this.maxRadius - 10) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = "darkgrey";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.restore();
    }
}

let stars = [];
class Star {
  constructor(x, y, width, height) {
    this.image = new Image();
    this.image.src = "./star.png";
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrame = 9;
    // this.sound = new Audio();
    // this.sound.src = "./boom.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 150;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    if (this.frame > this.maxFrame) {
      this.frame = 0;
      this.markedForDeletion = true;
    } else {
        if(Math.random() > 0.5){
            this.frame++;
            this.timeSinceLastFrame = 0;
        }
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let hammers = [];
class Hammer {
    constructor(x, y){
        this.spriteWidth = 150;
        this.spriteHeight = 135;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = x;
        this.y = y;
        this.newX = null;
        this.newY = null;
        this.image = new Image();
        this.image.src = './spritesheet1.png';
        this.frame = 0;
        this.maxFrame = 23;
        this.markedForDeletion = false;
        this.play = false;
        this.repeat = 2;
        this.hammerRect = {
          x: this.x - this.width / 2.3 - 45,
          y: this.y - this.height / 4.5 + 55,
          width: this.width * 0.2,
          height: this.height * 0.3,
        };
    }
    update(){
        if(this.frame > this.maxFrame){
            this.repeat--;
            this.frame = 0;
        } else {
            if(this.play){
                this.frame++;
            }
        }
        if(this.repeat == 0){
            this.play = false;
            this.repeat = 4;
            if (molee) molee.getHit = false;
            if (molee) molee.markedForDeletion = true;
        }
    }
    draw(){
        if(this.play){
            // ctx.fillRect(
            //   this.x - this.width / 2.3 - 45,
            //   this.y - this.height / 4.5 + 55,
            //   this.width * 0.2,
            //   this.height * 0.3
            // );
            let rect = {
              x: this.x - this.width / 2.3 - 45,
              y: this.y - this.height / 4.5 + 55,
              width: this.width * 0.2,
              height: this.height * 0.3,
            };
            moles.forEach((mole) => {
                if(mole.frame > 10 && mole.frame < 72){
                    let moleRect = mole.mole;
                    let isCollide = checkCollisionBetweenRects(moleRect, rect);
                    if (isCollide) {
                      molee = mole;
                      mole.getHit = true;
                      if (stars.length === 0) {
                        stars.push(
                          new Star(
                            moleRect.x - 10,
                            moleRect.y - 10,
                            moleRect.width * 1.5,
                            moleRect.height * 1.2
                          )
                        );
                      }
                    }
                }
            });
        }
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x - this.width, this.y - this.height/3 , this.width, this.height)
    }

}

document.addEventListener('mousemove', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    // if(isGameStart){
        if(hammers.length === 0){
            hammers = [new Hammer(x, y)];
        } else {
            if(hammers.length > 0 && !hammers[0].play){
                hammers[0].x = x;
                hammers[0].y = y;
            }
        }
    // }
})

document.addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    hammers[0].play = true;
    hammers[0].repeat++;

})

// stars = [new Star(200, 300, 200, 300)];

function animate(timestamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp
    timeToNextMole += deltaTime;
    if(timeToNextMole > moleInterval){
        let mole = new Mole();
        let isCollide = [];
        moles.forEach(m => {
            let collision = checkCollisionBetweenCircles(m.circle, mole.circle)
            isCollide.push(collision)
            // console.log(isCollide);
        })
        if(!isCollide.includes(true)){
            moles.push(mole);
            timeToNextMole = 0;
            moles.sort((a, b) => a.y - b.y);
        }
    }

    [...moles, ...hammers, ...stars].forEach(object => object.update(deltaTime));
    [...moles, ...hammers, ...stars].forEach(object => object.draw());

    moles = moles.filter(mole => !mole.markedForDeletion);
    circles = circles.filter(circle => !circle.markedForDeletion);
    stars = stars.filter(star => !star.markedForDeletion);

    requestAnimationFrame(animate)
}

animate(0)

function getRandom(min, max) {
    const floatRandom = Math.random()
    const difference = max - min
    // random between 0 and the difference
    const random = Math.round(difference * floatRandom)
    const randomWithinRange = random + min
    return randomWithinRange
  }

// collision detection between two rectangle
var rect1 = { x: 5, y: 5, width: 50, height: 50 };
var rect2 = { x: 20, y: 10, width: 10, height: 10 };

const checkCollisionBetweenRects = (rect1, rect2) => {
    if(rect1.x > rect2.x + rect2.width ||
       rect1.x + rect1.width < rect2.x ||
       rect1.y > rect2.y + rect2.height ||
       rect2.y + rect2.height < rect2.y
    ){
        return false;
    } else {
        return true;
    }
}

const checkCollisionBetweenCircles = (circle1, circle2) => {
    let dx = circle2.x - circle1.x;
    let dy = circle2.y - circle1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let sumOfRadius = circle1.radius + circle2.radius;

    if(distance < sumOfRadius){
        return true;
    } else if (distance === sumOfRadius){
        return false;
    } else if (distance > sumOfRadius){
        return false;
    }
}

const gameStart = (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    if (hammers.length === 0) {
      hammers = [new Hammer(x, y)];
    }

    let isGameStart = true;
    let startBtn = document.querySelector('.start');
    startBtn.style.display = 'none';
    canvas.style.opacity = 1;
}