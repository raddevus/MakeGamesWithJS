// chpt003 - main.js
var boxImage = new Image();
    
window.onload = () => {
    initApp();
}
boxImage.src = "../assets/chpt001/box.png";

var app = null;
var gameArea = null; 
const mainCanvasId = "gameArea";

function initApp(){
    
    var context = null;
    gameArea = document.querySelector(`#${mainCanvasId}`);

    var locationOutput = document.querySelector("#cursor-location");
    gameArea.addEventListener("mousemove", (e)=>{
        var loc = getMousePos(e,gameArea);
        locationOutput.textContent = `${loc.X} : ${loc.Y}`;
    });

    app = new App(mainCanvasId);
    app.context.drawImage(boxImage, 20, 20);
    app.context.fillStyle  = "#000000";
    app.context.font = "15px Sans-Serif";
    app.context.textBaseline = "top";
    app.context.fillText("<--- image on CANVAS", 50,20);

    console.log(app.context);
}

function takeSnap(){
    var gameArea = document.querySelector("#gameArea");
    
    var snapEl = document.querySelector("#snapout");
    console.log(gameArea.toDataURL());
    snapEl.src = gameArea.toDataURL();
}

class App{

    // pass the canvas element that you want to 
    // use to draw on
    constructor(canvasId){
        this.gameArea = document.querySelector(`#${canvasId}`);
        this.context = this.gameArea.getContext("2d");
    }
}