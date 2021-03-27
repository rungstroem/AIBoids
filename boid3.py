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
        self.perseption = 50;     # Radius around boid
        self.movePos = 2;         # Used to move boid towards or away from center of mass
  
    # Behaviors ##################################################
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
            steering = avgVel;
            
        return steering;

    def coh(self, boids):
        total = 0;
        steering = Vector(*np.zeros(2));
        cMass = Vector(*np.zeros(2));
        cMassVec = Vector(*np.zeros(2));
        cMassVecSize = 0;
        cMassDir = Vector(*np.zeros(2));
        for boid in boids:
            dist = np.sqrt((boid.position.x-self.position.x)**2) + ((boid.position.y-self.position.y)**2);

            if(dist < self.perseption):
                cMass += boid.position;
                total += 1;

        steering.x = 0;
        steering.y = 0;
        if(total > 0):
            cMass.x /= total;
            cMass.y /= total;
            cMassVec.x = cMass.x-self.position.x;
            cMassVec.y = cMass.y-self.position.y;
            if(cMassVec.x > 0 and cMassVec.y > 0):
                cMassVecSize = np.sqrt(((cMassVec.x)**2) + ((cMassVec.y)**2))
                cMassDir.x = cMassVec.x/cMassVecSize;
                cMassDir.y = cMassVec.y/cMassVecSize;
                steering.x = cMassDir.x * self.movePos;
                steering.y = cMassDir.y * self.movePos;
        return steering;

    def sep(self, boids):
        total = 0;
        steering = Vector(*np.zeros(2));
        cMass = Vector(*np.zeros(2));
        cMassVec = Vector(*np.zeros(2));
        cMassVecSize = 0;
        cMassDir = Vector(*np.zeros(2));
        for boid in boids:
            dist = np.sqrt((boid.position.x - self.position.x)**2 + (boid.position.y - self.position.y)**2);
            if(dist < self.perseption):
                cMass += boid.position;
                total += 1;
        # Make sure that steering contains some value
        steering.x = 0;
        steering.y = 0;

        if(total > 0):
            cMass.x /= total;
            cMass.y /= total;
            cMassVec.x = (cMass.x-self.position.x);
            cMassVec.y = (cMass.y-self.position.y);
            if(cMassVec.x > 0 and cMassVec.y > 0):
                cMassVecSize = np.sqrt((cMassVec.x)**2 + (cMassVec.y)**2);
                if(cMassVecSize < 1):
                    cMassDir.x = cMassVec.x/cMassVecSize;
                    cMassDir.y = cMassVec.y/cMassVecSize;
                    steering.x = (cMassDir.x * self.movePos)*(-1.2);
                    steering.y = (cMassDir.y * self.movePos)*(-1.2);
            
        return steering;


  # Behaviors ###########################################################################
    def apply_behaviors(self, boids):
        alignment = self.align(boids);
        self.acceleration += alignment;
        cohesion = self.coh(boids);
        self.acceleration += cohesion;
        seperation = self.sep(boids);
        self.acceleration += seperation;

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
