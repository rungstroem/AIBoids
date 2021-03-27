from p5 import setup, draw, size, background, run
import numpy as np
from boid3 import Boid

width = 400;
height = 200;

# Add 30 boids to list flock
flock = [Boid(*np.random.rand(2)*1000, width, height) for _ in range(20)]

def setup():
    size(width, height);

def draw():
    background(30,30,47);

    for boid in flock:
        boid.apply_behaviors(flock);
        boid.update();
        boid.show();

run();
