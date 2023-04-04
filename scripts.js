const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const shootSound = new Audio("minigun.mp3");
let whichWay=0;
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
let isSpaceKeyDown = false;
var sunrise = null;
var sunset = null;
const bloodParticles = [];
const player = {
    x: 10,
    y: 600,
    width: 50,
    height: 50,
    speed: 300, // pixels per second
    jumping: false,
    jumpHeight: 450,
    gravity: 1000, // pixels per second squared
    grounded: true,
    hp:100,
    bullets: []
};
const enemy = {
    x: 1100,
    y: 500,
    width: 100,
    height: 150,
    speed: 50, // pixels per second
    bullets: [],
    lastShot : Date.now(),
    hp:1000
};
function getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  async function getSunriseSunset() {
    try {
      const location = await getUserLocation();
      const url = `https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&formatted=0`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK") {
        sunrise = new Date(data.results.sunrise);
        sunset = new Date(data.results.sunset);
  
        console.log("Sunrise:", sunrise);
        console.log("Sunset:", sunset);
      } else {
        console.error("Error fetching sunrise and sunset data.");
      }
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  }
  
  
  function drawSun(x, y) {
    const sunRadius = 30; // Radius of the sun
  
    ctx.beginPath();
    ctx.arc(x, y, sunRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
  
  
function handleKeyDown(event) {
    if (event.code === 'Space' && !isSpaceKeyDown) {
        isSpaceKeyDown = true;
        shootSound.loop = true;
        shootSound.play();
    }
}

function handleKeyUp(event) {
    if (event.code === 'Space') {
        isSpaceKeyDown = false;
        shootSound.loop = false;
        shootSound.pause();
        shootSound.currentTime = 0;
    }
}

const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

let lastTimestamp = 0;
let timeO = Date.now();

function shoot() {
    const now = Date.now();
    if (now - timeO < 25) {
        return;
    }    
    const min = -100;
    const max = 100;
    const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    let bullet = {
        x: player.x + 25+player.width / 2,
        y: player.y + player.height / 2,
        width: 5,
        height: 5,
        speed: 1500,
        ySpeed: randomNum,
    }
    if(whichWay==1)
    {
        bullet.speed=-1500
        bullet.x=bullet.x-50
    }
    player.bullets.push(bullet);
    timeO = now;
}

function update(timestamp) {
    const dt = (timestamp - lastTimestamp) / 1000; // time difference in seconds
    lastTimestamp = timestamp;

}

function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}
function bloodAndGore(x, y) {
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 200 + 100; // Random speed between 100 and 300
        const particle = {
            x: x,
            y: y,
            radius: Math.random() * 2 + 1, // Random radius between 1 and 3
            xSpeed: Math.cos(angle) * speed,
            ySpeed: Math.sin(angle) * speed,
            alpha: 1,
        };

        bloodParticles.push(particle);
    }
}
function update(timestamp) {
    const dt = (timestamp - lastTimestamp) / 1000; // time difference in seconds
    lastTimestamp = timestamp;
    //enemy movement
    if (player.x < enemy.x) {
        enemy.x -= enemy.speed * dt;
    } else {
        enemy.x += enemy.speed * dt;
    }
    if (keys["ArrowLeft"]) {
        player.x -= player.speed * dt;
        whichWay=1;
    }
    // Shoot bullets at the player
    const now = Date.now();
    if (now - enemy.lastShot > 1000) {
        const bullet = {
            x: enemy.x - 10,
            y: enemy.y + 20,
            width: 5,
            height: 5,
            speed: -500,
        };
        enemy.bullets.push(bullet);
        enemy.lastShot = now;
    }
    for (let i = 0; i < enemy.bullets.length; i++) {
        enemy.bullets[i].x += enemy.bullets[i].speed * dt;

        // Check for collision with player
        if (checkCollision(player, enemy.bullets[i])) {
            player.hp -= 10;
            bloodAndGore(enemy.bullets[i].x,enemy.bullets[i].y)
            enemy.bullets.splice(i, 1);
        }
        else if (enemy.bullets[i].x < 1 || enemy.bullets[i].x > canvas.width) {
            enemy.bullets.splice(i, 1);
        }
    }
    if (keys["ArrowRight"]) {
        whichWay=0;
        player.x += player.speed * dt;
    }

    if (keys["ArrowUp"] && !player.jumping && player.grounded) {
        player.jumping = true;
        player.grounded = false;
        player.jumpVelocity = -player.jumpHeight * 2; // initial jump velocity
    }

    if (keys["Space"]) {
        shoot();
    }

    // Gravity and Jump
    if (!player.grounded) {
        // apply gravity
        player.jumpVelocity += player.gravity * dt;
        player.y += player.jumpVelocity * dt;

        // check if player has landed
        if (player.y >= 600) {
            player.y = 600;
            player.grounded = true;
            player.jumping = false;
        }
    }
    

    // Update player bullets
    for (let i = 0; i < player.bullets.length; i++) {
        player.bullets[i].x += player.bullets[i].speed * dt;
        player.bullets[i].y += player.bullets[i].ySpeed * dt; // Update y position

        // Check for collision with enemy
        if (checkCollision(enemy, player.bullets[i])) {
            enemy.hp -= 10;
            bloodAndGore(player.bullets[i].x, player.bullets[i].y);
            player.bullets.splice(i, 1);
        } else if (player.bullets[i].x < 1 || player.bullets[i].x > canvas.width || player.bullets[i].y > 650 || player.bullets[i].y < 0) {
            player.bullets.splice(i, 1);
        }
    }

    //update blood
    for (let i = bloodParticles.length - 1; i >= 0; i--) {
        const particle = bloodParticles[i];
    
        particle.x += particle.xSpeed * dt;
        particle.y += particle.ySpeed * dt;
        particle.alpha -= 0.5 * dt;
    
        if (particle.alpha <= 0) {
            bloodParticles.splice(i, 1);
        }
    }
}
function getSunPosition() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    console.log("sunrise:", sunrise);
    const sunriseStart=sunrise.getHours()+sunrise.getMinutes()/60;
    const sunX = (canvas.width * (currentHour-sunriseStart)) / ((sunset-sunrise)/ (1000 * 60 * 60));
  
    // Calculate the sun's Y-coordinate
    const midPoint = canvas.width / 2;
    const sunYmax = 20;
    const sunYmin = 650;
    const a = (sunYmin - sunYmax) / (midPoint ** 2);
    const sunY = a * (sunX - midPoint) ** 2 + sunYmax;
  
    return { x: sunX, y: sunY };
  }

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    const sunPosition = getSunPosition();
    drawSun(sunPosition.x, sunPosition.y);
    
    // Load the image
    const playerImage = new Image();
    const monsterImage = new Image();
    if(whichWay==0)
    {
        playerImage.src = "heroright.jpg";
    }
    else
    {
        playerImage.src = "heroleft.jpg";
    }
    monsterImage.src="Monsterright.jpg";
    // Fill all squares below y=600 with black color
    ctx.fillStyle = "black";
    ctx.fillRect(0, 650, canvas.width, canvas.height - 600);
    // Draw the player/monster
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    ctx.drawImage(monsterImage, enemy.x, enemy.y, enemy.width, enemy.height);
    // Draw HP bar
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, player.hp, 20);
    // Draw HP text
    ctx.fillStyle = "black";
    ctx.font = "bold 16px Arial";
    ctx.fillText("HP: " + player.hp, 10, 25);
    // Draw bullets
    ctx.fillStyle = "black";
    for (const bullet of player.bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    for (const bullet of enemy.bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    // Draw blood particles
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    for (const particle of bloodParticles) {
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

}
function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}
getSunriseSunset();
requestAnimationFrame(gameLoop);