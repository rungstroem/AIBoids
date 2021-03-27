from p5 import Vector, stroke, circle
import numpy as np

class Boid():
    
    def __init__(self, x, y, width, height):
        self.position = Vector(x,y);
        self.velocity = Vector(*np.random.rand(2)-0.5)*10;
        self.acceleration = Vector(*np.random.rand(2)-0.5)/2;
        self.width = width;
        self.height = height;
        self.maxSpeed = 5;
        self.perseption = 100;    # Radius aroind boid

    def align(self, boids):
        steering = Vector(*np.zeros(2));
        total = 0;
        avgVel = Vector(*np.zeros(2));
        for boid in boids:
            dist = np.sqrt((boid.velocity.x-self.velocity.x)**2 + (boid.velocity.y-self.velocity.y)**2);
            if(dist < self.perseption):
                total +=1;
                avgVel += boid.velocity;
        if(total > 0):
            avgVel.x /= total;
            avgVel.y /= total;
            # Get direction of avgVel vector - ie. unitVector
            avgVecSize = np.sqrt(avgVel.x**2+avgVel.y**2);
            avgVel.x /= avgVecSize * self.maxSpeed;
            avgVel.y /= avgVecSize * self.maxSpeed;
            steering = avgVel - self.velocity;
            
        return steering;

    def cohesion():
        i = 0;

    def separation():
        j = 0;

    def apply_behaviors(self, boids):
        alignment = self.align(boids);
        self.acceleration += alignment;

    def edges(self):
        if(self.position.x > self.width):
            self.position.x = 0;
        elif(self.position.x < 0):
            self.position.x = self.width;
        if(self.position.y > self.height):
            self.position.y = 0;
        elif(self.position.y < 0):
            self.position.y = self.height;

    def update(self):
        self.position += self.velocity;
        self.velocity += self.acceleration;
        velVecSize = np.sqrt(self.velocity.x**2 + self.velocity.y**2);
        if(velVecSize > self.maxSpeed):
            self.velocity.x = self.velocity.x/velVecSize * self.maxSpeed;
            self.velocity.y = self.velocity.y/velVecSize * self.maxSpeed;
        self.edges();

    def show(self):
        stroke(255);
        circle((self.position.x, self.position.y), 10);
