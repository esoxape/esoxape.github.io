const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 100,
    y: 450,
    width: 50,
    height: 50,
    speed: 5,
    jumping: false,
    jumpHeight: 15,
    gravity: 1,
    grounded: true,
    bullets: []
};

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

function update() {
	if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    if (keys["Space"] && !player.jumping && player.grounded) {
        player.jumping = true;
        player.grounded = false;
        player.y -= player.jumpHeight;
    }

    if (keys["KeyZ"]) {
        shoot();
    }

    // Gravity
    if (!player.grounded) {
        player.y += player.gravity;
    }

    // Ground
    if (player.y >= 450) {
        player.y = 450;
        player.grounded = true;
        player.jumping = false;
    }

    // Shooting
    function shoot() {
        const bullet = {
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            width: 10,
            height: 5,
            speed: 10,
        };
        player.bullets.push(bullet);
    }

    // Update bullets
    for (let i = 0; i < player.bullets.length; i++) {
        player.bullets[i].x += player.bullets[i].speed;

        if (player.bullets[i].x > canvas.width) {
            player.bullets.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = "red";
    for (const bullet of player.bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();