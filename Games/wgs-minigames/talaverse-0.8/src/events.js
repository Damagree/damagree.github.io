import * as cfg from "./config.js";

import { reset, loop, gameOver, startTimer } from "./game.js";

"use strict";

playButton.onclick = () => {
    splashScreen.style.display = "none";
    howToPlay.style.display = "block";
    howToPlay.animate(
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

    // if (muteGameSound) {
    //     muteButtons[0].click();
    // }
};

startButton.onclick = () => {
    howToPlay.animate(
        [
            { opacity: 1.0, scale: 1.0, transform: "scale(1.0)" },
            { opacity: 0.0, scale: 1.3, transform: "scale(1.3)" },
        ],
        {
            duration: 300,
            fill: "forwards",
            easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
        }
    ).onfinish = () => {
        // Show the gameplay screen
        pauseScreen.style.display = "none";
        howToPlay.style.display = "none";
        gamePoint.style.display = "flex";
        //gameControl.style.display = "flex";

        // Animate the gameplay screen
        gamePoint.animate(
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
        // gameControl.animate(
        //     [
        //         { opacity: 0.0, scale: 0.7, transform: "scale(0.7)", },
        //         { opacity: 1.0, scale: 1.0, transform: "scale(1.0)", },
        //     ],
        //     {
        //         duration: 300,
        //         fill: "forwards",
        //         easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
        //     }
        // );
    };

    // Start the game loop
    isPlayed = true;
    isPlaying = true;
    window.requestAnimationFrame(loop);

    startTimer();

    // Show debug information
    if (cfg.debugMode) {
        console.log("Game started");
    }
};

restartButton.onclick = () => {
    reset();

    gameResult.animate(
        [
            { opacity: 1.0, scale: 1.0, transform: "scale(1.0)", },
            { opacity: 0.0, scale: 1.3, transform: "scale(1.3)", },
        ],
        {
            duration: 300,
            fill: "forwards",
            easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
        }
    ).onfinish = () => {
        // Show the gameplay screen
        pauseScreen.style.display = "none";
        gameResult.style.display = "none";
        gamePoint.style.display = "flex";
        // gameControl.style.display = "flex";

        // Animate the gameplay screen
        gamePoint.animate(
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
        // gameControl.animate(
        //     [
        //         { opacity: 0.0, scale: 0.7, transform: "scale(0.7)", },
        //         { opacity: 1.0, scale: 1.0, transform: "scale(1.0)", },
        //     ],
        //     {
        //         duration: 300,
        //         fill: "forwards",
        //         easing: "cubic-bezier(0.47, 1.64, 0.41, 0.8)",
        //     }
        // );
    };

    // Resume the game loop
    isPlaying = true;

    backgroundMusic.currentTime = 0;
    backgroundMusic.play();

    // Reset timer if timer mode is enabled
    if (isTimerMode) {
        //clearInterval(timerInterval);
        startTimer();
    }

    // Show debug information
    if (cfg.debugMode) {
        console.log("Game restarted");
    }
};

muteButtons.forEach((muteButton) => {
    muteButton.onclick = () => {
        // Toggle the mute state
        muteGameSound = !muteGameSound;

        // Change the button icon
        muteButtons.forEach((button) => {
            button.classList.toggle("muted")
        });

        // Hack to force the audio to play on Safari browser
        // by triggering a click event on the audio element
        // to load and play the sound
        // Reference: https://stackoverflow.com/a/58004573/8791891
        successSFX.volume = 0;
        successSFX.muted = true;
        successSFX.play().then(() => {
            successSFX.pause();
            successSFX.currentTime = 0;
            successSFX.volume = 1.0;
            successSFX.muted = false;
        });

        // failureSFX.volume = 0;
        // failureSFX.muted = true;
        // failureSFX.play().then(() => {
        //     failureSFX.pause();
        //     failureSFX.currentTime = 0;
        //     failureSFX.volume = 0.5;
        //     failureSFX.muted = false;
        // });

        gameOverSFX.volume = 0;
        gameOverSFX.muted = true;
        gameOverSFX.play().then(() => {
            gameOverSFX.pause();
            gameOverSFX.currentTime = 0;
            gameOverSFX.volume = 1.0;
            gameOverSFX.muted = false;
        });

        if (!muteGameSound && !isGameOver) {
            backgroundMusic.volume = 1.0;
            backgroundMusic.play();
        } else {
            backgroundMusic.volume = 0;
            backgroundMusic.muted = true;
            backgroundMusic.play().then(() => {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                backgroundMusic.volume = 1.0;
                backgroundMusic.muted = false;
            });
        }

        // Show debug information
        if (cfg.debugMode) {
            console.log(`Game sound ${muteGameSound ? "" : "un"}muted`);
        }
    };
});

shareFacebookButton.onclick = () => {};
shareWhatsappButton.onclick = () => {};
shareTelegramButton.onclick = () => {};

// Reset the game on window resize
window.onresize = () => {
    if (isPlaying) {
        gameOver();
    }
    reset();
};
