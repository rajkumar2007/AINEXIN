// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 500;

// Game variables
let bird = { x: 50, y: 250, width: 20, height: 20, velocity: 0, gravity: 0.6, jump: -10 };
let pipes = [];
let score = 0;
let gameRunning = true;

// Jump function
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        bird.velocity = bird.jump;
    }
});

// Pipe generator
function generatePipe() {
    let height = Math.random() * (canvas.height - 200) + 50;
    pipes.push({ x: canvas.width, y: 0, width: 40, height: height }); // Top pipe
    pipes.push({ x: canvas.width, y: height + 100, width: 40, height: canvas.height - height - 100 }); // Bottom pipe
}

// Game loop
function update() {
    if (!gameRunning) return;

    // Bird movement
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Pipe movement
    pipes.forEach(pipe => pipe.x -= 2);

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Collision detection
    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        ) {
            gameRunning = false; // Game over
        }
    }

    // Prevent bird from going off-screen
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        gameRunning = false;
    }

    // Score update
    if (pipes.length > 0 && pipes[0].x + pipes[0].width === bird.x) {
        score++;
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = "green";
    pipes.forEach(pipe => ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height));

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    if (!gameRunning) {
        ctx.fillText("Game Over! Press F5 to Restart", 50, 250);
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Generate pipes at intervals
setInterval(generatePipe, 2000);
gameLoop();
