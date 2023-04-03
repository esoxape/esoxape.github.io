const player = document.getElementById("player");
const gameBoard = document.getElementById("gameBoard");
const playerSpeed = 5;

let isMovingLeft = false;
let isMovingRight = false;

function movePlayer() {
    const playerRect = player.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();

    if (isMovingLeft) {
        const newPosition = playerRect.left - playerSpeed;
        if (newPosition >= gameBoardRect.left) {
            player.style.left = `${newPosition}px`;
        }
    }

    if (isMovingRight) {
        const newPosition = playerRect.left + playerSpeed;
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
    } else if (event.key === "ArrowRight") {
        isMovingRight = false;
    }
});

requestAnimationFrame(movePlayer);
