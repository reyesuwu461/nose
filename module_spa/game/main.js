// --- Game Elements ---
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const gameOverScreen = document.getElementById('game-over');
const retryBtn = document.getElementById('retry-btn');
const exitBtn = document.getElementById('exit-btn');
const levelSelectScreen = document.getElementById('level-select');
const levelButtons = document.querySelectorAll('.level-btn');
const levelCompleteScreen = document.getElementById('level-complete');
const nextLevelBtn = document.getElementById('next-level-btn');
const gameCompleteScreen = document.getElementById('game-complete');
const restartGameBtn = document.getElementById('restart-game-btn');
const starsContainer = document.getElementById('stars-container');
const toggleControlsBtn = document.getElementById('toggle-controls');
const instructionsPanel = document.getElementById('instructions');
const pauseBtn = document.getElementById('pause-btn');
const pauseMenu = document.getElementById('pause-menu');
const continueBtn = document.getElementById('continue-btn');
const retryPauseBtn = document.getElementById('retry-pause-btn');
const exitPauseBtn = document.getElementById('exit-pause-btn');
const fireballsContainer = document.getElementById('fireballs-container');

// --- Game Variables ---
let isGameOver = false;
let isPaused = false;
let currentLevel = 1;
let playerX = 50;
let playerY = 300;
let playerVelocityY = 0;
let isJumping = false;
let jumpCount = 0;
let isCrouching = false;
let hasShield = false;
let hasFirePower = false;
const maxJumpCount = 2;
let gravity = 0.5;
let platforms = [];
let bats = [];
let ghosts = [];
let coins = [];
let spikes = [];
let traps = [];
let fireballs = [];
let boss = null;
let bossActive = false;
let bossHealth = 0;
let shieldPowerUp = null;
let firePowerUp = null;
const moveSpeed = 5;
let moveLeft = false;
let moveRight = false;

// --- Utility Functions ---
function rectsCollide(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// --- Game Initialization ---
function initGame(level = 1) {
    currentLevel = level;
    isGameOver = false;
    isPaused = false;
    playerX = 50;
    playerY = 300;
    playerVelocityY = 0;
    isJumping = false;
    jumpCount = 0;
    isCrouching = false;
    hasShield = false;
    hasFirePower = false;
    moveLeft = false;
    moveRight = false;
    bossActive = false;
    bossHealth = 0;
    shieldPowerUp = null;
    firePowerUp = null;

    // Clear elements
    document.querySelectorAll('.platform, .bat, .ghost, .coin, .spike, .trap, .fireball, .player-shield, .fire-indicator, .boss, .explosion, .power-up').forEach(el => el.remove());
    platforms = [];
    bats = [];
    ghosts = [];
    coins = [];
    spikes = [];
    traps = [];
    fireballs = [];
    boss = null;

    // Create elements
    createPlayer();
    createLevel(currentLevel);

    // Hide screens
    gameOverScreen.style.display = 'none';
    levelSelectScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    gameCompleteScreen.style.display = 'none';
    pauseMenu.style.display = 'none';

    // Show game container
    gameContainer.style.display = 'block';

    // Start game loop
    gameLoop();
}

// --- Player ---
function createPlayer() {
    player.innerHTML = '';
    const body = document.createElement('div');
    body.className = 'player-body';
    player.appendChild(body);
    const head = document.createElement('div');
    head.className = 'player-head';
    player.appendChild(head);
    const hair = document.createElement('div');
    hair.className = 'player-hair';
    player.appendChild(hair);
    const bangs = document.createElement('div');
    bangs.className = 'player-bangs';
    player.appendChild(bangs);
    const jeans = document.createElement('div');
    jeans.className = 'player-jeans';
    player.appendChild(jeans);
    const shoes = document.createElement('div');
    shoes.className = 'player-shoes';
    player.appendChild(shoes);
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
    player.style.display = 'block';
}

// --- Platforms ---
function createPlatform(x, y, width, height) {
    const platform = document.createElement('div');
    platform.className = 'platform';
    platform.style.left = `${x}px`;
    platform.style.top = `${y}px`;
    platform.style.width = `${width}px`;
    platform.style.height = `${height}px`;
    gameContainer.appendChild(platform);
    platforms.push({ element: platform, x, y, width, height });
}

// --- Bats ---
function createBat(x, y, isGroundBat = false, speed = 2) {
    const bat = document.createElement('div');
    bat.className = 'bat';
    const batImg = document.createElement('img');
    batImg.src = isGroundBat
        ? 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgz7JeUaNBsZ-hDxD05ojjTsuZafZ_WEtJw5PoYeypnTPdqH4d1frGsOFJkxlLYO3AjvSf0q0liQDYmnRkkTBKicjpgoY2BZk0KgcM0vFM72ElGM9GjBrCjbTldGrH-vRjKrKW4kFjBSHs/s106/murcielago4.gif'
        : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ6O2m5K_MsVn1cN3mWLnspQX8by-wXbUuo2WS0hCHJ9BsvJaINTRP_kd5u9dfFOCz0UMkEcVHgCwtzbN09AR91bWGhdbEKzu1gbpKtvFk5ldQtYjGmhYm4RGQWiJ8jVq-oekQihl6_QQ/s125/murcielago1.gif';
    batImg.style.width = '100%';
    batImg.style.height = '100%';
    bat.appendChild(batImg);
    bat.style.left = `${x}px`;
    bat.style.top = `${y}px`;
    bat.style.width = isGroundBat ? '40px' : '50px';
    bat.style.height = isGroundBat ? '30px' : '40px';
    gameContainer.appendChild(bat);
    bats.push({
        element: bat,
        x, y,
        directionX: Math.random() > 0.5 ? 1 : -1,
        directionY: isGroundBat ? 0 : (Math.random() > 0.5 ? 1 : -1),
        speed: speed + currentLevel * 0.5,
        isGroundBat
    });
}

// --- Ghosts ---
function createGhost(x, y) {
    const ghost = document.createElement('div');
    ghost.className = 'ghost';
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
    ghost.style.width = '40px';
    ghost.style.height = '50px';
    ghost.style.backgroundImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 50\'><path d=\'M20,5 Q30,0 40,5 Q35,20 40,35 Q30,50 20,45 Q10,50 0,35 Q5,20 0,5 Q10,0 20,5 Z\' fill=\'%23fff\' opacity=\'0.8\'/><circle cx=\'15\' cy=\'15\' r=\'3\' fill=\'%23000\'/><circle cx=\'25\' cy=\'15\' r=\'3\' fill=\'%23000\'/></svg>")';
    ghost.style.backgroundSize = 'cover';
    gameContainer.appendChild(ghost);
    ghosts.push({
        element: ghost,
        x, y,
        directionX: Math.random() > 0.5 ? 1 : -1,
        directionY: Math.random() > 0.5 ? 1 : -1,
        speed: 1 + Math.random() * 0.5 + currentLevel * 0.2
    });
}

// --- Coins ---
function createCoin(x, y) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    gameContainer.appendChild(coin);
    coins.push({ element: coin, x, y, collected: false });
}

// --- Spikes ---
function createSpike(x, y) {
    const spike = document.createElement('div');
    spike.className = 'spike';
    spike.style.left = `${x}px`;
    spike.style.top = `${y}px`;
    gameContainer.appendChild(spike);
    spikes.push({ element: spike, x, y });
}

// --- Traps ---
function createTrap(x, y, width, height, interval) {
    const trap = document.createElement('div');
    trap.className = 'trap';
    trap.style.left = `${x}px`;
    trap.style.top = `${y}px`;
    trap.style.width = `${width}px`;
    trap.style.height = `${height}px`;
    gameContainer.appendChild(trap);
    let visible = true;
    const trapInterval = setInterval(() => {
        visible = !visible;
        trap.style.display = visible ? 'block' : 'none';
    }, interval);
    traps.push({ element: trap, x, y, width, height, visible, interval: trapInterval });
}

// --- Power-Ups ---
function createShieldPowerUp(x, y) {
    shieldPowerUp = document.createElement('div');
    shieldPowerUp.className = 'power-up shield-power';
    shieldPowerUp.style.left = `${x}px`;
    shieldPowerUp.style.top = `${y}px`;
    shieldPowerUp.innerHTML = '🛡️';
    shieldPowerUp.title = 'Shield Power';
    gameContainer.appendChild(shieldPowerUp);
}
function createFirePowerUp(x, y) {
    firePowerUp = document.createElement('div');
    firePowerUp.className = 'power-up fire-power';
    firePowerUp.style.left = `${x}px`;
    firePowerUp.style.top = `${y}px`;
    firePowerUp.innerHTML = '🔥';
    firePowerUp.title = 'Fire Power';
    gameContainer.appendChild(firePowerUp);
}

// --- Boss ---
function createBoss(x = 700, y = 100, health = 10) {
    const bossDiv = document.createElement('div');
    bossDiv.className = 'boss';
    bossDiv.style.left = `${x}px`;
    bossDiv.style.top = `${y}px`;
    bossDiv.style.width = '100px';
    bossDiv.style.height = '100px';
    bossDiv.style.background = 'linear-gradient(135deg, #b40404 60%, #ffb300 100%)';
    bossDiv.style.border = '4px solid #fff';
    bossDiv.style.borderRadius = '50%';
    bossDiv.style.display = 'flex';
    bossDiv.style.alignItems = 'center';
    bossDiv.style.justifyContent = 'center';
    bossDiv.style.fontSize = '2.5rem';
    bossDiv.innerHTML = '👹';
    gameContainer.appendChild(bossDiv);
    boss = { element: bossDiv, x, y, width: 100, height: 100, health: health, speedX: 2, speedY: 1.5 };
    bossActive = true;
    bossHealth = health;
}

// --- Explosions ---
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameContainer.appendChild(explosion);
    setTimeout(() => explosion.remove(), 500);
}

// --- Power Logic ---
function addShield() {
    if (hasShield) return;
    hasShield = true;
    const shield = document.createElement('div');
    shield.className = 'player-shield';
    // Insertar el escudo como primer hijo para que quede detrás
    player.insertBefore(shield, player.firstChild);
}
function removeShield() {
    if (!hasShield) return;
    hasShield = false;
    document.querySelector('.player-shield')?.remove();
    createExplosion(playerX, playerY);
}
function addFirePower() {
    if (hasFirePower) return;
    hasFirePower = true;
    const fireIndicator = document.createElement('div');
    fireIndicator.className = 'fire-indicator';
    fireIndicator.innerHTML = '🔥';
    player.appendChild(fireIndicator);
}
function removeFirePower() {
    if (!hasFirePower) return;
    hasFirePower = false;
    document.querySelector('.fire-indicator')?.remove();
    createExplosion(playerX, playerY);
}

// --- Fireballs ---
function shootFireball() {
    if (!hasFirePower || isPaused) return;
    const fireball = document.createElement('div');
    fireball.className = 'fireball';
    fireball.style.left = `${playerX + 30}px`;
    fireball.style.top = `${playerY + 30}px`;
    fireballsContainer.appendChild(fireball);
    fireballs.push({ element: fireball, x: playerX + 30, y: playerY + 30, speed: 7 });
}
function updateFireballs() {
    for (let i = fireballs.length - 1; i >= 0; i--) {
        const fireball = fireballs[i];
        fireball.x += fireball.speed;
        fireball.element.style.left = `${fireball.x}px`;
        if (fireball.x > 900) {
            fireball.element.remove();
            fireballs.splice(i, 1);
            continue;
        }
        // Bat collision
        for (let j = bats.length - 1; j >= 0; j--) {
            const bat = bats[j];
            if (rectsCollide(fireball.x, fireball.y, 20, 20, bat.x, bat.y, 50, 40)) {
                createExplosion(bat.x, bat.y);
                bat.element.remove();
                bats.splice(j, 1);
                fireball.element.remove();
                fireballs.splice(i, 1);
                break;
            }
        }
        // Boss collision
        if (bossActive && boss && rectsCollide(fireball.x, fireball.y, 20, 20, boss.x, boss.y, boss.width, boss.height)) {
            bossHealth--;
            createExplosion(boss.x + 50, boss.y + 50);
            fireball.element.remove();
            fireballs.splice(i, 1);
            if (bossHealth <= 0) {
                boss.element.remove();
                bossActive = false;
                boss = null;
                setTimeout(() => showGameComplete(), 1000);
            }
            break;
        }
    }
}

// --- Level Design ---
function createLevel(level) {
    // Platforms
    createPlatform(0, 360, 800, 40);
    createPlatform(100, 280, 100, 20);
    createPlatform(250, 220, 100, 20);
    createPlatform(400, 280, 100, 20);
    createPlatform(550, 220, 100, 20);
    createPlatform(700, 280, 100, 20);

    // Bats & Ghosts
    createBat(200, 320, true);
    createBat(450, 320, true);
    createBat(700, 320, true);
    createBat(150, 150);
    createBat(350, 100);
    createBat(550, 180);
    createGhost(500, 270);

    // Coins
    createCoin(130, 240);
    createCoin(280, 180);
    createCoin(430, 240);
    createCoin(580, 180);
    createCoin(730, 240);

    // Spikes & Traps
    createSpike(300, 340);
    createTrap(600, 350, 40, 10, 1500);

    // Power-ups
    createShieldPowerUp(400, 150);
    createFirePowerUp(650, 220);

    // Level 2+
    if (level > 1) {
        createBat(500, 100);
        createBat(600, 200);
        createGhost(200, 100);
        createSpike(350, 340);
        createTrap(200, 350, 40, 10, 1000);
        createCoin(200, 100);
    }
    // Level 3: Boss
    if (level >= 3) {
        createBoss();
    }
}

// --- Game Loop ---
function gameLoop() {
    if (isGameOver) return;
    if (!isPaused) {
        updatePlayerPosition();
        updateBats();
        updateGhosts();
        updateBoss();
        updateFireballs();
        checkCollisions();
    }
    requestAnimationFrame(gameLoop);
}

// --- Updates ---
function updatePlayerPosition() {
    if (moveLeft) playerX -= moveSpeed;
    if (moveRight) playerX += moveSpeed;
    playerVelocityY += gravity;
    playerY += playerVelocityY;

    // Platform collision
    let onPlatform = false;
    for (const p of platforms) {
        if (rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, p.x, p.y, p.width, p.height) && playerVelocityY >= 0) {
            playerY = p.y - (isCrouching ? 40 : 60);
            playerVelocityY = 0;
            jumpCount = 0;
            isJumping = false;
            onPlatform = true;
        }
    }
    // Floor
    if (playerY > 340) {
        playerY = 340;
        playerVelocityY = 0;
        jumpCount = 0;
        isJumping = false;
    }
    // Boundaries
    if (playerX < 0) playerX = 0;
    if (playerX > 770) playerX = 770;

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
    if (isCrouching) player.classList.add('crouching');
    else player.classList.remove('crouching');
}
function updateBats() {
    bats.forEach(bat => {
        if (bat.isGroundBat) {
            bat.x += bat.directionX * bat.speed;
            if (bat.x < 0 || bat.x > 760) bat.directionX *= -1;
            bat.element.style.left = bat.x + "px";
        } else {
            bat.x += bat.directionX * bat.speed;
            bat.y += bat.directionY * bat.speed * 0.5;
            if (bat.x < 0 || bat.x > 770) bat.directionX *= -1;
            if (bat.y < 0 || bat.y > 340) bat.directionY *= -1;
            bat.element.style.left = bat.x + "px";
            bat.element.style.top = bat.y + "px";
        }
    });
}
function updateGhosts() {
    ghosts.forEach(ghost => {
        ghost.x += ghost.directionX * ghost.speed;
        ghost.y += ghost.directionY * ghost.speed;
        if (ghost.x < 0 || ghost.x > 770) ghost.directionX *= -1;
        if (ghost.y < 0 || ghost.y > 340) ghost.directionY *= -1;
        ghost.element.style.left = ghost.x + "px";
        ghost.element.style.top = ghost.y + "px";
    });
}
function updateBoss() {
    if (!bossActive || !boss) return;
    boss.x += boss.speedX;
    boss.y += boss.speedY;
    if (boss.x < 0 || boss.x > 700) boss.speedX *= -1;
    if (boss.y < 0 || boss.y > 300) boss.speedY *= -1;
    boss.element.style.left = boss.x + "px";
    boss.element.style.top = boss.y + "px";
}

// --- Collisions ---
function checkCollisions() {
    // Bat collision
    for (const bat of bats) {
        if (rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, bat.x, bat.y, 50, 40)) {
            if (hasShield) { removeShield(); createExplosion(bat.x, bat.y); }
            else if (hasFirePower) { removeFirePower(); createExplosion(bat.x, bat.y); }
            else { createExplosion(playerX, playerY); showGameOver(); }
            bat.element.remove();
            bats = bats.filter(b => b !== bat);
            return;
        }
    }
    // Spike collision
    for (const spike of spikes) {
        if (rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, spike.x, spike.y, 30, 20)) {
            if (hasShield) { removeShield(); createExplosion(spike.x, spike.y); }
            else if (hasFirePower) { removeFirePower(); createExplosion(spike.x, spike.y); }
            else { createExplosion(playerX, playerY); showGameOver(); }
            return;
        }
    }
    // Trap collision
    for (const trap of traps) {
        if (trap.element.style.display !== 'none' &&
            rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, trap.x, trap.y, trap.width, trap.height)) {
            if (hasShield) { removeShield(); createExplosion(trap.x, trap.y); }
            else if (hasFirePower) { removeFirePower(); createExplosion(trap.x, trap.y); }
            else { createExplosion(playerX, playerY); showGameOver(); }
            return;
        }
    }
    // Coin collision
    for (const coin of coins) {
        if (!coin.collected && rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, coin.x, coin.y, 20, 20)) {
            coin.collected = true;
            coin.element.style.display = 'none';
        }
    }
    // Shield power-up
    if (shieldPowerUp && rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, parseInt(shieldPowerUp.style.left), parseInt(shieldPowerUp.style.top), 30, 30)) {
        addShield();
        shieldPowerUp.remove();
        shieldPowerUp = null;
    }
    // Fire power-up
    if (firePowerUp && rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, parseInt(firePowerUp.style.left), parseInt(firePowerUp.style.top), 30, 30)) {
        addFirePower();
        firePowerUp.remove();
        firePowerUp = null;
    }
    // Boss collision
    if (bossActive && boss && rectsCollide(playerX, playerY, 30, isCrouching ? 40 : 60, boss.x, boss.y, boss.width, boss.height)) {
        if (hasShield) { removeShield(); bossHealth--; createExplosion(boss.x + 50, boss.y + 50); }
        else if (hasFirePower) { removeFirePower(); bossHealth--; createExplosion(boss.x + 50, boss.y + 50); }
        else { createExplosion(playerX, playerY); showGameOver(); }
        if (bossHealth <= 0) {
            boss.element.remove();
            bossActive = false;
            boss = null;
            setTimeout(() => showGameComplete(), 1000);
        }
    }
    // Level complete (all coins collected, boss defeated if present)
    if (coins.length && coins.every(c => c.collected) && (!bossActive || bossHealth <= 0)) {
        if (currentLevel < 3) setTimeout(() => showLevelComplete(), 500);
        else if (!bossActive) setTimeout(() => showGameComplete(), 500);
    }
}

// --- UI & Controls ---
function showGameOver() { isGameOver = true; gameOverScreen.style.display = 'flex'; }
function showLevelComplete() { isGameOver = true; levelCompleteScreen.style.display = 'flex'; }
function showGameComplete() { isGameOver = true; gameCompleteScreen.style.display = 'flex'; }
function showLevelSelect() {
    levelSelectScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    gameCompleteScreen.style.display = 'none';
    pauseMenu.style.display = 'none';
    gameContainer.style.display = 'none';
}
function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    pauseMenu.style.display = isPaused ? 'flex' : 'none';
}

// --- Event Listeners ---
toggleControlsBtn.addEventListener('click', () => {
    const isVisible = instructionsPanel.style.display === 'block';
    instructionsPanel.style.display = isVisible ? 'none' : 'block';
    toggleControlsBtn.textContent = isVisible ? 'Show Controls' : 'Hide Controls';
});
retryBtn.addEventListener('click', () => initGame(currentLevel));
exitBtn.addEventListener('click', showLevelSelect);
nextLevelBtn.addEventListener('click', () => initGame(currentLevel + 1));
restartGameBtn.addEventListener('click', () => initGame(1));
levelButtons.forEach(btn => btn.addEventListener('click', () => initGame(parseInt(btn.dataset.level))));
continueBtn.addEventListener('click', togglePause);
retryPauseBtn.addEventListener('click', () => { togglePause(); initGame(currentLevel); });
exitPauseBtn.addEventListener('click', () => { togglePause(); showLevelSelect(); });
pauseBtn.addEventListener('click', togglePause);

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    switch (e.key) {
        case 'ArrowLeft': moveLeft = true; break;
        case 'ArrowRight': moveRight = true; break;
        case 'ArrowUp':
        case ' ':
            if (!isPaused && jumpCount < maxJumpCount) {
                playerVelocityY = -12;
                isJumping = true;
                jumpCount++;
            }
            break;
        case 'ArrowDown': isCrouching = true; break;
        case 'Escape': togglePause(); break;
        case 'f': if (hasFirePower) shootFireball(); break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft': moveLeft = false; break;
        case 'ArrowRight': moveRight = false; break;
        case 'ArrowDown': isCrouching = false; break;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    levelSelectScreen.style.display = 'flex';
    gameContainer.style.display = 'block';
    gameOverScreen.style.display = 'none';
    levelCompleteScreen.style.display = 'none';
    gameCompleteScreen.style.display = 'none';
    pauseMenu.style.display = 'none';
    instructionsPanel.style.display = 'none';
    toggleControlsBtn.textContent = 'Show Controls';
});