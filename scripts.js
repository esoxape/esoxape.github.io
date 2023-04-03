const player = document.getElementById("player");
const gameBoard = document.getElementById("gameBoard");
const playerSpeed = 0.15;

let isMovingLeft = false;
let isMovingRight = false;
let lastFrameTime = performance.now();

function movePlayer(currentFrameTime) {
    const deltaTime = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    const playerRect = player.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();

    if (isMovingLeft) {
        const newPosition = playerRect.left - (playerSpeed * deltaTime);
        if (newPosition >= gameBoardRect.left) {
            player.style.left = `${newPosition}px`;
        }
    }

    if (isMovingRight) {
        const newPosition = playerRect.left + (playerSpeed * deltaTime);
        if (newPosition + playerRect.width <= gameBoardRect.right) {
            player.style.left = `${newPosition}px`;
        }
    }

    requestAnimationFrame(movePlayer);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        isMovingLeft = true;
    } else if (event.key === "ArrowRight") {
        isMovingRight = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        isMovingLeft = false;
    } else
