import * as cfg from "./config.js";
import resizeLayout from "./layout.js";

import Character from "./game_objects/Character.js";
import BloodDroplet from "./game_objects/BloodDroplet.js";

import { random, shuffle } from "./utils.js";
import CoindShibaInuDroplet from "./game_objects/CoinShibaInuDroplet.js";
import CoinTalax1 from "./game_objects/CoinTalax1.js";

"use strict";

let touchStartX = 0;
let timer = 0;
let timerInterval = null;

let mouseStartX = 0; // Store the initial mouse position
let isDragging = false; // Flag to check if dragging is active

/**
 * Procedure to initialise the game.
 */
export const init = () => {
    // Display the game board only once everything is loaded
    mainContainer.style.visibility = "visible";

    // Animate the splash screen
    document
        .querySelector("#splash-screen .bb")
        .animate(
            [
                { scale: 1.5, transform: "scale(1.5)", },
                { scale: 0.7, transform: "scale(0.7)", offset: 0.7, },
                { scale: 1.0, transform: "scale(1.0)", },
            ],
            {
                duration: 600,
                fill: "forwards",
                // Bouncing effect is copied from
                // https://stackoverflow.com/a/29786350/8791891
                easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
            }
        );
    document
        .querySelector("#splash-screen #play-game")
        .animate(
            [
                { opacity: 0.0, },
                { scale: 1.5, transform: "scale(1.5)", offset: 100 / (600 + 100) },
                { opacity: 1.0, scale: 0.7, transform: "scale(0.7)", offset: 0.7 },
                { scale: 1.0, transform: "scale(1.0)", },
            ],
            {
                duration: 600 + 100,
                fill: "forwards",
                easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
            }
        ).onfinish = (event) => event.target.cancel();
    document
        .querySelector("#splash-screen .title")
        .animate(
            [
                { opacity: 0.0 },
                { scale: 1.5, transform: "scale(1.5) rotate(-5deg)", offset: 300 / (600 + 300) },
                { opacity: 1.0, scale: 0.7, transform: "scale(0.7) rotate(-5deg)", offset: 0.7 },
                { scale: 1.0, transform: "scale(1.0)", },
            ],
            {
                duration: 600 + 300 + 50,
                fill: "forwards",
                easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
            }
        );

    // Initialise the game objects
    bb = new Character(offscreenCanvas, context, spriteImage);

    // Create collectible pools
    for (let i = 0; i < cfg.collectiblePoolSize; i++) {
        //bloodDropletPool.push(new BloodDroplet(offscreenCanvas, context, spriteImage, 1, i));
        coinTalax1DropletPool.push(new CoinTalax1(offscreenCanvas, context, talaxImage));
        // shibaInuDropletPool.push(new CoindShibaInuDroplet(offscreenCanvas, context, shibaInuImage))
    }
    //shuffle(bloodDropletPool);

    hud.addEventListener("touchstart", handleTouchStart);
    hud.addEventListener("mousedown", handleMouseDown);
    hud.addEventListener("touchmove", handleTouchMove);
    hud.addEventListener("mousemove", handleMouseMove);
    hud.addEventListener("touchend", handleTouchEnd);
    hud.addEventListener("mouseup", handleMouseUp);

    // Initialise the game state
    reset();

    if (cfg.skipToGamePlay) {
        playButton.click();
        startButton.click();
    }
}

/**
 * Procedure to start the game timer.
 */
export const startTimer = () => {
    if (!isTimerMode) return;

    timer = cfg.initialTime + 1; // Define an initial time limit in config
    timerInterval = setInterval(() => {
        if (timer > 0 && (timer - 1) > 0) {
            timer--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            gameOver(); // End game when timer reaches 0
        }
    }, 1000); // 1-second interval
};

/**
 * Procedure to update the timer display on the HUD in mm:ss format.
 */
const updateTimerDisplay = () => {
    // Round up the timer to the nearest second
    const roundedTimer = Math.ceil(timer);

    // Calculate minutes and seconds
    const minutes = Math.floor(roundedTimer / 60);
    const seconds = roundedTimer % 60;

    // Format as mm:ss
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Update the timer display
    timerDisplay.innerText = formattedTime;
};


// Touch event handlers
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX; // Store the initial touch position
    isDragging = true; // Start dragging
}

function handleTouchMove(event) {
    if (!isDragging) return; // Only move if dragging is active
    const touchCurrentX = event.touches[0].clientX; // Update the current touch position

    // Calculate the target position
    const targetX = bb.x + (touchCurrentX - touchStartX);

    // Call the snapMove function with the new target position
    var direction;
    if (touchCurrentX > touchStartX) {
        direction = 'right';
    } else if (touchCurrentX < touchStartX) {
        direction = 'left';
    }

    bb.snapMove(targetX, board.width, direction);
    bb.startWalking();

    // Update the starting position for the next movement
    touchStartX = touchCurrentX;
}

function handleTouchEnd(event) {
    // Reset button states if needed
    // leftButtonPressed = false;
    isDragging = false; // End dragging
    // rightButtonPressed = false;
    bb.stopWalking();
}

// Mouse event handlers
function handleMouseDown(event) {
    mouseStartX = event.clientX; // Set the initial mouse position
    isDragging = true; // Start dragging
}

function handleMouseMove(event) {
    if (!isDragging) return; // Only move if dragging is active

    const mouseCurrentX = event.clientX; // Get the current mouse position
    const targetX = bb.x + (mouseCurrentX - mouseStartX); // Calculate target position

    // Determine the direction of movement
    let direction;
    if (mouseCurrentX > mouseStartX) {
        direction = 'right';
    } else if (mouseCurrentX < mouseStartX) {
        direction = 'left';
    }

    bb.snapMove(targetX, board.width, direction); // Call snapMove with the target position

    bb.startWalking();

    // Update starting position for the next movement
    mouseStartX = mouseCurrentX;
}

function handleMouseUp(event) {
    isDragging = false; // End dragging
    leftButtonPressed = false; // Reset button states if needed
    rightButtonPressed = false;
    bb.stopWalking();
}

/**
 * Procedure to reset the game state and board.
 */
export const reset = () => {
    // Resize the layout
    resizeLayout();

    // Resize the main character
    bb.resize(windowScaleFactor);

    // Reposition the main character to the center of the game board
    bb.y = 0.7 * board.height;
    bb.x = board.width / 2 - bb.w / 2;

    // Reset the main character speed
    bb.vx = cfg.characterSpeed;

    // Reset the main character direction
    bb.direction = "right";

    // Shuffle the collectible pools
    // shuffle(bloodDropletPool);

    // Reset the game variables
    shiftTime = 0;
    collectibleCreationElapsedTime = 0;
    gameSpeedFactor = 1.0;

    // Reset the game state
    score = 0;
    lifePoints = cfg.gameLifePoints;
    collectibles = [];
    isPlaying = false;
    isGameOver = false;

    // Reset the game board
    offscreenCanvas.width = spriteImage.width;
    offscreenCanvas.height = spriteImage.height;
    offscreenContext.filter = `blur(${cfg.canvasWidth / board.width >> 1}px)`;
    offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenContext.drawImage(spriteImage, 0, 0);
    context.clearRect(0, 0, board.width, board.height);

    // Reset the game UIs
    scoreText.innerText = score;
    timerDisplay.innerText = "00:00"
    lifePointItems.forEach((item) => {
        item.classList.remove("hidden")
    });
}

/**
 * Procedure responsible for the game loop.
 * @param {number} timestamp
 */
export const loop = (timestamp) => {
    // Update the system variable
    currentTime = timestamp - shiftTime;

    // Update the debug variable
    fpsElapsedTime += (currentTime - fpsPreviousTime);

    if (isPlaying && previousTime > 0) {
        // Clear the game board
        clear();

        // Update the game state
        update();

        // Render the game board
        render();

        // Show debug information
        if (cfg.debugMode) {
            debug();
        }
    }

    // Update the system variable
    previousTime = currentTime;

    // Update the debug variable
    fpsPreviousTime = currentTime;

    // Request the next frame
    window.requestAnimationFrame(loop);
}

/**
 * Procedure to clear the game board.
 */
const clear = () => {
    if (cfg.showBoundingBoxes) {
        context.clearRect(0, 0, board.width, board.height);
        return;
    }

    for (let i = 0; i < collectibles.length; i++) {
        context.clearRect(
            collectibles[i].x - 1,
            collectibles[i].y - 1,
            collectibles[i].w + 1,
            collectibles[i].h + 1
        );
    }
    context.clearRect(bb.x - 100, bb.y - 100, bb.w + 200, bb.h + 200);
}

/**
 * Procedure to update the game state.
 */
const update = () => {
    // To handle dynamic frame rates
    elapsedTime = (currentTime - fpsPreviousTime) / 1000;

    // Limit the time skip
    elapsedTime = Math.min(elapsedTime, 0.1);

    // Keep track of the time passed
    passedTime += elapsedTime;

    // Update the main character position
    if (leftButtonPressed) {
        bb.moveLeft(elapsedTime, board.width);
    }
    if (rightButtonPressed) {
        bb.moveRight(elapsedTime, board.width);
    }
    if (!leftButtonPressed && !rightButtonPressed) {
        bb.stop();
    }

    // Calculate the time since the last collectible creation
    collectibleCreationElapsedTime += (currentTime - previousTime) * gameSpeedFactor;

    // Summon a collectible after the interval has elapsed
    if (collectibleCreationElapsedTime >= cfg.collectibleCreationInterval) {

        // Check whether there are two rain droplets in a row
        // or there are a number of rain droplets in the last few collectibles
        // rainDropletInRow = 0;
        // rainDropletInLastThree = 0;
        // twoRainDropletInRow = false;
        // for (let i = Math.min(collectibles.length, 5); i > 0; i--) {
        //     if (collectibles[i] instanceof CoinTalax1) {
        //         if (++rainDropletInRow == 2) {
        //             twoRainDropletInRow = true;
        //             break;
        //         }
        //         rainDropletInLastThree++;
        //         continue;
        //     }
        //     rainDropletInRow = 0;
        // }

        // Get a collectible from the pool or create a new one
        // if (random(0, 1) <= cfg.BloogDropletGenerationProbability || twoRainDropletInRow || rainDropletInLastThree >= 2) {
        //     newCollectible = bloodDropletPool.pop();
        //     if (typeof newCollectible === "undefined") { // if the pool is empty
        //         newCollectible = new BloodDroplet(context, spriteImage);
        //     }
        // } else {
        //     newCollectible = coinTalax1DropletPool.pop();
        //     if (typeof newCollectible === "undefined") { // if the pool is empty
        //         newCollectible = new CoinTalax1(context, talaxImage);
        //     }
        // }
        newCollectible = coinTalax1DropletPool.pop();
        if (typeof newCollectible === "undefined") { // if the pool is empty
            newCollectible = new CoinTalax1(context, talaxImage);
        }

        // Resize the collectible
        newCollectible.resize(windowScaleFactor * newCollectible.scale);

        // Reposition the collectible to the top of the game board
        newCollectible.y = -newCollectible.h;
        newCollectible.x = random(0, board.width - newCollectible.w);

        // Set the collectible speed
        newCollectible.vy = cfg.gravitationSpeed * gameSpeedFactor * newCollectible.weight;

        // Add the newly collectible to the game state
        collectibles.push(newCollectible);

        // Reset the collectible creation timer
        collectibleCreationElapsedTime = 0;
    }

    // Update the collectibles positions
    for (let i = 0; i < collectibles.length; i++) {
        collectibles[i].moveDown(elapsedTime, board.height);
    }

    // Find colliding collectibles
    for (let i = 0; i < collectibles.length; i++) {
        if (bb.collidesWith(collectibles[i])) {
            if (collectibles[i] instanceof BloodDroplet) {
                if (!muteGameSound) {
                    // Play the success sound effect
                    if (successSFX
                        && successSFX.currentTime > 0
                        && !successSFX.paused
                        && !successSFX.ended
                        && successSFX.readyState > 2) { // currently playing, see https://stackoverflow.com/a/46117824/8791891
                        // TODO: until structuredClone() is implemented on all major browsers,
                        // we need to use this way to clone the Audio object
                        const newSuccessSFX = successSFX.cloneNode();
                        newSuccessSFX.playbackRate = 1.2;
                        newSuccessSFX.onended = () => {
                            // FIXME: this will increase the garbage collection time
                            // Consider to create a pool of it
                            newSuccessSFX.remove();
                        };
                        newSuccessSFX.play();
                    } else {
                        successSFX.play();
                    }
                }

                // Update the game score
                score += collectibles[i].point;
                scoreText.innerText = score;

                // Put back the collectible to the pool
                bloodDropletPool.unshift(collectibles[i]);
                collectibles.splice(i--, 1);

                // Let the main character celebrate
                bb.celebrate();

                // Show debug information
                if (cfg.debugMode) {
                    console.log("Score increased to " + score);
                }
            }
            else if (collectibles[i] instanceof CoinTalax1) {
                if (!muteGameSound) {
                    // Play the success sound effect
                    if (successSFX
                        && successSFX.currentTime > 0
                        && !successSFX.paused
                        && !successSFX.ended
                        && successSFX.readyState > 2) { // currently playing, see https://stackoverflow.com/a/46117824/8791891
                        // TODO: until structuredClone() is implemented on all major browsers,
                        // we need to use this way to clone the Audio object
                        const newSuccessSFX = successSFX.cloneNode();
                        newSuccessSFX.playbackRate = 1.2;
                        newSuccessSFX.onended = () => {
                            // FIXME: this will increase the garbage collection time
                            // Consider to create a pool of it
                            newSuccessSFX.remove();
                        };
                        newSuccessSFX.play();
                    } else {
                        successSFX.play();
                    }
                }

                // Update the game score
                score += collectibles[i].point;
                scoreText.innerText = score;

                // Put back the collectible to the pool
                coinTalax1DropletPool.unshift(collectibles[i]);
                collectibles.splice(i--, 1);

                // Apply celebration to the main character
                bb.celebrate();

                // Show debug information
                if (cfg.debugMode) {
                    console.log("Life points decreased to " + lifePoints);
                }

                // End the game if the life points are depleted
                if (lifePoints <= 0) {
                    gameOver();
                }
            }
            else { }
        }
    }

    // Increase the game speed factor
    gameSpeedFactor = Math.min(
        gameSpeedFactor + (currentTime - previousTime) / (1000 * 30),
        cfg.gameSpeedFactorMax
    );

    // Increase the character speed
    bb.vx = cfg.characterSpeed * Math.sqrt(gameSpeedFactor);

    // Remove the collectibles that are off the screen
    for (let i = 0; i < collectibles.length; i++) {
        if (collectibles[i].y >= board.height) {
            // Put back the collectible to the pool
            if (collectibles[i] instanceof BloodDroplet) {
                bloodDropletPool.unshift(collectibles[i]);
            } else if (collectibles[i] instanceof CoinTalax1) {
                coinTalax1DropletPool.unshift(collectibles[i]);
            } else { }
            collectibles.splice(i--, 1);
        }
    }
}

/**
 * Procedure to render the game state.
 */
const render = () => {
    if (!isPlaying) {
        return;
    }

    // Render the game objects
    bb.render();
    for (let i = 0; i < collectibles.length; i++) {
        collectibles[i].render();
    }
}

/**
 * Procedure to show the game over screen.
 */
export const gameOver = () => {
    // Stop the game loop
    isPlaying = false;
    isGameOver = true;

    // Play the game over sound effect
    if (!muteGameSound) {
        backgroundMusic.pause();
        gameOverSFX.play()
    };

    // Update the game over information
    finalScore = score;
    finalScoreText.innerText = `${finalScore} CTALAX`;
    // finalScoreVerboseText.innerText = cfg.finalScoreText
    //     .replace("{score}", finalScore)
    //     .replace("{bags}", finalScore > 1 ? "bags" : "bag");

    // Set the hyperlink reference for the share buttons
    shareText = cfg.shareText.replace("{score}", finalScore).replace("{link}", serverUrl);
    shareFacebookButton.href = "https://www.facebook.com/sharer/sharer.php?u=" + serverUrl;
    shareWhatsappButton.href = "https://api.whatsapp.com/send?text=" + shareText;
    shareTelegramButton.href = "https://t.me/share/url?url=" + serverUrl + "&text=" + shareText;

    // Clear the game screen
    gamePoint.style.display = "none";
    //  gameControl.style.display = "none";
    fpsText.style.visibility = "hidden";
    clear();

    // Show the game over screen
    pauseScreen.style.display = "flex";
    gameResult.style.display = "block";

    // Animate the game over screen
    gameResult.animate(
        [
            { opacity: 0.0, scale: 0.7, transform: "scale(0.7)", },
            { opacity: 1.0, scale: 1.0, transform: "scale(1.0)", },
        ],
        {
            duration: 300,
            fill: "forwards",
            easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
        }
    );

    // Clear timer if timer mode was enabled
    if (isTimerMode) {
        clearInterval(timerInterval);
    }

    // Show debug information
    if (cfg.debugMode) {
        console.log("Game over!");
    }
};

/**
 * Procedure to control which debug information is shown.
 */
const debug = () => {
    if (!isPlaying) {
        return;
    }

    if (cfg.showFPS) {
        renderFPS();
    }
    if (cfg.showBoundingBoxes) {
        renderBoundingBoxes();
    }
}

/**
 * Procedure to calculate the frame per second.
 */
const renderFPS = () => {
    if (!isPlaying) {
        return;
    }

    frameCount++;

    if (fpsElapsedTime >= cfg.fpsUpdateInterval) {
        // Calculate the FPS
        fps = frameCount;
        frameCount = 0;
        fpsElapsedTime = 0;

        // Show the current FPS
        fpsText.innerText = fps + " FPS";
        fpsText.style.visibility = "visible";
    }
}

/**
 * Procedure to draw the bounding boxes of the game objects.
 */
const renderBoundingBoxes = () => {
    if (!isPlaying) {
        return;
    }

    bb.renderBoundary();
    for (let i = 0; i < collectibles.length; i++) {
        collectibles[i].renderBoundary();
    }
}
