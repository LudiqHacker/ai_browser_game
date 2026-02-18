const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const startBtn = document.getElementById("startBtn");

let player, blocks, score, lives, gameRunning;

const playerWidth = 50;
const playerHeight = 20;

function resetGame() {
    player = {
        x: canvas.width/2 - 25,
        y: canvas.height - 40,
        width: playerWidth,
        height: playerHeight,
        speed: 7
    };

    blocks = [];
    score = 0;
    lives = 3;
    gameRunning = true;
}

document.addEventListener("keydown", e => {
    if(!gameRunning) return;

    if(e.key === "ArrowLeft") {
        player.x -= player.speed;
    }
    if(e.key === "ArrowRight") {
        player.x += player.speed;
    }
});

function spawnBlock() {
    const size = 20 + Math.random()*20;
    blocks.push({
        x: Math.random()*(canvas.width-size),
        y: -size,
        size: size,
        speed: 2 + Math.random()*3
    });
}

function update() {
    if(!gameRunning) return;

    if(Math.random() < 0.03) spawnBlock();

    blocks.forEach((b, i) => {
        b.y += b.speed;

        // collision
        if(
            b.x < player.x + player.width &&
            b.x + b.size > player.x &&
            b.y < player.y + player.height &&
            b.y + b.size > player.y
        ){
            blocks.splice(i,1);
            lives--;
            livesEl.textContent = lives;

            if(lives <= 0){
                gameRunning = false;
                alert("Game Over! Score: " + score);
            }
        }

        // passed screen
        if(b.y > canvas.height){
            blocks.splice(i,1);
            score++;
            scoreEl.textContent = score;
        }
    });

    // keep player in bounds
    if(player.x < 0) player.x = 0;
    if(player.x + player.width > canvas.width)
        player.x = canvas.width - player.width;
}

function draw() {
   ctx.clearRect(0,0,canvas.width,canvas.height);

    if(!player) return; // <-- ADD THIS

    // player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // blocks
    ctx.fillStyle = "red";
    blocks.forEach(b => {
        ctx.fillRect(b.x,b.y,b.size,b.size);
    });
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

startBtn.onclick = () => {
    resetGame();
};

gameLoop();
