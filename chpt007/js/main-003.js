
var boxImage = new Image();
var gridImage = new Image();
var bunnyImage = new Image();
var imgIdx = 0;
var radius = 10;
var allCircles = [];

window.onload = () => {
    initApp();
}

boxImage.src = "../assets/chpt001/box.png";
gridImage.src = "./assets/1stTiled.png";
bunnyImage.src = "../assets/BunnyAlt.png";

var app = null;
var gameArea = null; 
var mouseLoc = null;
const mainCanvasId = "gameArea";
var gridLoc = new Point(0,0);
var charPositions = [64,112,160];
var walkWestImgOffset = 112;
var walkEastImgOffset = 160;
var walkUpImgOffset = 64;
var imgOffset = 16;
var numberOfAnimMoves = 4;
var speed;
const ga_width = 500;
const ga_height = 500;
let avatarWidth = 30;
// basically offset is the avatar center point
let offset = avatarWidth / 2;
let avatarLocX = 230;
let avatarLocY = 230;
let avatarSize = 48;


function initApp(){
    
    var context = null;
    gameArea = document.querySelector(`#${mainCanvasId}`);
    gameArea.width = ga_width;
    gameArea.height = ga_height;

    speedEl = document.querySelector("#speed");
    speedEl.value = 20;
    speed = speedEl.valueAsNumber;

    speedEl.addEventListener("change", (e) => {
        speed = speedEl.valueAsNumber;
        // set focus to button so that when the arrows keys 
        // are pressed (to move the character) they don't 
        // change the value of the speed control.
        document.querySelector("#snapshot").focus();
      });

    var locationOutput = document.querySelector("#cursor-location");
    gameArea.addEventListener("mousemove", (e)=>{
        mouseLoc = getMousePos(e,gameArea);
        locationOutput.textContent = `${mouseLoc.X} : ${mouseLoc.Y}`;
    });
    generateRandomCircles();

    document.addEventListener("keydown", (e) => {
        console.log(`${gridLoc.X} : ${gridLoc.Y}`);

        switch (e.key){
            case "ArrowUp":{
                moveUp(true);
                break;
            }
            case "ArrowDown":{
                moveDown(true);
                break;
            }
            case "ArrowLeft":{
                moveLeft(true);
                break;
            }
            case "ArrowRight":{
                moveRight(true);
                break;
            }
        }
        console.log(`${gridLoc.X} : ${gridLoc.Y}`);
    });

    let upArrow = document.querySelector("#upMoveArrow");
    let downArrow = document.querySelector("#downMoveArrow");
    let leftArrow = document.querySelector("#leftMoveArrow");
    let rightArrow = document.querySelector("#rightMoveArrow");

    upArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingUp = true;
        touchMoveHandler("up");
    });

    upArrow.addEventListener("touchend", () =>{
        isMovingUp = false;
        clearTimeout(cancelId);
    });

    downArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingDown = true;
        touchMoveHandler("down");
    });

    downArrow.addEventListener("touchend", () =>{
        isMovingDown = false;
        clearTimeout(cancelId);
    });

    leftArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingLeft = true;
        touchMoveHandler("left");
    });

    leftArrow.addEventListener("touchend", () =>{
        isMovingLeft = false;
        clearTimeout(cancelId);
    });

    rightArrow.addEventListener("touchstart", (e) =>{
        e.preventDefault();
        isMovingRight = true;
        touchMoveHandler("right");
    });

    rightArrow.addEventListener("touchend", () =>{
        isMovingRight = false;
        clearTimeout(cancelId);
    });

    app = new App(mainCanvasId);
    Draw();
}
var isMovingUp = false;
var isMovingDown = false;
var isMovingLeft = false;
var isMovingRight = false;
var cancelId = null;

function touchMoveHandler(direction){
    switch (direction){
        case "up":{
            if (isMovingUp){
                cancelId = setTimeout(moveUp, 35);
                console.log("set thte timeout...");
            }
            break;
        }
        case "down":{
            console.log("got down...");
            if (isMovingDown){
                cancelId = setTimeout(moveDown, 35);
                console.log("set thte timeout...");
            }
            break;
        }
        case "left":{
            if (isMovingLeft){
                cancelId = setTimeout(moveLeft, 35);
                console.log("set thte timeout...");
            }
            break;
        }
        case "right":{
            if (isMovingRight){
                cancelId = setTimeout(moveRight, 35);
                console.log("set thte timeout...");
            }
            break;
        }
    }

}
function moveUp(isKey){
    imgOffset = walkUpImgOffset;
    gridLoc.Y += speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("up");
    }
}

function moveDown(isKey){
    imgOffset = 16;
    gridLoc.Y -= speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("down");
    }
}

function moveLeft(isKey){
    imgOffset = walkWestImgOffset;
    gridLoc.X += speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("left");
    }
}

function moveRight(isKey){
    imgOffset = walkEastImgOffset;
    gridLoc.X -= speed;
    ClearCanvas();
    Draw();
    // run code that when isKey isn't defined
    // bec their isn't a way to pass a value into 
    // a method that is called by setTimeout!!!
    if (isKey === undefined){
        touchMoveHandler("right");
    }
}

function generateRandomCircles(){
    for (var i = 0; i < 100;i++){
        
        var x = (getRandom(40) + 1) * 25;
        var y = (getRandom(40) + 1) * 25;
        // gen random color
        var r = getRandom(255);
        var g = getRandom(255);
        var b = getRandom(255);
        var rndColor = `rgba(${r}, ${g}, ${b}`;
        // gen random-ish point
        var p = new Point(x,y)
        allCircles.push(new Circle(p,rndColor));
    }
}

function DrawCircle(){
    // Define the circle properties
    const centerX = 25 + gridLoc.X;
    const centerY = 25 + gridLoc.Y;
    

    // Begin a new path
    app.context.beginPath();
    // Draw the circle
    app.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    // Set the fill color
    app.context.fillStyle =  `rgba(255, 99, 71, 0.4)`;//'blue';
    // Fill the circle with the color
    app.context.fill();
    // Set the border color
    app.context.strokeStyle = 'black';
    // Draw the border
    
}

function DrawRandomCircles(){

    allCircles.forEach(c => {
     
     // Begin a new path
     app.context.beginPath();
     // Draw the circle
     app.context.arc(c.Point.X + gridLoc.X, c.Point.Y + gridLoc.Y, radius, 0, 2 * Math.PI, false);
     // Set the fill color
     app.context.fillStyle =  c.Color;
     // Fill the circle with the color
     app.context.fill();
     // Set the border color
     app.context.strokeStyle = 'black';
     // Draw the border
     app.context.stroke();
    });
}

function ClearCanvas(){
    app.context.clearRect(0,0,ga_width,ga_height);
    app.context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    app.context.fillRect(0, 0, ga_width,ga_height);
}

function Draw(){
    
    app.context.drawImage(gridImage,gridLoc.X, gridLoc.Y,2560,2560);
    DrawCircle();
    DrawRandomCircles();
    app.context.drawImage(bunnyImage, charPositions[imgIdx], imgOffset, 16, 16, avatarLocY, avatarLocY, avatarSize, avatarSize);
    imgIdx = ++imgIdx % (numberOfAnimMoves -1);
    //app.context.drawImage(bunnyImage, 230, 230,avatarWidth,avatarWidth);

}

function takeSnap(){
    var gameArea = document.querySelector(`#${mainCanvasId}`);
    var snapEl = document.querySelector("#snapout");
    console.log(gameArea.toDataURL());
    snapEl.src = gameArea.toDataURL();
}

function getRandom(max){
    // returns 0 to max-1
    // if you want 1 to max simply add 1 to result
	return Math.floor((Math.random() * max));
}

class App{

    // pass the id of canvas element that you want to 
    // use to draw on
    constructor(canvasId){
        this.gameArea = document.querySelector(`#${canvasId}`);
        this.context = this.gameArea.getContext("2d");
    }
}

class Circle{
    constructor(point, color){
        this.Point = point;
        this.Color = color;
    }
}