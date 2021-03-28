let width = 400;
let height = 400;

let numBoids = 30;
let perception = 10;
let maxVel = 2;
let maxAcc = 0.01;

var flock = [];

class Boid{
	constructor(x,y,vx,vy,ax,ay, bc){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.ax = ax;
		this.ay = ay;
		this.blinkCount = bc;	// Problem is with random initialization...
	}
	updateBlink(){
		if(blinkCount > 99){
			this.blinkCount = 0;
		}
		this.blinkCount++;
	}
};

function init(){
	for(let i = 0; i<numBoids; i++){
		flock.push(new Boid(Math.random()*width, Math.random()*height, Math.random()*1-0.5, Math.random()*1-0.5, Math.random()*0.5-0.25, Math.random()*0.5-0.25), Math.floor(Math.random()*101));
	}
}

function dist(boid1, boid2){
	let distance = Math.sqrt( (boid2.x-boid1.x)**2 + (boid2.y-boid1.y)**2);
	return distance;
}

function edges(boid){
	if(boid.x > width){
		boid.x = 0;
	}
	if(boid.y > height){
		boid.y = 0;
	}
	if(boid.x < 0){
		boid.x = width;
	}
	if(boid.y < 0){
		boid.y = height;
	}
}

/*function updateBlink(boid){
	if(boid.blinkCount > 100){
		boid.blinkCount = 0;
	}
	boid.blinkCount++;
}*/

function updateVel(boid){
	if(boid.vx > maxVel) boid.vx = maxVel;
	if(boid.vy > maxVel) boid.vy = maxVel;
	if(boid.vx < -maxVel) boid.vx = -maxVel;
	if(boid.vy < -maxVel) boid.vy = -maxVel;
	if(boid.ax > maxAcc) boid.ax = maxAcc;
	if(boid.ay > maxAcc) boid.ay = maxAcc;
	if(boid.ax < -maxAcc) boid.ax = -maxAcc;
	if(boid.ay < -maxAcc) boid.ay = -maxAcc;

	boid.x += boid.vx;
	boid.y += boid.vy;
	boid.vx += boid.ax;
	boid.vy += boid.ay;
}

function seperation(boid){
	let deltaX = 0;
	let deltaY = 0;
	for(let boids of flock){
		if(boid !== boids){
			if(dist(boid, boids) < perception){
				deltaX += boid.x-boids.x;
				deltaY += boid.y-boids.y;
			}
		}
	}
	boid.vx += deltaX*0.05;
	boid.vy += deltaY*0.05;
}

function boidDraw(ctx, boid){
	ctx.beginPath();
	ctx.arc(boid.x, boid.y, 5, 0, 2*Math.PI, false);
	ctx.lineWidth = 3;
	ctx.strokeStyle = "#FF0000";
	ctx.stroke();
	if(boid.blinkCount > 90){
		ctx.fillStyle = "#0000FF";
	}else{
		ctx.fillStyle = "#FFFFFF";
	}
	ctx.fill();
	//if(boid.blinkCount > 90){
	//	ctx.fillStyle = "#0000FF";
	//}else{
	//	ctx.fillStyle = "#000000";
	//}
	//ctx.fill();
}

function gameLoop(){
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.clearRect(0,0,width,height);
	for(let boid of flock){
		updateVel(boid);
		seperation(boid);
		edges(boid);
		boidDraw(ctx,boid);
	}
	window.requestAnimationFrame(gameLoop);
}

function canvasSizing(){
	let canvas = document.getElementById("myCanvas");
	//width = window.innerWidth;
	//height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
}

window.onload = () => {
	window.addEventListener("resize", canvasSizing, false);
	canvasSizing();
	init();
	window.requestAnimationFrame(gameLoop);
}
