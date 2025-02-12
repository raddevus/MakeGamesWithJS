// trappoints.js

var ctx = null;
var theCanvas = null;
window.addEventListener("load", initApp);
var LINES = 20;
var lineInterval = 0;
var gridColor = "lightgreen";
var allPoints = [];
var RADIUS = 10;
var CANVAS_SIZE = 650;
var selectedTriangle = []; // three points selected by user
var capturedIndex = null;
var isCtrlKeyPressed = false;

function initApp()
{
	theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");
	
	ctx.canvas.height  = CANVAS_SIZE;
	ctx.canvas.width = ctx.canvas.height;

	window.addEventListener("mousedown", mouseDownHandler);
	window.addEventListener("mousemove", mouseMoveHandler);
	window.addEventListener("mouseup", mouseUpHandler);
	initBoard();
}

function initBoard(){
	lineInterval = Math.floor(ctx.canvas.width / LINES);
	console.log(lineInterval);
	draw();
}

function drawTriangle(){
	var tempAllPoints = null;
	if (allPoints.length < 3){
		console.log("not enough points to draw a triangle");
		return;
	}
	var triIndex = $("#triangleNumber").val();
	
	if (triIndex < 1){
		if (selectedTriangle.length == 3){
			tempAllPoints = allPoints;
			allPoints = selectedTriangle;
		}
		//return;
	}
	console.log(triIndex);
	var offset = (triIndex - 1);
	offset = offset > 0 ? offset :0;
	maxIdx = allPoints.length;
	
	var firstPoint = null;
	for (var count = 0; count < 2; count++)
	{
		var idxPoint1 = (offset +count) % maxIdx;
		console.log("(offset +count) % maxIdx : " +(offset +count) % maxIdx);
		var idxPoint2 = (offset + count + 1) % maxIdx;
		drawLine(allPoints[idxPoint1], allPoints[idxPoint2]);
		if (count == 0)
		{
			firstPoint = allPoints[idxPoint1];
		}
		else if (count > 0){
			drawLine(allPoints[idxPoint2], firstPoint);
		}
	}
	if (tempAllPoints !== null){
		allPoints = tempAllPoints;
	}
}
function draw() {
	ctx.globalAlpha = 1;
	// fill the canvas background with white
	ctx.fillStyle="white";
	ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);
	
	// draw the grid background
	for (var lineCount=0;lineCount<LINES;lineCount++)
	{
		ctx.fillStyle=gridColor;
		ctx.fillRect(0,lineInterval*(lineCount+1),ctx.canvas.width,2);
		ctx.fillRect(lineInterval*(lineCount+1),0,2,ctx.canvas.width);
	}
	if (allPoints.length > 0){
		drawPoints();
	}
	drawHighlightPoints();
}

function getMousePos(evt) {
	
	var rect = theCanvas.getBoundingClientRect();
	var currentPoint = {};
	currentPoint.x = evt.clientX - rect.left;
	currentPoint.y = evt.clientY - rect.top;
	return currentPoint;
}

function clearPoints(){
	// clear all the points from the array
	allPoints = [];
	selectedTriangle = [];
	// redraw the background grid (erasing the points);
	draw();
}

function generateRandomPoints(pointCount){
	clearPoints(); // empty out both arrays
	for (var i = 0; i < pointCount;i++){
		var X = Math.floor(Math.random() * CANVAS_SIZE); // gen number 0 to 649
		var Y = Math.floor(Math.random() * CANVAS_SIZE); // gen number 0 to 649
		var p = {};
		p.x = X;
		p.y = Y;
		allPoints.push(p);
	}
	draw();
}

function clearLines(){
	draw();
}

function drawLine(p, p2){
	ctx.beginPath();
	ctx.moveTo(p.x,p.y);
	ctx.lineTo(p2.x, p2.y);
	console.log ("p.x : " + p.x + " p.y : " + p.y + " p2.x : " + p2.x + " p2.y : " +  p2.y);
	ctx.stroke();
}

function connectPoints(){
	console.log("connecting points...");
	
	if (allPoints === null || allPoints.length < 3){
		console.log("there are not enough points to do calculation.");
		return;
	}
	for (var x = 0;x < allPoints.length-1;x++){
		drawLine(allPoints[x],allPoints[x+1]);
		console.log("x+1 : " + x+1);
	}
	// draws back to the first point.
	drawLine(allPoints[allPoints.length-1], allPoints[0]);
}

function drawPoint(currentPoint){
	ctx.beginPath();
	ctx.arc(currentPoint.x, currentPoint.y,RADIUS,0,2*Math.PI);
	ctx.stroke();
}

function drawPoints(){
	for (var x = 0; x < allPoints.length;x++){
		drawPoint(allPoints[x]);
	}
}

function hitTest(p){
	// iterate through all points
	for (var x = 0;x<allPoints.length;x++){
		if ((Math.abs(p.x - allPoints[x].x) <= RADIUS) && Math.abs(p.y - allPoints[x].y) <=RADIUS){
			console.log("It's a hit..." + allPoints[x]);
			if (isCtrlKeyPressed){
				capturedIndex = x;
				selectedTriangle = [];
				isCtrlKeyPressed = false;
			}
			return allPoints[x];
		}
	}
}
function drawHighlightPoints(){
	
	for (var x = 0; x < selectedTriangle.length;x++){
		highlightPoint(selectedTriangle[x]);
	}
}
function highlightPoint(point){
	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	drawPoint(point);
	// set style back to original
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
}

function mouseUpHandler(event){
	capturedIndex = null;
}

function mouseMoveHandler(event){
	if (capturedIndex !== null){
		allPoints[capturedIndex] = getMousePos(event);
		draw();
	}
}


function mouseDownHandler(event){
	
	if (event.button == 0){
		var currentPoint = getMousePos(event);
		if ((currentPoint.x > 650) || (currentPoint.y > 650))
		{
			return;
		}
		
		if (event.shiftKey){
				console.log(event.shiftKey);
				var p = hitTest(currentPoint);
				if (p !== undefined)
				{
					selectedTriangle.push(p);
					if (selectedTriangle.length > 3){
						selectedTriangle.shift();
					}
					draw();
				}
			}
		else if (event.ctrlKey){
			isCtrlKeyPressed = true;
			hitTest(currentPoint);
		}
		else{
				allPoints.push(currentPoint);
				drawPoint(currentPoint);
				console.log(currentPoint);
		}
	}
}
