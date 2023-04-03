const player = document.getElementById("player");
const gameBoard = document.getElementById("gameBoard");
const playerSpeed = 5;

function movePlayer(event) {
    const playerRect = player.getBoundingClientRect();
    const gameBoardRect = gameBoard.getBoundingClientRect();

    if (event.key === "ArrowLeft") {
        const newPosition = playerRect.left - playerSpeed;
        if (newPosition >= gameBoardRect.left) {
            player.style.left = `${newPosition}px`;
        }
    } else if (event.key === "ArrowRight") {
        const newPosition = playerRect.left + playerSpeed;
        if (newPosition + playerRect.width <= gameBoardRect.right) {
            player.style.left = `${newPosition}px`;
        }
    }
}

document.addEventListener("keydown", movePlayer);
