const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d"); 

class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let speed = 7;

let tileCount = 20; 
let tileSize = canvas.width/tileCount - 2; 
let headX = 10; 
let headY = 10; 

const snakeParts = [];
let tailLength = 2;

let appleX = 5; 
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const eatingSound = new Audio("resources/apple.wav");
const boomSound = new Audio("resources/gameover.wav")

const appleImg = new Image();
appleImg.src = "resources/apple.png";

//game loop
function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if (result){
        boomSound.play();
        return; //stop loop
    }
    clearScreen();
    checkAppleCollision();
    drawApple(); 
    drawSnake();

    drawScore();
    if (score > 2){
        speed = 11;
    }
    if (score > 5){
        speed= 15;
    }
    setTimeout(drawGame, 1000 / speed); 
}
function drawScore() { 
    let playerScore = document.getElementById("playerScore");
    playerScore.textContent = `Score: ${score}`;
}

function clearScreen(){
    ctx.fillStyle = "rgb(60, 60, 60)";
    ctx.fillRect(0,0, canvas.width, canvas.height); 
}

function drawSnake(){

    ctx.fillStyle = "rgb(79, 255, 117)"; //body 
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize); 
    }
    snakeParts.push(new SnakePart(headX, headY)) 
    while (snakeParts.length > tailLength){
        snakeParts.shift(); 
    }
    ctx.fillStyle = "rgb(200, 255, 212)"; //head 
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize) 
}

function isGameOver(){ //check game over
    let gameOver = false;
    
    //if game hasn't started can't be game over
    if (yVelocity === 0 && xVelocity === 0){
        return false;
    }

    //walls
    if (headX < 0 ||
        headX >= tileCount ||
        headY < 0 || 
        headY >= tileCount) { 
        gameOver = true;
    }
    //body collision
    for (let i = 0; i < snakeParts.length; i++) {
       let part = snakeParts[i];
       if(part.x === headX && part.y === headY){
        gameOver = true;
        break;
       }
        
    }
    //draw game over
    if (gameOver){
        ctx.font = "30px 'Press Start 2P'";
        ctx.shadowColor="rgb(79, 255, 117)";
        ctx.shadowBlur=7;
        ctx.lineWidth=5;
        ctx.strokeText("Game Over!",canvas.width/6, canvas.height/2);
        ctx.shadowBlur=0;
        ctx.fillStyle ="rgb(200, 255, 212)";
        ctx.fillText(`Game Over!`, canvas.width/6, canvas.height/2);
    }
    return gameOver;
}

function changeSnakePosition(){ 
    headX = headX + xVelocity; 
    headY = headY + yVelocity;
}

function checkAppleCollision(){ //collision detection with apple
    if(appleX === headX && appleY == headY){
        appleX = Math.floor(Math.random()* tileCount);
        appleY = Math.floor(Math.random()* tileCount);
        tailLength++;
        score++;
        eatingSound.play();
    }
}
function drawApple(){
    ctx.drawImage(appleImg, appleX*tileCount, appleY*tileCount, 25, 25)
}

function keyDown(event){ 
    //up 
    if (event.keyCode == 38){
        if (yVelocity == 1) //prevents crashing into own body
            return 
        yVelocity = -1; 
        xVelocity = 0;
    }
    //down 
    if (event.keyCode == 40){
        if (yVelocity == -1) 
            return
        yVelocity = 1; 
        xVelocity = 0;
    }
    //left 
    if (event.keyCode == 37){
        if (xVelocity == 1) 
            return
        yVelocity = 0;
        xVelocity = -1; 
    } //right
    if (event.keyCode == 39){
        if (xVelocity == -1) 
            return
        yVelocity = 0;
        xVelocity = 1;
    }
} 
document.getElementById("restartBtn").addEventListener("click", function(){
    window.location.reload();
});
document.body.addEventListener("keydown", keyDown);
drawGame();