function getMousePos(evt, canvasElement) {
	// we get the rect to determine the offset of the canvas to
    // the "outer" html page (or body).
    var rect = canvasElement.getBoundingClientRect();
    // These values are all broken out so it is more clear
    // what we are doing.
    // Normally you might just have one line of code like:
    // return new Point((evt.clientX - rect.left), evt.clientY - rect.top);
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var currentPoint = new Point(x,y);
	return currentPoint;
}

class Point{
    constructor(x,y){
        this.X = x;
        this.Y = y;
    }
}