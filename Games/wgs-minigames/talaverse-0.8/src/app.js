import * as cfg from "./config.js";

import { init, gameOver } from "./game.js";

import {
    isMobileDevice,
    pageVisibilityAPISupport,
    context2DAPIFilterSupport
} from "./utils.js";

"use strict";

// Set metadata
document.querySelector('meta[property="og:url"]').content = serverUrl;
document.querySelector('meta[property="og:site_name"]').content = documentTitle;
document.querySelector('meta[property="og:title"]').content = documentTitle;
document.querySelector('meta[name="twitter:title"]').content = documentTitle;
document.querySelector('link[rel="canonical"]').href = serverUrl;

/**
 * The following code is the main program,
 * which is executed when the page is loaded.
 */
window.onload = () => {
    // Set the name of the hidden property and the change event for visibility
    [hidden, visibility] = pageVisibilityAPISupport();

    if (hidden !== "") {
        // Handle page visibility change
        document.addEventListener(
            visibility,
            () => {
                if (!isPlayed || isGameOver) {
                    return;
                }

                if (document[hidden]) { // page is hidden
                    isPlaying = false;
                    shiftTime = currentTime;

                    // Add "paused" suffix to the document title
                    document.title += " - Paused";

                    // Pause the background music
                    if (!muteGameSound) {
                        backgroundMusic.pause();
                    }

                    // Show debug information
                    if (cfg.debugMode) {
                        console.log("Game paused");
                    }
                }

                else { // page is shown
                    isPlaying = true;
                    fpsElapsedTime = 0;
                    fpsPreviousTime = currentTime - shiftTime;

                    // Reset the document title
                    document.title = documentTitle;

                    // Resume the background music
                    if (!muteGameSound) {
                        backgroundMusic.play();
                    }

                    // Show debug information
                    if (cfg.debugMode) {
                        console.log("Game resumed");
                    }
                }
            },
            false
        );
    }

    else {
        // Warn if the browser doesn't support the Page Visibility API
        // See https://caniuse.com/pagevisibility for browser support update
        console.warn(
            "This game requires a browser, such as Google Chrome or Firefox, " +
            "that supports the Page Visibility API"
        );

        // Game over when the window is focused again
        window.onblur = () => {
            if (isPlaying) {
                gameOver();
            }
        };
    }

    // Load the resources
    spriteImage.src = "./assets/images/sprite.png";
    shibaInuImage.src = "./assets/images/shiba-inu.png";
    talaxImage.src = "./assets/images/talax.png";
    successSFX.src = "./assets/musics/get-coin.wav";
    // failureSFX.src = "./assets/sounds/failure.wav"; //gada
    gameOverSFX.src = "./assets/musics/game-over.wav"; //gada
    backgroundMusic.src = "./assets/musics/bgm.mp3";

    // Hackaround to fix the "ended" event not firing in Safari
    // See https://stackoverflow.com/a/5467883/8791891
    successSFX.currentTime = 0.1;
    // failureSFX.currentTime = 0.1;
    gameOverSFX.currentTime = 0.1;
    backgroundMusic.currentTime = 0.1;

    // Setup the game resources
    successSFX.playbackRate = 1.2;
    // failureSFX.playbackRate = 1.8;
    backgroundMusic.loop = true;

    // Hackaround to fix the audio delays on Safari
    // See https://stackoverflow.com/a/54119854/8791891
    new (window.AudioContext || window.webkitAudioContext)();

    // Initialise the game after the resources are loaded.
    // Only check for the sprite image loaded, because the
    // other resources aren't mandatory for the game to work
    spriteImage.onload = () => init();

    // Setup the game canvas
    if (isMobileDevice()) {
        // Disable anti-aliasing for mobile devices
        offscreenContext.imageSmoothingEnabled = false;
    } else {
        // If this antialiasing doesn't work, try other ways as suggested
        // at https://stackify.dev/832455-html5-canvas-drawimage-how-to-apply-antialiasing
        // or at https://stackoverflow.com/a/17862644/8791891
        offscreenContext.imageSmoothingEnabled = true;
        offscreenContext.imageSmoothingQuality = "high";
    }

    if (!context2DAPIFilterSupport(offscreenContext)) {
        console.warn(
            "This game requires a browser, such as Google Chrome or Firefox, " +
            "that supports Context2D filters"
        );
    }
};
