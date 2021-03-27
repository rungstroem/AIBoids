var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = 2;
var y = 2;

class Boid(){
	let position
	constructor(x,y,width,height){
		
	};

	position
};

function main(){
	ctx.beginPath();
	ctx.rect(x,y,10,10);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();

	x += 2;
	y += 2;
}
setInterval(main, 10);
