const player = document.getElementById("player");
const gameBoard = document.getElementById("gameBoard");
const playerSpeed = 5;

function movePlayer(event) {
    const playerRect = player.getBoundingClientRect();
    const gameBoardRect
