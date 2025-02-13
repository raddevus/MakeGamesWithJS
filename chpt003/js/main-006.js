// chpt003 - main-003.js
var boxImage = new Image();
    
window.onload = () => {
    initApp();
}
boxImage.src = "../assets/chpt001/box.png";

var app = null;
var gameArea = null; 
var mouseLoc = null;
const mainCanvasId = "gameArea";
var boxLoc = new Point(0,0);
var speed;

function initApp(){
    
    var context = null;
    gameArea = document.querySelector(`#${mainCanvasId}`);
    speedEl = document.querySelector("#speed");
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
        console.log(e.key);
        switch (e.key){
            case "ArrowUp":{
                boxLoc.Y -= speed;
                break;
            }
            case "ArrowDown":{
                boxLoc.Y += speed;
                break;
            }
            case "ArrowLeft":{
                boxLoc.X -= speed;
                break;
            }
            case "ArrowRight":{
                boxLoc.X += speed;
                break;
            }
        }
        console.log(`${boxLoc.X} : ${boxLoc.Y}`);
        ClearCanvas();
        Draw();
    });

    app = new App(mainCanvasId);
    Draw();
}

function ClearCanvas(){

}

function Draw(){
    app.context.drawImage(boxImage, boxLoc.X, boxLoc.Y);
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