     /*
    @title: AarusPlatformer
    @description: A 2D platformer game where players navigate through levels, collect coins, and avoid spikes.
    @author: Aarav Gupta
    @tags: [Platformer, Adventure, Singleplayer]
    @addedOn: 2025-06-16
    */

    // Define sprites
    const player = "p";
    const wall = "w";
    const ground = "g";
    const coin = "c";
    const spike = "s";
    const goal = "G";
    const background = "b";
    const blackScreen = "k";

    // Set legend
    setLegend(
    [player, bitmap`
................
................
.......000......
......00000.....
......0.0.0.....
......00000.....
......00000.....
.......000......
.......000......
......00000.....
.....0000000....
....000000000...
......00000.....
......0...0.....
.....00...00....
....00.....00...`],
    [wall, bitmap`
LLLLLLLLLLLLLLLL
L11111111111111L
L1CCCCCCCCCCCC1L
L1C2222222222C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2333333332C1L
L1C2222222222C1L
L1CCCCCCCCCCCC1L
L11111111111111L
LLLLLLLLLLLLLLLL`],
    [ground, bitmap`
    4444444444444444
    4333333333333334
    4322222222222234
    4321111111111234
    4321000000001234
    4321000000001234
    4321000000001234
    4321000000001234
    4321000000001234
    4321000000001234
    4321000000001234
    4321111111111234
    4322222222222234
    4333333333333334
    4444444444444444
    4444444444444444`],
    [coin, bitmap`
    ................
    ................
    ......6666......
    .....666666.....
    ....66666666....
    ....66F66F66....
    ....66666666....
    ....66666666....
    ....66666666....
    ....66F66F66....
    ....66666666....
    .....666666.....
    ......6666......
    ................
    ................
    ................`],
    [spike, bitmap`
    ................
    ................
    ................
    ................
    ................
    ................
    .......33.......
    ......3333......
    .....333333.....
    ....33333333....
    ...3333333333...
    ..333333333333..
    .33333333333333.
    3333333333333333
    3333333333333333
    3333333333333333`],
    [goal, bitmap`
    ................
    ................
    ....44444444....
    ...4444444444...
    ..444444444444..
    .44444444444444.
    .44466666666444.
    .44466666666444.
    .44466666666444.
    .44466666666444.
    .44466666666444.
    .44444444444444.
    ..444444444444..
    ...4444444444...
    ....44444444....
    ................`],
    [background, bitmap`
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777
    7777777777777777`],
    [blackScreen, bitmap`
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000
    0000000000000000`]
    );

    // Set background
    setBackground(background);

    // Game variables
    let level = 0;

    // Define levels
    const levels = [
    map`
wwwwwwwwwwwwwwww
w..............w
w..c........c..w
w..............w
w.....gggg.....w
w..............w
wp.............w
ggggsgg..ggsgggg
w..............w
w......GG......w
wwwwwwwwwwwwwwww`,

    map`
wwwwwwwwwwwwwwww
w..............w
w.c.........c..w
w..ggg...ggg...w
w..............w
w.....ggg......w
wp.............w
ggg...........Gw
w............ggg
w..ssssssssss..w
wwwwwwwwwwwwwwww`,

    map`
wwwwwwwwwwwwwwww
w..............w
w.c..........c.w
w.g..........g.w
w..............w
w..gg......gg..w
wp.............w
gg....gggg....Gw
w.............gg
wssssssssssssssw
wwwwwwwwwwwwwwww`,

    map`
wwwwwwwwwwwwwwww
w..............w
wc.............w
wg.............w
w...gggg...c...w
w..............w
wp.............w
ggg............w
w........gg.gg.w
wssssssssss.ssGw
wwwwwwwwwwwwwwww`,

    map`
wwwwwwwwwwwwwwww
w..............w
w.c..........c.w
w.g..........g.w
w..............w
w..g........g..w
wp.............w
gg.............w
w.....gggg.....w
wsssssssssssss.w
wwwwwwwwwwwwwwGw`,

    map`
wwwwwwwwwwwwwwww
w..c...........w
w.ggg..........w
w..............w
w.....c........w
w....ggg.......w
wp.............w
gg.............w
w........c.....w
w.......ggg....w
wsssssssssssssGw`,

    map`
wwwwwwwwwwwwwwww
wc........c....w
wgg......gg....w
w..............w
w.gggggggg.....w
w..............w
wp.............w
gg.............w
w.........gg...w
wsssssssssssss.w
wwwwwwwwwwwwwwGw`,

    map`
wwwwwwwwwwwwwwww
w..............w
w.c..........c.w
w.g..........g.w
w..............w
w..ggggsgggg...w
wp.............w
gg.............w
w..............w
wsssssssssssss.w
wwwwwwwwwwwwwwGw`,

    map`
wwwwwwwwwwwwwwww
w..............w
wc.............w
wg.............w
w..............w
w.....c........w
wp...ggg.......w
ggg............w
w........gg....w
wsssssssssssss.w
wwwwwwwwwwwwwwGw`,

    map`
wwwwwwwwwwwwwwww
w..............w
w.c..........c.w
w.g..........g.w
w..............w
w..ggggsgggg...w
wp.............w
gg.............w
w..............w
wsssssssssssss.w
wwwwwwwwwwwwwwGw`
    ];

    const completionMap = map`
................
................
................
................
................
................
................
................
................
................
................`;

    // Set the first level
    setMap(levels[level]);

    // Set solids
    setSolids([player, wall, ground]);

    // Player physics variables
    let playerVelocityY = 0;
    let playerOnGround = false;
    const gravity = 0.5;
    const jumpPower = -8;
    const maxFallSpeed = 6;
    const tickMs = 50;
    const respawnDelayMs = 800;

    const gameStatePlaying = "playing";
    const gameStateRespawning = "respawning";
    const gameStateCompleted = "completed";

    let gameState = gameStatePlaying;
    let levelTimeMs = 0;
    let totalTimeMs = 0;
    let gameLoop = null;

    function startGameLoop() {
    if (gameLoop) return;

    gameLoop = setInterval(() => {
        if (gameState === gameStatePlaying || gameState === gameStateRespawning) {
        levelTimeMs += tickMs;
        totalTimeMs += tickMs;
        }

        if (gameState !== gameStatePlaying) {
        return;
        }

        // Apply gravity
        if (!playerOnGround) {
        playerVelocityY += gravity;
        if (playerVelocityY > maxFallSpeed) {
            playerVelocityY = maxFallSpeed;
        }
        }

        // Apply vertical movement
        if (playerVelocityY != 0) {
        let playerSprite = getFirst(player);
        if (playerSprite) {
            let newY = playerSprite.y + Math.sign(playerVelocityY);

            // Check collision
            if (newY >= 0 && newY < height()) {
            let testMove = { x: playerSprite.x, y: newY };
            let collision = getTile(testMove.x, testMove.y).some(sprite =>
                sprite.type === wall || sprite.type === ground
            );

            if (!collision) {
                playerSprite.y = newY;
                playerOnGround = false;
            } else {
                if (playerVelocityY > 0) {
                // Landing
                playerOnGround = true;
                }
                playerVelocityY = 0;
            }
            } else {
            playerVelocityY = 0;
            }
        }
        }

        // Check collisions every frame, not just on input
        checkCollisions();
        updateUI();
    }, tickMs);
    }

    // Input handling
    onInput("w", () => {
    if (gameState === gameStateCompleted) {
        restartGame();
        return;
    }

    if (gameState !== gameStatePlaying) {
        return;
    }

    // Jump
    if (playerOnGround) {
        playerVelocityY = jumpPower;
        playerOnGround = false;
    }
    });

    onInput("a", () => {
    if (gameState !== gameStatePlaying) {
        return;
    }

    // Move left
    let playerSprite = getFirst(player);
    if (playerSprite && playerSprite.x > 0) {
        playerSprite.x -= 1;
    }
    });

    onInput("d", () => {
    if (gameState !== gameStatePlaying) {
        return;
    }

    // Move right
    let playerSprite = getFirst(player);
    if (playerSprite && playerSprite.x < width() - 1) {
        playerSprite.x += 1;
    }
    });

    onInput("s", () => {
    if (gameState === gameStatePlaying) {
        restartLevel();
    }
    });

    // Collision detection
    function checkCollisions() {
        if (gameState !== gameStatePlaying) return;

        let playerSprite = getFirst(player);
        if (!playerSprite) return;

        // Check for coin collection
        let coinsAtPlayer = getTile(playerSprite.x, playerSprite.y).filter(sprite => sprite.type === coin);
        if (coinsAtPlayer.length > 0) {
        coinsAtPlayer.forEach(coinSprite => {
            coinSprite.remove();
            playTune(tune`
        37.5: C5^37.5,
        1125`);
        });
        }

        // Check for spike collision
        let spikesAtPlayer = getTile(playerSprite.x, playerSprite.y).filter(sprite => sprite.type === spike);
        if (spikesAtPlayer.length > 0) {
        gameState = gameStateRespawning;
        playerVelocityY = 0;
        playerOnGround = false;
        playerSprite.remove();

        clearText();
        addText("Don't lose hope.", { x: 2, y: 0, color: color`2` });
        addText("Respawning...", { x: 2, y: 15, color: color`2` });

        setTimeout(() => {
            if (gameState === gameStateRespawning) {
            restartLevel(false);
            }
        }, respawnDelayMs);

        playTune(tune`
        150: G4~150 + A4~150 + B4~150,
        150: F4~150 + G4~150 + A4~150,
        150: E4~150 + F4~150 + G4~150,
        4350`);
        return;
        }

        // Check for goal
        let goalAtPlayer = getTile(playerSprite.x, playerSprite.y).filter(sprite => sprite.type === goal);
        if (goalAtPlayer.length > 0) {
        nextLevel();
        return;
        }

        // Update ground detection
        if (playerSprite.y < height() - 1) {
        let groundBelow = getTile(playerSprite.x, playerSprite.y + 1).some(sprite =>
            sprite.type === wall || sprite.type === ground
        );
        playerOnGround = groundBelow;
        }
    }

    afterInput(() => {
    if (gameState === gameStatePlaying) {
        checkCollisions();
        updateUI();
    }
    });

    // Helper functions
    function restartLevel(resetLevelTime = true) {
    clearText();
    setBackground(background);
    setMap(levels[level]);
    playerVelocityY = 0;
    playerOnGround = false;
    gameState = gameStatePlaying;
    if (resetLevelTime) {
        levelTimeMs = 0;
    }
    updateUI();
    }

    function restartGame() {
    level = 0;
    totalTimeMs = 0;
    levelTimeMs = 0;
    playerVelocityY = 0;
    playerOnGround = false;
    gameState = gameStatePlaying;
    setBackground(background);
    startGameLoop();
    restartLevel();
    }

    function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${paddedSeconds}`;
    }

    function updateUI() {
    if (gameState !== gameStatePlaying) return;

    clearText();
    addText(`L ${formatTime(levelTimeMs)}`, { x: 0, y: 0, color: color`3` });
    addText(`T ${formatTime(totalTimeMs)}`, { x: 9, y: 0, color: color`6` });
    addText(`Level:${level + 1}/${levels.length}`, { x: 1, y: 15, color: color`4` });
    }

    function showCompletionScreen() {
    gameState = gameStateCompleted;

    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }

    setBackground(blackScreen);
    setMap(completionMap);
    clearText();
    addText("Thank you", { x: 4, y: 5, color: color`2` });
    addText("for playing", { x: 3, y: 7, color: color`2` });
    addText("W: Play again", { x: 2, y: 10, color: color`4` });
    }

    function nextLevel() {
    level++;
    if (level >= levels.length) {
        showCompletionScreen();

        playTune(tune`
    150: C5^150,
    150: E5^150,
    150: G5^150,
    150: C6^150,
    450`);
    } else {
        restartLevel();
        playTune(tune`
    75: C5^75,
    75: D5^75,
    75: E5^75,
    75: F5^75,
    75: G5^75,
    300`);
    }
    }

    // Initialize game
    startGameLoop();
    restartLevel();
