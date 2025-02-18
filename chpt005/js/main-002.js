// chpt003 - main-003.js
var boxImage = new Image();
var gridImage = new Image();
    
window.onload = () => {
    initApp();
}
boxImage.src = "../assets/chpt001/box.png";
gridImage.src = "../assets/chpt005/1000Grid50pix.png";

var app = null;
var gameArea = null; 
var mouseLoc = null;
const mainCanvasId = "gameArea";
var gridLoc = new Point(0,0);

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

function ClearCanvas(){
    app.context.clearRect(0,0,ga_width,ga_height);
    app.context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    app.context.fillRect(0, 0, ga_width,ga_height);
}

function Draw(){
    app.context.drawImage(gridImage,gridLoc.X, gridLoc.Y,1000,1000);
    app.context.drawImage(boxImage, 230, 230,avatarWidth,avatarWidth);
}

function takeSnap(){
    var gameArea = document.querySelector(`#${mainCanvasId}`);
    var snapEl = document.querySelector("#snapout");
    console.log(gameArea.toDataURL());
    snapEl.src = gameArea.toDataURL();
}

class App{

    // pass the id of canvas element that you want to 
    // use to draw on
    constructor(canvasId){
        this.gameArea = document.querySelector(`#${canvasId}`);
        this.context = this.gameArea.getContext("2d");
    }
}