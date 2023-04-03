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
    const playerLeft = parseFloat(player.style.left) || 0;

    if (isMovingLeft) {
        const newPosition = playerLeft - (playerSpeed * deltaTime);
        if (newPosition >= gameBoardRect.left) {
            player.style.left = `${newPosition}px`;
        }
    }

    if (isMovingRight) {
        const newPosition = playerLeft + (playerSpeed * deltaTime);
        if (newPosition + playerRect.width <= gameBoardRect.right) {
            player.style.left = `${newPosition}px`;
        }
    }

    requestAnimationFrame(movePlayer);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        isMoving
