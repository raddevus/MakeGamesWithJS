// chpt003 - main-003.js
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
gridImage.src = "../assets/chpt005/1000Grid50pix.png";
bunnyImage.src = "../assets/chpt006/bunny.png";

var app = null;
var gameArea = null; 
var mouseLoc = null;
const mainCanvasId = "gameArea";
var gridLoc = new Point(0,0);
var charPositions = [0,17,32];
var speed;
const ga_width = 500;
const ga_height = 500;
let avatarWidth = 30;
// basically offset is the avatar center point
let offset = avatarWidth / 2;


function initApp(){
    
    var context = null;
    gameArea = document.querySelector(`#${mainCanvasId}`);
    gameArea.width = ga_width;
    gameArea.height = ga_height;

    speedEl = document.querySelector("#speed");
    speedEl.value = 5;
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
                gridLoc.Y += speed;
                break;
            }
            case "ArrowDown":{
                gridLoc.Y -= speed;
                break;
            }
            case "ArrowLeft":{
                gridLoc.X += speed;
                break;
            }
            case "ArrowRight":{
                gridLoc.X -= speed;
                break;
            }
        }
        console.log(`${gridLoc.X} : ${gridLoc.Y}`);
        
        ClearCanvas();
        Draw();
    });

    app = new App(mainCanvasId);
    Draw();
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
    
    app.context.drawImage(gridImage,gridLoc.X, gridLoc.Y,1000,1000);
    DrawCircle();
    DrawRandomCircles();
    app.context.drawImage(bunnyImage, charPositions[imgIdx], 17, 16, 16, 230, 230, 48, 48);
    imgIdx = ++imgIdx % 3
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