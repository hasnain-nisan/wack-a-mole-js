let canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

let timeToNextMole = 0;
let moleInterval = 500;
let lastTime = 0;

let moles = [];
class Mole {
    constructor(){
        this.spriteWidth = 250;
        this.spriteHeight = 188;
        this.sizeModifier = Math.random() * 0.6 + 0.6;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = getRandom(400, window.innerHeight) - this.height / 2;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './spritesheet.png';
        this.frame = 0;
        this.maxFrame = 78;
        this.circle = {x:this.x, y:this.y, radius:this.width*.2}
}
    update(){
        if(this.frame > this.maxFrame){
            this.frame = 0;
            this.markedForDeletion = true;
        }
        if(Math.random() > 0.6){
            this.frame++;
        }
    }
    draw(){
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.width*.2, 0, 2 * Math.PI);
        // ctx.stroke();
        ctx.strokeRect(this.x - (this.width/9.5), this.y - (this.height/5), this.width *.2, this.height*.3)
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x - (this.width/2), this.y - (this.height/2), this.width, this.height)
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

let bullets = [];
class Bullet {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.markedForDeletion = false;
    }
    update(){
        this.y -= 2;
        if(this.y < 0) this.markedForDeletion = true;
    }
    draw(){
        // ctx.beginPath();
        // ctx.fillStyle = "black";
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fill();
        ctx.fillRect(this.x, this.y, 5, 5)
    }
}

let hammers = [];
class Hammer {
    constructor(x, y){
        this.spriteWidth = 150;
        this.spriteHeight = 135;
        this.width = this.spriteWidth/1.3;
        this.height = this.spriteHeight/1.3;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = './spritesheet1.png';
        this.frame = 7;
        this.maxFrame = 23;
        this.markedForDeletion = false;
        this.play = false;
        this.repeat = 4;
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
        }
    }
    draw(){
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.width*.2, 0, 2 * Math.PI);
        // ctx.stroke();
        let frameInterval = (this.maxFrame / 2) + 1;
        let rectX = this.x - (this.width/2.3);
        let rectY = this.y - (this.height/4.5);
        let rectW = this.width *.3;
        let rectH = this.height*.2

        if(this.play){
            if(this.frame < frameInterval){
                ctx.fillRect(
                    this.x - (this.width/2.3), 
                    (this.y - (this.height/4.5)), 
                    this.width *.3, 
                    this.height*.2
                );
            } else {
                ctx.fillRect(
                    this.x - (this.width/2.3) - 33, 
                    (this.y - (this.height/4.5)) + 43, 
                    // this.width *.3, 
                    // this.height*.2
                    this.width *.2, 
                    this.height*.3
                );
            }
        }
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x - this.width, this.y - this.height/3 , this.width, this.height)
    }

}

// document.addEventListener('mouseover', (e) => {
//     let x = e.offsetX;
//     let y = e.offsetY;

//     for (let i = 0; i < 3; i++) {
//         let hammer = new Hammer(x, y);
//         hammers.push(hammer);
//     }
// })

document.addEventListener('mousemove', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    if(hammers.length === 0){
        hammers = [new Hammer(x, y)];
    } else {
        hammers[0].x = x;
        hammers[0].y = y;
    }
})

document.addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    hammers[0].play = true;
    hammers[0].repeat++;
    // hammers[0].update();
    // hammers[0].draw();

    // let hammer = new Hammer(x, y);
    // hammers.push(hammer);

    // for (let i = 0; i < 3; i++) {
    //     let bullet = new Bullet(x, y);
    //     bullets.push(bullet);
    // }

})

// hammers = [new Hammer(300, 500)];

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

    [...moles, ...hammers].forEach(object => object.update(deltaTime));
    [...moles, ...hammers].forEach(object => object.draw());


    moles = moles.filter(mole => !mole.markedForDeletion);
    circles = circles.filter(circle => !circle.markedForDeletion);
    bullets = bullets.filter(bullet => !bullet.markedForDeletion);

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