let width = 400;
let height = 400;

let numBoids = 30;
let perception = 20;
let maxVel = 2;
let maxAcc = 0.1;

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

function boundingBox(boid){
	let xMin = 0+10;
	let xMax = width-10;
	let yMin = 0+10;
	let yMax = height-10;
	if(boid.x < xMin){
		boid.vx = maxVel;
	}
	if(boid.x > xMax){
		boid.vx = -maxVel;
	}
	if(boid.y < yMin){
		boid.vy = maxVel;
	}
	if(boid.y > yMax){
		boid.vy = -maxVel;
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

function billiardBallBehavior(boid){
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
	return [deltaX, deltaY];
}
function seperation(boid){
	let centerX = 0;
	let centerY = 0;
	for(boids in flock){
		if(boid !== boids){
			if(dist(boid,boids) < perception*2){
				centerX = centerX -(boids.x-boid.x);
				centerY = centerY -(boids.y-boid.y);
			}
		}
	}
	return [centerX, centerY];
}

function alignment(boid){
	let velocityX = 0;
	let velocityY = 0;
	let count = 0;
	for(boids of flock){
		if(boid !== boids){
			if(dist(boid, boids) < perception*2){
				velocityX += boids.vx;
				velocityY += boids.vy;
				count++;
			}
		}
	}
	if(count > 0){
		velocityX = velocityX/count;
		velocityY = velocityY/count;
		return [velocityX-boid.vx, velocityY-boid.vy];
	}
	return [0, 0];
}
function cohesion(boid){
	let centerX = 0;
	let centerY = 0;
	let count = 0;
	for(boids of flock){
		if(boid !== boids){
			if(dist(boid,boids) < perception){
				centerX += boids.x;
				centerY += boids.y;
				count++;
			}
		}
	}
	if(count > 0){
		centerX = centerX/ (count-1);
		centerY = centerY/ (count-1);
		return[(centerX-boid.x)/100, (centerY-boid.y)/100];
	}
	return [0, 0];
}

function towardsCenter(boid){
	let centerX = width/2;
	let centerY = height/2;
	return [(centerX-boid.x)/100, (centerY-boid.y)/100];
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
	let v1 = 0;
	let v2 = 0;
	let v3 = 0;
	let v4 = 0;
	for(let boid of flock){
		updateVel(boid);
		v1 = seperation(boid);
		v2 = alignment(boid);
		v3 = cohesion(boid);
		v4 = towardsCenter(boid);
		boid.vx += v1[0]*0.5 + v2[0] + v3[0] +v4[0];
		boid.vy += v1[1]*0.5 + v2[1] + v3[1] +v4[1];
		boid.x = boid.x + boid.vx;
		boid.y = boid.y + boid.vy;
		edges(boid);
		//boundingBox(boid);
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
