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

function initApp(){
    
    var context = null;
    gameArea = document.querySelector(`#${mainCanvasId}`);

    var locationOutput = document.querySelector("#cursor-location");
    gameArea.addEventListener("mousemove", (e)=>{
        mouseLoc = getMousePos(e,gameArea);
        locationOutput.textContent = `${mouseLoc.X} : ${mouseLoc.Y}`;
    });

    gameArea.addEventListener("click", () =>{

        console.log(`from click - ${mouseLoc.X} : ${mouseLoc.Y}`);
        Draw();
    });

    app = new App(mainCanvasId);
    Draw();
}

function Draw(){
    app.context.drawImage(boxImage, mouseLoc.X, mouseLoc.Y);
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